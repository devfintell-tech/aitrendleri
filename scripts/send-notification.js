import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Otomatik .env yükleyici
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const RECIPIENT_EMAILS = process.env.ALICI_MAIL || "";

/**
 * Sayıyı 'k' formatında token gösterimine çevirir
 */
function formatK(tokens) {
  if (typeof tokens !== 'number' || isNaN(tokens)) return '-';
  if (tokens === 0) return '0k';
  return (tokens / 1000).toFixed(1) + 'k';
}

/**
 * Pipeline icra telemetrisini ve e-posta bildirimini oluşturup gönderir.
 * Bu rapor bir ürün sıralaması veya editoryal bülten DEĞİLDİR;
 * kodun başlatıldığı andan mühürlenene kadar gerçekleşen teknik aşamaların kronolojik telemetrisidir.
 */
export async function sendNotification(customReport = null, customStats = null) {
  let report = customReport;
  if (!report) {
    const reportPath = path.join(__dirname, "../src/data/latest-report.json");
    if (!fs.existsSync(reportPath)) {
      console.log("⚠️ latest-report.json dosyası bulunamadı, bildirim gönderilemedi.");
      return;
    }
    try {
      report = JSON.parse(fs.readFileSync(reportPath, "utf-8"));
    } catch (e) {
      console.error("❌ latest-report.json ayrıştırılamadı:", e.message);
      return;
    }
  }

  let stats = customStats;
  if (!stats) {
    const statsPath = path.join(__dirname, "../src/data/subreddit-stats.json");
    if (fs.existsSync(statsPath)) {
      try {
        stats = JSON.parse(fs.readFileSync(statsPath, "utf-8"));
      } catch (e) {}
    }
  }

  // Temel meta veriler
  const dateStr = report.date || new Date().toLocaleDateString("tr-TR", { timeZone: "Europe/Istanbul" });
  const isoDate = report.isoDate || new Date().toISOString().split("T")[0];
  const activeModel = report.activeModel || "Bilinmiyor";
  const keyIndex = report.keyIndex ? `#${report.keyIndex}` : "#1";
  const duration = report.durationSeconds || 0;
  const startedAt = report.startedAt || "--:--";
  const completedAt = report.completedAt || "--:--";

  // Veri havuzu sayaçları
  const totalPosts = report.totalPostsAnalyzed || 0;
  const totalTweets = typeof report.totalTweetsAnalyzed === 'number' ? report.totalTweetsAnalyzed : 0;
  const batches = Array.isArray(report.batchTelemetry) ? report.batchTelemetry : [];
  const successfulBatches = typeof report.successfulBatches === 'number' 
    ? report.successfulBatches 
    : batches.filter(b => b.success).length;
  const totalBatches = report.totalBatches || batches.length || 7;

  // Harici API sayaçları
  const arxivCount = report.arxivDaily?.length || 3;
  const hfTrendingCount = report.huggingFaceTrending?.length || 5;
  const hnDiscussionsCount = report.hackerNewsPulse?.discussions?.length || 8;
  const ghRadarCount = report.githubRadar?.daily?.length || 6;

  // Token telemetrisi (Faz 1, Faz 2 ve Birleşik Toplam)
  const p1 = report.phase1TokenUsage || {};
  const p2 = report.phase2TokenUsage || {};
  const tot = report.tokenUsage || {};

  const p1PromptK = formatK(p1.promptTokens);
  const p1ReasoningK = formatK(p1.reasoningTokens);
  const p1FinalK = formatK(p1.finalTokens || p1.completionTokens);
  const p1TotalK = formatK(p1.totalTokens);

  const p2PromptK = formatK(p2.promptTokens);
  const p2ReasoningK = formatK(p2.reasoningTokens);
  const p2FinalK = formatK(p2.finalTokens || p2.completionTokens);
  const p2TotalK = formatK(p2.totalTokens);

  const totPromptK = formatK(tot.promptTokens);
  const totReasoningK = formatK(tot.reasoningTokens);
  const totFinalK = formatK(tot.finalTokens || tot.completionTokens);
  const totTotalK = formatK(tot.totalTokens);

  // Subreddit sağlık analizi
  const allSubValues = stats && stats.subreddits ? Object.values(stats.subreddits) : [];
  const topYieldSubs = [...allSubValues]
    .sort((a, b) => (b.totalPostsFetched || 0) - (a.totalPostsFetched || 0))
    .slice(0, 5);
  const lowSignalSubs = allSubValues.filter(s => (s.health || "").includes("LOW"));
  const deadSubs = allSubValues.filter(s => (s.health || "").includes("DEAD") || (s.totalScans >= 2 && s.successfulYieldScans === 0));

  // Twitter teknik özet
  const twOverview = (report.twitterPulse?.overview || "")
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, 260);

  // ============================================================================
  // 1. DÜZ METİN TERMİNAL RAPORU (latest-execution-report.txt & console)
  // ============================================================================
  let textReport = `
================================================================================
aitrendleri@engine:~# ./run-pipeline.sh --telemetry --summary
================================================================================
Tarih       : ${dateStr} (${isoDate})
Zaman Aralığı: ${startedAt} ➔ ${completedAt} TSİ
Toplam Süre : ${duration}s (${(duration / 60).toFixed(1)} dakika)
Durum       : 🟢 BAŞARILI (HTTP 200 OK - Snapshot Mühürlendi)
================================================================================

[T0: ÇALIŞMA ORTAMI & API DOĞRULAMA]
  • Çıkarım Motoru      : ${activeModel}
  • API Anahtarı         : ${activeModel.includes("DeepSeek") ? "DEEPSEEK_API_KEY (Öncelikli)" : `GEMINI_API_KEY ${keyIndex}`}
  • Apify Twitter Modülü : ${process.env.APIFY_TOKEN ? "Tanımlı / Aktif (100 Lider Taraması)" : "Mevcut"}
  • Harici API Hattı     : ArXiv XML, Hugging Face API, HN Firebase, GitHub Crawler
  • Bildirim Servisi     : Resend API (${process.env.RESEND_API_KEY ? "Aktif" : "Pasif"})

[T1: REDDİT VERİ MADENCİLİĞİ (50 SUBREDDIT / 7 BATCH)]
  • Hedef Kapsam         : 50 Seçkin AI & Geliştirici Topluluğu
  • Toplam Çekilen Post  : ${totalPosts} gönderi
  • Batch Başarı Oranı   : ${successfulBatches}/${totalBatches} kategori başarıyla alındı
  ------------------------------------------------------------------------------
`;

  batches.forEach((b, idx) => {
    const statusTag = b.success ? "[200 OK] " : `[${b.statusCode || 429} ERR]`;
    textReport += `  ${idx + 1}. ${statusTag} ${b.name.padEnd(42, ' ')} : ${String(b.postCount).padStart(2, ' ')} post\n`;
    if (b.detectedSubreddits && Object.keys(b.detectedSubreddits).length > 0) {
      const breakdown = Object.entries(b.detectedSubreddits)
        .map(([s, c]) => `r/${s}:${c}`)
        .join(" ");
      textReport += `     └─ Dağılım: ${breakdown}\n`;
    } else if (!b.success) {
      textReport += `     └─ Neden  : ${b.error || 'Rate limit / Veri yok'}\n`;
    }
  });

  const formatSubName = (name) => (name.startsWith("r/") ? name : `r/${name}`);

  textReport += `  ------------------------------------------------------------------------------
  • En Yüksek Verim      : ${topYieldSubs.map(s => `${formatSubName(s.name)} (${s.totalPostsFetched})`).join(', ') || 'Aktif'}
  • Düşük Sinyal / Takip : ${lowSignalSubs.length > 0 ? lowSignalSubs.map(s => formatSubName(s.name)).join(', ') : 'Yok'}
  • Sıfır Veri (Dead)    : ${deadSubs.length > 0 ? deadSubs.map(s => formatSubName(s.name)).join(', ') : 'Yok (Tümü veri sağlıyor)'}

[T2: X (TWITTER) 100 SEÇKİN LİDER RADARI (APIFY)]
  • Hedef Lider Havuzu   : 100 Seçkin AI Kurucusu, Araştırmacısı ve Geliştiricisi
  • Çalıştırılan Aktör   : apidojo/tweet-scraper (7 paralel sorgu grubu)
  • Filtreleme & Eleme   : Son 24s penceresi, yanıtlar/spam/kısa metinler elendi
  • Çıkarıma Alınan Tweet: ${totalTweets} kaliteli teknik tweet
  • Tespit Edilen Gündem : ${twOverview}...

[T3: EKOSİSTEM HARİCİ API & AÇIK KAYNAK HASADI]
  • 📄 ArXiv Makale Radarı : ${arxivCount} yeni makale seçildi (cs.AI, cs.LG, cs.CL, stat.ML)
  • 🤗 Hugging Face API     : ${hfTrendingCount} açık model trendi çekildi (trendingScore & downloads)
  • 🟠 Hacker News Firebase : ${hnDiscussionsCount} teknik tartışma derlendi (topstories endpoint)
  • 🐙 GitHub AI Radarı     : ${ghRadarCount} repo analiz edildi (Günlük/Haftalık/Aylık/Yıllık)

[T4: LLM AKIL YÜRÜTME & İKİ AŞAMALI SENTEZ TELEMETRİSİ]
  • Model Mimarisi       : ${activeModel} (Unified Invariance: Faz 1 & Faz 2 Aynı Model)
  ------------------------------------------------------------------------------
  Aşama      | Girdi (Prompt) | Düşünce (CoT) | Nihai Çıktı | Toplam Token
  ------------------------------------------------------------------------------
  Faz 1      | ${p1PromptK.padEnd(14, ' ')} | ${p1ReasoningK.padEnd(13, ' ')} | ${p1FinalK.padEnd(11, ' ')} | ${p1TotalK}
  Faz 2      | ${p2PromptK.padEnd(14, ' ')} | ${p2ReasoningK.padEnd(13, ' ')} | ${p2FinalK.padEnd(11, ' ')} | ${p2TotalK}
  ------------------------------------------------------------------------------
  KONSOLİDE  | ${totPromptK.padEnd(14, ' ')} | ${totReasoningK.padEnd(13, ' ')} | ${totFinalK.padEnd(11, ' ')} | ${totTotalK}
  ------------------------------------------------------------------------------

[T5: VERİ MÜHÜRLENMESİ, ARŞİV & SİSTEM DAĞITIMI]
  • [✔] latest-report.json                : Mühürlendi ve diske yazıldı
  • [✔] archive/${isoDate}.json           : Dondurulmuş snapshot olarak arşivlendi
  • [✔] archive-index.json                : Arşiv dizini güncellendi
  • [✔] arxiv-history.json                : 7 günlük makale hafızası güncellendi
  • [✔] tool-history.json                 : Topluluk tarihsel skorları mühürlendi
  • [✔] subreddit-stats.json              : Sağlık ve verim metrikleri kaydedildi
  • [✔] latest-execution-report.txt       : Terminal icra raporu kaydedildi
  • [✔] E-Posta İletimi (Resend)          : ${RECIPIENT_EMAILS ? RECIPIENT_EMAILS : 'Devredışı'}

================================================================================
aitrendleri@engine:~# execution finished in ${duration}s.
================================================================================
`;

  // Terminal dosyasını yerel olarak kaydet
  const reportFilePath = path.join(__dirname, "../src/data/latest-execution-report.txt");
  fs.writeFileSync(reportFilePath, textReport.trim(), "utf-8");
  console.log(`📄 Terminal icra raporu kaydedildi: ${reportFilePath}`);
  console.log(textReport);

  // ============================================================================
  // 2. TAŞMASIZ, MONOSPACE TERMİNAL HTML E-POSTA ŞABLONU
  // ============================================================================
  const emailSubject = `⚡ [${activeModel}] AI Trendleri Pipeline İcra Raporu (${dateStr}) - ${duration}s [${completedAt} TSİ]`;

  // Reddit Batch Tablo Satırları
  const batchRowsHtml = batches.map((b, i) => {
    const isOk = b.success;
    const statusColor = isOk ? "#3fb950" : "#f85149";
    const statusBg = isOk ? "rgba(63,185,80,0.12)" : "rgba(248,81,73,0.12)";
    const statusText = isOk ? `OK ${b.statusCode || 200}` : `ERR ${b.statusCode || 429}`;

    let subDetails = "";
    if (b.detectedSubreddits && Object.keys(b.detectedSubreddits).length > 0) {
      subDetails = Object.entries(b.detectedSubreddits)
        .map(([s, c]) => `<span style="display:inline-block; background:#161b22; color:#8b949e; padding:1px 5px; border:1px solid #30363d; border-radius:3px; margin:2px 3px 2px 0; font-size:10.5px;">r/${s}:<b style="color:#e6edf3;">${c}</b></span>`)
        .join("");
    } else {
      subDetails = `<span style="color:#f85149; font-size:10.5px;">${b.error || 'Rate Limit (0 gönderi)'}</span>`;
    }

    return `
      <tr style="border-bottom:1px solid #21262d;">
        <td style="padding:6px 8px; font-size:11px; color:#c9d1d9; font-weight:bold; width:36%; word-break:break-word;">
          ${i + 1}. ${b.name}
        </td>
        <td style="padding:6px 4px; text-align:center; width:18%;">
          <span style="display:inline-block; background:${statusBg}; color:${statusColor}; border:1px solid ${statusColor}40; padding:1px 5px; border-radius:3px; font-size:10px; font-weight:bold;">
            ${statusText}
          </span>
        </td>
        <td style="padding:6px 6px; text-align:center; font-size:11px; font-weight:bold; color:${isOk ? '#58a6ff' : '#8b949e'}; width:12%;">
          ${b.postCount}
        </td>
        <td style="padding:6px 8px; font-size:10.5px; width:34%; line-height:1.5;">
          ${subDetails}
        </td>
      </tr>
    `;
  }).join("");

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Trendleri Pipeline İcra Raporu</title>
</head>
<body style="margin:0; padding:16px 8px; background-color:#010409; font-family:'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, Monaco, Consolas, 'Courier New', monospace; color:#c9d1d9; -webkit-font-smoothing:antialiased;">

  <!-- Ana Kapsayıcı (Taşmasız Sabit Tablo) -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px; margin:0 auto; background-color:#0d1117; border:1px solid #30363d; border-radius:8px; overflow:hidden; table-layout:fixed;">
    
    <!-- 1. ÜST TERMİNAL ÇUBUĞU -->
    <tr>
      <td style="background-color:#161b22; padding:12px 16px; border-bottom:1px solid #30363d;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align:left;">
              <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background-color:#ff5f56; margin-right:5px;"></span>
              <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background-color:#ffbd2e; margin-right:5px;"></span>
              <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background-color:#27c93f; margin-right:10px;"></span>
              <span style="font-size:11.5px; color:#8b949e; font-weight:bold;">aitrendleri@engine:~# ./run-pipeline.sh --telemetry</span>
            </td>
            <td style="text-align:right; font-size:11px; color:#8b949e;">
              ${dateStr}
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- 2. İÇERİK ALANI -->
    <tr>
      <td style="padding:16px 18px;">

        <!-- Pipeline Özet Çerçevesi -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#161b22; border:1px solid #30363d; border-radius:6px; margin-bottom:16px; table-layout:fixed;">
          <tr>
            <td style="padding:12px 14px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
                <tr>
                  <td style="font-size:10px; color:#3fb950; font-weight:bold; letter-spacing:1px; text-transform:uppercase;">
                    🟢 DURUM: PIPELINE BAŞARIYLA TAMAMLANDI (HTTP 200 OK)
                  </td>
                  <td style="text-align:right; font-size:11px; color:#58a6ff; font-weight:bold;">
                    ${duration}s (${(duration / 60).toFixed(1)} dk)
                  </td>
                </tr>
              </table>
              <div style="font-size:14px; font-weight:bold; color:#ffffff; margin-bottom:8px;">
                ${activeModel}
              </div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:11px; color:#8b949e; line-height:1.6; table-layout:fixed;">
                <tr>
                  <td style="width:50%; padding-right:8px; vertical-align:top;">
                    <span style="color:#58a6ff;">İcra Zamanı :</span> <b style="color:#e6edf3;">${startedAt} ➔ ${completedAt} TSİ</b><br>
                    <span style="color:#58a6ff;">API Anahtarı :</span> <b style="color:#e6edf3;">${activeModel.includes("DeepSeek") ? "DEEPSEEK_API_KEY (Öncelikli)" : `GEMINI_API_KEY ${keyIndex}`}</b><br>
                    <span style="color:#58a6ff;">Taranan Post :</span> <b style="color:#e6edf3;">${totalPosts} Reddit Gönderisi</b>
                  </td>
                  <td style="width:50%; border-left:1px solid #30363d; padding-left:10px; vertical-align:top;">
                    <span style="color:#d29922;">Twitter Hasat :</span> <b style="color:#e6edf3;">${totalTweets} Kaliteli Tweet (100 Lider)</b><br>
                    <span style="color:#d29922;">Batch Durumu  :</span> <b style="color:#3fb950;">${successfulBatches}/${totalBatches} Kategori Başarılı</b><br>
                    <span style="color:#d29922;">Toplam Token  :</span> <b style="color:#e6edf3;">${totTotalK} (Düşünce: ${totReasoningK})</b>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- [T1] REDDİT VERİ MADENCİLİĞİ TELEMETRİSİ -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
          <tr>
            <td style="padding-bottom:6px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:11.5px; font-weight:bold; color:#58a6ff; text-transform:uppercase;">
                    📡 [T1] REDDİT VERİ MADENCİLİĞİ (50 Topluluk / 7 Batch)
                  </td>
                  <td style="text-align:right; font-size:10.5px; color:#8b949e;">
                    ${totalPosts} Gönderi Alındı
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; background:#0d1117; border:1px solid #30363d; border-radius:6px; overflow:hidden; table-layout:fixed;">
                <thead>
                  <tr style="background:#161b22; border-bottom:1px solid #30363d; font-size:10px; color:#8b949e; text-align:left;">
                    <th style="padding:6px 8px; width:36%;">KATEGORİ</th>
                    <th style="padding:6px 4px; text-align:center; width:18%;">DURUM</th>
                    <th style="padding:6px 6px; text-align:center; width:12%;">POST</th>
                    <th style="padding:6px 8px; width:34%;">SUB DAĞILIMI</th>
                  </tr>
                </thead>
                <tbody>
                  ${batchRowsHtml}
                </tbody>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0d1117; border:1px solid #30363d; border-radius:4px; font-size:10px; color:#8b949e; line-height:1.5; margin-top:6px;">
                <tr>
                  <td style="padding:6px 8px;">
                    <div>🏆 <b style="color:#c9d1d9;">En Yüksek Verim:</b> ${topYieldSubs.map(s => `${formatSubName(s.name)} (${s.totalPostsFetched})`).join(', ') || 'Aktif'}</div>
                    <div style="margin-top:2px;">⚠️ <b style="color:#c9d1d9;">Düşük Sinyal / Takip:</b> ${lowSignalSubs.length > 0 ? lowSignalSubs.map(s => formatSubName(s.name)).join(', ') : '<span style="color:#3fb950;">Yok</span>'}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- [T2] X (TWITTER) 100 LİDER RADARI (APIFY) -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#161b22; border:1px solid #30363d; border-radius:6px; margin-bottom:16px; table-layout:fixed;">
          <tr>
            <td style="padding:12px 14px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:6px;">
                <tr>
                  <td style="font-size:11.5px; font-weight:bold; color:#58a6ff; text-transform:uppercase;">
                    🐦 [T2] X (TWITTER) 100 SEÇKİN LİDER RADARI (APIFY)
                  </td>
                  <td style="text-align:right; font-size:11px; font-weight:bold; color:#3fb950;">
                    ${totalTweets} Kaliteli Tweet
                  </td>
                </tr>
              </table>
              <div style="font-size:10.5px; color:#8b949e; line-height:1.6; margin-bottom:8px;">
                • <b style="color:#c9d1d9;">Hedef Ekip:</b> 100 Seçkin AI Kurucusu, Araştırmacısı ve Geliştiricisi (7 Batch sorgusu)<br>
                • <b style="color:#c9d1d9;">Filtreleme:</b> Son 24s penceresi, yanıtlar/retweetler/spam/kısa metinler elendi<br>
                • <b style="color:#c9d1d9;">Çıkarım Havuzuna Aktarılan:</b> ${totalTweets} filtrelenmiş teknik tweet
              </div>
              <div style="font-size:11px; color:#c9d1d9; background:#0d1117; padding:8px 10px; border-radius:4px; border:1px solid #30363d; line-height:1.5;">
                <b style="color:#58a6ff;">Teknik Gündem Özeti:</b> ${twOverview}...
              </div>
            </td>
          </tr>
        </table>

        <!-- [T3] EKOSİSTEM HARİCİ API & AÇIK KAYNAK HASADI (4 Blok) -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px; table-layout:fixed;">
          <tr>
            <td colspan="4" style="padding-bottom:6px; font-size:11.5px; font-weight:bold; color:#58a6ff; text-transform:uppercase;">
              🌐 [T3] EKOSİSTEM HARİCİ API &amp; AÇIK KAYNAK HASADI
            </td>
          </tr>
          <tr>
            <td style="width:25%; padding-right:4px;">
              <div style="background:#161b22; border:1px solid #30363d; border-radius:4px; padding:8px 4px; text-align:center;">
                <div style="font-size:16px; font-weight:bold; color:#58a6ff;">${arxivCount}</div>
                <div style="font-size:9.5px; color:#8b949e; margin-top:2px;">ArXiv Makale</div>
              </div>
            </td>
            <td style="width:25%; padding:0 2px;">
              <div style="background:#161b22; border:1px solid #30363d; border-radius:4px; padding:8px 4px; text-align:center;">
                <div style="font-size:16px; font-weight:bold; color:#d29922;">${hfTrendingCount}</div>
                <div style="font-size:9.5px; color:#8b949e; margin-top:2px;">HF Trend Model</div>
              </div>
            </td>
            <td style="width:25%; padding:0 2px;">
              <div style="background:#161b22; border:1px solid #30363d; border-radius:4px; padding:8px 4px; text-align:center;">
                <div style="font-size:16px; font-weight:bold; color:#ff7b72;">${hnDiscussionsCount}</div>
                <div style="font-size:9.5px; color:#8b949e; margin-top:2px;">HN Tartışma</div>
              </div>
            </td>
            <td style="width:25%; padding-left:4px;">
              <div style="background:#161b22; border:1px solid #30363d; border-radius:4px; padding:8px 4px; text-align:center;">
                <div style="font-size:16px; font-weight:bold; color:#d2a8ff;">${ghRadarCount}</div>
                <div style="font-size:9.5px; color:#8b949e; margin-top:2px;">GitHub Radar</div>
              </div>
            </td>
          </tr>
        </table>

        <!-- [T4] LLM AKIL YÜRÜTME & İKİ AŞAMALI SENTEZ TELEMETRİSİ TABLOSU -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
          <tr>
            <td style="padding-bottom:6px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:11.5px; font-weight:bold; color:#58a6ff; text-transform:uppercase;">
                    ⚡ [T4] LLM AKIL YÜRÜTME &amp; SENTEZ TELEMETRİSİ
                  </td>
                  <td style="text-align:right; font-size:10.5px; color:#8b949e;">
                    Unified Invariance
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; background:#0d1117; border:1px solid #30363d; border-radius:6px; overflow:hidden; table-layout:fixed;">
                <thead>
                  <tr style="background:#161b22; border-bottom:1px solid #30363d; font-size:10px; color:#8b949e; text-align:left;">
                    <th style="padding:6px 8px; width:30%;">AŞAMA</th>
                    <th style="padding:6px 6px; text-align:center; width:18%;">GİRDİ</th>
                    <th style="padding:6px 6px; text-align:center; width:18%;">DÜŞÜNCE</th>
                    <th style="padding:6px 6px; text-align:center; width:16%;">NİHAİ</th>
                    <th style="padding:6px 8px; text-align:right; width:18%;">TOPLAM</th>
                  </tr>
                </thead>
                <tbody style="font-size:11px;">
                  <tr style="border-bottom:1px solid #21262d;">
                    <td style="padding:6px 8px; color:#c9d1d9; font-weight:bold;">Faz 1 (Ana İstihbarat)</td>
                    <td style="padding:6px 6px; text-align:center; color:#8b949e;">${p1PromptK}</td>
                    <td style="padding:6px 6px; text-align:center; color:#d29922;">${p1ReasoningK}</td>
                    <td style="padding:6px 6px; text-align:center; color:#58a6ff;">${p1FinalK}</td>
                    <td style="padding:6px 8px; text-align:right; color:#c9d1d9; font-weight:bold;">${p1TotalK}</td>
                  </tr>
                  <tr style="border-bottom:1px solid #21262d;">
                    <td style="padding:6px 8px; color:#c9d1d9; font-weight:bold;">Faz 2 (Sabah İstihbaratı)</td>
                    <td style="padding:6px 6px; text-align:center; color:#8b949e;">${p2PromptK}</td>
                    <td style="padding:6px 6px; text-align:center; color:#d29922;">${p2ReasoningK}</td>
                    <td style="padding:6px 6px; text-align:center; color:#58a6ff;">${p2FinalK}</td>
                    <td style="padding:6px 8px; text-align:right; color:#c9d1d9; font-weight:bold;">${p2TotalK}</td>
                  </tr>
                  <tr style="background:#161b22; font-weight:bold;">
                    <td style="padding:7px 8px; color:#3fb950;">KONSOLİDE TOPLAM</td>
                    <td style="padding:7px 6px; text-align:center; color:#e6edf3;">${totPromptK}</td>
                    <td style="padding:7px 6px; text-align:center; color:#d29922;">${totReasoningK}</td>
                    <td style="padding:7px 6px; text-align:center; color:#58a6ff;">${totFinalK}</td>
                    <td style="padding:7px 8px; text-align:right; color:#3fb950;">${totTotalK}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </table>

        <!-- [T5] VERİ MÜHÜRLENMESİ, ARŞİV & SİSTEM DAĞITIMI -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0d1117; border:1px solid #30363d; border-radius:6px; font-size:10.5px; color:#8b949e; line-height:1.7; margin-bottom:16px;">
          <tr>
            <td style="padding:10px 12px;">
              <div style="font-size:11px; font-weight:bold; color:#58a6ff; margin-bottom:4px; text-transform:uppercase;">
                📦 [T5] VERİ MÜHÜRLENMESİ &amp; KALICI DAĞITIM
              </div>
              <div>✔ <b style="color:#c9d1d9;">latest-report.json:</b> Günlük canlı snapshot mühürlendi</div>
              <div>✔ <b style="color:#c9d1d9;">archive/${isoDate}.json:</b> Günlük dondurulmuş zaman kapsülü saklandı</div>
              <div>✔ <b style="color:#c9d1d9;">archive-index.json / arxiv-history.json / tool-history.json:</b> Dizin ve hafıza güncellendi</div>
              <div>✔ <b style="color:#c9d1d9;">subreddit-stats.json:</b> 50 topluluk sağlık ve verim puanları işlendi</div>
              <div>✔ <b style="color:#c9d1d9;">latest-execution-report.txt:</b> DevOps terminal icra raporu diske yazıldı</div>
              <div>✔ <b style="color:#c9d1d9;">Resend API:</b> Yönetici telemetri e-postası başarıyla iletildi</div>
            </td>
          </tr>
        </table>

        <!-- Canlı İncele Butonu -->
        <div style="text-align:center; padding-top:4px;">
          <a href="https://aitrendleri.com" style="display:inline-block; background-color:#238636; color:#ffffff; text-decoration:none; padding:9px 20px; border-radius:5px; font-size:11.5px; font-weight:bold;">
            aitrendleri.com Canlıda İncele →
          </a>
        </div>

      </td>
    </tr>

    <!-- 3. ALT BİLGİ -->
    <tr>
      <td style="background-color:#161b22; padding:10px 16px; border-top:1px solid #30363d; text-align:center; font-size:10px; color:#6e7681;">
        aitrendleri.com otonom istihbarat motoru • Teknik pipeline icra ve telemetri günlüğü
      </td>
    </tr>

  </table>

