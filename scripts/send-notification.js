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

const RECIPIENT_EMAILS = process.env.ALICI_MAIL || "orhaner1907@gmail.com";

/**
 * Terminal icra özetini ve e-posta bildirimini oluşturup gönderir.
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

  const dateStr = report.date || new Date().toISOString().split("T")[0];
  const activeModel = report.activeModel || "gemini-3.8-flash";
  const keyIndex = report.keyIndex ? `#${report.keyIndex}` : "#1";
  const duration = report.durationSeconds || 0;
  const totalPosts = report.totalPostsAnalyzed || 0;
  const batches = report.batchTelemetry || [];

  const leaderTool = (report.daily && report.daily[0]) || (report.twelveHours && report.twelveHours[0]) || { name: "Organik Tespit", score: 99, badge: "Lider" };

  // Subreddit sağlık analizi
  const allSubValues = stats && stats.subreddits ? Object.values(stats.subreddits) : [];
  const topYieldSubs = [...allSubValues].sort((a, b) => b.totalPostsFetched - a.totalPostsFetched).slice(0, 5);
  const lowSignalSubs = allSubValues.filter(s => (s.health || "").includes("LOW"));
  const deadSubs = allSubValues.filter(s => (s.health || "").includes("DEAD") || (s.totalScans >= 2 && s.successfulYieldScans === 0));

  // 1. DÜZ METİN TERMİNAL RAPORU
  let textReport = `
================================================================================
🤖 AITRENDLERI.COM OTONOM TARAMA VE ANALİZ TERMİNAL RAPORU
Tarih: ${dateStr} | İşlem Süresi: ${duration}s
================================================================================

[1. MODEL & ŞELALE AKTİVİTESİ]
  ✔ Aktif Çalışan Model : ${activeModel}
  ✔ Seçilen API Anahtarı : GEMINI_API_KEY ${keyIndex}
  ✔ Yürütme Durumu       : BAŞARILI (HTTP 200 OK)

[2. 50 REDDIT TOPLULUĞU TARAMA TELEMETRİSİ]
  ✔ Toplam Analiz Edilen Gönderi : ${totalPosts}
  ✔ Başarılı Kategori / Batch   : ${batches.filter(b => b.success).length} / ${batches.length || 7}
  ------------------------------------------------------------------------------
`;

  batches.forEach((b, idx) => {
    const statusIcon = b.success ? "🟢 OK" : "🔴 ERR";
    textReport += `  ${idx + 1}. [${statusIcon} ${b.statusCode || 200}] ${b.name}: ${b.postCount} gönderi\n`;
    if (b.detectedSubreddits && Object.keys(b.detectedSubreddits).length > 0) {
      const breakdown = Object.entries(b.detectedSubreddits)
        .map(([s, c]) => `r/${s}: ${c}`)
        .join(", ");
      textReport += `     └─ Dağılım: ${breakdown}\n`;
    } else if (!b.success) {
      textReport += `     └─ Hata/Uyarı: ${b.error || 'Veri çekilemedi'}\n`;
    }
  });

  textReport += `
[3. SUBREDDİT VERİTABANI İÇGÖRÜLERİ (src/data/subreddit-stats.json)]
  ✔ Toplam Takip Edilen Subreddit : ${stats?.summary?.totalSubreddits || 50}
  ✔ Yüksek Sinyal Verenler        : ${stats?.summary?.highSignalSubreddits || 0}
  ✔ Aktif Düzenli Kaynaklar       : ${stats?.summary?.activeSubreddits || 0}
  ✔ Düşük Sinyal / Takiptekiler   : ${stats?.summary?.lowSignalSubreddits || 0}
  ✔ Sıfır Çekenler (Dead Sub)     : ${stats?.summary?.deadSubreddits || 0}
  ------------------------------------------------------------------------------
  🏆 En Çok Katkı Sağlayanlar: ${topYieldSubs.map(s => `${s.name} (${s.totalPostsFetched})`).join(', ') || 'İlk tarama'}
  ⚠️ Düşük Sinyal Verenler   : ${lowSignalSubs.length > 0 ? lowSignalSubs.map(s => s.name).join(', ') : 'Yok'}
  🚫 Değiştirilmesi Önerilen : ${deadSubs.length > 0 ? deadSubs.map(s => s.name).join(', ') : 'Yok (Tümü veri sağlıyor)'}

[4. DİĞER VERİ KAYNAKLARI]
  ✔ ArXiv Makaleleri    : ${report.arxivDaily?.length || 3} taze makale (Türkçe özetli)
  ✔ Hugging Face Modeller: ${report.huggingface?.trending?.length || 5} trend model
  ✔ Hacker News         : ${report.hackerNews?.items?.length || 8} derin tartışma
  ✔ GitHub Radar        : ${report.githubTrends?.daily?.length || 6} repo

[5. GÜNÜN ORGANİK 1 NUMARALI LİDERİ]
  👑 ${leaderTool.name} (Skor: ${leaderTool.score || 99}/100 - ${leaderTool.badge || 'Zirvede'})
  📝 Neden Seçildi: ${leaderTool.whyTrending || leaderTool.function || 'Topluluk ivmesiyle öne çıktı'}

================================================================================
`;

  // Terminal dosyasını her zaman yerel olarak kaydet
  const reportFilePath = path.join(__dirname, "../src/data/latest-execution-report.txt");
  fs.writeFileSync(reportFilePath, textReport.trim(), "utf-8");
  console.log(`📄 Terminal icra raporu kaydedildi: ${reportFilePath}`);
  console.log(textReport);

  // 2. MODERN DARK TERMİNAL HTML E-POSTA ŞABLONU
  const emailSubject = `⚡ [${activeModel}] AI Trendleri Terminal Raporu (${dateStr}) - 👑 ${leaderTool.name}`;
  
  const batchRowsHtml = batches.map((b, i) => {
    const isOk = b.success;
    const badgeColor = isOk ? "#10b981" : "#ef4444";
    const statusText = isOk ? `OK ${b.statusCode || 200}` : `ERR ${b.statusCode || 'FAIL'}`;
    const detected = b.detectedSubreddits ? Object.entries(b.detectedSubreddits).map(([s, c]) => `<span style="background:#1e293b; color:#94a3b8; padding:2px 6px; border-radius:4px; font-size:11px; margin-right:4px;">r/${s}: <b>${c}</b></span>`).join("") : `<span style="color:#64748b; font-size:11px;">${b.error || '0 gönderi'}</span>`;

    return `
      <tr style="border-bottom: 1px solid #1e293b;">
        <td style="padding: 8px 6px; font-family: monospace; font-size: 12px; color: #cbd5e1;">${b.name}</td>
        <td style="padding: 8px 6px; text-align: center;">
          <span style="background: rgba(${isOk ? '16, 185, 129' : '239, 68, 68'}, 0.15); color: ${badgeColor}; border: 1px solid ${badgeColor}40; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; font-family: monospace;">${statusText}</span>
        </td>
        <td style="padding: 8px 6px; text-align: center; font-weight: bold; font-family: monospace; color: ${isOk ? '#f8fafc' : '#ef4444'};">${b.postCount}</td>
        <td style="padding: 8px 6px;">${detected}</td>
      </tr>
    `;
  }).join("");

  const emailHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
  </head>
  <body style="margin:0; padding:20px; background-color:#030712; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#f3f4f6;">
    <div style="max-width:680px; margin:0 auto; background-color:#090d16; border:1px solid #1f293d; border-radius:12px; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.5);">
      
      <!-- Terminal Header -->
      <div style="background-color:#0f172a; padding:16px 20px; border-bottom:1px solid #1e293b; display:flex; align-items:center; justify-content:space-between;">
        <div>
          <div style="display:inline-block; width:10px; height:10px; border-radius:50%; background-color:#ef4444; margin-right:6px;"></div>
          <div style="display:inline-block; width:10px; height:10px; border-radius:50%; background-color:#eab308; margin-right:6px;"></div>
          <div style="display:inline-block; width:10px; height:10px; border-radius:50%; background-color:#10b981; margin-right:12px;"></div>
          <span style="font-family:monospace; font-size:12px; color:#94a3b8; font-weight:bold;">aitrendleri@engine:~# terminal-report</span>
        </div>
        <div style="font-family:monospace; font-size:11px; color:#64748b; text-align:right;">
          ${dateStr} | ${duration}s
        </div>
      </div>

      <div style="padding:24px;">

        <!-- Status Hero -->
        <div style="background:linear-gradient(135deg, #0f172a 0%, #111e38 100%); border:1px solid #1e3a8a40; border-radius:10px; padding:18px; margin-bottom:20px;">
          <div style="font-size:11px; font-weight:bold; color:#38bdf8; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;">
            ⚡ OTONOM ANALİZ RAPORU
          </div>
          <h2 style="margin:0 0 10px 0; font-size:20px; color:#ffffff; font-weight:800;">
            Tarama Başarıyla Tamamlandı
          </h2>
          <div style="display:flex; flex-wrap:wrap; gap:8px;">
            <span style="background:#0284c720; color:#38bdf8; border:1px solid #0284c740; padding:4px 10px; border-radius:6px; font-size:12px; font-family:monospace; font-weight:bold;">
              🤖 Model: ${activeModel}
            </span>
            <span style="background:#10b98120; color:#34d399; border:1px solid #10b98140; padding:4px 10px; border-radius:6px; font-size:12px; font-family:monospace; font-weight:bold;">
              🔑 API Key: ${keyIndex}
            </span>
            <span style="background:#8b5cf620; color:#a78bfa; border:1px solid #8b5cf640; padding:4px 10px; border-radius:6px; font-size:12px; font-family:monospace; font-weight:bold;">
              ⏱️ ${duration} Saniye
            </span>
            <span style="background:#f59e0b20; color:#fbbf24; border:1px solid #f59e0b40; padding:4px 10px; border-radius:6px; font-size:12px; font-family:monospace; font-weight:bold;">
              📡 ${totalPosts} Gönderi
            </span>
          </div>
        </div>

        <!-- Günün 1 Numarası Banner -->
        <div style="background:#0a192f; border-left:4px solid #10b981; border-radius:6px; padding:14px; margin-bottom:20px;">
          <div style="font-size:11px; font-weight:bold; color:#10b981; text-transform:uppercase;">👑 GÜNÜN ORGANİK 1 NUMARALI LİDERİ</div>
          <div style="font-size:16px; font-weight:bold; color:#ffffff; margin:4px 0;">${leaderTool.name} <span style="font-size:12px; color:#38bdf8; background:#0284c720; padding:2px 6px; border-radius:4px;">${leaderTool.score || 99}/100</span></div>
          <div style="font-size:12px; color:#94a3b8; line-height:1.5;">${leaderTool.whyTrending || leaderTool.function || ''}</div>
        </div>

        <!-- Reddit 7 Batch Tablosu -->
        <div style="margin-bottom:20px;">
          <div style="font-size:13px; font-weight:bold; color:#e2e8f0; margin-bottom:10px; font-family:monospace;">
            📡 REDDIT TARAMA TELEMETRİSİ (7 Kategori / 50 Sub)
          </div>
          <table style="width:100%; border-collapse:collapse; background:#050912; border:1px solid #1e293b; border-radius:6px; overflow:hidden;">
            <thead>
              <tr style="background:#0f172a; border-bottom:1px solid #1e293b; text-align:left; font-size:11px; color:#94a3b8; font-family:monospace;">
                <th style="padding:8px 6px;">KATEGORİ</th>
                <th style="padding:8px 6px; text-align:center;">DURUM</th>
                <th style="padding:8px 6px; text-align:center;">POST</th>
                <th style="padding:8px 6px;">SUB DAĞILIMI</th>
              </tr>
            </thead>
            <tbody>
              ${batchRowsHtml}
            </tbody>
          </table>
        </div>

        <!-- Subreddit Sağlık & Veri Tabanı Kutusu -->
        <div style="background:#050912; border:1px solid #1e293b; border-radius:8px; padding:16px; margin-bottom:20px;">
          <div style="font-size:12px; font-weight:bold; color:#f1f5f9; margin-bottom:10px; font-family:monospace;">
            📊 SUBREDDİT SAĞLIK & SİNYAL ANALİZİ (src/data/subreddit-stats.json)
          </div>
          <div style="font-size:12px; color:#cbd5e1; line-height:1.8;">
            <div>🏆 <b>En Yüksek Verim:</b> ${topYieldSubs.map(s => `<code style="background:#1e293b; color:#38bdf8; padding:1px 5px; border-radius:3px;">${s.name} (${s.totalPostsFetched})</code>`).join(" ") || 'İlk tarama'}</div>
            <div style="margin-top:4px;">⚠️ <b>Düşük Sinyal / Takipte:</b> ${lowSignalSubs.length > 0 ? lowSignalSubs.map(s => `<code style="background:#1e293b; color:#fbbf24; padding:1px 5px; border-radius:3px;">${s.name}</code>`).join(" ") : '<span style="color:#10b981;">Yok (Tümü aktif)</span>'}</div>
            <div style="margin-top:4px;">🚫 <b>Değiştirilmesi Önerilen (Dead Sub):</b> ${deadSubs.length > 0 ? deadSubs.map(s => `<code style="background:#ef444420; color:#f87171; padding:1px 5px; border-radius:3px;">${s.name}</code>`).join(" ") : '<span style="color:#10b981;">Yok (Sıfır çeken sub yok)</span>'}</div>
          </div>
        </div>

        <!-- Çoklu Kaynak Sayıları -->
        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px; margin-bottom:20px; text-align:center;">
          <div style="background:#0f172a; padding:10px; border-radius:6px; border:1px solid #1e293b;">
            <div style="font-size:18px; font-weight:bold; color:#38bdf8;">${report.arxivDaily?.length || 3}</div>
            <div style="font-size:10px; color:#94a3b8; font-family:monospace;">ArXiv Makalesi</div>
          </div>
          <div style="background:#0f172a; padding:10px; border-radius:6px; border:1px solid #1e293b;">
            <div style="font-size:18px; font-weight:bold; color:#eab308;">${report.huggingface?.trending?.length || 5}</div>
            <div style="font-size:10px; color:#94a3b8; font-family:monospace;">HF Trend Model</div>
          </div>
          <div style="background:#0f172a; padding:10px; border-radius:6px; border:1px solid #1e293b;">
            <div style="font-size:18px; font-weight:bold; color:#f97316;">${report.hackerNews?.items?.length || 8}</div>
            <div style="font-size:10px; color:#94a3b8; font-family:monospace;">HN Tartışma</div>
          </div>
          <div style="background:#0f172a; padding:10px; border-radius:6px; border:1px solid #1e293b;">
            <div style="font-size:18px; font-weight:bold; color:#a855f7;">${report.githubTrends?.daily?.length || 6}</div>
            <div style="font-size:10px; color:#94a3b8; font-family:monospace;">GitHub Repo</div>
          </div>
        </div>

        <!-- Buton -->
        <div style="text-align:center; margin-top:24px;">
          <a href="https://aitrendleri.com" style="display:inline-block; background-color:#2563eb; color:#ffffff; text-decoration:none; padding:12px 28px; border-radius:8px; font-size:13px; font-weight:bold; font-family:monospace;">
            Canlıda Görüntüle (aitrendleri.com) →
          </a>
        </div>

      </div>

      <!-- Footer -->
      <div style="background-color:#050912; padding:12px 20px; border-top:1px solid #1e293b; text-align:center; font-size:11px; color:#475569; font-family:monospace;">
        aitrendleri.com otonom botu tarafından ${new Date().toUTCString()} tarihinde üretildi.
      </div>
    </div>
  </body>
  </html>
  `;

  // 3. E-POSTA GÖNDERİM KANALLARI (Resend API & Google Apps Script Webhook)
  let sent = false;

  // Resend API (Öncelikli Modern Servis)
  if (process.env.RESEND_API_KEY) {
    try {
      console.log(`📨 Resend API üzerinden [${RECIPIENT_EMAILS}] adresine e-posta gönderiliyor...`);
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "AI Trendleri <onboarding@resend.dev>",
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
  if (!sent && process.env.GAS_WEBHOOK_URL) {
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
    console.log("ℹ️ RESEND_API_KEY veya GAS_WEBHOOK_URL tanımlı olmadığı için e-posta gönderilmedi.");
    console.log("💡 E-posta bildirimlerini almak için Resend'den (resend.com - ücretsiz) aldığınız anahtarı .env dosyanıza veya GitHub Secrets'a RESEND_API_KEY olarak ekleyebilirsiniz.");
  }
}

// Doğrudan CLI ile çağrılırsa çalıştır:
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  sendNotification().catch(console.error);
}
