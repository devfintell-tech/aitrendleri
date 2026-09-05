# 📜 AI TRENDLERİ PROJE ANAYASASI & DEĞİŞMEZ STANDARTLAR

Bu belge, bu projenin tüm tasarım, veri mimarisi ve geliştirme standartlarını kalıcı olarak belirleyen resmi anayasadır. Projede çalışacak her yapay zeka asistanı, mühendis ve otomasyon botu bu kurallara tavizsiz uymakla yükümlüdür.

---

## 🏛️ 1. Estetik, Doğallık & Izgara Düzeni (CSS Subgrid İlkesi)

1. **Sıfır Kaydırma Çubuğu (No Internal Scrollbars):**
   - ArXiv, GitHub, Hacker News veya diğer kartların hiçbirinde iç kaydırma çubuğu (`overflow-y-auto`, `overflow-scroll`) KULLANILAMAZ.
   - Hiçbir kutuda siyah/gri scrollbar çıkmasına izin verilemez.

2. **Doğal Metin Akışı & Zorlamasız Genişleme:**
   - Metinler yapay olarak aynı satırda bitsin diye zorlanamaz, kısaltılamaz (`line-clamp` ile gövde metni kesilemez) veya suni kelime dolgusu yapılamaz.
   - Bir metin kaç satır sürüyorsa doğal olarak o kadar satıra yayılır ("Yazı aşağı gitmesi gerekiyorsa gitsin, sorun yok").

3. **Kutu Seviyelerinin Eşitlenmesi (CSS Subgrid):**
   - Bir satırdaki kutulardan biri uzun bir metne sahipse, o kutu doğal olarak aşağıya doğru büyür.
   - CSS Subgrid mimarisi sayesinde, o satırdaki diğer kutular da en uzun kutunun bittiği seviyeye kadar otomatik olarak uzar (`h-full`).
   - Daha kısa metin içeren kutularda metin ile kutu tabanı arasında doğal bir boşluk kalabilir ("Yazı ve kutu arasında boşluk kalabilir sorun değil"), ancak kutuların alt çizgisi ve takip eden elemanların başlangıç çizgisi daima jilet gibi aynı hizada kalır.

---

## 🔬 2. ArXiv Akademik Radar Standartları

1. **Zorunlu Türkçe Başlık (`titleTr`):**
   - ArXiv makalelerinin başlıkları sitede ASLA ham İngilizce gösterilemez.
   - Her makale için akıcı, akademik ve anlaşılır bir `titleTr` alanı üretilmek zorundadır.
   - `scripts/run-analysis.js` içindeki Gemini prompt'u `titleTr` alanını zorunlu tutar; `enforceStrictStandards()` fonksiyonu eksik veya İngilizce kalan başlıkları otomatik olarak Türkçe sözlük ve çeviri motoruyla tamamlar.
   - `src/App.jsx` bileşeni de `knownArxivTrTitles` normalizasyonu ile geçmiş ve gelecek tüm verilerde Türkçe başlığı garanti eder.

2. **ArXiv Kart Hizalaması:**
   - Rozet (Row 1) ve Başlık (Row 2) aynı satırda başlar.
   - Sarı Kutu (Çarpıcı Etki / `whyMad`) metne göre doğal olarak büyür, 3 kartta da tam aynı hizada biter.
   - Özet (Row 4 / `summary`) 3 kartta da tam aynı seviyede başlar.
   - Alt çubuk (Yazarlar & Buton) en altta eşitlenir.

---

## 🐙 3. GitHub AI Radarı Standartları

1. **4 Zaman Dilimi (Timeframe Switcher):**
   - `⚡ 24s Flaş` (daily)
   - `📈 1 Haftalık` (weekly)
   - `🪐 1 Aylık` (monthly)
   - `🏆 Yıllık En İyiler` (yearly)

2. **Zorunlu Veri Formatı (Her Dilimde 6 Repo):**
   - Her repo için `id`, `name`, `owner`, `url`, `stars`, `deltaStars`, `category`, `language`, `function` (Ne İşe Yarar?), `whyHype` (Neden Yıldızlaştı?), `installCommand` alanları eksiksiz olmalıdır.

3. **Subgrid Hizalaması:**
   - 3'lü sütun gruplarında *"Ne İşe Yarar?"* ve *"Neden Yıldızlaştı?"* kutuları, o gruptaki en uzun kutuya göre doğal olarak uzar ve aynı çizgide biter.

4. **Tek Tip ve Dengeli Terminal Komutları (`installCommand`):**
   - Komutlar kartlar arasında görsel ve yapısal dengeyi bozmayacak tek tip, kısa ve kompakt bir yapıda olmalıdır (`pip install <repo>`, `npm i <repo>`, `npx <repo>` vb.).
   - `git clone https://... && npm i` gibi uzun URL'ler ve `&&` ile birbirine bağlanmış zincir komutlar KESİNLİKLE YASAKTIR.
   - Komut kutusu asla sağ kenara dayanmamalı, taşma sınırına gelmemeli ve her dilde en doğrudan paket/CLI formatı kullanılmalıdır.

---

## 🟢 4. Hacker News Geliştirici Nabzı

1. **24 Saatlik Özet (`summary24h`) & 8 Teknik Tartışma:**
   - Her gün en çok puan ve teknik derinliğe sahip 8 tartışma yer alır.
2. **Yeşil Çıkarım Kutuları (`usefulInsight`):**
   - İkili satır gruplarında (`md:grid-cols-2`) sol ve sağ karttaki yeşil kutular tam olarak aynı yatay hizada başlar, doğal olarak genişler ve aynı seviyede biter.

---

## 🤗 5. Hugging Face Liderlik Tablosu

1. **Sol Sütun (5 Amiral Gemisi Model):**
   - DeepSeek V3, Llama 3.3 70B, Qwen 2.5 Coder 32B, FLUX.1 Schnell, Whisper Large v3 gibi sektör standartları.
2. **Sağ Sütun (5 Trend Model):**
   - Son 24 saatte Hugging Face'te en çok indirme ve beğeni ivmesi yakalayan modeller.

---

## 📦 6. Geçmiş Arşiv Dokunulmazlığı & Veri Güvenliği

1. **Dondurulmuş Zaman Kapsülleri (Snapshots):**
   - Her günün analizi `src/data/archive/YYYY-MM-DD.json` dosyasına kaydedilir ve mühürlenir.
   - Kullanıcı geçmiş bir tarihi seçtiğinde harici hiçbir bot, LLM veya scraping çalıştırılamaz; veri doğrudan statik JSON'dan 1 milisaniyede okunur.