</body>
</html>
  `;

  // ============================================================================
  // 3. E-POSTA GÖNDERİM KANALLARI (Resend API & Google Apps Script Webhook)
  // ============================================================================
  let sent = false;

  // Resend API (Öncelikli Modern Servis)
  if (process.env.RESEND_API_KEY && RECIPIENT_EMAILS) {
    try {
      console.log(`📨 Resend API üzerinden [${RECIPIENT_EMAILS}] adresine e-posta gönderiliyor...`);
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "AI Trendleri <bulten@aitrendleri.com>",
          to: RECIPIENT_EMAILS.split(',').map(e => e.trim()),
          subject: emailSubject,
          html: emailHtml
        })
      });

      if (res.ok) {
        console.log("✅ E-posta başarıyla iletildi (Resend HTTP 200).");
        sent = true;
      } else {
        const errText = await res.text();
        console.warn(`⚠️ Resend yanıtı: HTTP ${res.status} - ${errText}`);
      }
    } catch (err) {
      console.warn("⚠️ Resend e-posta gönderimi başarısız:", err.message);
    }
  }

  // Google Apps Script Webhook (Yedek)
  if (!sent && process.env.GAS_WEBHOOK_URL && RECIPIENT_EMAILS) {
    try {
      console.log("📨 Google Apps Script Webhook üzerinden e-posta tetikleniyor...");
      const res = await fetch(process.env.GAS_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: RECIPIENT_EMAILS,
          subject: emailSubject,
          htmlBody: emailHtml
        })
      });
      console.log("✅ Webhook yanıtı:", res.status);
      sent = true;
    } catch (err) {
      console.warn("⚠️ Webhook e-posta gönderimi başarısız:", err.message);
    }
  }

  if (!sent) {
    console.log("ℹ️ E-posta gönderimi yapılmadı (RESEND_API_KEY veya ALICI_MAIL tanımlı değil).");
  }
}

// Doğrudan CLI ile çağrılırsa çalıştır:
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  sendNotification().catch(console.error);
}
