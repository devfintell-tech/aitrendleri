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
 * 50 topluluktan en güncel sıcak tartışmaları ve flaş duyuruları çeker.
 */
async function fetchBatchPosts(batch) {
  const feedUrl = `https://www.reddit.com/r/${batch.slug}/hot.rss?limit=30`;
  const posts = [];
  const seenLinks = new Set();

  console.log(`📡 Çekiliyor: [${batch.name}] -> (Günlük Sıcak & Flaş)...`);

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
        if (content.length > 750) content = content.substring(0, 750) + "...";

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
 * 2. HUGGING FACE API (%100 Ücretsiz Açık Uç Nokta)
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
 * 3. HACKER NEWS ALGOLIA API (%100 Ücretsiz Açık Uç Nokta)
 * Son 24 saatte en çok oylanan ve tartışılan yapay zeka/mühendislik konuları.
 * DİKKAT: Sıralamaya KESİNLİKLE etki etmez, yalnızca özet ve faydalı bilgi içindir.
 */
async function fetchHackerNews24h() {
  console.log("⚡ Hacker News API'den son 24 saatin teknik tartışmaları çekiliyor...");
  try {
    const oneDayAgo = Math.floor(Date.now() / 1000) - 86400;
    const queries = ["AI", "LLM"];
    const allHits = new Map();

    for (const q of queries) {
      const url = `https://hn.algolia.com/api/v1/search?query=${q}&tags=story&numericFilters=created_at_i>${oneDayAgo}&hitsPerPage=15`;
      const res = await fetch(url, { headers: { "Accept": "application/json" } });
      if (res.ok) {
        const data = await res.json();
        for (const h of (data.hits || [])) {
          if ((h.points || 0) >= 15 && !allHits.has(h.objectID)) {
            allHits.set(h.objectID, {
              id: h.objectID,
              title: decodeHtmlEntities(h.title || ""),
              points: h.points || 0,
              comments: h.num_comments || 0,
              url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
              hnUrl: `https://news.ycombinator.com/item?id=${h.objectID}`
            });
          }
        }
      }
      await sleep(500);
    }

    const sorted = Array.from(allHits.values())
      .sort((a, b) => b.points - a.points)
      .slice(0, 8);

    console.log(`✅ Hacker News'den ${sorted.length} taze mühendis tartışması alındı.`);
    return sorted;
  } catch (err) {
    console.warn("⚠️ Hacker News çekilemedi:", err.message);
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
      
      // MÜKERRERLİK KONTROLÜ: Daha önce getirilmiş makaleleri eliyoruz!
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
 * Google Search Grounding destekli çalışır.
 */
async function callGemini(model, apiKey, prompt) {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    tools: [{ googleSearch: {} }],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json"
    }
  };

  let res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  // Eğer model sürümü googleSearch ile responseMimeType: application/json kombinasyonunu desteklemezse tools'suz tekrar dener
  if (!res.ok && res.status === 400) {
    console.log("ℹ️ Google Search aracı yalın JSON moduna devrediliyor...");
    delete payload.tools;
    res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  }

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }

  const json = await res.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  return JSON.parse(text);
}

