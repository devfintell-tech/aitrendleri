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

4. **Başlık Ayrım Çizgilerinin Eşitlenmesi (Header Bottom Border Alignment):**
   - Kartların başlıklarının altında yer alan ince ayrım çizgileri (`border-b`), aynı satırdaki kartlar arasında daima milimetrik olarak aynı yatay hizada olmalıdır.
   - Bir kartın başlığı 2 veya daha fazla satıra uzayıp aşağı kaysa bile, yanındaki tek satırlık başlığa sahip kartların başlık kapsayıcıları `h-full flex flex-col justify-between` ile otomatik olarak en uzun başlığın seviyesine kadar aşağı uzar.
   - Alt ayrım çizgisi daima o satırdaki en uzun (aşağıda olan) başlığın bittiği seviyeye kilitlenir; yan kartlardaki çizgiler asla yukarıda kalamaz.
   - Bu kural hem Sabah İstihbaratı 4 Kilit Madde kartlarında (`.subgrid-row-morning`), hem Danışman Raporu 4 Bölüm kartlarında (`.subgrid-row-sections`), hem Günün Sözlüğü'nde (`.subgrid-row-glossary`), hem de sitedeki tüm grid kartlarında tavizsiz uygulanır.

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

## 🟠 4. Hacker News Geliştirici Nabzı Standartları

1. **Günün En Önemli Tam 8 Kilit Teknik Tartışması (4x2 Simetri):**
   - Her gün Hacker News'de en yüksek puan ve yorum alan en önemli tam 8 teknik tartışma yer alır.
   - Bu tartışmalar sıralamaya kesinlikle etki etmez; bağımsız ve saf mühendis/geliştirici nabzını yansıtır.

2. **Zorunlu Akıcı Türkçe Başlık (`titleTr`):**
   - Hacker News başlıkları sitede ASLA ham İngilizce gösterilemez.
   - Her tartışma için akıcı, merak uyandırıcı ve konuyu tam anlatan bir Türkçe başlık (`titleTr`) üretilmek zorundadır. Orijinal İngilizce başlık alt referans çubuğunda şeffafça korunur.

3. **Yeşil Kutu Yasağı & Zengin ve Derin Tartışma Paragrafı (`discussion`):**
   - Kartlarda ayrık yeşil çıkarım kutucukları (`usefulInsight`) KESİNLİKLE YASAKTIR.
   - Başlığın hemen altında, mühendis ve geliştiricilerin o başlık altında neleri tartıştığını, öne çıkan karşıt fikirleri, teknik argümanları, mimari deneyimleri ve pratik deneyimleri aktaran en az 3-4 cümlelik doyurucu, zengin ve derinlemesine bir Türkçe analiz paragrafı (`discussion`) yer alır.
   - Şablon/dolgu cümleler ("Büyük ölçekli sistemlerde yazılım...", "mimari tasarım ve geliştirici deneyimi...") KESİNLİKLE YASAKTIR; her tartışmanın içeriği kendine has ve gerçek yorumlara dayalı olmalıdır.

4. **CSS Subgrid ve Jilet Hizalama İlkesi:**
   - Kartlar 2 sütunlu (`grid-cols-1 md:grid-cols-2`) ızgara düzeninde doğal olarak genişler (`h-full flex flex-col justify-between`).
   - Kart başlıkları ve altındaki tartışma paragrafları aynı satırdaki kartlar arasında tam hizalı başlar, en uzun paragrafa göre kutular doğal olarak uzar ve alt HN link çubuğu jilet gibi aynı çizgide eşitlenir.
   - Kart içinde hiçbir dikey/yatay kaydırma çubuğu (scrollbar) KULLANILAMAZ.

---

## 🤗 5. Hugging Face Liderlik Tablosu

