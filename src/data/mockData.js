export const SUBREDDITS_DATA = [
  // Vibe Coding & Editörler
  { name: "vibecoding", category: "Vibe Coding", desc: "Doğal dille kodlama, vibe mantığı ve akış pratikleri", status: "active", icon: "Code2" },
  { name: "CursorAI", category: "Vibe Coding", desc: "Cursor IDE, Composer, rule dosyaları ve eklentiler", status: "active", icon: "Sparkles" },
  { name: "windsurf", category: "Vibe Coding", desc: "Codeium Windsurf editörü ve Cascade akışları", status: "active", icon: "Compass" },
  { name: "ChatGPTCoding", category: "Vibe Coding", desc: "ChatGPT ile kod geliştirme ve otomasyon senaryoları", status: "active", icon: "Bot" },
  { name: "copilot", category: "Vibe Coding", desc: "GitHub Copilot Workspace ve Agent modları", status: "active", icon: "GitFork" },
  { name: "ClaudeAI", category: "Vibe Coding", desc: "Claude 3.7 Sonnet hibrit düşünme ve kodlama tartışmaları", status: "active", icon: "Brain" },
  { name: "ClaudeDev", category: "Vibe Coding", desc: "Cline (eski adıyla Claude Dev) VSCode otonom ajanı", status: "active", icon: "Terminal" },
  { name: "vscode", category: "Vibe Coding", desc: "VS Code açık kaynak ekosistemi ve AI uzantıları", status: "active", icon: "Laptop" },

  // Otonom Ajanlar & Framework'ler
  { name: "AI_Agents", category: "Otonom Ajanlar", desc: "Otonom ajan mimarileri, multi-agent sistemler", status: "active", icon: "Cpu" },
  { name: "CrewAI", category: "Otonom Ajanlar", desc: "CrewAI rol tabanlı çoklu ajan framework'ü", status: "active", icon: "Users" },
  { name: "LangChain", category: "Otonom Ajanlar", desc: "LangChain & LangGraph ajan orkestrasyonu", status: "active", icon: "Network" },
  { name: "AutoGPT", category: "Otonom Ajanlar", desc: "Otonom hedef odaklı ajan deneyleri", status: "active", icon: "Zap" },
  { name: "Automate", category: "Otonom Ajanlar", desc: "İş süreçleri ve operasyonel otomasyonlar", status: "active", icon: "Repeat" },
  { name: "n8n", category: "Otonom Ajanlar", desc: "Açık kaynak görsel iş akışı otomasyonu ve AI nodeları", status: "active", icon: "Workflow" },
  { name: "agenticai", category: "Otonom Ajanlar", desc: "Agentic AI kurumsal mimarileri ve karar sistemleri", status: "active", icon: "Layers" },

  // Büyük Dil Modelleri & Çekirdek
  { name: "OpenAI", category: "Temel LLM", desc: "OpenAI ekosistemi, GPT-4o, o3-mini ve sora", status: "active", icon: "Hexagon" },
  { name: "GoogleGemini", category: "Temel LLM", desc: "Gemini 2.5/3 modelleri, Google AI Studio, 2M token bağlamı", status: "active", icon: "Orbit" },
  { name: "DeepSeek", category: "Temel LLM", desc: "DeepSeek-V3 ve R1 açık akıl yürütme modelleri", status: "active", icon: "Flame" },
  { name: "Singularity", category: "Temel LLM", desc: "AGI tartışmaları, makro teknolojik sıçramalar", status: "active", icon: "Eye" },
  { name: "ArtificialInteligence", category: "Temel LLM", desc: "Genel yapay zeka endüstrisi ve pazar analizleri", status: "active", icon: "Globe" },
  { name: "MachineLearning", category: "Temel LLM", desc: "Akademik makaleler, mimari yenilikler ve ML mühendisliği", status: "active", icon: "Binary" },
  { name: "Anthropic", category: "Temel LLM", desc: "Anthropic şirket stratejisi, model hizalama ve güvenlik", status: "active", icon: "Shield" },

  // Açık Kaynak & Yerel Modeller
  { name: "LocalLLaMA", category: "Açık Kaynak", desc: "Yerel modeller (Llama, Mistral, Qwen), GPU optimizasyonu", status: "active", icon: "Server" },
  { name: "ollama", category: "Açık Kaynak", desc: "Ollama ile tek komutla yerel model çalıştırma", status: "active", icon: "Terminal" },
  { name: "vllm", category: "Açık Kaynak", desc: "Yüksek verimli LLM servis ve çıkarım motoru", status: "active", icon: "Gauge" },
  { name: "huggingface", category: "Açık Kaynak", desc: "Hugging Face model reposu, transformers ve datasetler", status: "active", icon: "Smile" },
  { name: "OpenSourceAI", category: "Açık Kaynak", desc: "Açık lisanslı ağırlıklar ve topluluk fine-tuning projeleri", status: "active", icon: "FolderGit2" },
  { name: "MistralAI", category: "Açık Kaynak", desc: "Mistral, Mixtral ve Codestral açık modelleri", status: "active", icon: "Wind" },
  { name: "selfhosted", category: "Açık Kaynak", desc: "Kendi donanımında barındırılan açık kaynak AI altyapıları", status: "active", icon: "HardDrive" },

  // Geliştirici & Prompt Mühendisliği
  { name: "LLMDevs", category: "Geliştirici", desc: "Production-ready LLM uygulamaları geliştirenler", status: "active", icon: "Laptop" },
  { name: "PromptEngineering", category: "Geliştirici", desc: "System prompt optimizasyonu ve reasoning teknikleri", status: "active", icon: "MessageSquareCode" },
  { name: "AI_Tools", category: "Geliştirici", desc: "Yeni çıkan yapay zeka araçları ve SaaS incelemeleri", status: "active", icon: "Wrench" },
  { name: "GenerativeAI", category: "Geliştirici", desc: "Üretken yapay zeka teknolojileri ve kullanım alanları", status: "active", icon: "Layers" },
  { name: "datascience", category: "Geliştirici", desc: "Veri bilimi ve makine öğrenmesi pratikleri", status: "active", icon: "BarChart3" },

  // Görsel & Video Üretimi
  { name: "ComfyUI", category: "Görsel & Medya", desc: "Node tabanlı ileri seviye Stable Diffusion / Flux iş akışları", status: "active", icon: "Palette" },
  { name: "StableDiffusion", category: "Görsel & Medya", desc: "Açık kaynak görsel üretimi, LoRA ve ControlNet", status: "active", icon: "Image" },
  { name: "Midjourney", category: "Görsel & Medya", desc: "Midjourney v6/v7 ve estetik prompt pratikleri", status: "active", icon: "Film" },
  { name: "Sora", category: "Görsel & Medya", desc: "OpenAI Sora video üretim modelleri ve fizik simülasyonu", status: "active", icon: "Video" },
  { name: "RunwayML", category: "Görsel & Medya", desc: "Gen-3 Alpha video üretimi ve görsel yönetmenlik", status: "active", icon: "Clapperboard" }
];

