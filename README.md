# ⚡ AI HYPE RADAR (Yapay Zeka Hype ve Benimsenme Terminali)

30'dan fazla seçkin Reddit yapay zeka topluluğundaki binlerce geliştirici ve araştırmacı tartışmasını takip eden, **Gemini API** ile analiz edip **günlük, haftalık ve aylık hype skorlarını (1-10)** ölçen ve derin danışman bülteni üreten tam teşekküllü web platformu.

---

## 🌟 Öne Çıkan Özellikler

1. **Gelişmiş Hype Takip Motoru:**
   - **Günlük (Daily):** Son 24 saat içinde patlayan ani hype'lar (Spike/Rocket).
   - **Haftalık (Weekly):** 7 günlük net puan değişimi (🔺/🔻 Delta) ve benimsenme eğilimleri.
   - **Aylık (Monthly):** 30 günlük kalıcı endüstri liderleri ve makro pazar dengesi.
   - **Sparkline Çizgileri:** Her model için 7 günlük seyrin mini grafiği.

2. **30+ Yüksek Sinyalli Reddit Topluluğu:**
   - *Vibe Coding:* `r/vibecoding`, `r/CursorAI`, `r/windsurf`, `r/ClaudeAI`, `r/ChatGPTCoding`, `r/copilot`
   - *Otonom Ajanlar:* `r/AI_Agents`, `r/CrewAI`, `r/LangChain`, `r/AutoGPT`, `r/Automate`
   - *Temel LLM'ler:* `r/OpenAI`, `r/GoogleGemini`, `r/DeepSeek`, `r/Singularity`, `r/ArtificialInteligence`, `r/MachineLearning`
   - *Açık Kaynak & Yerel:* `r/LocalLLaMA`, `r/ollama`, `r/vllm`, `r/huggingface`
   - *Geliştirici & Üretken Medya:* `r/LLMDevs`, `r/PromptEngineering`, `r/ComfyUI`, `r/StableDiffusion`, `r/Midjourney`

3. **Reddit Koruma Protokolü (Sıfır Bloklama):**
   - 30 subreddit tek tek taranmaz. Reddit'in resmi **Multi-Subreddit** (`r/sub1+sub2+...`) özelliğiyle **sadece 5 istekte** tüm havuz taranır.
   - İstekler arası rastgele jitter (2.5 - 4.0 saniye insan benzeri gecikme).
   - Resmi kurumsal `User-Agent` formatı.

4. **Kayıt & Geçmiş Arşivi:**
   - Geçmiş günlerin ve haftaların raporları saklanır; tek tıkla geçmiş tarihler incelenebilir.

5. **Danışman Bülteni & Beyaz Yaka Rehberi:**
   - 🛠️ Model Sıralaması & Radar
   - 💡 Vibe Coding & Teknik İçgörüler
   - 📉 Makro Sektör Trendleri & Rekabet Dengesi
   - 💼 Beyaz Yaka Entegrasyon ve Operasyon Rehberi

---

## 💻 Yerel Geliştirme (Local Preview)

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirici sunucusunu başlatın
npm run dev
```
Tarayıcınızda `http://localhost:3000` adresini açarak siteyi canlı olarak görebilirsiniz.

---

## 🌐 Domain Alma ve Cloudflare'e Bağlama Rehberi

### 1. Adım: Domaini Cloudflare'den Alın (Toptan Fiyata ~$9.77/yıl)
1. [Cloudflare Dashboard](https://dash.cloudflare.com/) hesabınıza girin.
2. Sol menüden **Domain Registration > Register Domains** seçin.
3. Almak istediğiniz domaini aratın (Örn: `aitrendradar.com`, `vibehype.dev`, `aihypepulse.com`).
4. Satın alımı tamamlayın. *(WHOIS gizliliği ve SSL ömür boyu tamamen ücretsizdir, komisyon yoktur).*

### 2. Adım: Projeyi GitHub'a Yükleyin
```bash
git add .
git commit -m "feat: AI Hype Radar v1.0"
git remote add origin https://github.com/KULLANICI_ADINIZ/ai-hype-radar.git
git push -u origin main
```

### 3. Adım: Cloudflare Pages'e Bağlayın
1. Cloudflare panelinde **Compute (Workers) > Workers & Pages** bölümüne gidin.
2. **Create application > Pages > Connect to Git** seçin.
3. GitHub reponuzu seçin.
4. Ayarlar:
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. **Save and Deploy** butonuna basın. Siteniz 1 dakika içinde canlıya geçer!

### 4. Adım: Domaininizi Tek Tıkla Ekleyin
- Oluşan Pages projenizin içine girin > **Custom domains** sekmesine tıklayın.
- Satın aldığınız domaini (örn: `aitrendradar.com`) yazın.
- Cloudflare domaini de Cloudflare üzerinde olduğu için DNS ve SSL ayarlarını tek tıkla otomatik bağlar!

### 5. Adım: Günlük Otomatik Taramayı Açın
- GitHub reponuzda **Settings > Secrets and variables > Actions** sayfasına gidin.
- **New repository secret** diyerek:
  - Ad: `GEMINI_API_KEY`
  - Değer: Gemini API Anahtarınız
- Artık her sabah saat 06:00 UTC'de `.github/workflows/daily-scan.yml` otomatik çalışıp sitenizi güncelleyecektir.
