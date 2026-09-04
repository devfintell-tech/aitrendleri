import { XMLParser } from 'fast-xml-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SUBREDDIT_BATCHES, REDDIT_USER_AGENT } from './subreddits.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 3 Farklı Gemini API Anahtar Havuzu (Yedekli ve Rotasyonlu - Sadece ortam değişkenlerinden okunur)
const GEMINI_API_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3
].filter(Boolean);

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_"
});

function decodeHtmlEntities(str) {
  if (!str) return "";
  return str.replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&nbsp;/g, " ")
            .replace(/&apos;/g, "'");
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Reddit RSS beslemesini akıllı retry ve sakin bekleme ile çeker.
 * Hem son 24 saatin "hot" beslemesini hem de son 1 haftanın en çok oylanan "top.rss?t=week" beslemesini çeker.
 */
async function fetchBatchPosts(batch) {
  const feeds = [
    { label: "Günlük Sıcak", url: `https://www.reddit.com/r/${batch.slug}/hot.rss?limit=25` },
    { label: "1 Haftalık En Çok Oylanan", url: `https://www.reddit.com/r/${batch.slug}/top.rss?t=week&limit=15` }
  ];

  const posts = [];
  const seenLinks = new Set();

  for (const feedConfig of feeds) {
    console.log(`📡 Çekiliyor: [${batch.name}] -> (${feedConfig.label})...`);

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const res = await fetch(feedConfig.url, {
          headers: {
            "User-Agent": REDDIT_USER_AGENT,
            "Accept": "application/atom+xml,application/xml,text/xml"
          }
        });

        if (res.status === 429) {
          console.warn(`⏳ Reddit 429 verdi [${batch.name} - ${feedConfig.label}]. 10 saniye sakinleşip tekrar deneniyor (Deneme ${attempt}/2)...`);
          await sleep(10000);
          continue;
        }

        if (!res.ok) {
          console.warn(`⚠️ HTTP ${res.status} [${batch.name} - ${feedConfig.label}]: ${res.statusText}`);
          break;
        }

        const xml = await res.text();
        const jsonObj = parser.parse(xml);
        const feed = jsonObj.feed;
        if (!feed || !feed.entry) break;

        const entries = Array.isArray(feed.entry) ? feed.entry : [feed.entry];

        for (const entry of entries.slice(0, 15)) {
          const link = entry.link && entry.link["@_href"] ? entry.link["@_href"] : "";
          if (seenLinks.has(link)) continue;
          if (link) seenLinks.add(link);

          let content = "";
          if (entry.content && typeof entry.content === "string") {
            content = entry.content;
          } else if (entry.content && entry.content["#text"]) {
            content = entry.content["#text"];
          }

          const title = entry.title ? decodeHtmlEntities(typeof entry.title === "string" ? entry.title : entry.title["#text"] || "") : "";
          if (title.toLowerCase().includes("monthly discussion") || title.toLowerCase().includes("weekly thread") || title.toLowerCase().includes("rules")) {
            continue;
          }

          content = content.replace(/<\/?[^>]+(>|$)/g, "");
          content = decodeHtmlEntities(content);
          if (content.length > 800) content = content.substring(0, 800) + "...";

          posts.push({
            label: feedConfig.label,
            title,
            link,
            content: content.trim()
          });
        }
        break; // Başarılı, döngüden çık
      } catch (err) {
        console.error(`❌ Hata [${batch.name} - ${feedConfig.label}]:`, err.message);
        if (attempt < 2) await sleep(4000);
      }
    }
    // İki besleme arasında kısa nefes alma
    await sleep(2000);
  }

  console.log(`✅ [${batch.name}] için toplam ${posts.length} başlık (sıcak + 1 haftalık) başarıyla alındı.`);
  return posts;
}

/**
 * tool-history.json dosyasından sistemin kendi geçmiş kayıtlarını derleyip Gemini'ye beslenebilir özet metin haline getirir.
 */