export const MOCK_TOOLS_DATA = {
  daily: [
    {
      id: "claude-3-7-sonnet",
      name: "Claude 3.7 Sonnet",
      category: "Temel LLM",
      badge: "Lider Model",
      hypeScore: 9.8,
      prevScore: 8.9,
      scoreDelta: +0.9,
      trend: "skyrocketing",
      mentions: 1240,
      sparkline: [8.1, 8.4, 8.7, 8.9, 9.2, 9.5, 9.8],
      primaryFunction: "Hibrit Düşünme (Standart Hız + Derin Akıl Yürütme) ve Üst Düzey Kod Yazımı",
      whyTrending: "Hibrit düşünme (thinking budget) modu geliştiriciler arasında fırtına kopardı; kod yazarken hata oranı en düşük model seçildi.",
      sources: ["r/ClaudeAI", "r/vibecoding", "r/CursorAI", "r/LocalLLaMA"]
    },
    {
      id: "cursor-composer",
      name: "Cursor (Agent Mode)",
      category: "Vibe Coding",
      badge: "Vibe Standardı",
      hypeScore: 9.6,
      prevScore: 9.2,
      scoreDelta: +0.4,
      trend: "rising",
      mentions: 980,
      sparkline: [8.8, 8.9, 9.0, 9.2, 9.3, 9.4, 9.6],
      primaryFunction: "Çok Dosyalı Otonom Kod Düzenleme ve Terminal Yetkili Editör",
      whyTrending: "Son güncelleme ile terminal komutlarını kendi kendine çalıştırıp hataları otomatik düzelten Agent modu övülüyor.",
      sources: ["r/CursorAI", "r/vibecoding", "r/LLMDevs"]
    },
    {
      id: "deepseek-r1",
      name: "DeepSeek-R1 / V3",
      category: "Açık Kaynak",
      badge: "Açık Standart",
      hypeScore: 9.5,
      prevScore: 9.5,
      scoreDelta: 0.0,
      trend: "stable",
      mentions: 890,
      sparkline: [9.6, 9.6, 9.5, 9.5, 9.5, 9.5, 9.5],
      primaryFunction: "Açık Ağırlıklı Reasoning (Akıl Yürütme) Modeli ve Düşük Çıkarım Maliyeti",
      whyTrending: "Yerel Ollama kurulumları ve kurumsal API entegrasyonlarında maliyet/performans kralı olmaya devam ediyor.",
      sources: ["r/LocalLLaMA", "r/ollama", "r/Singularity", "r/MachineLearning"]
    },
    {
      id: "windsurf-cascade",
      name: "Windsurf Cascade",
      category: "Vibe Coding",
      badge: "Hızlı Tırmanan",
      hypeScore: 9.1,
      prevScore: 8.3,
      scoreDelta: +0.8,
      trend: "skyrocketing",
      mentions: 670,
      sparkline: [7.2, 7.5, 7.8, 8.0, 8.3, 8.7, 9.1],
      primaryFunction: "Bağlam Farkındalıklı Akış (Cascade Flow) ve Canlı Önizleme Editörü",
      whyTrending: "Cursor'a güçlü bir rakip olarak 'Cascade' akışı ve daha az token tüketimiyle geliştirici topluluklarında viral oldu.",
      sources: ["r/windsurf", "r/vibecoding", "r/ChatGPTCoding"]
    },
    {
      id: "gemini-2-5-pro",
      name: "Google Gemini 2.5 Pro",
      category: "Temel LLM",
      badge: "2M Token",
      hypeScore: 8.9,
      prevScore: 8.5,
      scoreDelta: +0.4,
      trend: "rising",
      mentions: 590,
      sparkline: [8.0, 8.1, 8.3, 8.4, 8.5, 8.7, 8.9],
      primaryFunction: "2 Milyon Token Devasa Bağlam Penceresi ve Multimodal Kod Analizi",
      whyTrending: "Tüm codebase'i tek promptta okuyup mimari refactoring yapabilmesi geliştiricilerin favorisi.",
      sources: ["r/GoogleGemini", "r/LLMDevs", "r/ArtificialInteligence"]
    },
    {
      id: "crewai-v1",
      name: "CrewAI Multi-Agent",
      category: "Otonom Ajanlar",
      badge: "Ajan Ekibi",
      hypeScore: 8.7,
      prevScore: 8.2,
      scoreDelta: +0.5,
      trend: "rising",
      mentions: 480,
      sparkline: [7.5, 7.7, 7.9, 8.0, 8.2, 8.4, 8.7],
      primaryFunction: "Rol ve Görev Tanımlı Otomasyon ve Otonom Ekip İş Akışları",
      whyTrending: "Finansal analiz ve pazar araştırması yapan otonom multi-agent ekipleri kurmak isteyen profesyoneller arasında popülerleşti.",
      sources: ["r/AI_Agents", "r/CrewAI", "r/Automate"]
    },
    {
      id: "cline-claude-dev",
      name: "Cline (Claude Dev)",
      category: "Vibe Coding",
      badge: "Açık Kaynak IDE",
      hypeScore: 8.6,
      prevScore: 7.9,
      scoreDelta: +0.7,
      trend: "skyrocketing",
      mentions: 430,
      sparkline: [7.1, 7.4, 7.7, 8.0, 8.1, 8.4, 8.6],
      primaryFunction: "VS Code İçinde Kendi Terminalini Yöneten Açık Kaynak Otonom Ajan",
      whyTrending: "Kendi API anahtarını kullanıp Cursor'a aylık abonelik ödemek istemeyen geliştiricilerin 1 numaralı tercihi.",
      sources: ["r/ClaudeDev", "r/vscode", "r/vibecoding"]
    },
    {
      id: "comfyui-flux",
      name: "ComfyUI + Flux.1",
      category: "Görsel & Medya",
      badge: "Düğüm Tabanlı",
      hypeScore: 8.4,
      prevScore: 8.6,
      scoreDelta: -0.2,
      trend: "stable",
      mentions: 390,
      sparkline: [8.6, 8.7, 8.6, 8.5, 8.5, 8.4, 8.4],
      primaryFunction: "Düğüm Tabanlı (Node-Based) Kontrollü İleri Seviye Görsel Üretimi",
      whyTrending: "LoRA entegrasyonu ve kurumsal görsel üretim pipeline'larında standart araç haline geldi.",
      sources: ["r/ComfyUI", "r/StableDiffusion"]
    },
    {
      id: "ollama-vllm",
      name: "Ollama & vLLM",
      category: "Açık Kaynak",
      badge: "Yerel Çıkarım",
      hypeScore: 8.3,
      prevScore: 8.2,
      scoreDelta: +0.1,
      trend: "stable",
      mentions: 360,
      sparkline: [7.9, 8.0, 8.0, 8.1, 8.1, 8.2, 8.3],
      primaryFunction: "Yerel Cihazda veya Şirket İçi Sunucuda Tek Komutla LLM Dağıtımı",
      whyTrending: "Veri gizliliğine önem veren kurumsal ekiplerin yerel modelleri offline çalıştırma standardı.",
      sources: ["r/LocalLLaMA", "r/ollama", "r/vllm"]
    },
    {
      id: "langgraph-core",
      name: "LangGraph",
      category: "Otonom Ajanlar",
      badge: "Döngüsel Ajan",
      hypeScore: 8.2,
      prevScore: 7.7,
      scoreDelta: +0.5,
      trend: "rising",
      mentions: 340,
      sparkline: [7.2, 7.4, 7.6, 7.8, 7.9, 8.0, 8.2],
      primaryFunction: "Grafik Tabanlı Döngüsel State Yönetimi ve Dayanıklı Ajan Orkestrasyonu",
      whyTrending: "Lineer zincirler yerine hata toleranslı döngüsel karar yapıları kurmak isteyen kurumsal ekiplerin tercihi.",
      sources: ["r/LangChain", "r/AI_Agents", "r/agenticai"]
    },
    {
      id: "n8n-ai-workflows",
      name: "n8n AI Workflows",
      category: "Otonom Ajanlar",
      badge: "No-Code Ajan",
      hypeScore: 8.1,
      prevScore: 7.5,
      scoreDelta: +0.6,
      trend: "rising",
      mentions: 310,
      sparkline: [7.0, 7.2, 7.4, 7.6, 7.8, 8.0, 8.1],
      primaryFunction: "Görsel Düğüm Editörü ile LLM'leri Slack, CRM ve E-postalara Bağlama",
      whyTrending: "Kod yazmadan kurumsal süreçleri yapay zekayla otomatize etmek isteyen operasyon liderleri arasında patladı.",
      sources: ["r/n8n", "r/Automate", "r/AI_Tools"]
    },
    {
      id: "qwen-2-5-coder",
      name: "Qwen 2.5 Coder (32B)",
      category: "Açık Kaynak",
      badge: "Yerel Kodlama",
      hypeScore: 8.0,
      prevScore: 7.8,
      scoreDelta: +0.2,
      trend: "stable",
      mentions: 290,
      sparkline: [7.6, 7.7, 7.7, 7.8, 7.9, 7.9, 8.0],
      primaryFunction: "Tüketici Düzeyi GPU'larda Çalışabilen Açık Ağırlıklı Kodlama Canavarı",
      whyTrending: "M3/M4 Mac'lerde ve 24GB VRAM kartlarda GPT-4 kalitesine en yakın açık kodlama modeli.",
      sources: ["r/LocalLLaMA", "r/Qwen", "r/ollama"]
    },
    {
      id: "v0-bolt-new",
      name: "v0.dev & Bolt.new",
      category: "Vibe Coding",
      badge: "UI Üretimi",
      hypeScore: 7.9,
      prevScore: 7.6,
      scoreDelta: +0.3,
      trend: "rising",
      mentions: 270,
      sparkline: [7.1, 7.3, 7.4, 7.5, 7.6, 7.7, 7.9],
      primaryFunction: "Doğal Dil Komutlarıyla Anında Fullstack Web Uygulaması ve UI İnşası",
      whyTrending: "Fikir aşamasındaki SaaS projelerinin ilk prototipini 10 dakikada ayağa kaldırma hızı.",
      sources: ["r/vibecoding", "r/ChatGPTCoding", "r/AI_Tools"]
    },
    {
      id: "pydantic-ai",
      name: "PydanticAI",
      category: "Geliştirici",
      badge: "Tip Güvenliği",
      hypeScore: 7.8,
      prevScore: 7.1,
      scoreDelta: +0.7,
      trend: "skyrocketing",
      mentions: 250,
      sparkline: [6.8, 7.0, 7.1, 7.3, 7.5, 7.6, 7.8],
      primaryFunction: "Python Pydantic Ekibi Tarafından Geliştirilen Tip Güvenli Model Framework'ü",
      whyTrending: "LangChain'in karmaşıklığından kaçan Python geliştiricilerinin minimalist yeni gözdesi.",
      sources: ["r/LLMDevs", "r/PromptEngineering"]
    },
    {
      id: "wan-video-2-1",
      name: "Wan 2.1 Video",
      category: "Görsel & Medya",
      badge: "Açık Video",
      hypeScore: 7.7,
      prevScore: 6.9,
      scoreDelta: +0.8,
      trend: "skyrocketing",
      mentions: 230,
      sparkline: [6.2, 6.5, 6.7, 7.0, 7.2, 7.5, 7.7],
      primaryFunction: "Açık Kaynaklı Yüksek Kaliteli Metinden ve Görselden Video Üretimi",
      whyTrending: "ComfyUI entegrasyonuyla yerel bilgisayarlarda çalışan en yetenekli açık video modeli.",
      sources: ["r/ComfyUI", "r/ArtificialInteligence", "r/StableDiffusion"]
    }
  ],

  weekly: [
    {
      id: "claude-3-7-sonnet",
      name: "Claude 3.7 Sonnet",
      category: "Temel LLM",
      badge: "Haftalık Şampiyon",
      hypeScore: 9.7,
      prevScore: 8.2,
      scoreDelta: +1.5,
      trend: "skyrocketing",
      mentions: 5400,
      sparkline: [7.5, 7.8, 8.2, 8.6, 9.1, 9.5, 9.7],
      primaryFunction: "Hibrit Akıl Yürütme ve Karmaşık Kod Mimarisi Çözümleri",
      whyTrending: "Hafta boyunca tüm subredditlerde OpenAI modelleriyle kıyaslandı ve kodlama benchmark'larında %85 oranında üstün çıktı.",
      sources: ["r/ClaudeAI", "r/vibecoding", "r/CursorAI", "r/MachineLearning"]
    },
    {
      id: "cursor-composer",
      name: "Cursor (Agent Mode)",
      category: "Vibe Coding",
      badge: "Vibe Standardı",
      hypeScore: 9.5,
      prevScore: 8.8,
      scoreDelta: +0.7,
      trend: "rising",
      mentions: 4800,
      sparkline: [8.5, 8.7, 8.8, 9.0, 9.2, 9.4, 9.5],
      primaryFunction: "Gelişmiş IDE İçi Ajan ve Doğal Dille Tam Uygulama İnşası",
      whyTrending: "Vibe coding akımının fiili editörü olarak kabul görüyor; kıdemli mühendislerden ürün yöneticilerine herkes benimsedi.",
      sources: ["r/vibecoding", "r/CursorAI", "r/ChatGPTCoding"]
    },
    {
      id: "deepseek-r1",
      name: "DeepSeek-R1 / V3",
      category: "Açık Kaynak",
      badge: "Sarsılmaz Güç",
      hypeScore: 9.4,
      prevScore: 9.6,
      scoreDelta: -0.2,
      trend: "stable",
      mentions: 4500,
      sparkline: [9.7, 9.6, 9.6, 9.5, 9.5, 9.4, 9.4],
      primaryFunction: "Açık Ağırlıklı Akıl Yürütme ve Düşük Bütçeli API",
      whyTrending: "Lansman fırtınası yerini stabil üretim sistemlerine entegrasyon ve yerel barındırma tartışmalarına bıraktı.",
      sources: ["r/LocalLLaMA", "r/Singularity", "r/huggingface"]
    },
    {
      id: "windsurf-cascade",
      name: "Windsurf Editör",
      category: "Vibe Coding",
      badge: "Yükselen Yıldız",
      hypeScore: 9.0,
      prevScore: 7.6,
      scoreDelta: +1.4,
      trend: "skyrocketing",
      mentions: 3200,
      sparkline: [6.8, 7.1, 7.5, 7.9, 8.3, 8.7, 9.0],
      primaryFunction: "Codeium Destekli Akıllı IDE ve Cascade İş Akışı",
      whyTrending: "Cursor'un token limitlerinden ve kota maliyetlerinden sıkılan geliştiricilerin haftalık göç adresi oldu.",
      sources: ["r/windsurf", "r/vibecoding", "r/ChatGPTCoding"]
    },
    {
      id: "gemini-2-5-pro",
      name: "Google Gemini 2.5 Pro",
      category: "Temel LLM",
      badge: "Bağlam Devi",
      hypeScore: 8.8,
      prevScore: 8.2,
      scoreDelta: +0.6,
      trend: "rising",
      mentions: 2700,
      sparkline: [7.8, 8.0, 8.1, 8.3, 8.4, 8.6, 8.8],
      primaryFunction: "Büyük Kod Tabanları ve Video/Ses Multimodal Analiz",
      whyTrending: "2M token penceresiyle tüm kütüphane dokümanlarını tek seferde yutması öne çıkıyor.",
      sources: ["r/GoogleGemini", "r/LLMDevs"]
    },
    {
      id: "crewai-v1",
      name: "CrewAI & LangGraph",
      category: "Otonom Ajanlar",
      badge: "Ajan Ekosistemi",
      hypeScore: 8.6,
      prevScore: 8.0,
      scoreDelta: +0.6,
      trend: "rising",
      mentions: 2300,
      sparkline: [7.6, 7.8, 8.0, 8.1, 8.3, 8.4, 8.6],
      primaryFunction: "Rol ve Görev Tanımlı Otomasyon ve Döngüsel Çoklu Ajanlar",
      whyTrending: "Tekil promptlardan çoklu ajan sistemlerine geçiş bu hafta kurumsal raporların ana konusuydu.",
      sources: ["r/AI_Agents", "r/CrewAI", "r/LangChain"]
    }
  ],

  monthly: [
    {
      id: "claude-3-7-sonnet",
      name: "Claude 3.7 Sonnet / 3.5",
      category: "Temel LLM",
      badge: "Ayın Şampiyonu",
      hypeScore: 9.7,
      prevScore: 8.1,
      scoreDelta: +1.6,
      trend: "skyrocketing",
      mentions: 22000,
      sparkline: [7.2, 7.6, 8.1, 8.6, 9.0, 9.4, 9.7],
      primaryFunction: "Kodlama, Mantık Yürütme ve Geliştirici Altyapısı",
      whyTrending: "Son 30 günde yazılımcı topluluklarında en çok tavsiye edilen ve vazgeçilmez model oldu.",
      sources: ["r/ClaudeAI", "r/vibecoding", "r/CursorAI"]
    },
    {
      id: "cursor-composer",
      name: "Cursor AI",
      category: "Vibe Coding",
      badge: "Dönüm Noktası",
      hypeScore: 9.5,
      prevScore: 8.4,
      scoreDelta: +1.1,
      trend: "rising",
      mentions: 19500,
      sparkline: [7.9, 8.1, 8.4, 8.8, 9.1, 9.3, 9.5],
      primaryFunction: "Yapay Zeka Destekli Yeni Nesil Kod Editörü",
      whyTrending: "Vibe coding terimini ana akım haline getirdi; hem acemiler hem de kıdemli mühendisler benimsedi.",
      sources: ["r/CursorAI", "r/vibecoding"]
    },
    {
      id: "deepseek-r1",
      name: "DeepSeek Ekolü (V3/R1)",
      category: "Açık Kaynak",
      badge: "Küresel Etki",
      hypeScore: 9.4,
      prevScore: 7.3,
      scoreDelta: +2.1,
      trend: "skyrocketing",
      mentions: 24000,
      sparkline: [6.5, 7.2, 8.4, 9.6, 9.5, 9.4, 9.4],
      primaryFunction: "Ekonomik Çıkarım, Açık Ağırlık ve Akıl Yürütme",
      whyTrending: "Yapay zeka modellerinin eğitim ve çalışma maliyetlerini radikal biçimde düşürerek pazar dinamiklerini sarstı.",
      sources: ["r/LocalLLaMA", "r/MachineLearning", "r/Singularity"]
    },
    {
      id: "windsurf-cascade",
      name: "Windsurf Editör",
      category: "Vibe Coding",
      badge: "En Hızlı Büyüyen",
      hypeScore: 8.9,
      prevScore: 7.0,
      scoreDelta: +1.9,
      trend: "skyrocketing",
      mentions: 12000,
      sparkline: [6.0, 6.5, 7.0, 7.6, 8.1, 8.5, 8.9],
      primaryFunction: "Bütüncül Akış Tabanlı Kodlama ve Cascade Ajanı",
      whyTrending: "Son 30 günde en yüksek kullanıcı büyüme oranını yakalayan kodlama asistanı editörü.",
      sources: ["r/windsurf", "r/ChatGPTCoding"]
    }
  ]
};

