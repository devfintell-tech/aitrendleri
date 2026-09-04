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
 * 1. REDDİT GÜNLÜK SICAK (HOT) BESLEMESİ
 * Haftalık/aylık için ayrı ağır tarama yapmayız; gün gün biriken veri haftalık ve aylık görünümü oluşturur.
 */
async function fetchBatchPosts(batch) {
  const feedUrl = `https://www.reddit.com/r/${batch.slug}/hot.rss?limit=25`;
  const posts = [];
  const seenLinks = new Set();

  console.log(`📡 Çekiliyor: [${batch.name}] -> (Günlük Sıcak)...`);

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(feedUrl, {
        headers: {
          "User-Agent": REDDIT_USER_AGENT,
          "Accept": "application/atom+xml,application/xml,text/xml"
        }
      });

      if (res.status === 429) {
        console.warn(`⏳ Reddit 429 verdi [${batch.name}]. 10 saniye bekleniyor (Deneme ${attempt}/2)...`);
        await sleep(10000);
        continue;
      }

      if (!res.ok) {
        console.warn(`⚠️ HTTP ${res.status} [${batch.name}]: ${res.statusText}`);
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
        if (content.length > 700) content = content.substring(0, 700) + "...";

        posts.push({
          title,
          link,
          content: content.trim()
        });
      }
      break;
    } catch (err) {
      console.error(`❌ Hata [${batch.name}]:`, err.message);
      if (attempt < 2) await sleep(4000);
    }
  }

  return posts;
}

/**
 * 2. HACKER NEWS API (Algolia - %100 Ücretsiz & Sınırsız)
 * Silikon Vadisi mühendislerinin son 24 saatteki teknik tartışmaları ve eleştirileri.
 */
async function fetchHackerNewsPosts() {
  console.log("⚡ Hacker News Algolia API'den teknik tartışmalar çekiliyor...");
  try {
    const oneDayAgo = Math.floor(Date.now() / 1000) - 86400;
    const url = `https://hn.algolia.com/api/v1/search?query=AI+OR+LLM+OR+model&tags=story&numericFilters=created_at_i>${oneDayAgo}&hitsPerPage=15`;
    const res = await fetch(url, { headers: { "Accept": "application/json" } });
    if (!res.ok) {
      console.warn(`⚠️ Hacker News HTTP ${res.status}`);
      return [];
    }
    const data = await res.json();
    const hits = (data.hits || []).filter(h => (h.points || 0) >= 15).slice(0, 10);

    return hits.map(h => ({
      title: h.title,
      points: h.points,
      comments: h.num_comments,
      url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
      hnUrl: `https://news.ycombinator.com/item?id=${h.objectID}`
    }));
  } catch (err) {
    console.warn("⚠️ Hacker News çekilemedi:", err.message);
    return [];
  }
}

/**
 * 3. HUGGING FACE API (%100 Ücretsiz Açık Uç Nokta)
 * Açık kaynak & yerel modellerin gerçek indirme ve beğeni sayıları.
 */
async function fetchHuggingFaceTrending() {
  console.log("🤗 Hugging Face API'den trending yerel modeller çekiliyor...");
  try {
    const url = "https://huggingface.co/api/models?sort=trendingScore&direction=-1&limit=12&full=false";
    const res = await fetch(url, { headers: { "Accept": "application/json" } });
    if (!res.ok) {
      console.warn(`⚠️ Hugging Face HTTP ${res.status}`);
      return [];
    }
    const list = await res.json();
    return (list || []).map(m => ({
      id: m.id,
      likes: m.likes || 0,
      downloads: m.downloads || 0,
      pipeline_tag: m.pipeline_tag || "text-generation",
      author: m.author || (m.id.includes("/") ? m.id.split("/")[0] : "community")
    }));
  } catch (err) {
    console.warn("⚠️ Hugging Face modelleri çekilemedi:", err.message);
    return [];
  }
}

