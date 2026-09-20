/**
 * Cloudflare Pages Function: /api/subscribe
 * aitrendleri.com ziyaretçilerini Resend Audience (General) listesine ekler.
 */
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function onRequestPost(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  try {
    const { request, env } = context;
    const body = await request.json().catch(() => ({}));
    const email = body.email ? String(body.email).trim().toLowerCase() : '';

    // E-posta regex doğrulaması
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Lütfen geçerli bir e-posta adresi giriniz.' 
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    const apiKey = env.RESEND_API_KEY;
    const audienceId = env.RESEND_AUDIENCE_ID || "799a53ac-4334-4193-87a1-d0b15c54acf1";

    if (!apiKey) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'E-posta servisi henüz yapılandırılmamış (RESEND_API_KEY eksik).' 
      }), {
        status: 500,
        headers: corsHeaders
      });
    }

    // 1. Resend Audience'a Abone Ekle
    const resendRes = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        unsubscribed: false
      })
    });

    const resData = await resendRes.json().catch(() => ({}));

    // 200/201 (Başarılı) veya 409 (Zaten Abone)
    if (resendRes.ok || resendRes.status === 409) {
      // Yeni aboneye anında Hoş Geldin E-postası gönder
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: "AI Trendleri <bulten@aitrendleri.com>",
            to: [email],
            subject: "🤖 Hoş Geldiniz! Günlük AI Trendleri İstihbarat Bülteni",
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #107c41; padding: 22px 24px; text-align: center; color: #ffffff;">
                  <h1 style="margin: 0; font-size: 22px; font-family: monospace; letter-spacing: 0.5px;">
                    <a href="https://aitrendleri.com" style="color: #ffffff !important; text-decoration: none !important;">
                      AI aitrendleri.com
                    </a>
                  </h1>
                  <p style="margin: 6px 0 0 0; font-size: 13px; color: #ffffff !important; opacity: 0.95;">Günlük Yapay Zeka İstihbaratı</p>
                </div>
                
                <div style="padding: 22px 24px; color: #1e293b; line-height: 1.6;">
                  <h2 style="font-size: 18px; color: #0f172a; margin-top: 0;">Aramıza Hoş Geldiniz! 🎉</h2>
                  <p style="font-size: 14px; color: #334155;">
                    Gündemin kısa özeti artık her sabah doğrudan gelen kutunuzda olacak.
                  </p>
                  
                  <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-left: 4px solid #107c41; padding: 14px 18px; border-radius: 4px; margin: 20px 0;">
                    <div style="font-size: 13px; font-weight: bold; color: #0f172a; margin-bottom: 4px;">Bültende Neler Var?</div>
                    <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #475569;">
                      <li>🔥 <strong>Günün En Çok Konuşulan & En Beğenilen Modelleri</strong></li>
                      <li>🚀 <strong>Sabah İstihbaratı:</strong> Model savaşları, kurumsal hamleler ve yerel zeka</li>
                      <li>⚡ <strong>Günün Zirvesindeki AI Ürünleri:</strong> Hype ve Memnuniyet skorları</li>
                    </ul>
                  </div>

                  <p style="font-size: 14px; color: #334155;">
                    Yarın sabah ilk istihbarat raporunuzda görüşmek üzere!
                  </p>

                  <div style="text-align: center; margin: 28px 0 16px 0;">
                    <a href="https://aitrendleri.com" style="display: inline-block; background-color: #107c41; color: #ffffff !important; text-decoration: none !important; padding: 14px 28px; border-radius: 6px; font-size: 13px; font-weight: bold; font-family: monospace;">
                      Canlı Trend Tablosunu İncele (aitrendleri.com) →
                    </a>
                  </div>
                </div>

                <div style="background-color: #f1f5f9; padding: 14px 20px; text-align: center; font-size: 11px; color: #64748b; font-family: monospace; border-top: 1px solid #e2e8f0;">
                  Bu e-posta <a href="https://aitrendleri.com" style="color: #64748b !important; text-decoration: none !important; font-weight: bold;">aitrendleri.com</a> bültenine abone olduğunuz için gönderilmiştir.<br/>
                  © ${new Date().getFullYear()} aitrendleri.com • Tüm hakları saklıdır.
                </div>
              </div>
            `
          })
        });
      } catch (e) {
        console.warn("Hoş geldin maili gönderilemedi:", e.message);
      }

      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Aramıza hoş geldiniz! İlk bülteniniz yarın sabah gelen kutunuzda olacak.' 
      }), {
        status: 200,
        headers: corsHeaders
      });
    }

    return new Response(JSON.stringify({ 
      success: false, 
      error: resData.message || 'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.' 
    }), {
      status: resendRes.status,
      headers: corsHeaders
    });

  } catch (err) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Sunucu hatası: ' + err.message 
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