export const TREND_TIMELINE_SERIES = {
  days: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
  models: [
    { name: "Claude 3.7 Sonnet", color: "#d97706", data: [8.2, 8.5, 8.9, 9.2, 9.5, 9.7, 9.8] },
    { name: "Cursor Agent", color: "#107c41", data: [8.8, 8.9, 9.1, 9.2, 9.4, 9.5, 9.6] },
    { name: "DeepSeek-R1", color: "#0284c7", data: [9.6, 9.5, 9.5, 9.5, 9.5, 9.5, 9.5] },
    { name: "Windsurf Cascade", color: "#059669", data: [7.2, 7.6, 7.9, 8.2, 8.6, 8.9, 9.1] },
    { name: "Gemini 2.5 Pro", color: "#7c3aed", data: [8.0, 8.1, 8.3, 8.5, 8.6, 8.7, 8.9] }
  ]
};

export const LATEST_CONSULTANT_REPORT = {
  id: "rep-live",
  title: "Reddit AI Danışman Bülteni - Günlük Sinyal Raporu",
  date: "4 Eylül 2026",
  activeModel: "gemini-2.5-flash",
  stats: {
    totalSubreddits: 43,
    successfulSubreddits: 43,
    durationSeconds: 63,
    totalPostsAnalyzed: 240,
    avgHypeIndex: 8.85
  },
  executiveSummary: "Bu hafta yapay zeka ekosisteminde iki devrimsel dalga çarpışıyor: Claude 3.7 Sonnet'in 'hibrit düşünme' kabiliyeti ile kod kalitesinde çıtayı arşa çıkarması ve Cursor/Windsurf üzerinden yürütülen 'Vibe Coding' felsefesinin geleneksel yazılım geliştirme metodolojilerini kökten değiştirmesi. Açık kaynak cephesinde ise DeepSeek-R1 ve Qwen 2.5 Coder, yerel donanımda kapalı API seviyesinde performans sunarak kurumsal veri mahremiyeti sağlayan şirketlerin bir numaralı tercihi haline geldi.",
  sections: [
    {
      title: "BÖLÜM 1: 🛠️ MODEL SIRALAMALARI VE YAPAY ZEKA ARAÇLARI DASHBOARD'U",
      badge: "Liderlik Tablosu",
      contentHtml: `
        <p class="mb-3 text-slate-700 dark:text-slate-300">
          Son 24 saatlik ve haftalık Reddit tartışmalarında 43 topluluktan derlenen öne çıkan modeller ve hype dağılımı:
        </p>
        <ul class="space-y-2 text-slate-700 dark:text-slate-300">
          <li><strong>Claude 3.7 Sonnet (Skor: 9.8/10):</strong> Özellikle karmaşık mimari refactoring ve sıfır hata kod üretiminde tartışmasız sektör lideri. Thinking budget parametresiyle geliştiriciye düşünme süresini kontrol etme imkanı tanıması büyük övgü topladı.</li>
          <li><strong>Cursor Composer & Agent Mode (Skor: 9.6/10):</strong> Kendi terminalini yönetebilme, linter/derleme hatalarını terminalden okuyup otomatik düzeltme yeteneği ile vibe coding'in fiili işletim sistemi.</li>
          <li><strong>DeepSeek-R1 / V3 (Skor: 9.5/10):</strong> Açık ağırlıklı modellerde çıkarım maliyeti avantajı ve akıl yürütme kalitesiyle yerel kurulumlarda rakipsizliğini koruyor.</li>
          <li><strong>Windsurf Cascade (Skor: 9.1/10):</strong> Cursor'a karşı en güçlü meydan okuyucu; çok dosyalı bağlam yönetimi ve daha verimli token harcamasıyla hızla yayılıyor.</li>
          <li><strong>Google Gemini 2.5 Pro (Skor: 8.9/10):</strong> 2M devasa bağlam kapasitesi sayesinde 50.000 satırlık dev codebase'leri tek promptta hazmedebilen tek model.</li>
        </ul>
      `
    },
    {
      title: "BÖLÜM 2: 💡 DERİN TEKNİK İÇGÖRÜLER, MODELLER & VIBE CODING",
      badge: "Kodlama Devrimi",
      contentHtml: `
        <p class="mb-3 text-slate-700 dark:text-slate-300">
          Geliştirici topluluklarında <strong>"Vibe Coding"</strong> artık bir heves değil, kurumsal bir yazılım metodolojisine dönüştü. Öne çıkan kritik teknik pratikler:
        </p>
        <ul class="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
          <li><strong>.cursorrules ve AGENTS.md Standartlaşması:</strong> Geliştiriciler projelerine özel kuralları (TypeScript katı kuralları, Tailwind yönergeleri, mimari desenler) repo köküne koyarak ajanın her promptta aynı disiplinle kod yazmasını sağlıyor.</li>
          <li><strong>Terminal Yetkili Ajanlar (Cline & Cursor Agent):</strong> Ajanın yalnızca kod üretmesi değil; <code>npm run build</code>, test koşma ve linter hatalarını kendi kendine fix etmesi geliştirme hızını 5-10 katına çıkarıyor.</li>
          <li><strong>PydanticAI & Minimalist Framework'ler:</strong> LangChain'in getirdiği aşırı soyutlamadan kaçınan mühendisler, Python tip güvenliğini merkeze alan PydanticAI ve yerel Ollama servislerini tercih ediyor.</li>
        </ul>
      `
    },
    {
      title: "BÖLÜM 3: 📉 MAKRO SEKTÖR TRENDLERİ VE REKABET DENGESİ",
      badge: "Pazar Dengesi",
      contentHtml: `
        <p class="mb-3 text-slate-700 dark:text-slate-300">
          Yapay zeka devleri arasındaki güç savaşında yeni eksenler oluşuyor:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 my-3">
          <div class="p-3 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">
            <h4 class="font-bold text-slate-900 dark:text-white text-xs uppercase mb-1 text-amber-700 dark:text-amber-400">Anthropic vs OpenAI Savaşları</h4>
            <p class="text-xs text-slate-600 dark:text-slate-300">Claude 3.7 ile geliştiricilerin kalbini kazanan Anthropic, kodlama pazarında OpenAI'nin o3-mini ve GPT-4o hamlesine karşı liderliği açık ara ele geçirdi.</p>
          </div>
          <div class="p-3 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700">
            <h4 class="font-bold text-slate-900 dark:text-white text-xs uppercase mb-1 text-emerald-700 dark:text-emerald-400">Açık Kaynak Baskısı (DeepSeek & Qwen)</h4>
            <p class="text-xs text-slate-600 dark:text-slate-300">Kapalı API sağlayıcıları fiyat kırmaya zorlanıyor. Şirketler hassas verilerini korumak için Ollama/vLLM üzerinde yerel açık modelleri hızla yaygınlaştırıyor.</p>
          </div>
        </div>
      `
    },
    {
      title: "BÖLÜM 4: 💼 BEYAZ YAKA ENTEGRASYON VE OPERASYON REHBERİ",
      badge: "İş Dünyası Rehberi",
      contentHtml: `
        <div class="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-700/50 rounded text-slate-800 dark:text-slate-200 text-xs sm:text-sm space-y-3">
          <p class="font-bold text-emerald-900 dark:text-emerald-300 text-sm">
            Teknik altyapısı olmayan bir iş profesyoneli bu haftaki gelişmelerden ne çıkarmalı?
          </p>
          <ol class="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300">
            <li><strong>Tek Sayfalık İç Otomasyon Araçları:</strong> Artık yazılım ekibine bekleme listesi vermenize gerek yok. Cursor veya Windsurf kullanarak departmanınızın Excel raporlarını görselleştiren dahili web araçlarını doğal dille 2 saatte kurabilirsiniz.</li>
            <li><strong>Görsel Süreç Otomasyonu (n8n + AI):</strong> n8n gibi araçlarla; gelen müşteri e-postalarını okuyan, sınıflandıran, CRM'e işleyen ve otomatik teklif hazırlayan otonom iş akışlarını sıfır kodla canlıya alabilirsiniz.</li>
            <li><strong>Büyük Doküman & Sözleşme İncelemesi:</strong> Gemini 2.5'in devasa 2M bağlam kapasitesi sayesinde 500 sayfalık ihale şartnamesi veya şirket politikasını tek seferde yükleyip 'Riskli maddeleri Excel tablosu halinde çıkar' komutuyla saatler süren işleri dakikalara indirebilirsiniz.</li>
          </ol>
        </div>
      `
    }
  ]
};

