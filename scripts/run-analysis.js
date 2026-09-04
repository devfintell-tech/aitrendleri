import { XMLParser } from 'fast-xml-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SUBREDDIT_BATCHES, REDDIT_USER_AGENT } from './subreddits.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 3 Farklı Gemini API Anahtar Havuzu (Yedekli ve Rotasyonlu)
const GEMINI_API_KEYS = [
  process.env.GEMINI_API_KEY || "AIzaSyDNxwcKWSpib1dvX6sEYA29CyqzoB0ewuY",
  process.env.GEMINI_API_KEY_2 || "AIzaSyB8UrTMckuRlXsBHlbowNnQTxxEH8_0fmo",
  process.env.GEMINI_API_KEY_3 || "AIzaSyB2N1DVVGtmkO3x7PeqAJ4Fn0ODpK3sU6I"
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
 */
async function fetchBatchPosts(batch) {
  const url = `https://www.reddit.com/r/${batch.slug}/hot.rss?limit=30`;
  console.log(`📡 Çekiliyor: [${batch.name}] -> (${batch.subreddits.length} sub, en sıcak başlıklar)...`);

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": REDDIT_USER_AGENT,
          "Accept": "application/atom+xml,application/xml,text/xml"
        }
      });

      if (res.status === 429) {
        console.warn(`⏳ Reddit 429 verdi [${batch.name}]. 10 saniye sakinleşip tekrar deneniyor (Deneme ${attempt}/2)...`);
        await sleep(10000);
        continue;
      }

      if (!res.ok) {
        console.warn(`⚠️ HTTP ${res.status} [${batch.name}]: ${res.statusText}`);
        return [];
      }

      const xml = await res.text();
      const jsonObj = parser.parse(xml);
      const feed = jsonObj.feed;
      if (!feed || !feed.entry) return [];

      const entries = Array.isArray(feed.entry) ? feed.entry : [feed.entry];
      const posts = [];

      for (const entry of entries.slice(0, 20)) {
        let content = "";
        if (entry.content && typeof entry.content === "string") {
          content = entry.content;
        } else if (entry.content && entry.content["#text"]) {
          content = entry.content["#text"];
        }

        // Sabitlenmiş moderatör duyurularını ve kuralları ele
        const title = entry.title ? decodeHtmlEntities(typeof entry.title === "string" ? entry.title : entry.title["#text"] || "") : "";
        if (title.toLowerCase().includes("monthly discussion") || title.toLowerCase().includes("weekly thread") || title.toLowerCase().includes("rules")) {
          continue;
        }

        // HTML etiketlerini temizle
        content = content.replace(/<\/?[^>]+(>|$)/g, "");
        content = decodeHtmlEntities(content);
        if (content.length > 800) content = content.substring(0, 800) + "...";

        const link = entry.link && entry.link["@_href"] ? entry.link["@_href"] : "";

        posts.push({
          title,
          link,
          content: content.trim()
        });
      }

      console.log(`✅ [${batch.name}] için ${posts.length} sıcak başlık başarıyla alındı.`);
      return posts;
    } catch (err) {
      console.error(`❌ Hata [${batch.name}]:`, err.message);
      if (attempt < 2) await sleep(5000);
    }
  }

  return [];
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

  console.log(`📊 Toplam ${totalPosts} adet en sıcak gönderi toplandı (${successfulBatches}/${SUBREDDIT_BATCHES.length} grup). Gemini şelale analizine geçiliyor...`);

  const prompt = `
    Sen kıdemli bir "Yapay Zeka, GPU/Donanım ve Yazılım Ekosistemi Baş Danışmanısın".
    Aşağıda 50 seçkin Reddit topluluğundan (Vibe coding, Ajanlar, LLM'ler, Açık kaynak, Donanım/GPU/CPU, Bulut altyapısı ve Yazılım) toplanan en güncel tartışmalar yer almaktadır:

    ${allDiscussions}

    GÖREV:
    Bu verileri analiz ederek günlük, haftalık ve aylık Hype Skorlarını (1.0 - 10.0) ve 4 bölümlü derin danışman bültenini JSON formatında üret.

    KATEGORİLENDİRME KURALLARI:
    Her araca veya modele MUTLAKA şu kategorilerden tam olarak birini ver:
    - "LLM (Model)" : Claude, Gemini, GPT-4.5 gibi kapalı/ticari API modelleri.
    - "Yerel Model" : DeepSeek, Llama, Qwen, Mistral, Phi gibi açık ağırlıklı, yerel cihazda/sunucuda çalışabilen modeller.
    - "IDE / Editör" : Cursor, Windsurf, VS Code gibi kodlama editörleri.
    - "CLI / Terminal" : Cline, Aider, Claude Code gibi terminal ajanları.
    - "Otonom Agent" : CrewAI, LangGraph, AutoGPT gibi çoklu ajan framework'leri.
    - "Otomasyon" : n8n, Zapier AI gibi iş akışı otomasyonları.
    - "Altyapı & SDK" : Ollama, vLLM, PydanticAI, GPU sunucuları, API maliyet/yönetim kütüphaneleri.
    - "Medya / Üretim" : ComfyUI, Flux, Midjourney, Wan 2.1 gibi görsel ve video üretim araçları.
    - "Şirket / Lab" : NVIDIA, OpenAI, Anthropic, DeepSeek, AMD gibi çip ve model üreticisi şirketler.

    DONANIM, GPU/CPU VE MALİYET VURGUSU:
    Raporun içinde yapay zeka modellerinin çalışması için gereken donanım (NVIDIA RTX/Blackwell, Apple M4, AMD, CPU çıkarımı), API token maliyetleri ve sunucu yükü tartışmalarına mutlaka yer ver.

    İSTENEN JSON ŞEMASI:
    {
      "executiveSummary": "1-2 paragraflık derin makro yönetici özeti",
      "daily": [
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
      "weekly": [ ...aynı formatta haftalık 10-12 araç... ],
      "monthly": [ ...aynı formatta aylık 6-8 araç... ],
      "sections": [
        {
          "title": "BÖLÜM 1: 🛠️ MODEL SIRALAMALARI VE YAPAY ZEKA ARAÇLARI DASHBOARD'U",
          "badge": "Liderlik",
          "contentHtml": "<p>...</p>"
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

  // Araç bazlı tarihsel hafıza ve topluluk duygu günlüğünü güncelle
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

  const allItems = [...(reportData.daily || []), ...(reportData.weekly || [])];
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
