import { XMLParser } from 'fast-xml-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SUBREDDIT_BATCHES, REDDIT_USER_AGENT } from './subreddits.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API anahtarı çevre değişkeninden veya varsayılandan alınır
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDNxwcKWSpib1dvX6sEYA29CyqzoB0ewuY";

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
 * Multi-Subreddit RSS beslemesini güvenli şekilde çeker.
 */
async function fetchBatchPosts(batch) {
  // En sıcak (hot) 30 içeriği çekip en yüksek sinyallileri süzüyoruz
  const url = `https://www.reddit.com/r/${batch.slug}/hot.rss?limit=30`;
  console.log(`📡 Çekiliyor: [${batch.name}] -> (${batch.subreddits.length} sub, en sıcak içerikler)...`);

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": REDDIT_USER_AGENT,
        "Accept": "application/atom+xml,application/xml,text/xml"
      }
    });

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

    for (const entry of entries.slice(0, 18)) {
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

    console.log(`✅ [${batch.name}] için ${posts.length} yüksek sinyalli başlık alındı.`);
    return posts;
  } catch (err) {
    console.error(`❌ Hata [${batch.name}]:`, err.message);
    return [];
  }
}

/**
 * Gemini API'ye istek gönderir.
 */
async function callGemini(model, prompt) {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.3,
      responseMimeType: "application/json"
    }
  };

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error(`Gemini API HTTP ${res.status}: ${await res.text()}`);
  }

  const json = await res.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  return JSON.parse(text);
}

/**
 * Ana işlem akışı
 */
async function main() {
  console.log("🚀 Reddit AI Trend Radarı Başlatılıyor...");
  const startTime = Date.now();

  let allDiscussions = "";
  let totalPosts = 0;

  for (const batch of SUBREDDIT_BATCHES) {
    const posts = await fetchBatchPosts(batch);
    if (posts.length > 0) {
      totalPosts += posts.length;
      allDiscussions += `\n\n=== KATEGORİ: ${batch.name} (Subredditler: ${batch.slug}) ===\n`;
      allDiscussions += posts.map(p => `BAŞLIK: ${p.title}\nİÇERİK: ${p.content}`).join("\n---\n");
    }
    // İnsan benzeri rastgele bekleme (Reddit koruması)
    const jitter = 2500 + Math.floor(Math.random() * 1500);
    console.log(`⏳ Bekleniyor (${(jitter / 1000).toFixed(1)}s)...`);
    await sleep(jitter);
  }

  if (allDiscussions.length < 200) {
    console.error("❌ Yeterli veri toplanamadı. Lütfen internet bağlantısını veya RSS erişimini kontrol edin.");
    process.exit(1);
  }

  console.log(`📊 Toplam ${totalPosts} gönderi toplandı. Gemini analiz motoruna gönderiliyor...`);

  const prompt = `
    Sen kıdemli bir "Yapay Zeka ve Teknoloji Analistisin".
    Aşağıda 30'dan fazla seçkin Reddit topluluğundan toplanan en güncel tartışmalar yer almaktadır:

    ${allDiscussions}

    GÖREV:
    Bu verileri analiz ederek hem günlük/haftalık/aylık Hype Skorlarını (1.0 - 10.0) hem de derin danışman bülteni içeriğini JSON formatında üret.

    İSTENEN JSON ŞEMASI:
    {
      "executiveSummary": "1-2 paragraflık yönetici özeti",
      "daily": [
        {
          "id": "model-id",
          "name": "Model/Araç Adı",
          "category": "Vibe Coding | Temel LLM | Otonom Ajanlar | Açık Kaynak | Görsel & Medya",
          "badge": "Örn: Günün Lideri",
          "hypeScore": 9.5,
          "category": "LLM (Model) | Yerel Model | IDE / Editör | CLI / Terminal | Otonom Agent | Otomasyon | Altyapı & SDK | Medya / Üretim | Şirket / Lab",
          "badge": "Örn: Günün Lideri",
          "hypeScore": 9.5,
          "prevScore": 9.0,
          "scoreDelta": 0.5,
          "trend": "skyrocketing | rising | stable | cooling",
          "mentions": 500,
          "sparkline": [8.0, 8.2, 8.5, 8.9, 9.1, 9.3, 9.5],
          "primaryFunction": "Temel işlev ve yetenek",
          "whyTrending": "Neden trend olduğuna dair 1-2 cümlelik keskin özet",
          "sources": ["r/vibecoding", "r/CursorAI"]
        }
      ],
      "weekly": [ ...aynı formatta haftalık 8-10 araç... ],
      "monthly": [ ...aynı formatta aylık 6-8 araç... ],
      "sections": [
        {
          "title": "BÖLÜM 1: 🛠️ MODEL SIRALAMALARI VE YAPAY ZEKA ARAÇLARI DASHBOARD'U",
          "badge": "Liderlik",
          "contentHtml": "<p>...</p>"
        },
        {
          "title": "BÖLÜM 2: 💡 DERİN TEKNİK İÇGÖRÜLER, MODELLER & VIBE CODING",
          "badge": "Kodlama Devrimi",
          "contentHtml": "<p>...</p>"
        },
        {
          "title": "BÖLÜM 3: 📉 MAKRO SEKTÖR TRENDLERİ VE REKABET DENGESİ",
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

    ÖNEMLİ KATEGORİLEME KURALI:
    - DeepSeek-R1, Qwen, Llama, Mistral gibi açık ağırlıklı veya yerel çalıştırılabilen modelleri MUTLAKA "Yerel Model" olarak kategorilendir!
    - Claude, Gemini, GPT-4.5 gibi kapalı API modellerini "LLM (Model)" olarak kategorilendir.
  `;

  const fallbackModels = ["gemini-3.8-flash", "gemini-3.7-flash", "gemini-2.5-flash", "gemini-2.5-pro"];
  let resultJson = null;
  let activeModelUsed = "";

  for (const model of fallbackModels) {
    try {
      console.log(`🤖 Gemini modeli deneniyor: [${model}]...`);
      resultJson = await callGemini(model, prompt);
      activeModelUsed = model;
      console.log(`✅ [${model}] başarıyla analiz etti.`);
      break;
    } catch (err) {
      console.warn(`⚠️ [${model}] başarısız: ${err.message}. Sıradakine geçiliyor...`);
    }
  }

  if (!resultJson) {
    console.error("☠️ Hiçbir Gemini modeli yanıt veremedi.");
    process.exit(1);
  }

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
    subredditsCovered: 30,
    ...resultJson
  };

  const outputPath = path.join(__dirname, "../src/data/latest-report.json");
  fs.writeFileSync(outputPath, JSON.stringify(finalOutput, null, 2), "utf-8");
  console.log(`🎉 Rapor başarıyla oluşturuldu ve kaydedildi: ${outputPath}`);
  console.log(`⏱️ Toplam Çalışma Süresi: ${duration} saniye.`);
}

main().catch(err => {
  console.error("Kritik Hata:", err);
  process.exit(1);
});