/**
 * 4. ARXİV API (%100 Ücretsiz & Sınırsız)
 * Son günlerde çıkan yapay zeka makalelerini çeker ve daha önce görülmemiş olanları seçer.
 */
async function fetchArxivCandidatePapers(seenIds = new Set()) {
  console.log("🔬 ArXiv API'den güncel yapay zeka makaleleri taranıyor...");
  try {
    const url = "http://export.arxiv.org/api/query?search_query=cat:cs.AI+OR+cat:cs.CL+OR+cat:cs.LG&sortBy=submittedDate&sortOrder=descending&max_results=20";
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`⚠️ ArXiv HTTP ${res.status}`);
      return [];
    }
    const xml = await res.text();
    const jsonObj = parser.parse(xml);
    const entries = jsonObj.feed?.entry || [];
    const list = Array.isArray(entries) ? entries : [entries];

    const candidates = [];
    for (const e of list) {
      const fullId = e.id ? String(e.id) : "";
      const rawId = fullId.replace("http://arxiv.org/abs/", "").replace("https://arxiv.org/abs/", "").trim();
      
      // MÜKERRERLİK KONTROLÜ: Daha önce getirilmiş makaleleri kesinlikle eliyoruz!
      if (seenIds.has(rawId) || seenIds.has(fullId)) continue;

      let authors = [];
      if (e.author) {
        const authArr = Array.isArray(e.author) ? e.author : [e.author];
        authors = authArr.map(a => a.name).filter(Boolean).slice(0, 3);
      }

      const title = e.title ? decodeHtmlEntities(String(e.title)).replace(/\s+/g, " ").trim() : "";
      const summary = e.summary ? decodeHtmlEntities(String(e.summary)).replace(/\s+/g, " ").trim() : "";

      candidates.push({
        id: rawId,
        arxivUrl: fullId.startsWith("http") ? fullId : `https://arxiv.org/abs/${rawId}`,
        title,
        summary: summary.length > 500 ? summary.substring(0, 500) + "..." : summary,
        authors
      });

      if (candidates.length >= 8) break;
    }
    return candidates;
  } catch (err) {
    console.warn("⚠️ ArXiv makaleleri çekilemedi:", err.message);
    return [];
  }
}

/**
 * ArXiv kalıcı hafızasını yükler (Tekrar etmemek için)
 */
function loadArxivHistory() {
  const arxivPath = path.join(__dirname, "../src/data/arxiv-papers.json");
  if (!fs.existsSync(arxivPath)) {
    return { seenPaperIds: [], dailyRecords: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(arxivPath, "utf-8"));
  } catch (e) {
    return { seenPaperIds: [], dailyRecords: [] };
  }
}

/**
 * Yeni seçilen ArXiv makalelerini kalıcı veritabanına kaydeder.
 */
function updateArxivHistory(newPapers, dateStr, isoDate) {
  const arxivPath = path.join(__dirname, "../src/data/arxiv-papers.json");
  const history = loadArxivHistory();

  for (const p of newPapers) {
    if (p.id && !history.seenPaperIds.includes(p.id)) {
      history.seenPaperIds.push(p.id);
    }
  }

  const existingRecordIndex = history.dailyRecords.findIndex(r => r.isoDate === isoDate);
  if (existingRecordIndex >= 0) {
    history.dailyRecords[existingRecordIndex] = { date: dateStr, isoDate, papers: newPapers };
  } else {
    history.dailyRecords.unshift({ date: dateStr, isoDate, papers: newPapers });
  }

  if (history.dailyRecords.length > 60) {
    history.dailyRecords = history.dailyRecords.slice(0, 60);
  }

  fs.writeFileSync(arxivPath, JSON.stringify(history, null, 2), "utf-8");
  console.log(`📚 ArXiv veritabanı güncellendi (Toplam görülen benzersiz makale: ${history.seenPaperIds.length}).`);
}