1. **Sol Sütun (5 En Çok Beğenilen & İndirilen Model):**
   - Hugging Face API'sinden (`sort=likes` ve `sort=downloads`) günlük olarak dinamik çekilen, açık kaynak ekosisteminde en çok beğenilen ve indirilen 5 açık model. Kod seviyesinde sabit/hardcoded amiral model dayatması yapılamaz; güncel API verileri esastır.
2. **Sağ Sütun (5 Trend Model):**
   - Son 24 saatte Hugging Face'te en çok indirme ve beğeni ivmesi yakalayan (`sort=trendingScore`) modeller.

---

## 📦 6. Geçmiş Arşiv Dokunulmazlığı & Veri Güvenliği

1. **Dondurulmuş Zaman Kapsülleri (Snapshots):**
   - Her günün analizi `src/data/archive/YYYY-MM-DD.json` dosyasına kaydedilir ve mühürlenir.
   - Kullanıcı geçmiş bir tarihi seçtiğinde harici hiçbir bot, LLM veya scraping çalıştırılamaz; veri doğrudan statik JSON'dan 1 milisaniyede okunur.

---

## 📖 7. Günün Sözlüğü (AI, Yazılım & Donanım Kavramları) Standartları

1. **Yalnızca ve Yalnızca Sitede Bizzat Geçen Kavramlar Şartı:**
   - Sözlükteki kavramlar kesinlikle o günkü sitede (ArXiv makaleleri, GitHub repoları, Hugging Face modelleri, Hacker News tartışmaları, Sabah Özeti ve Danışman Raporu) bizzat geçen terim, mimari ve jargonlardan seçilmelidir.
   - Sitede bahsi geçmeyen, genel internet veya Reddit gündeminde kalmış hiçbir kavram sözlüğe ALINAMAZ.