function loadToolHistorySummary() {
  const historyPath = path.join(__dirname, "../src/data/tool-history.json");
  if (!fs.existsSync(historyPath)) return "Veritabanında henüz kayıtlı geçmiş veri bulunmuyor.";

  try {
    const raw = JSON.parse(fs.readFileSync(historyPath, "utf-8"));
    const summaries = [];

    for (const [toolId, info] of Object.entries(raw)) {
      const history = info.history || [];
      if (history.length === 0) continue;

      const latest = history[history.length - 1];
      const older7d = history.length > 1 ? history[Math.max(0, history.length - 3)] : history[0];
      const delta7d = (latest.hypeScore - older7d.hypeScore).toFixed(1);
      const sentimentFlow = history.map(h => `${h.date}: ${h.hypeScore} (${h.sentiment})`).join(" -> ");
      const headlines = history.slice(-2).map(h => `"${h.headline}"`).join(", ");

      summaries.push(`- [${toolId}] ${info.name} (${info.category}):
  * Veritabanındaki Son Skor: ${latest.hypeScore} (${latest.date})
  * 7 Günlük Kayıt Değişimi: ${older7d.hypeScore} -> ${latest.hypeScore} (7 Günlük Fark: ${Number(delta7d) >= 0 ? '+' + delta7d : delta7d})
  * Zaman Çizgisi ve Hissiyat: ${sentimentFlow}
  * Kayıtlı Olaylar: ${headlines}`);
    }

    return summaries.join("\n\n");
  } catch (err) {
    console.warn("⚠️ tool-history.json okunamadı:", err.message);
    return "Veritabanı okuma hatası.";
  }
}

/**
 * Belirtilen model ve API anahtarı ile Gemini çağrısı yapar.
 */
async function callGemini(model, apiKey, prompt) {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json"
    }
  };

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }

  const json = await res.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  return JSON.parse(text);
}

/**
 * 3.8 -> 3.7 -> 3.6 -> 3.5 -> 2.5 sırasıyla ve 3 farklı API anahtarıyla en iyi yanıta ulaşana kadar dener.
 */
async function generateWithWaterfall(prompt) {
  const MODELS = [
    "gemini-3.8-flash",
    "gemini-3.7-flash",
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-2.5-flash",
    "gemini-2.5-pro"
  ];

  for (const model of MODELS) {
    for (let i = 0; i < GEMINI_API_KEYS.length; i++) {
      const apiKey = GEMINI_API_KEYS[i];
      const keySnippet = apiKey.substring(0, 8) + "..." + apiKey.slice(-4);
      console.log(`🔄 Deneniyor: Model [${model}] | API Anahtarı #${i + 1} (${keySnippet})...`);

      try {
        const result = await callGemini(model, apiKey, prompt);
        if (result && result.daily && result.daily.length > 0) {
          console.log(`🎯 MÜKEMMEL BAŞARI! Model [${model}] (Anahtar #${i + 1}) ile veri işlendi.`);
          return { data: result, modelUsed: model };
        }
      } catch (err) {
        console.warn(`⚠️ [${model}] (Anahtar #${i + 1}) başarısız: ${err.message.substring(0, 100)}... Sıradaki deneniyor.`);
      }
    }
  }

  throw new Error("Hiçbir model ve API anahtarı kombinasyonu başarılı olamadı.");
}

/**
 * Ana işlem akışı
 */