export const ARCHIVE_REPORTS = [
  {
    id: "rep-2026-09-04",
    title: "Claude 3.7 Sonnet Hibrit Mod Patlaması ve Vibe Coding Zirvesi",
    date: "4 Eylül 2026",
    activeModel: "gemini-2.5-flash",
    avgHype: "8.85/10",
    topTool: "Claude 3.7 Sonnet",
    subredditsCount: 43
  },
  {
    id: "rep-2026-09-03",
    title: "Cursor Agentic Mode ve Otonom Terminal Entegrasyonları",
    date: "3 Eylül 2026",
    activeModel: "gemini-2.5-flash",
    avgHype: "8.70/10",
    topTool: "Cursor (Agent Mode)",
    subredditsCount: 40
  },
  {
    id: "rep-2026-09-02",
    title: "DeepSeek-R1 Açık Kaynak Çıkarım Maliyeti Devrimi",
    date: "2 Eylül 2026",
    activeModel: "gemini-2.5-flash",
    avgHype: "9.10/10",
    topTool: "DeepSeek-R1",
    subredditsCount: 38
  },
  {
    id: "rep-2026-09-01",
    title: "Windsurf Cascade Akışı ve Çok Dosyalı Bağlam Yönetimi",
    date: "1 Eylül 2026",
    activeModel: "gemini-2.5-flash",
    avgHype: "8.50/10",
    topTool: "Windsurf Cascade",
    subredditsCount: 38
  },
  {
    id: "rep-2026-08-31",
    title: "Haftalık Makro Özet: Kapalı API'ler vs Yerel Modellerin Yükselişi",
    date: "31 Ağustos 2026",
    activeModel: "gemini-2.5-flash",
    avgHype: "8.65/10",
    topTool: "Claude 3.5 / 3.7 Sonnet",
    subredditsCount: 35
  }
];