2. **Zorunlu Veri Formatı (Tam 9 Kavram & Yalın Anlatım):**
   - Her gün tam 9 kilit teknik kavram yer alır (3'lü ızgarada 3x3 kusursuz simetri).
   - Her kavram için `id`, `term`, `category`, `definition` (Geniş, doyurucu ve herkesin anlayabileceği akıcı Türkçe açıklama) alanları eksiksiz olmalıdır.
   - Arayüzde görsel kalabalık ve gürültü oluşturmaması için kart üzerinde kaynak referansları veya etiket cümbüşü yer almaz; yalnızca **Kavram** ve **Anlamı** gösterilir.

3. **Subgrid Hizalaması & Sıfır Kaydırma Çubuğu:**
   - `.subgrid-row-glossary` ve `.subgrid-card-glossary` CSS Subgrid mimarisi (`grid-template-rows: auto 1fr`) ile yönetilir.
   - Kartların hiçbirinde dikey veya yatay kaydırma çubuğu KULLANILAMAZ.
   - 3'lü sütun satırlarındaki tüm kavram başlıkları ve tanım paragrafları milimetrik olarak aynı çizgide başlar ve eşitlenerek biter.

---

## 🤖 8. AI Ürün Sıralaması, Hype Hacmi & Beğeni Puanı Ayrımı Standartları

1. **Hype Skoru (Konuşulma Derecesi / Popülarite Hacmi):**
   - Hype Skoru (`hypeScore` 0.0 - 10.0), bir ürünün son 24 saatte internette ve topluluklarda (Reddit, X, teknik forumlar vb.) ne kadar konuşulduğunu, ne kadar yoğun gündem olduğunu ve mention/buzz hacmini belirler.
   - Bir ürün ister olumlu övgülerle ister olumsuz şikayetlerle veya sansür/çöküş skandallarıyla konuşulsun; çok konuşulan her ürünün Hype Skoru yüksek olur.

2. **Topluluk Beğeni Puanı (Memnuniyet & Duygu Skoru):**
   - Beğeni Puanı (`sentimentScore` 0 - 100 veya %), o ürünün topluluk tarafından beğenilip beğenilmediğini (memnuniyet, pozitif/negatif duygu) bağımsız olarak skorlar.
   - Çok konuşulan (yüksek hype) bir ürün eğer kısıtlamalar, sansür, fahiş fiyat veya model bozulması nedeniyle eleştiriliyorsa Beğeni Puanı düşük verilir (20 - 55 arası).
   - Topluluk ürünü coşkuyla övüyor, yeni yeteneklerini kutluyor ve tavsiye ediyorsa Beğeni Puanı yüksek verilir (85 - 99 arası).
   - Böylece kullanıcılar bir ürünün ne kadar popüler olduğunu Hype Skoru'ndan, sevilip sevilmediğini ise Beğeni Puanı'ndan net olarak ayırt eder.

3. **Hype Skoruna Göre Yukarıdan Aşağıya Kesin Sıralama Şartı:**
   - Sitedeki tüm tablolar ve ürün listeleri (`daily`, `weekly`, `monthly`) tavizsiz olarak **HYPE SKORUNA GÖRE YUKARIDAN AŞAĞIYA DOĞRU (BÜYÜKTEN KÜÇÜĞE / DESCENDING)** sıralanır.
   - En çok konuşulan ürün daima 1. sırada (Zirvede) yer alır. Hype skoru düşük olan ürünler listenin alt sıralarında konumlanır.

4. **Sıfır Yapay Yönlendirme (No Concept Hijacking / No Artificial Mapping):**
   - Kod ve analiz süreçlerinde bir kavram veya akım (örneğin "Vibe Coding", "Workspace", "Self-Hosted") görüldüğünde asla yapay olarak başka bir ürüne (Cursor, Ollama vb.) zorla bağlanamaz / map edilemez.
   - Cursor yalnızca gerçekten Cursor tartışılıyorsa listeye girebilir; her ürün yalnızca kendi konuşulma sıklığına ve popülaritesine göre bağımsızca sıralamaya dahil olur.

5. **Tüm Sıcak Başlıkların Taranması & Somut Yapay Zeka Ürünü Şartı:**
   - Son 24 saatte Reddit'te tartışılan tüm sıcak başlıklar, tartışmalar ve içerikler eksiksiz taranır.
   - Sıralamaya girebilecek tek şart **somut bir yapay zeka ürünü** olmasıdır (Büyük dil modeli, açık kaynak yerel model, otonom ajan, AI CLI / terminal aracı, AI editör / IDE, framework, GPU veya AI donanımı).
   - "Maliyet", "felsefe", "anket", "iş piyasası" gibi soyut meta tartışma başlıkları ürün olmadıkları için doğrudan sıralamaya alınamaz; ancak bu tartışmaların içinde geçen somut AI araçları tespit edilerek değerlendirilir.

6. **Şeffaf Nedenler & Duygu Analizi (`whyTrending`):**
   - Sıralamadaki her ürünün kartına tıklandığında neden konuşulduğu ve neden beğenildiği/eleştirildiği (`whyTrending`, `primaryFunction`, `badge`) topluluğun gerçek yorumlarına dayanarak net şekilde gösterilmelidir.
   - Topluluk bir ürünü övüyorsa yüksek beğeni puanı (`sentimentScore`), eleştiriyorsa (sansür, hata, bellek sorunu, pahalılık) düşük beğeni puanı verilir.

---

## ⚡ 9. Yürütme Telemetrisi, Model Bilgisi & Token Standartları (Girdi, Düşünce & Nihai Çıktı Şeffaflığı)

1. **Zorunlu Telemetri Başlık Bilgileri (Header Bar):**
   - Sitenin üst bilgi çubuğunda (tarih seçicinin hemen yanında) günlük analizin teknik yürütme verileri eksiksiz ve şeffaf şekilde yer almalıdır:
     - **Aktif Model:** Analizi ve çıkarımı yapan model adı (ör. `DeepSeek v4.1 Flash`, `Gemini 2.5 Flash`).
     - **Çalışma Süresi:** Analizin toplam kaç saniye sürdüğü (`durationSeconds` ör. `267s`).
     - **Zaman Damgası:** Analizin saat kaçta tetiklendiği ve nihai çıktının saat kaçta mühürlendiği (`startedAt ➔ completedAt` ör. `12:01 ➔ 12:05`).
     - **Girdi, Düşünce ve Nihai Çıktı Token Ayrımı:** Çıktı tokenlarında modelin düşünce süreci (`reasoningTokens` / Düşünce - CoT) ile ürettiği nihai yanıt tokenları (`finalTokens` / Nihai Çıktı) birbirinden kesinlikle ayrı gösterilmelidir:
       - Örnek format: `Girdi: 39.1k | Düşünce: 9.2k | Nihai: 11.2k`

2. **Veri ve Şema Bütünlüğü:**
   - `scripts/run-analysis.js` üretilen her JSON çıktısında (`latest-report.json` ve `src/data/archive/YYYY-MM-DD.json`) `activeModel`, `durationSeconds`, `startedAt`, `completedAt` ve `tokenUsage` (`promptTokens`, `completionTokens`, `reasoningTokens`, `finalTokens`, `totalTokens`) alanlarını eksiksiz üretmek ve kaydetmek zorundadır.
   - Sitedeki üst başlık rozetlerinde ve alt durum çubuğunda (status bar) bu veriler kullanıcıya anlık ve şeffaf bir şekilde yansıtılmalıdır.

3. **Gerçek Veri Zorunluluğu & Sabit/Uydurma Veri Yasağı:**
   - Geçmiş arşiv günlerinde veya telemetri verisinin henüz toplanmadığı tarihlerde, arayüzde KESİNLİKLE sabit/örnek/uydurma telemetri verisi (`39.1k`, `9.2k`, `267s`, `12:01 ➔ 12:05` vb.) gösterilemez.
   - Gerçek ölçüm yoksa ilgili rozet arayüzden tamamen gizlenir (`null`); yalnızca eldeki gerçek ve doğrulanmış ölçümler ekrana basılır.

4. **İki Aşamada Çift Çağrı Token Toplamı (Faz 1 + Faz 2):**
   - Sistem Faz 1 (Tüm analiz) ve Faz 2 (Sabah İstihbaratı sentezi) olmak üzere iki LLM çağrısı gerçekleştirdiğinden, raporlanan ve kaydedilen nihai token verisi (`tokenUsage`) her iki çağrının matematiksel olarak BİREBİR TOPLAMI (`Faz 1 + Faz 2`) olmak zorundadır.

5. **1. LLM ve 2. LLM Ayrı Telemetri Gösterimi (Üst Bar ve Alt Durum Çubuğu):**
   - Sitenin üst başlık çubuğunda ve alt durum çubuğunda yalnızca bileşik toplam değil; 1. LLM (Ana İstihbarat & Sıralama - `phase1TokenUsage`) ve 2. LLM (Sabah İstihbaratı Sentezi - `phase2TokenUsage`) çıktıları bağımsız rozetler halinde net ve şeffaf şekilde gösterilir (`1. LLM: G: Xk | D: Yk | N: Zk`, `2. LLM: G: Xk | D: Yk | N: Zk`, `∑ Toplam: Zk`).
   - Geçmiş arşiv günlerinde veya telemetrinin henüz ayrı toplanmadığı tarihlerde, arayüz otomatik olarak tekil token rozetine geri döner (sıfır uydurma veri ilkesi).

---

## 🌅 10. Sabah İstihbaratı ve Yönetici Özeti Sentez Mimarisi & Saf Reddit Ürün Sıralaması Şartı

1. **Yönetici Özeti'nin Bilgi Havuzu Dokunulmazlığı (Toplanan Tüm Ham Verilerden Çıkarım Şartı):**
   - **Eksik Bilgi Setiyle Çıkarım Yapma Yasağı:** Yönetici Özeti (`executiveSummary`), yalnızca sitedeki filtrelenmiş birkaç kartı değil; 50 seçkin Reddit topluluğundan toplanan tüm ham gönderileri, sıcak tartışmaları, donanım krizlerini, ArXiv makale havuzunu ve Hacker News mühendislik nabzını eksiksiz okuyarak hazırlanır.
   - Sitedeki daraltılmış son verileri okuyarak yönetici özeti hazırlamak bilgi kaybına ve ekosistemin büyük resminin kaçırılmasına yol açacağından; Yönetici Özeti doğrudan Faz 1'deki devasa veri setinden üretilir ve Faz 2 tarafından kesinlikle ezilemez veya daraltılamaz.

2. **Sabah İstihbaratı'nın İki Aşamalı Sentezi (Two-Phase Synthesis):**
   - Sabah İstihbaratı'nın Lider Kartı (`morningBrief.leader`) ve 4 Kilit Madde kutusu (`morningBrief.bullets`: 🚀 Model Savaşları, 🏢 Kurumsal & Pazar Dengesi, 💻 Yazılım & Otonom Ajanlar, ⚡ Yerel Zeka & Donanım), sitede listelenen nihai verilerle jilet gibi milimetrik tutarlı olması için Faz 2'de kesinleşmiş site çıktısını okuyarak sentezlenir.
   - Zirvedeki 1 numaralı lider kartı (`daily[0]`) ile Lider Kartı isim ve rozet olarak birebir eşitlenir.

3. **Saf Reddit Ürün Sıralaması Şartı (Pure Reddit Source Constraint):**
   - Sitedeki ana ürün tabloları (`daily`, `weekly`, `monthly`) YALNIZCA VE SADECE 50 seçkin Reddit topluluğunda bizzat konuşulan, tartışılan ve öne çıkan somut yapay zeka ürünlerinden oluşur.
   - Hugging Face, GitHub, ArXiv ve Hacker News verileri ana ürün sıralamasına ASLA sızamaz, puanları etkileyemez veya ürün tablosuna müdahale edemez; bu kaynaklar yalnızca kendi özel alt bölümlerinde ve Sabah İstihbaratı/Yönetici Özeti sentezinde değerlendirilir.
   - Ürün tablosundaki her ürünün `sources` dizisi istisnasız Reddit topluluklarından (örn. `["r/LocalLLaMA", "r/singularity"]`) oluşmak zorundadır.

4. **Sarı Kısım İkili Lider Kırılması (En Çok Konuşulan Model & En Beğenilen Model):**
   - Sabah İstihbaratı'nın sarı lider alanı, ekosistemin çift yönlü gerçeğini (Hype vs. Memnuniyet) şeffafça yansıtmak üzere yan yana **tam 2 model** içerir:
     - **🔥 En Çok Konuşulan Model (`mostDiscussed`):** Günün en yüksek konuşulma hacmine ve Hype Skoruna sahip modeli (`daily[0]`). Neden gündem olduğu, viral olaylar veya kriz/tartışma hacmi özetlenir.
     - **⭐ En Beğenilen Model (`mostLoved`):** Topluluğun en yüksek memnuniyet ve övgü oranına (`sentimentScore`) sahip modeli. Neden bu kadar beğenildiği, geliştirici deneyimi ve kullanıcı takdiri özetlenir.
   - Bu iki kart yan yana tam dengeli, eşit yükseklikte ve milimetrik olarak eşleşir. Geriye dönük uyumluluk için `morningBrief.leader` alanı `mostDiscussed` modeliyle senkronize tutulur.

5. **İki Aşamada Tek Model İlkesi (Unified Model Invariance):**
   - Faz 1 ve Faz 2 KESİNLİKLE BİREBİR AYNI MODEL ve sağlayıcı tarafından yürütülmelidir. Biri DeepSeek diğeri Gemini olamaz.
   - Faz 1'i hangi model başarıyla tamamladıysa, Faz 2 de tavizsiz olarak o modelle çalıştırılır. Model değişimi veya aşamalar arası çapraz model karmaşası KESİNLİKLE YASAKTIR.