/**
 * EN YÜKSEK ÖNCELİK: gemini-3.8-flash İLK SIRADA ÇALIŞIR!
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
  console.log("🚀 Canlı Yapay Zeka İstihbarat Radarı (Reddit + Google Search Teyidi + HF + ArXiv) Başlatılıyor...");
  const startTime = Date.now();

  // 1. REDDIT GÜNLÜK SICAK VE EN TAZE FLAŞ GÖNDERİLERİ TOPLA
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

  // 2. HUGGING FACE YEREL MODEL VE TREND VERİLERİNİ TOPLA
  const hfModels = await fetchHuggingFaceTrending();
  let hfSummary = "";
  if (hfModels.length > 0) {
    hfSummary = hfModels.map(m => `- Model: ${m.id} | İndirme: ${m.downloads.toLocaleString()} | Beğeni: ${m.likes} | Tür: ${m.pipeline_tag}`).join("\n");
  }

  // 3. ARXİV BİLİMSEL MAKALE HAVUZU
  const arxivHistory = loadArxivHistory();
  const seenPaperIds = new Set(arxivHistory.seenPaperIds || []);
  const candidateArxiv = await fetchArxivCandidatePapers(seenPaperIds);

  const past7DaysPapers = (arxivHistory.dailyRecords || [])
    .slice(0, 7)
    .flatMap(r => (r.papers || []).map(p => ({ ...p, recordedDate: r.date })));

  let arxivPromptText = `ADAY YENİ MAKALE HAVUZU (Daha önce hiç sunulmamış, bugün için seçebileceğin 3 makale adayı):\n`;
  arxivPromptText += candidateArxiv.map((c, i) => `${i + 1}. [${c.id}] "${c.title}" by ${c.authors.join(", ")}\nÖzet: ${c.summary}\nLink: ${c.arxivUrl}`).join("\n\n");

  let pastArxivText = `HAFIZADAKİ SON 7 GÜNÜN ARXİV MAKALELERİ (Haftalık En İyileri Seçmek İçin Kaynak):\n`;
  pastArxivText += past7DaysPapers.slice(0, 15).map(p => `- [${p.id}] "${p.title}" (Etki Skoru: ${p.impactScore || 9.0}) - ${p.whyMad || p.summary}`).join("\n");

  // 4. HACKER NEWS SON 24 SAAT TARTIŞMALARI (SIRALAMAYA KESİNLİKLE ETKİ ETMEZ!)
  const hnPosts = await fetchHackerNews24h();
  let hnPromptText = "";
  if (hnPosts.length > 0) {
    hnPromptText = hnPosts.map(h => `- [Puan: ${h.points} | Yorum: ${h.comments}] "${h.title}" (Link: ${h.hnUrl})`).join("\n");
  }

  const historySummary = loadToolHistorySummary();
  console.log(`📊 Toplam ${totalPosts} Reddit gönderisi, ${hfModels.length} Hugging Face modeli, ${hnPosts.length} Hacker News tartışması ve ${candidateArxiv.length} taze ArXiv adayı toplandı.`);

  const prompt = `
    Sen kıdemli bir "Yapay Zeka, GPU/Donanım, Bulut Platformları ve Yazılım Ekosistemi Baş Danışmanısın".
    
    ════════════════════════════════════════════════════════════════════
    🚨 EN KRİTİK KURAL: GÜNCELLİK, RESMİ LANSMANLAR VE SIZINTILAR:
    - 3 Eylül 2026'da OpenAI tarafından resmi lansmanı yapılan ve 'Critical' siber güvenlik seviyesiyle ilk nesil ötesi otonom bilgisayar operatörü olarak duyurulan "GPT-6 Astra" gibi devasa kırılmaları KESİNLİKLE hem 12 Saatlik hem de Günlük listenin zirvesine (#1) yerleştir!
    - İhtiyaç duyarsan Google Arama yeteneğini kullanarak modellerin resmi duyurularını ve güncelliğini canlı teyit et.
    - Reddit'te konuşulan taze ve sıcak kırılmaları eski modellerin kesinlikle önüne al.
    ════════════════════════════════════════════════════════════════════

    Aşağıda derlenen son 24 saatin istihbaratı yer almaktadır:

    ════════════════════════════════════════════════════════════════════
    1. 🌐 50 SEÇKİN REDDIT TOPLULUĞU TARTIŞMALARI (Sıcak & Flaş Gelişmeler):
    ${allDiscussions}

    ════════════════════════════════════════════════════════════════════
    2. 🤗 HUGGING FACE GERÇEK İNDİRME VE YEREL MODEL POPÜLARİTE VERİLERİ:
    ${hfSummary || "Veri çekilemedi."}

    ════════════════════════════════════════════════════════════════════
    3. 🔬 ARXİV BİLİMSEL YAPAY ZEKA VE MAKİNE ÖĞRENİMİ MAKALE HAVUZU:
    ${arxivPromptText}

    ${pastArxivText}

    ════════════════════════════════════════════════════════════════════
    4. 🟠 HACKER NEWS (SON 24 SAAT MÜHENDİS & GELİŞTİRİCİ TARTIŞMALARI):
    ⚠️ KESİNLİKLE DİKKAT: Hacker News verisi araç/model puan sıralamalarını (12h, Daily tablolarını) KESİNLİKLE ETKİLEMEZ.
    Sıralamalar Reddit, Google Grounding ve Hugging Face doğrulamasıyla saf model gücüne dayanır.
    Hacker News verisi SADECE "hackerNewsPulse" alanında Silikon Vadisi ve küresel mühendislerin son 24 saatte tartıştığı konuları, eleştirileri ve pratik faydalı teknik hap bilgileri özetlemek için kullanılır.
    
    ${hnPromptText || "Veri bulunamadı."}
    ════════════════════════════════════════════════════════════════════

    ════════════════════════════════════════════════════════════════════
    📌 SİSTEMİN KALICI VERİTABANI HAFIZASI (TOOL-HISTORY DATABASE):
    ${historySummary}
    ════════════════════════════════════════════════════════════════════

    GÖREV VE ZAMAN DİLİMLERİ HESAPLAMA KURALLARI:
    1. "twelveHours" (12 Saatlik Sekme):
       - Reddit'in son 12 saatteki anlık çıkışlarına, viral modellerine ve sıcak tartışmalarına dayanmalıdır.
       - "GPT-6 Astra" gibi resmi lansmanları ve ani kırılma yaşayan modelleri listele (en az 10 adet).

    2. "daily" (24 Saatlik Sekme):
       - Bugünün genel günlüğünü temsil eder (en az 10-14 adet).
       - Zirvede günün en büyük modelleri yer almalıdır.

    3. "weekly" (1 Haftalık Sekme):
       - Kalıcı hafızadaki son 7 günlük kayıtları ve gerçek performansı harmanla.

    4. "monthly" (1 Aylık Sekme):
       - Veritabanındaki 30 günlük genel trendi yansıtmalıdır.

    KATEGORİLENDİRME KURALLARI:
    Her araca veya modele MUTLAKA şu kategorilerden tam olarak birini ver:
    - "LLM (Model)", "Yerel Model", "IDE / Editör", "CLI / Terminal", "Otonom Agent", "Otomasyon", "Altyapı & SDK", "Bulut & Platform", "Medya / Üretim", "Şirket / Lab".

    ARXİV MAKALE KURALLARI:
    - "arxivDaily" listesi için: "ADAY YENİ MAKALE HAVUZU"ndan en çarpıcı, en yenilikçi ve en mantıklı 3 makaleyi seç.
    - "arxivWeeklyBest" listesi için: Son 7 günün makaleleri arasından en iyi 3-4 makaleyi seç.

    HUGGING FACE ÖZETİ:
    - "huggingFaceTop": En popüler 4 yerel modeli indirme ve beğeni sayılarıyla formatla.

    İSTENEN JSON ŞEMASI:
    {
      "executiveSummary": "GPT-6 Astra ve günün en büyük kırılmalarını özetleyen 1-2 paragraflık derin yönetici özeti",
      "twelveHours": [
        {
          "id": "model-id",
          "name": "Model/Araç/Donanım Adı",
          "category": "LLM (Model) | Yerel Model | IDE / Editör | CLI / Terminal | Otonom Agent | Otomasyon | Altyapı & SDK | Bulut & Platform | Medya / Üretim | Şirket / Lab",
          "badge": "Örn: 3 Eylül Lansmanı",
          "hypeScore": 10.0,
          "prevScore": 9.2,
          "scoreDelta": 0.8,
          "trend": "skyrocketing | rising | stable | cooling",
          "mentions": 3400,
          "sparkline": [8.8, 9.0, 9.2, 9.5, 9.8, 9.9, 10.0],
          "primaryFunction": "Temel işlev ve yetenek",
          "whyTrending": "Son 12 saatteki ani yükseliş ve kırılma gerekçesi",
          "sources": ["OpenAI", "r/singularity"]
        }
      ],
      "daily": [
        // EN AZ 10-14 ADET model ve araç (Zirvede GPT-6 Astra yer almalıdır)
        {
          "id": "model-id",
          "name": "Model/Araç/Donanım Adı",
          "category": "LLM (Model) | Yerel Model | IDE / Editör | CLI / Terminal | Otonom Agent | Otomasyon | Altyapı & SDK | Bulut & Platform | Medya / Üretim | Şirket / Lab",
          "badge": "Örn: Günün Lideri",
          "hypeScore": 10.0,
          "prevScore": 9.2,
          "scoreDelta": 0.8,
          "trend": "skyrocketing | rising | stable | cooling",
          "mentions": 4200,
          "sparkline": [8.8, 9.0, 9.2, 9.5, 9.8, 9.9, 10.0],
          "primaryFunction": "Temel işlev ve yetenek",
          "whyTrending": "Neden trend olduğuna dair 1-2 cümlelik keskin analiz",
          "sources": ["r/singularity", "Hugging Face"]
        }
      ],
      "weekly": [ /* Son 7 günün kalıcı hafızasından derlenmiş en iyi 10-12 araç... */ ],
      "monthly": [ /* Son 30 günün kalıcı hafızasından derlenmiş en iyi 6-8 araç... */ ],
      "arxivDaily": [
        {
          "id": "arxiv-id",
          "title": "İngilizce Makale Başlığı",
          "arxivUrl": "https://arxiv.org/abs/...",
          "authors": ["Yazar 1", "Yazar 2"],
          "category": "cs.AI",
          "impactScore": 9.6,
          "whyMad": "Neden çılgın ve ezber bozan bir makale olduğuna dair keskin Türkçe açıklama",
          "summary": "Makalenin getirdiği teknik yeniliğin anlaşılır Türkçe özeti"
        }
      ],
      "arxivWeeklyBest": [
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
          "downloads": "5.2M",
          "likes": 4200,
          "tag": "text-generation",
          "highlight": "Topluluğun en çok tercih ettiği açık ağırlık"
        }
      ],
      "hackerNewsPulse": {
        "summary24h": "Son 24 saatte Hacker News gündeminde öne çıkan geliştirici tartışmalarının ve ekosistem nabzının 1-2 cümlelik özeti.",
        "discussions": [
          {
            "title": "Hacker News Başlığı",
            "points": 340,
            "comments": 180,
            "hnUrl": "https://news.ycombinator.com/item?id=...",
            "category": "E-Ticaret / Kurumsal / Teori / Donanım / Ajan Güvenliği",
            "keyTakeaway": "Mühendislerin tartıştığı ana konu ve eleştirisi",
            "usefulInsight": "Geliştiriciler veya teknoloji meraklıları için doğrudan işe yarar hap teknik bilgi veya çıkarım"
          }
        ]
      },
      "sections": [
        {
          "title": "BÖLÜM 1: 🌐 GÜNÜN EKOSİSTEM DENGESİ & MODELLER ARASI GÜÇ SAVAŞI",
          "badge": "Ekosistem Dengesi",
          "contentHtml": "<p>GPT-6 Astra, Claude ve Açık Kaynak kamplarının güç savaşı.</p>"
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

  // 4. ArXiv kalıcı veritabanını güncelle
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
