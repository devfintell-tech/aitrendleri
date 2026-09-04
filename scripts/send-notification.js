import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RECIPIENT_EMAILS = process.env.ALICI_MAIL || "orhaner1907@gmail.com";

async function sendNotification() {
  const reportPath = path.join(__dirname, "../src/data/latest-report.json");
  if (!fs.existsSync(reportPath)) {
    console.log("Rapor dosyası bulunamadı, mail gönderilmedi.");
    return;
  }

  const report = JSON.parse(fs.readFileSync(reportPath, "utf-8"));

  const emailSubject = `🤖 aitrendleri.com Güncellendi (${report.date}) - [${report.activeModel}]`;
  const emailHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b0f19; color: #f1f5f9; padding: 24px; border-radius: 12px; max-width: 600px; margin: 0 auto;">
      <div style="border-bottom: 1px solid #1e293b; padding-bottom: 16px; margin-bottom: 20px;">
        <span style="font-size: 11px; font-weight: bold; color: #107c41; text-transform: uppercase; letter-spacing: 1px;">OTONOM ANALİZ BİLDİRİMİ</span>
        <h1 style="font-size: 22px; font-weight: 800; color: #ffffff; margin: 4px 0 0 0;">aitrendleri.com Taraması Tamamlandı</h1>
        <p style="font-size: 13px; color: #94a3b8; margin: 4px 0 0 0;">${report.date}</p>
      </div>

      <div style="background-color: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <h3 style="font-size: 14px; font-weight: bold; color: #38bdf8; margin: 0 0 12px 0;">📊 Tarama ve İşleme İstatistikleri</h3>
        <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #94a3b8;">📡 Taranan Subreddit:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #ffffff; text-align: right;">43 Topluluk</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #94a3b8;">🔥 Çekilen Sıcak Başlık:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #ffffff; text-align: right;">${report.totalPostsAnalyzed || 36} İçerik</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #94a3b8;">🤖 Kullanılan Model:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #10b981; text-align: right;">${report.activeModel}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #94a3b8;">⏱️ İşlem Süresi:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #ffffff; text-align: right;">${report.durationSeconds} saniye</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 14px; font-weight: bold; color: #ffffff; margin: 0 0 8px 0;">📌 Yönetici Özeti:</h3>
        <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6; margin: 0; background-color: #1e293b; padding: 12px; border-radius: 6px; border-left: 3px solid #107c41;">
          ${report.executiveSummary}
        </p>
      </div>

      <div style="text-align: center; margin-top: 24px;">
        <a href="https://aitrendleri.com" style="display: inline-block; background-color: #107c41; color: #ffffff; text-decoration: none; padding: 10px 24px; border-radius: 6px; font-size: 13px; font-weight: bold;">
          Canlı Tabloyu Görüntüle (aitrendleri.com) →
        </a>
      </div>

      <div style="margin-top: 24px; pt-16px; border-top: 1px solid #1e293b; text-align: center; font-size: 11px; color: #64748b;">
        Bu bilgilendirme GitHub Actions tarafından otomatik olarak gönderilmiştir.
      </div>
    </div>
  `;

  // 1. Yöntem: Google Apps Script Webhook (varsa)
  if (process.env.GAS_WEBHOOK_URL) {
    try {
      console.log("📨 Google Apps Script Webhook üzerinden mail tetikleniyor...");
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
      return;
    } catch (err) {
      console.warn("⚠️ Webhook gönderimi başarısız:", err.message);
    }
  }

  // 2. Yöntem: Resend API (varsa)
  if (process.env.RESEND_API_KEY) {
    try {
      console.log("📨 Resend API üzerinden mail gönderiliyor...");
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
      console.log("✅ Resend yanıtı:", res.status);
      return;
    } catch (err) {
      console.warn("⚠️ Resend gönderimi başarısız:", err.message);
    }
  }

  console.log("ℹ️ Mail servisi anahtarı tanımlanmadığı için konsola özet yazıldı.");
  console.log(`[BİLDİRİM] ${emailSubject}`);
}

sendNotification().catch(console.error);
