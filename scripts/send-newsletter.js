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

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID || "799a53ac-4334-4193-87a1-d0b15c54acf1";
const SENDER_EMAIL = "AI Trendleri <bulten@aitrendleri.com>";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Resend Audience listesindeki tüm aktif aboneleri çeker
 */
async function fetchAudienceContacts() {
  try {
    const res = await fetch(`https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`, {
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Resend Contacts HTTP ${res.status}: ${err}`);
    }

    const data = await res.json();
    const contacts = (data.data || []).filter(c => !c.unsubscribed);
    return contacts.map(c => c.email);
  } catch (err) {
    console.error("❌ Abone listesi çekilemedi:", err.message);
    return [];
  }
}

/**
 * Günlük bülten HTML şablonunu hazırlar
 */
function buildNewsletterHtml(report) {
  const dateStr = report.date || new Date().toLocaleDateString('tr-TR');
  const disc = report.morningBrief?.mostDiscussed || report.daily?.[0] || { name: "Model", hypeScore: 9.5, description: "" };
  const loved = report.morningBrief?.mostLoved || report.daily?.[1] || { name: "Model", sentimentScore: 95, description: "" };
  const lovedScore10 = typeof loved.sentimentScore === 'number' && loved.sentimentScore > 10 
    ? (loved.sentimentScore / 10).toFixed(1) 
    : Number(loved.sentimentScore || 9.2).toFixed(1);

  const bullets = report.morningBrief?.bullets || [];
  const topProducts = (report.daily || []).slice(0, 3);
  const hnBest = (report.hackerNewsPulse?.items || [])[0];
  const ghBest = (report.githubRadar?.daily || [])[0];
  const arxivBest = (report.arxivDaily || [])[0];

  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Trendleri — Günlük İstihbarat</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <div style="max-width: 620px; margin: 20px auto; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
    
    <!-- 1. ÜST HEADER ÇUBUĞU -->
    <div style="background-color: #107c41; padding: 18px 24px; color: #ffffff;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td>
            <div style="display: inline-block; vertical-align: middle; background-color: #ffffff; color: #107c41; font-weight: 900; font-family: monospace; font-size: 13px; padding: 4px 8px; border-radius: 4px; margin-right: 10px;">AI</div>
            <span style="font-size: 18px; font-weight: bold; font-family: monospace; letter-spacing: 0.5px; vertical-align: middle;">aitrendleri.com</span>
          </td>
          <td align="right">
            <span style="font-size: 12px; font-family: monospace; background-color: #0c592d; padding: 4px 10px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2);">
              ${dateStr}
            </span>
          </td>
        </tr>
      </table>
    </div>

    <!-- 2. GİRİŞ & SLOGAN -->
    <div style="padding: 20px 24px 12px 24px; border-bottom: 1px solid #e2e8f0;">
      <h1 style="margin: 0 0 6px 0; font-size: 20px; color: #0f172a; font-weight: 800;">
        🌅 Sabah İstihbaratı: Yapay Zekada Bugün Ne Oldu?
      </h1>
      <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.5;">
        50 seçkin Reddit topluluğu, 30 çekirdek X araştırmacısı, Hugging Face, GitHub ve ArXiv verilerinden filtrelenmiş 5 dakikalık yönetici brifingi.
      </p>
    </div>

    <div style="padding: 20px 24px;">

      <!-- 3. SARI KARTLAR: ÇİFTE LİDER KIRILMASI -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
        <tr>
          <!-- En Çok Konuşulan -->
          <td width="48%" valign="top" style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 12px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom: 1px solid #fef3c7; padding-bottom: 8px; margin-bottom: 8px;">
              <tr>
                <td>
                  <span style="font-size: 11px; font-weight: bold; font-family: monospace; color: #78350f;">🔥 EN ÇOK KONUŞULAN</span>
                </td>
                <td align="right">
                  <span style="background-color: #d97706; color: #ffffff; font-size: 10px; font-family: monospace; font-weight: 900; padding: 2px 6px; border-radius: 3px;">
                    HYPE: ${disc.hypeScore || 9.8}/10
                  </span>
                </td>
              </tr>
            </table>
            <div style="font-size: 14px; font-weight: 900; font-family: monospace; color: #78350f; margin-bottom: 6px;">
              ${disc.name}
            </div>
            <p style="margin: 0; font-size: 12px; color: #92400e; line-height: 1.4;">
              ${disc.description || 'Toplulukta en yüksek konuşulma ve mention hacmine sahip model.'}
            </p>
          </td>

          <td width="4%">&nbsp;</td>

          <!-- En Beğenilen -->
          <td width="48%" valign="top" style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 12px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom: 1px solid #fef3c7; padding-bottom: 8px; margin-bottom: 8px;">
              <tr>
                <td>
                  <span style="font-size: 11px; font-weight: bold; font-family: monospace; color: #78350f;">⭐ EN BEĞENİLEN</span>
                </td>
                <td align="right">
                  <span style="background-color: #059669; color: #ffffff; font-size: 10px; font-family: monospace; font-weight: 900; padding: 2px 6px; border-radius: 3px;">
                    BEĞENİ: ${lovedScore10}/10
                  </span>
                </td>
              </tr>
            </table>
            <div style="font-size: 14px; font-weight: 900; font-family: monospace; color: #78350f; margin-bottom: 6px;">
              ${loved.name}
            </div>
            <p style="margin: 0; font-size: 12px; color: #92400e; line-height: 1.4;">
              ${loved.description || 'Geliştiricilerin en yüksek memnuniyet ve takdir bildirdiği araç.'}
            </p>
          </td>
        </tr>
      </table>

      <!-- 4. SABAH İSTİHBARATI 4 KİLİT MADDE -->
      <div style="margin-bottom: 24px;">
        <div style="font-size: 12px; font-weight: bold; font-family: monospace; color: #0f172a; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.5px;">
          ⚡ 24 Saatin 4 Kritik Gelişmesi:
        </div>
        
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          ${bullets.map(b => `
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="24" valign="top" style="font-size: 16px;">${b.icon || '📌'}</td>
                    <td valign="top">
                      <strong style="font-size: 13px; color: #0f172a; font-family: monospace;">${b.tag}:</strong>
                      <span style="font-size: 13px; color: #334155; line-height: 1.4;"> ${b.text}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          `).join('')}
        </table>
      </div>

      <!-- 5. GÜNÜN ZİRVESİNDEKİ İLK 3 ÜRÜN -->
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px 16px; margin-bottom: 24px;">
        <div style="font-size: 12px; font-weight: bold; font-family: monospace; color: #107c41; text-transform: uppercase; margin-bottom: 10px;">
          📊 Topluluk Radarı: Günün Zirvedeki 3 Ürünü
        </div>
        ${topProducts.map((p, idx) => `
          <div style="padding: 8px 0; ${idx !== topProducts.length - 1 ? 'border-bottom: 1px dashed #cbd5e1;' : ''}">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td>
                  <span style="font-weight: bold; font-size: 13px; color: #0f172a; font-family: monospace;">#${idx + 1} ${p.name}</span>
                  <span style="font-size: 10px; color: #64748b; background: #e2e8f0; padding: 2px 6px; border-radius: 3px; font-family: monospace; margin-left: 6px;">${p.category || 'AI Modeli'}</span>
                </td>
                <td align="right">
                  <span style="font-size: 11px; font-family: monospace; font-weight: bold; color: #d97706;">Hype: ${p.hypeScore}/10</span>
                </td>
              </tr>
            </table>
            <div style="font-size: 12px; color: #475569; margin-top: 4px; line-height: 1.3;">
              ${p.whyTrending || p.primaryFunction || ''}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- 6. KISA VE ÖZ RADAR BAŞLIKLARI (ArXiv, GitHub, HN) -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px; font-size: 12px; color: #334155;">
        ${hnBest ? `
          <tr>
            <td style="padding: 6px 0;">
              <span style="color: #f97316; font-weight: bold; font-family: monospace;">[Hacker News]</span>
              <strong>${hnBest.titleTr || hnBest.title}</strong>
            </td>
          </tr>
        ` : ''}
        ${ghBest ? `
          <tr>
            <td style="padding: 6px 0;">
              <span style="color: #8b5cf6; font-weight: bold; font-family: monospace;">[GitHub]</span>
              <strong>${ghBest.owner}/${ghBest.name}</strong> — ${ghBest.function || ghBest.whyHype || ''}
            </td>
          </tr>
        ` : ''}
        ${arxivBest ? `
          <tr>
            <td style="padding: 6px 0;">
              <span style="color: #0284c7; font-weight: bold; font-family: monospace;">[ArXiv]</span>
              <strong>${arxivBest.titleTr || arxivBest.title}</strong>
            </td>
          </tr>
        ` : ''}
      </table>

      <!-- 7. BÜYÜK AKSİYON BUTONU (CTA) -->
      <div style="text-align: center; margin: 28px 0 10px 0;">
        <a href="https://aitrendleri.com" style="display: inline-block; background-color: #107c41; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 14px; font-weight: bold; font-family: monospace; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          Tüm Detayları, Kodları ve Grafikleri Canlıda İncele →
        </a>
        <div style="font-size: 11px; color: #64748b; margin-top: 8px; font-family: monospace;">
          aitrendleri.com • Canlı AI Ekosistem Paneli
        </div>
      </div>

    </div>

    <!-- 8. FOOTER -->
    <div style="background-color: #f8fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #64748b; line-height: 1.5; font-family: monospace;">
      Bu bülten, <strong>aitrendleri.com</strong> aboneliğiniz kapsamında her sabah otomatik olarak iletilmektedir.<br/>
      Gereksiz e-posta almamak ve abonelikten çıkmak için <a href="mailto:destek@aitrendleri.com?subject=Abonelikten%20Cik" style="color: #107c41; text-decoration: underline;">buraya tıklayabilirsiniz</a>.<br/>
      © ${new Date().getFullYear()} aitrendleri.com • Bağımsız Yapay Zeka Radarı
    </div>

  </div>
</body>
</html>
  `;
}

/**
 * Bülteni tüm abonelere gönderir
 */
export async function sendNewsletter() {
  console.log("📬 Günlük E-posta Bülteni Dağıtımı Başlatılıyor...");

  // 1. Rapor verisini oku
  const reportPath = path.join(__dirname, "../src/data/latest-report.json");
  if (!fs.existsSync(reportPath)) {
    console.error("❌ latest-report.json bulunamadı! Dağıtım iptal edildi.");
    return;
  }

  const report = JSON.parse(fs.readFileSync(reportPath, "utf-8"));
  const dateStr = report.date || new Date().toISOString().split("T")[0];

  // 2. Aboneleri Resend Audience'tan çek
  const subscribers = await fetchAudienceContacts();
  console.log(`📋 Toplam Aktif Abone Sayısı: ${subscribers.length}`);

  if (subscribers.length === 0) {
    console.log("ℹ️ Henüz bültene kayıtlı abone bulunmuyor. Gönderim yapılmadı.");
    return;
  }

  // 3. HTML Şablonunu oluştur
  const subject = `🤖 AI Trendleri: ${dateStr} — Günün En Çok Konuşulan Modelleri ve Sabah Brifingi`;
  const htmlContent = buildNewsletterHtml(report);

  let successCount = 0;
  let failCount = 0;

  // 4. Her aboneye gizlilik korumalı tek tek gönder (Kullanıcılar birbirinin mailini görmez)
  for (const email of subscribers) {
    try {
      console.log(`✉️ Gönderiliyor: [${email}]...`);
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: SENDER_EMAIL,
          to: [email],
          subject: subject,
          html: htmlContent
        })
      });

      if (res.ok) {
        successCount++;
        console.log(`   ✔ Başarılı: [${email}]`);
      } else {
        failCount++;
        const errText = await res.text();
        console.warn(`   ⚠️ Başarısız [${email}]: ${errText}`);
      }

      // API rate-limit koruması için 100ms bekleme
      await sleep(100);
    } catch (err) {
      failCount++;
      console.warn(`   ❌ Hata [${email}]:`, err.message);
    }
  }

  console.log(`\n🎉 Bülten Dağıtımı Tamamlandı! Başarılı: ${successCount}, Hatalı: ${failCount}`);
}

// CLI ile çağrılırsa çalıştır:
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  sendNewsletter().catch(console.error);
}