async function main() {
  console.log("🚀 50 Subreddit Reddit AI, GPU/CPU ve Yazılım Trend Radarı Başlatılıyor...");
  const startTime = Date.now();

  let allDiscussions = "";
  let totalPosts = 0;
  let successfulBatches = 0;

  for (const batch of SUBREDDIT_BATCHES) {
    const posts = await fetchBatchPosts(batch);
    if (posts.length > 0) {
      successfulBatches++;
      totalPosts += posts.length;
      allDiscussions += `\n\n=== KATEGORİ: ${batch.name} (Subredditler: ${batch.slug}) ===\n`;
      allDiscussions += posts.map(p => `BAŞLIK: ${p.title}\nİÇERİK: ${p.content}`).join("\n---\n");
    }
    // GitHub'da süremiz bol; Reddit'i hiç rahatsız etmemek için sakin sakin bekliyoruz (5.0 - 7.5s)
    const jitter = 5000 + Math.floor(Math.random() * 2500);
    console.log(`⏳ Bekleniyor (${(jitter / 1000).toFixed(1)}s)...`);
    await sleep(jitter);
  }

  if (allDiscussions.length < 200) {
    console.error("❌ Yeterli veri toplanamadı.");
    process.exit(1);
  }

  const historySummary = loadToolHistorySummary();
  console.log(`📊 Toplam ${totalPosts} adet gönderi toplandı (Günlük sıcak + 1 haftalık en çok oylananlar).`);
  console.log(`📚 Sistemin yerel hafıza veritabanı analiz promptuna enjekte ediliyor...`);

  const prompt = `
    Sen kıdemli bir "Yapay Zeka, GPU/Donanım ve Yazılım Ekosistemi Baş Danışmanısın".
    Aşağıda 50 seçkin Reddit topluluğundan toplanan en güncel tartışmalar (Günlük Sıcak + 1 Haftalık En Çok Oylanan) yer almaktadır:

    ${allDiscussions}

    ════════════════════════════════════════════════════════════════════
    📌 SİSTEMİN KALICI VERİTABANI HAFIZASI (TOOL-HISTORY DATABASE):
    Aşağıda sistemimizin daha önceki günlerde ve haftalarda kaydettiği gerçek model ve araç skorları, zaman çizgisi ve hissiyat akışı yer almaktadır:

    ${historySummary}
    ════════════════════════════════════════════════════════════════════

    GÖREV VE ZAMAN DİLİMLERİ HESAPLAMA KURALLARI:
    1. "twelveHours" (12 Saatlik Sekme):
       - Reddit'in son 12 saatteki anlık çıkışlarına ve sıcak tartışmalarına dayanmalıdır.
       - En taze duyurulan, ani kırılma yaşayan veya servis çöküşü yaşayan modelleri listele (en az 10 adet).

    2. "daily" (24 Saatlik Sekme):
       - Bugünün genel günlüğünü temsil eder (en az 10-14 adet).
       - scoreDelta: Dün kaydedilen skora göre 24 saatlik net değişim.

    3. "weekly" (1 Haftalık Sekme - VERİTABANI VE 1 HAFTALIK REDDIT VERİSİ):
       - KESİNLİKLE yukarıdaki "SİSTEMİN KALICI VERİTABANI HAFIZASI"ndaki son 7 günlük kayıtları ve Reddit'in "1 Haftalık En Çok Oylanan" başlıklarını harmanla!
       - scoreDelta: Veritabanındaki 7 gün önceki kayıt ile bugünkü skor arasındaki gerçek 7 günlük net farkı (7d Delta) yansıtmalıdır.
       - Eğer bir model (örn. ilk günlerde büyük coşkuyla karşılanıp sonra 503 hataları, kota bitmesi veya servis çöküşü nedeniyle eleştirilen bir araç) son 7 günde düşüşe geçtiyse ("balon söndü"), haftalık skorda bu düşüşü negatif delta (-1.5, -2.0 gibi) olarak yansıt.
       - sparkline: Son 7 günün puan akışını temsil eden 7 adet sayı dizisi olmalıdır (en az 10-12 araç).

    4. "monthly" (1 Aylık Sekme - VERİTABANI VE PAZAR DİNAMİKLERİ):
       - Veritabanındaki 30 günlük genel trendi, kurumsal benimsenmeyi ve pazar konsolidasyonunu yansıtmalıdır.

    KATEGORİLENDİRME KURALLARI:
    Her araca veya modele MUTLAKA şu kategorilerden tam olarak birini ver:
    - "LLM (Model)" : Claude, Gemini, GPT-4.5 gibi kapalı/ticari API modelleri.
    - "Yerel Model" : DeepSeek, Llama, Qwen, Mistral, Phi gibi açık ağırlıklı, yerel cihazda/sunucuda çalışabilen modeller.
    - "IDE / Editör" : Cursor, Windsurf, VS Code gibi kodlama editörleri.
    - "CLI / Terminal" : Cline, Aider, Claude Code gibi terminal ajanları.
    - "Otonom Agent" : CrewAI, LangGraph, AutoGPT gibi çoklu ajan framework'leri.
    - "Otomasyon" : n8n, Zapier AI gibi iş akışı otomasyonları.
    - "Altyapı & SDK" : Ollama, vLLM, PydanticAI, GPU sunucuları, API maliyet/yönetim kütüphaneleri.
    - "Bulut & Platform" : Google AI Studio, Google Colab, Vertex AI (Google Cloud), AWS Bedrock, RunPod, Modal, Hugging Face Spaces gibi model test/playground, bulut GPU, notebook ve kurumsal dağıtım platformları.
    - "Medya / Üretim" : ComfyUI, Flux, Midjourney, Wan 2.1 gibi görsel ve video üretim araçları.
    - "Şirket / Lab" : NVIDIA, OpenAI, Anthropic, DeepSeek, AMD gibi çip ve model üreticisi şirketler.

    DONANIM, GPU/CPU, BULUT PLATFORMLARI VE MALİYET VURGUSU:
    Raporun içinde yapay zeka modellerinin çalışması için gereken donanım (NVIDIA RTX/Blackwell, Apple M4, AMD, CPU çıkarımı), API token maliyetleri ve geliştirici bulut platformlarını (Google AI Studio, Google Colab, Vertex AI, AWS Bedrock, RunPod) mutlaka değerlendir. Kota değişimleri veya test ortamı güncellemeleri varsa bunları "Bulut & Platform" kategorisiyle listeye al.

    İSTENEN JSON ŞEMASI:
    {
      "executiveSummary": "1-2 paragraflık derin makro yönetici özeti",
      "twelveHours": [
        // SON 12 SAAT: Günde 2 kez yapılan taramanın son 12 saatteki en ani çıkış yapanları, son döngüde kırılma yaşayan modeller/araçlar (en az 10 adet)
        {
          "id": "model-id",
          "name": "Model/Araç/Donanım Adı",
          "category": "LLM (Model) | Yerel Model | IDE / Editör | CLI / Terminal | Otonom Agent | Otomasyon | Altyapı & SDK | Bulut & Platform | Medya / Üretim | Şirket / Lab",
          "badge": "Örn: 12s Patlaması",
          "hypeScore": 9.7,
          "prevScore": 8.9,
          "scoreDelta": 0.8,
          "trend": "skyrocketing | rising | stable | cooling",
          "mentions": 650,
          "sparkline": [8.0, 8.3, 8.7, 9.0, 9.3, 9.5, 9.7],
          "primaryFunction": "Temel işlev ve yetenek",
          "whyTrending": "Son 12 saatteki ani yükseliş ve kırılma gerekçesi",
          "sources": ["r/vibecoding", "r/hardware"]
        }
      ],
      "daily": [
        // DİKKAT: EN AZ 10 ADET (10-14 arası) konuşulan model ve aracı listele! Kesinlikle 10'dan az olmasın.
        {
          "id": "model-id",
          "name": "Model/Araç/Donanım Adı",
          "category": "LLM (Model) | Yerel Model | IDE / Editör | CLI / Terminal | Otonom Agent | Otomasyon | Altyapı & SDK | Medya / Üretim | Şirket / Lab",
          "badge": "Örn: Günün Lideri",
          "hypeScore": 9.5,
          "prevScore": 9.0,
          "scoreDelta": 0.5,
          "trend": "skyrocketing | rising | stable | cooling",
          "mentions": 500,
          "sparkline": [8.0, 8.2, 8.5, 8.9, 9.1, 9.3, 9.5],
          "primaryFunction": "Temel işlev ve yetenek",
          "whyTrending": "Neden trend olduğuna dair 1-2 cümlelik keskin analiz",
          "sources": ["r/vibecoding", "r/hardware"]
        }
      ],
      "weekly": [ /* aynı formatta en az 10-12 araç... */ ],
      "monthly": [ /* aynı formatta en az 6-8 araç... */ ],
      "sections": [
        {
          "title": "BÖLÜM 1: 🌐 GÜNÜN EKOSİSTEM DENGESİ & MODELLER ARASI GÜÇ SAVAŞI",
          "badge": "Ekosistem Dengesi",
          "contentHtml": "<p>Anthropic, OpenAI, Google ve Açık Kaynak (DeepSeek/Llama/vLLM) kamplarının geliştirici zihnindeki hakimiyeti ve günün pazar kırılma noktaları hakkında derinlemesine 2-3 analitik paragraf (asla tablo listesi tekrarı yapma).</p>"
        },
        {
          "title": "BÖLÜM 2: 💡 DERİN TEKNİK İÇGÖRÜLER, VIBE CODING & GPU/ALTYAPI DENGESİ",
          "badge": "Teknoloji & Donanım",
          "contentHtml": "<p>...</p>"
        },
        {
          "title": "BÖLÜM 3: 📉 MAKRO SEKTÖR TRENDLERİ, ÇİP SAVAŞLARI & API MALİYETLERİ",
          "badge": "Pazar Analizi",
          "contentHtml": "<p>...</p>"
        },
        {
          "title": "BÖLÜM 4: 💼 BEYAZ YAKA ENTEGRASYON VE OPERASYON REHBERİ",
          "badge": "İş Dünyası",
          "contentHtml": "<p>...</p>"
        }
      ]
    }
  `;

  const { data: resultJson, modelUsed: activeModelUsed } = await generateWithWaterfall(prompt);

  const duration = Math.round((Date.now() - startTime) / 1000);
  const dateStr = new Date().toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const finalOutput = {
    date: dateStr,
    activeModel: activeModelUsed,
    durationSeconds: duration,
    totalPostsAnalyzed: totalPosts,
    subredditsCovered: 50,
    ...resultJson
  };

  const outputPath = path.join(__dirname, "../src/data/latest-report.json");
  fs.writeFileSync(outputPath, JSON.stringify(finalOutput, null, 2), "utf-8");
  console.log(`🎉 Rapor başarıyla oluşturuldu ve kaydedildi: ${outputPath}`);

  // 2. Gün bazında kalıcı arşiv dosyası oluştur (src/data/archive/YYYY-MM-DD.json)
  const archiveDir = path.join(__dirname, "../src/data/archive");
  if (!fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir, { recursive: true });
  }
  const isoDate = new Date().toISOString().split("T")[0]; // örn. "2026-09-05"
  const archivePath = path.join(archiveDir, `${isoDate}.json`);
  fs.writeFileSync(archivePath, JSON.stringify(finalOutput, null, 2), "utf-8");
  console.log(`📦 Günlük arşiv kalıcı olarak saklandı: ${archivePath}`);

  // 3. Arşiv İndeksini güncelle (archive-index.json)
  const indexPath = path.join(archiveDir, "archive-index.json");
  let archiveIndex = [];
  if (fs.existsSync(indexPath)) {
    try { archiveIndex = JSON.parse(fs.readFileSync(indexPath, "utf-8")); } catch (e) {}
  }
  if (!archiveIndex.find(item => item.isoDate === isoDate)) {
    archiveIndex.unshift({ isoDate, dateStr, count: (finalOutput.daily || []).length });
    fs.writeFileSync(indexPath, JSON.stringify(archiveIndex, null, 2), "utf-8");
  }

  // 4. Araç bazlı tarihsel hafıza ve topluluk duygu günlüğünü güncelle
  updateToolHistory(finalOutput, dateStr);

  console.log(`⏱️ Toplam Çalışma Süresi: ${duration} saniye.`);
}