/**
 * tool-history.json dosyasından sistemin kendi geçmiş kayıtlarını derleyip Gemini'ye besler.
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
 * EN YÜKSEK ÖNCELİK: gemini-3.8-flash İLK SIRADA ÇALIŞIR!
 * 3.8 -> 3.7 -> 3.6 -> 3.5 -> 2.5 sırasıyla ve 3 farklı API anahtarıyla en iyi yanıta ulaşana kadar dener.
 */
async function generateWithWaterfall(prompt) {
  const MODELS = [
    "gemini-3.8-flash", // 🥇 HER ZAMAN İLK ÇALIŞTIRILIR!
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
  console.log("🚀 Çok Kaynaklı Yapay Zeka İstihbarat Radarı (Reddit + HN + HuggingFace + ArXiv) Başlatılıyor...");
  const startTime = Date.now();

  // 1. REDDIT GÜNLÜK SICAK GÖNDERİLERİ TOPLA
  let allDiscussions = "";
  let totalPosts = 0;
  let successfulBatches = 0;

  for (const batch of SUBREDDIT_BATCHES) {
    const posts = await fetchBatchPosts(batch);
    if (posts.length > 0) {
      successfulBatches++;
      totalPosts += posts.length;
      allDiscussions += `\n\n=== REDDIT KATEGORİ: ${batch.name} (Subredditler: ${batch.slug}) ===\n`;
      allDiscussions += posts.map(p => `BAŞLIK: ${p.title}\nİÇERİK: ${p.content}`).join("\n---\n");
    }
    const jitter = 3500 + Math.floor(Math.random() * 2000);
    console.log(`⏳ Bekleniyor (${(jitter / 1000).toFixed(1)}s)...`);
    await sleep(jitter);
  }

  // 2. HACKER NEWS MÜHENDİS TARTIŞMALARINI TOPLA
  const hnPosts = await fetchHackerNewsPosts();
  let hnDiscussions = "";
  if (hnPosts.length > 0) {
    hnDiscussions = hnPosts.map(h => `- [HN Puan: ${h.points} | Yorum: ${h.comments}] "${h.title}" (Link: ${h.url})`).join("\n");
  }

  // 3. HUGGING FACE YEREL MODEL VE TREND VERİLERİNİ TOPLA
  const hfModels = await fetchHuggingFaceTrending();
  let hfSummary = "";
  if (hfModels.length > 0) {
    hfSummary = hfModels.map(m => `- Model: ${m.id} | İndirme: ${m.downloads.toLocaleString()} | Beğeni: ${m.likes} | Tür: ${m.pipeline_tag}`).join("\n");
  }

  // 4. ARXİV BİLİMSEL MAKALE HAVUZU (Daha önce getirilmemiş olanları filtrele)
  const arxivHistory = loadArxivHistory();
  const seenPaperIds = new Set(arxivHistory.seenPaperIds || []);
  const candidateArxiv = await fetchArxivCandidatePapers(seenPaperIds);

  // Son 7 günün kaydedilmiş ArXiv makalelerini topla (Haftalık en iyileri seçebilmek için)
  const past7DaysPapers = (arxivHistory.dailyRecords || [])
    .slice(0, 7)
    .flatMap(r => (r.papers || []).map(p => ({ ...p, recordedDate: r.date })));

  let arxivPromptText = `ADAY YENİ MAKALE HAVUZU (Daha önce hiç sunulmamış, bugün için seçebileceğin 3 makale adayı):\n`;
  arxivPromptText += candidateArxiv.map((c, i) => `${i + 1}. [${c.id}] "${c.title}" by ${c.authors.join(", ")}\nÖzet: ${c.summary}\nLink: ${c.arxivUrl}`).join("\n\n");

  let pastArxivText = `HAFIZADAKİ SON 7 GÜNÜN ARXİV MAKALELERİ (Haftalık En İyileri Seçmek İçin Kaynak):\n`;
  pastArxivText += past7DaysPapers.slice(0, 15).map(p => `- [${p.id}] "${p.title}" (Etki Skoru: ${p.impactScore || 9.0}) - ${p.whyMad || p.summary}`).join("\n");

  const historySummary = loadToolHistorySummary();
  console.log(`📊 Toplam ${totalPosts} Reddit gönderisi, ${hnPosts.length} Hacker News başlığı, ${hfModels.length} Hugging Face modeli ve ${candidateArxiv.length} taze ArXiv adayı toplandı.`);
  console.log(`📚 Sistemin yerel hafıza veritabanı analiz promptuna enjekte ediliyor...`);

  const prompt = `
    Sen kıdemli bir "Yapay Zeka, GPU/Donanım, Bulut Platformları ve Yazılım Ekosistemi Baş Danışmanısın".
    Aşağıda 4 FARKLI KÜRESEL KAYNAKTAN derlenen son 24 saatin istihbaratı yer almaktadır:

    ════════════════════════════════════════════════════════════════════
    1. 🌐 50 SEÇKİN REDDIT TOPLULUĞU TARTIŞMALARI:
    ${allDiscussions}

    ════════════════════════════════════════════════════════════════════
    2. ⚡ HACKER NEWS SİLİKON VADİSİ MÜHENDİS TARTIŞMALARI & ELEŞTİRİLERİ:
    ${hnDiscussions || "Bugün yoğun bir tartışma kaydedilmedi."}

    ════════════════════════════════════════════════════════════════════
    3. 🤗 HUGGING FACE GERÇEK İNDİRME VE YEREL MODEL POPÜLARİTE VERİLERİ:
    ${hfSummary || "Veri çekilemedi."}

    ════════════════════════════════════════════════════════════════════
    4. 🔬 ARXİV BİLİMSEL YAPAY ZEKA VE MAKİNE ÖĞRENİMİ MAKALE HAVUZU:
    ${arxivPromptText}

    ${pastArxivText}

    ════════════════════════════════════════════════════════════════════
    📌 SİSTEMİN KALICI VERİTABANI HAFIZASI (TOOL-HISTORY DATABASE):
    Aşağıda sistemimizin daha önceki günlerde kaydettiği gerçek model skorları, zaman çizgisi ve hissiyat akışı yer almaktadır:
    ${historySummary}
    ════════════════════════════════════════════════════════════════════

    GÖREV VE ZAMAN DİLİMLERİ HESAPLAMA KURALLARI (AYRI TARAMA YAPILMAZ; GEÇMİŞ HAFIZA KULLANILIR):
    1. "twelveHours" (12 Saatlik Sekme):
       - Reddit ve Hacker News'in son 12 saatteki anlık çıkışlarına ve sıcak tartışmalarına dayanmalıdır.
       - En taze duyurulan, ani kırılma yaşayan veya servis çöküşü yaşayan modelleri listele (en az 10 adet).

    2. "daily" (24 Saatlik Sekme):
       - Bugünün genel günlüğünü temsil eder (en az 10-14 adet).
       - scoreDelta: Dün kaydedilen skora göre 24 saatlik net değişim.

    3. "weekly" (1 Haftalık Sekme - VERİTABANINDAN DERLENEN GERÇEK 7 GÜNLÜK HAFIZA):
       - KESİNLİKLE yukarıdaki "SİSTEMİN KALICI VERİTABANI HAFIZASI"ndaki son 7 günlük kayıtları kullan!
       - Yeni tarama uydurma; son 7 günde tabloda en çok adı geçen, en yüksek puan alan ve istikrarını koruyan modelleri listele.
       - scoreDelta: Veritabanındaki 7 gün önceki kayıt ile bugünkü skor arasındaki gerçek farkı yansıtmalıdır.
       - Eğer bir model (örn. ilk günlerde büyük hype alıp sonra çöken bir araç) son 7 günde düşüşe geçtiyse bunu negatif delta (-1.5 gibi) olarak yansıt.

    4. "monthly" (1 Aylık Sekme):
       - Veritabanındaki 30 günlük genel trendi, kurumsal benimsenmeyi ve pazar konsolidasyonunu yansıtmalıdır.

    KATEGORİLENDİRME KURALLARI:
    Her araca veya modele MUTLAKA şu kategorilerden tam olarak birini ver:
    - "LLM (Model)" : Claude, Gemini, GPT-4.5 gibi kapalı/ticari API modelleri.
    - "Yerel Model" : DeepSeek, Llama, Qwen, Mistral, Phi gibi açık ağırlıklı, yerel cihazda/sunucuda çalışabilen modeller (Hugging Face verileriyle destekle).
    - "IDE / Editör" : Cursor, Windsurf, VS Code gibi kodlama editörleri.
    - "CLI / Terminal" : Cline, Aider, Claude Code gibi terminal ajanları.
    - "Otonom Agent" : CrewAI, LangGraph, AutoGPT gibi çoklu ajan framework'leri.
    - "Otomasyon" : n8n, Zapier AI gibi iş akışı otomasyonları.
    - "Altyapı & SDK" : Ollama, vLLM, PydanticAI, GPU sunucuları, API maliyet/yönetim kütüphaneleri.
    - "Bulut & Platform" : Google AI Studio, Google Colab, Vertex AI (Google Cloud), AWS Bedrock, RunPod, Modal, Hugging Face Spaces gibi model test/playground, bulut GPU ve kurumsal dağıtım platformları.
    - "Medya / Üretim" : ComfyUI, Flux, Midjourney, Wan 2.1 gibi görsel ve video üretim araçları.
    - "Şirket / Lab" : NVIDIA, OpenAI, Anthropic, DeepSeek, AMD gibi çip ve model üreticisi şirketler.

    ARXİV MAKALE KURALLARI:
    - "arxivDaily" listesi için: "ADAY YENİ MAKALE HAVUZU"ndan en çarpıcı, en yenilikçi ve en mantıklı 3 makaleyi seç. Her biri için Türkçe anlaşılır "whyMad" (neden çılgın ve çarpıcı olduğu) ve 1-2 cümlelik "summary" yaz.
    - "arxivWeeklyBest" listesi için: Hem bugünün makalelerini hem de "HAFIZADAKİ SON 7 GÜNÜN ARXİV MAKALELERİ"ni incele ve bu 7 günün toplamındaki en yüksek etki yaratan en iyi 3-4 makalesini seçip derle!

    HUGGING FACE VE HACKER NEWS ÖZETİ:
    - "huggingFaceTop": En popüler 4-5 yerel modeli indirme ve beğeni sayılarıyla formatla.
    - "hackerNewsPulse": HN'deki en dikkat çeken 3 mühendis tartışmasını ve ana fikrini çıkar.

    İSTENEN JSON ŞEMASI:
    {
      "executiveSummary": "1-2 paragraflık derin makro yönetici özeti",
      "twelveHours": [
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
          "sources": ["r/vibecoding", "Hacker News"]
        }
      ],
      "daily": [
        // EN AZ 10-14 ADET model ve araç
        {
          "id": "model-id",
          "name": "Model/Araç/Donanım Adı",
          "category": "LLM (Model) | Yerel Model | IDE / Editör | CLI / Terminal | Otonom Agent | Otomasyon | Altyapı & SDK | Bulut & Platform | Medya / Üretim | Şirket / Lab",
          "badge": "Örn: Günün Lideri",
          "hypeScore": 9.5,
          "prevScore": 9.0,
          "scoreDelta": 0.5,
          "trend": "skyrocketing | rising | stable | cooling",
          "mentions": 500,
          "sparkline": [8.0, 8.2, 8.5, 8.9, 9.1, 9.3, 9.5],
          "primaryFunction": "Temel işlev ve yetenek",
          "whyTrending": "Neden trend olduğuna dair 1-2 cümlelik keskin analiz",
          "sources": ["r/vibecoding", "Hugging Face"]
        }
      ],
      "weekly": [ /* Son 7 günün kalıcı hafızasından derlenmiş en iyi 10-12 araç... */ ],
      "monthly": [ /* Son 30 günün kalıcı hafızasından derlenmiş en iyi 6-8 araç... */ ],
      "arxivDaily": [
        // Bugün adaylardan seçilen 3 yeni ve benzersiz makale
        {
          "id": "arxiv-id",
          "title": "İngilizce Makale Başlığı",
          "arxivUrl": "https://arxiv.org/abs/...",
          "authors": ["Yazar 1", "Yazar 2"],
          "category": "cs.AI | cs.LG | cs.CL",
          "impactScore": 9.5,
          "whyMad": "Neden çılgın ve ezber bozan bir makale olduğuna dair keskin Türkçe açıklama",
          "summary": "Makalenin getirdiği teknik yeniliğin anlaşılır Türkçe özeti"
        }
      ],
      "arxivWeeklyBest": [
        // Son 7 günün birikmiş makaleleri arasından en iyi 3-4 makale
        {
          "id": "arxiv-id",
          "title": "Makale Başlığı",
          "arxivUrl": "https://arxiv.org/abs/...",
          "impactScore": 9.7,
          "whyMad": "Haftanın en iyi makalelerinden biri seçilme gerekçesi",
          "summary": "Teknik özet"
        }
      ],
      "huggingFaceTop": [
        {
          "id": "org/model-name",
          "downloads": "250K",
          "likes": 420,
          "tag": "text-generation",
          "highlight": "Topluluğun en çok tercih ettiği açık ağırlık"
        }
      ],
      "hackerNewsPulse": [
        {
          "title": "Tartışma Başlığı",
          "points": 340,
          "comments": 180,
          "url": "https://...",
          "takeaway": "Silikon vadisi mühendislerinin ana eleştiri ve görüşü"
        }
      ],
      "sections": [
        {
          "title": "BÖLÜM 1: 🌐 GÜNÜN EKOSİSTEM DENGESİ & MODELLER ARASI GÜÇ SAVAŞI",
          "badge": "Ekosistem Dengesi",
          "contentHtml": "<p>Anthropic, OpenAI, Google ve Açık Kaynak kamplarının geliştirici zihnindeki pazar payı ve güç dengesi analizi.</p>"
        },
        {
          "title": "BÖLÜM 2: 💡 DERİN TEKNİK İÇGÖRÜLER, VIBE CODING & GPU/ALTYAPI DENGESİ",
          "badge": "Teknoloji & Donanım",
          "contentHtml": "<p>Hacker News ve Reddit tartışmalarından süzülen teknik mimari, bellek ve donanım içgörüleri.</p>"
        },
        {
          "title": "BÖLÜM 3: 📉 MAKRO SEKTÖR TRENDLERİ, ÇİP SAVAŞLARI & API MALİYETLERİ",
          "badge": "Pazar Analizi",
          "contentHtml": "<p>Bulut sağlayıcılar, GPU kiralama maliyetleri ve kurumsal platform hareketleri.</p>"
        },
        {
          "title": "BÖLÜM 4: 💼 BEYAZ YAKA ENTEGRASYON VE OPERASYON REHBERİ",
          "badge": "İş Dünyası",
          "contentHtml": "<p>Şirketlerin ve ekiplerin günlük operasyonlarına bu araçları nasıl entegre edeceği.</p>"
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
  const isoDate = new Date().toISOString().split("T")[0]; // örn. "2026-09-05"

  const finalOutput = {
    date: dateStr,
    isoDate: isoDate,
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

  // 4. ArXiv kalıcı veritabanını güncelle (Bugün seçilen 3 makale kaydedilir ve tekrar getirilmesi engellenir)
  if (resultJson.arxivDaily && resultJson.arxivDaily.length > 0) {
    updateArxivHistory(resultJson.arxivDaily, dateStr, isoDate);
  }

  // 5. Araç bazlı tarihsel hafıza ve topluluk duygu günlüğünü güncelle
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