/**
 * Araçların gün gün performansını, hype skorunu ve topluluk nabzını kalıcı olarak tool-history.json dosyasına işler.
 */
function updateToolHistory(reportData, dateStr) {
  const historyPath = path.join(__dirname, "../src/data/tool-history.json");
  let historyData = {};
  if (fs.existsSync(historyPath)) {
    try {
      historyData = JSON.parse(fs.readFileSync(historyPath, "utf-8"));
    } catch (e) {
      console.warn("⚠️ tool-history.json okunamadı, sıfırdan oluşturuluyor.");
    }
  }

  const allItems = [...(reportData.twelveHours || []), ...(reportData.daily || []), ...(reportData.weekly || [])];
  const processedIds = new Set();

  for (const item of allItems) {
    if (!item.id || processedIds.has(item.id)) continue;
    processedIds.add(item.id);

    if (!historyData[item.id]) {
      historyData[item.id] = {
        name: item.name,
        category: item.category,
        history: []
      };
    }

    let sentiment = "stabil";
    if (item.scoreDelta >= 0.3 || item.trend === "skyrocketing") {
      sentiment = "coşkulu";
    } else if (item.scoreDelta <= -0.3 || item.trend === "cooling") {
      sentiment = "eleştirel";
    } else if (item.scoreDelta < -0.8) {
      sentiment = "düşüş";
    }

    const headline = item.badge ? `${item.badge}` : `${item.name} Gelişmesi`;

    const historyEntry = {
      date: dateStr,
      hypeScore: item.hypeScore,
      sentiment: sentiment,
      headline: headline,
      summary: item.whyTrending || item.primaryFunction,
      sources: item.sources || []
    };

    const existingIndex = historyData[item.id].history.findIndex(h => h.date === dateStr);
    if (existingIndex >= 0) {
      historyData[item.id].history[existingIndex] = historyEntry;
    } else {
      historyData[item.id].history.push(historyEntry);
    }
  }

  fs.writeFileSync(historyPath, JSON.stringify(historyData, null, 2), "utf-8");
  console.log(`📚 Tarihsel araç veri tabanı (${Object.keys(historyData).length} araç) başarıyla güncellendi.`);
}

main().catch(err => {
  console.error("Kritik Hata:", err);
  process.exit(1);
});
