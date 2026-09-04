export const CATEGORY_DEFINITIONS = [
  { id: "all", label: "Tümü", badgeColor: "bg-slate-800 text-slate-300 border-slate-700" },
  { id: "LLM (Model)", label: "LLM (Model)", desc: "Büyük dil ve akıl yürütme modelleri", badgeColor: "bg-amber-950/60 text-amber-300 border-amber-600/40" },
  { id: "Yerel Model", label: "Yerel Model", desc: "Açık ağırlıklı, yerel cihazda çalışabilen modeller (DeepSeek, Llama, Qwen)", badgeColor: "bg-teal-950/60 text-teal-300 border-teal-600/40" },
  { id: "IDE / Editör", label: "IDE / Editör", desc: "Yeni nesil AI kod editörleri ve çalışma ortamları", badgeColor: "bg-blue-950/60 text-blue-300 border-blue-600/40" },
  { id: "CLI / Terminal", label: "CLI / Terminal", desc: "Komut satırı ve terminalde çalışan otonom kodlama ajanları", badgeColor: "bg-emerald-950/60 text-emerald-300 border-emerald-600/40" },
  { id: "Otonom Agent", label: "Otonom Agent", desc: "Rol ve hedef odaklı çoklu ajan framework'leri", badgeColor: "bg-purple-950/60 text-purple-300 border-purple-600/40" },
  { id: "Otomasyon", label: "Otomasyon", desc: "İş süreçleri ve görsel API otomasyon araçları", badgeColor: "bg-cyan-950/60 text-cyan-300 border-cyan-600/40" },
  { id: "Altyapı & SDK", label: "Altyapı & SDK", desc: "Yerel model sunucuları, kütüphaneler ve geliştirici SDK'ları", badgeColor: "bg-slate-800 text-slate-200 border-slate-600" },
  { id: "Bulut & Platform", label: "Bulut & Platform", desc: "Model test/playground, bulut GPU ve kurumsal dağıtım (Google AI Studio, Colab, Vertex AI, RunPod, AWS Bedrock)", badgeColor: "bg-sky-950/60 text-sky-300 border-sky-600/40" },
  { id: "Medya / Üretim", label: "Medya / Üretim", desc: "Görsel, ses ve video üretim modelleri/araçları", badgeColor: "bg-rose-950/60 text-rose-300 border-rose-600/40" },
  { id: "Şirket / Lab", label: "Şirket / Lab", desc: "Yapay zeka araştırma laboratuvarları ve ekosistem liderleri", badgeColor: "bg-orange-950/60 text-orange-300 border-orange-600/40" }
];

export const MOCK_TOOLS_DATA = {
  twelveHours: [
    {
      id: "gpt-6-astra",
      name: "GPT-6 Astra",
      category: "LLM (Model)",
      badge: "12s Patlaması",
      hypeScore: 9.9,
      prevScore: 9.1,
      scoreDelta: +0.8,
      trend: "skyrocketing",
      mentions: 1420,
      sparkline: [8.5, 8.8, 9.0, 9.2, 9.5, 9.8, 9.9],
      primaryFunction: "Uç seviye akıl yürütme, LEAN tabanlı matematik ispatı ve çoklu ajanlı otonom simülasyon üretimi",
      whyTrending: "Son 12 saatte FrontierMath Erdős benchmark'ında rekor kırmasıyla küresel AI topluluklarında bir numaraya yerleşti.",
      sources: ["r/singularity", "r/OpenAI", "r/ArtificialInteligence"]
    },
    {
      id: "amd-threadripper-halo",
      name: "AMD Threadripper Halo Station (MI350P)",
      category: "Şirket / Lab",
      badge: "Donanım Çıkışı",
      hypeScore: 9.2,
      prevScore: 8.2,
      scoreDelta: +1.0,
      trend: "skyrocketing",
      mentions: 650,
      sparkline: [7.5, 7.8, 8.0, 8.3, 8.6, 8.9, 9.2],
      primaryFunction: "96 çekirdek CPU, 576GB GPU belleği ve 2TB sistem belleği ile ultra büyük model yerel çıkarımı ve fine-tuning",
      whyTrending: "Son 12 saatte bağımsız donanım kanallarında yerel model çıkarım rekorları kırmasıyla donanım subredditlerini salladı.",
      sources: ["r/hardware", "r/AMD_Stock"]
    },
    {
      id: "claude-3-7-sonnet",
      name: "Claude 3.7 Sonnet",
      category: "LLM (Model)",
      badge: "Lider Model",
      hypeScore: 9.8,
      prevScore: 9.0,
      scoreDelta: +0.8,
      trend: "skyrocketing",
      mentions: 1240,
      sparkline: [8.1, 8.4, 8.7, 8.9, 9.2, 9.5, 9.8],
      primaryFunction: "Hibrit Düşünme (Standart Hız + Derin Akıl Yürütme) ve Üst Düzey Kod Yazımı",
      whyTrending: "Hibrit düşünme modu geliştiriciler arasında son 12 saatte en yüksek skorlu kod modeli seçildi.",
      sources: ["r/ClaudeAI", "r/vibecoding", "r/CursorAI"]
    }
  ],
  daily: [
    {
      id: "claude-3-7-sonnet",
      name: "Claude 3.7 Sonnet",
      category: "LLM (Model)",
      badge: "Lider Model",
      hypeScore: 9.8,
      prevScore: 8.9,
      scoreDelta: +0.9,
      trend: "skyrocketing",
      mentions: 1240,
      sparkline: [8.1, 8.4, 8.7, 8.9, 9.2, 9.5, 9.8],
      primaryFunction: "Hibrit Düşünme (Standart Hız + Derin Akıl Yürütme) ve Üst Düzey Kod Yazımı",
      whyTrending: "Hibrit düşünme (thinking budget) modu geliştiriciler arasında fırtına kopardı; kod yazarken hata oranı en düşük model seçildi.",
      sources: ["r/ClaudeAI", "r/vibecoding", "r/CursorAI"]
    },
    {
      id: "cursor-composer",
      name: "Cursor (Agent Mode)",
      category: "IDE / Editör",
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
      category: "Yerel Model",
      badge: "Açık Standart",
      hypeScore: 9.5,
      prevScore: 9.5,
      scoreDelta: 0.0,
      trend: "stable",
      mentions: 890,
      sparkline: [9.6, 9.6, 9.5, 9.5, 9.5, 9.5, 9.5],
      primaryFunction: "Açık Ağırlıklı Reasoning (Akıl Yürütme) Modeli ve Düşük Çıkarım Maliyeti",
      whyTrending: "Yerel Ollama kurulumları ve kurumsal API entegrasyonlarında maliyet/performans kralı olmaya devam ediyor.",
      sources: ["r/LocalLLaMA", "r/ollama", "r/Singularity"]
    },
    {
      id: "windsurf-cascade",
      name: "Windsurf Cascade",
      category: "IDE / Editör",
      badge: "Hızlı Tırmanan",
      hypeScore: 9.1,
      prevScore: 8.3,
      scoreDelta: +0.8,
      trend: "skyrocketing",
      mentions: 670,
      sparkline: [7.2, 7.5, 7.8, 8.0, 8.3, 8.7, 9.1],
      primaryFunction: "Bağlam Farkındalıklı Akış (Cascade Flow) ve Canlı Önizleme Editörü",
      whyTrending: "Cursor'a güçlü bir rakip olarak 'Cascade' akışı ve daha az token tüketimiyle geliştirici topluluklarında viral oldu.",
      sources: ["r/windsurf", "r/vibecoding"]
    },
    {
      id: "cline-claude-dev",
      name: "Cline (Claude Dev)",
      category: "CLI / Terminal",
      badge: "Terminal Ajanı",
      hypeScore: 8.9,
      prevScore: 8.1,
      scoreDelta: +0.8,
      trend: "skyrocketing",
      mentions: 590,
      sparkline: [7.1, 7.4, 7.7, 8.0, 8.2, 8.5, 8.9],
      primaryFunction: "VS Code & Terminalde Çalışan, Komut Koşan ve Dosya Düzenleyen Açık Kaynak Ajan",
      whyTrending: "Kendi API anahtarını kullanıp bağımsız çalışabilmesi ve sıfır abonelik ücretiyle Cursor'a en popüler açık alternatif oldu.",
      sources: ["r/ClaudeDev", "r/vscode", "r/vibecoding"]
    },
    {
      id: "gemini-2-5-pro",
      name: "Google Gemini 2.5 Pro",
      category: "LLM (Model)",
      badge: "2M Token",
      hypeScore: 8.8,
      prevScore: 8.4,
      scoreDelta: +0.4,
      trend: "rising",
      mentions: 540,
      sparkline: [8.0, 8.1, 8.3, 8.4, 8.5, 8.7, 8.8],
      primaryFunction: "2 Milyon Token Devasa Bağlam Penceresi ve Multimodal Kod Analizi",
      whyTrending: "Tüm codebase'i tek promptta okuyup mimari refactoring yapabilmesi geliştiricilerin favorisi.",
      sources: ["r/GoogleGemini", "r/LLMDevs"]
    },
    {
      id: "crewai-v1",
      name: "CrewAI",
      category: "Otonom Agent",
      badge: "Çoklu Ajan",
      hypeScore: 8.7,
      prevScore: 8.2,
      scoreDelta: +0.5,
      trend: "rising",
      mentions: 480,
      sparkline: [7.5, 7.7, 7.9, 8.0, 8.2, 8.4, 8.7],
      primaryFunction: "Rol ve Görev Tanımlı Otonom Ajan Ekipleri Kurma Framework'ü",
      whyTrending: "Pazar araştırması ve veri analizi yapan otonom multi-agent ekipleri kurmak isteyen profesyoneller arasında popülerleşti.",
      sources: ["r/AI_Agents", "r/CrewAI"]
    },
    {
      id: "aider-chat",
      name: "Aider",
      category: "CLI / Terminal",
      badge: "Saf CLI",
      hypeScore: 8.6,
      prevScore: 8.0,
      scoreDelta: +0.6,
      trend: "rising",
      mentions: 440,
      sparkline: [7.3, 7.5, 7.7, 8.0, 8.2, 8.4, 8.6],
      primaryFunction: "Terminal Üzerinden Git Entegreli Otonom Kod Düzenleme ve Commit Aracı",
      whyTrending: "Doğrudan git geçmişiyle çalışan ve terminalden çıkmadan büyük repo düzenlemeleri yapabilen kıdemli geliştirici favorisi.",
      sources: ["r/vibecoding", "r/ChatGPTCoding"]
    },
    {
      id: "n8n-ai",
      name: "n8n AI Workflows",
      category: "Otomasyon",
      badge: "Görsel İş Akışı",
      hypeScore: 8.4,
      prevScore: 7.8,
      scoreDelta: +0.6,
      trend: "rising",
      mentions: 390,
      sparkline: [7.0, 7.2, 7.4, 7.6, 7.9, 8.1, 8.4],
      primaryFunction: "Açık Kaynak Düğüm Editörü ile LLM'leri Slack, CRM ve E-postalara Bağlama",
      whyTrending: "Kod yazmadan kurumsal süreçleri yapay zekayla otomatize etmek isteyen operasyon liderleri arasında patladı.",
      sources: ["r/n8n", "r/Automate"]
    },
    {
      id: "comfyui-flux",
      name: "ComfyUI + Flux.1",
      category: "Medya / Üretim",
      badge: "Düğüm Tabanlı",
      hypeScore: 8.3,
      prevScore: 8.5,
      scoreDelta: -0.2,
      trend: "stable",
      mentions: 360,
      sparkline: [8.6, 8.6, 8.5, 8.5, 8.4, 8.4, 8.3],
      primaryFunction: "Düğüm Tabanlı (Node-Based) Kontrollü İleri Seviye Görsel Üretimi",
      whyTrending: "LoRA entegrasyonu ve kurumsal görsel üretim pipeline'larında standart araç haline geldi.",
      sources: ["r/ComfyUI", "r/StableDiffusion"]
    },
    {
      id: "ollama-server",
      name: "Ollama",
      category: "Altyapı & SDK",
      badge: "Yerel Sunucu",
      hypeScore: 8.2,
      prevScore: 8.1,
      scoreDelta: +0.1,
      trend: "stable",
      mentions: 340,
      sparkline: [7.9, 8.0, 8.0, 8.1, 8.1, 8.2, 8.2],
      primaryFunction: "Yerel Cihazda veya Şirket İçi Sunucuda Tek Komutla LLM Dağıtımı",
      whyTrending: "Veri gizliliğine önem veren kurumsal ekiplerin yerel modelleri offline çalıştırma standardı.",
      sources: ["r/LocalLLaMA", "r/ollama"]
    },
    {
      id: "langgraph-core",
      name: "LangGraph",
      category: "Otonom Agent",
      badge: "Döngüsel Ajan",
      hypeScore: 8.1,
      prevScore: 7.6,
      scoreDelta: +0.5,
      trend: "rising",
      mentions: 320,
      sparkline: [7.1, 7.3, 7.5, 7.7, 7.8, 8.0, 8.1],
      primaryFunction: "Grafik Tabanlı Döngüsel State Yönetimi ve Dayanıklı Ajan Orkestrasyonu",
      whyTrending: "Lineer zincirler yerine hata toleranslı döngüsel karar yapıları kurmak isteyen kurumsal ekiplerin tercihi.",
      sources: ["r/LangChain", "r/agenticai"]
    },
    {
      id: "pydantic-ai",
      name: "PydanticAI",
      category: "Altyapı & SDK",
      badge: "Tip Güvenli SDK",
      hypeScore: 7.9,
      prevScore: 7.2,
      scoreDelta: +0.7,
      trend: "skyrocketing",
      mentions: 290,
      sparkline: [6.8, 7.0, 7.2, 7.4, 7.6, 7.8, 7.9],
      primaryFunction: "Python Pydantic Ekibi Tarafından Geliştirilen Tip Güvenli Model Framework'ü",
      whyTrending: "LangChain'in karmaşıklığından kaçan Python geliştiricilerinin minimalist yeni gözdesi.",
      sources: ["r/LLMDevs", "r/PromptEngineering"]
    },
    {
      id: "wan-video",
      name: "Wan 2.1 Video",
      category: "Medya / Üretim",
      badge: "Açık Video",
      hypeScore: 7.8,
      prevScore: 7.0,
      scoreDelta: +0.8,
      trend: "skyrocketing",
      mentions: 260,
      sparkline: [6.2, 6.5, 6.8, 7.1, 7.3, 7.6, 7.8],
      primaryFunction: "Açık Kaynaklı Yüksek Kaliteli Metinden ve Görselden Video Üretimi",
      whyTrending: "ComfyUI entegrasyonuyla yerel bilgisayarlarda çalışan en yetenekli açık video modeli.",
      sources: ["r/ComfyUI", "r/ArtificialInteligence"]
    },
    {
      id: "anthropic-corp",
      name: "Anthropic",
      category: "Şirket / Lab",
      badge: "Sektör Lideri",
      hypeScore: 9.7,
      prevScore: 9.0,
      scoreDelta: +0.7,
      trend: "skyrocketing",
      mentions: 1800,
      sparkline: [8.5, 8.8, 9.0, 9.2, 9.4, 9.6, 9.7],
      primaryFunction: "Claude Modelleri, Güvenli AI Hizalaması ve Hibrit Akıl Yürütme Mimarisi",
      whyTrending: "Claude 3.7 lansmanıyla kodlama ve mantık pazarında OpenAI'nin önüne geçerek gündeme oturdu.",
      sources: ["r/Anthropic", "r/ClaudeAI", "r/Singularity"]
    }
  ],

  weekly: [
    {
      id: "claude-3-7-sonnet",
      name: "Claude 3.7 Sonnet",
      category: "LLM (Model)",
      badge: "Haftalık Şampiyon",
      hypeScore: 9.7,
      prevScore: 8.2,
      scoreDelta: +1.5,
      trend: "skyrocketing",
      mentions: 5400,
      sparkline: [7.5, 7.8, 8.2, 8.6, 9.1, 9.5, 9.7],
      primaryFunction: "Hibrit Akıl Yürütme ve Karmaşık Kod Mimarisi Çözümleri",
      whyTrending: "Hafta boyunca tüm subredditlerde OpenAI modelleriyle kıyaslandı ve kodlama benchmark'larında %85 oranında üstün çıktı.",
      sources: ["r/ClaudeAI", "r/vibecoding", "r/CursorAI"]
    },
    {
      id: "cursor-composer",
      name: "Cursor (Agent Mode)",
      category: "IDE / Editör",
      badge: "Vibe Standardı",
      hypeScore: 9.5,
      prevScore: 8.8,
      scoreDelta: +0.7,
      trend: "rising",
      mentions: 4800,
      sparkline: [8.5, 8.7, 8.8, 9.0, 9.2, 9.4, 9.5],
      primaryFunction: "Gelişmiş IDE İçi Ajan ve Doğal Dille Tam Uygulama İnşası",
      whyTrending: "Vibe coding akımının fiili editörü olarak kabul görüyor; kıdemli mühendislerden ürün yöneticilerine herkes benimsedi.",
      sources: ["r/vibecoding", "r/CursorAI"]
    },
    {
      id: "deepseek-r1",
      name: "DeepSeek-R1 / V3",
      category: "LLM (Model)",
      badge: "Sarsılmaz Güç",
      hypeScore: 9.4,
      prevScore: 9.6,
      scoreDelta: -0.2,
      trend: "stable",
      mentions: 4500,
      sparkline: [9.7, 9.6, 9.6, 9.5, 9.5, 9.4, 9.4],
      primaryFunction: "Açık Ağırlıklı Akıl Yürütme ve Düşük Bütçeli API",
      whyTrending: "Lansman fırtınası yerini stabil üretim sistemlerine entegrasyon ve yerel barındırma tartışmalarına bıraktı.",
      sources: ["r/LocalLLaMA", "r/Singularity"]
    },
    {
      id: "windsurf-cascade",
      name: "Windsurf Editör",
      category: "IDE / Editör",
      badge: "Yükselen Yıldız",
      hypeScore: 9.0,
      prevScore: 7.6,
      scoreDelta: +1.4,
      trend: "skyrocketing",
      mentions: 3200,
      sparkline: [6.8, 7.1, 7.5, 7.9, 8.3, 8.7, 9.0],
      primaryFunction: "Codeium Destekli Akıllı IDE ve Cascade İş Akışı",
      whyTrending: "Cursor'un token limitlerinden ve kota maliyetlerinden sıkılan geliştiricilerin haftalık göç adresi oldu.",
      sources: ["r/windsurf", "r/vibecoding"]
    },
    {
      id: "cline-claude-dev",
      name: "Cline (Claude Dev)",
      category: "CLI / Terminal",
      badge: "Açık Terminal",
      hypeScore: 8.8,
      prevScore: 7.7,
      scoreDelta: +1.1,
      trend: "skyrocketing",
      mentions: 2800,
      sparkline: [6.8, 7.1, 7.4, 7.8, 8.1, 8.5, 8.8],
      primaryFunction: "Terminal ve Dosya Sistemine Tam Yetkili Açık Kaynak VSCode Ajanı",
      whyTrending: "Haftalık indirme rekoru kırdı; açık kaynak geliştiricilerin en sevdiği otonom araç haline geldi.",
      sources: ["r/ClaudeDev", "r/vscode"]
    },
    {
      id: "crewai-v1",
      name: "CrewAI",
      category: "Otonom Agent",
      badge: "Ajan Ekibi",
      hypeScore: 8.6,
      prevScore: 8.0,
      scoreDelta: +0.6,
      trend: "rising",
      mentions: 2300,
      sparkline: [7.6, 7.8, 8.0, 8.1, 8.3, 8.4, 8.6],
      primaryFunction: "Rol ve Görev Tanımlı Otomasyon ve Döngüsel Çoklu Ajanlar",
      whyTrending: "Tekil promptlardan çoklu ajan sistemlerine geçiş bu hafta kurumsal raporların ana konusuydu.",
      sources: ["r/AI_Agents", "r/CrewAI"]
    },
    {
      id: "openai-corp",
      name: "OpenAI",
      category: "Şirket / Lab",
      badge: "Sektör Devi",
      hypeScore: 9.3,
      prevScore: 9.5,
      scoreDelta: -0.2,
      trend: "stable",
      mentions: 8900,
      sparkline: [9.6, 9.5, 9.5, 9.4, 9.4, 9.3, 9.3],
      primaryFunction: "ChatGPT, GPT-4o, o3-mini ve Sora Video Ekosistemi",
      whyTrending: "Anthropic ve DeepSeek rekabeti karşısında yeni akıl yürütme güncellemeleri ve pazar stratejileri tartışılıyor.",
      sources: ["r/OpenAI", "r/Singularity"]
    }
  ],

  monthly: [
    {
      id: "claude-3-7-sonnet",
      name: "Claude 3.7 Sonnet / 3.5",
      category: "LLM (Model)",
      badge: "Ayın Şampiyonu",
      hypeScore: 9.7,
      prevScore: 8.1,
      scoreDelta: +1.6,
      trend: "skyrocketing",
      mentions: 22000,
      sparkline: [7.2, 7.6, 8.1, 8.6, 9.0, 9.4, 9.7],
      primaryFunction: "Kodlama, Mantık Yürütme ve Geliştirici Altyapısı",
      whyTrending: "Son 30 günde yazılımcı topluluklarında en çok tavsiye edilen ve vazgeçilmez model oldu.",
      sources: ["r/ClaudeAI", "r/vibecoding"]
    },
    {
      id: "cursor-composer",
      name: "Cursor AI",
      category: "IDE / Editör",
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
      category: "LLM (Model)",
      badge: "Küresel Etki",
      hypeScore: 9.4,
      prevScore: 7.3,
      scoreDelta: +2.1,
      trend: "skyrocketing",
      mentions: 24000,
      sparkline: [6.5, 7.2, 8.4, 9.6, 9.5, 9.4, 9.4],
      primaryFunction: "Ekonomik Çıkarım, Açık Ağırlık ve Akıl Yürütme",
      whyTrending: "Yapay zeka modellerinin eğitim ve çalışma maliyetlerini radikal biçimde düşürerek pazar dinamiklerini sarstı.",
      sources: ["r/LocalLLaMA", "r/MachineLearning"]
    },
    {
      id: "windsurf-cascade",
      name: "Windsurf Editör",
      category: "IDE / Editör",
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
        <p class="mb-3 text-slate-300">
          Son 24 saatlik ve haftalık Reddit tartışmalarında 43 topluluktan derlenen öne çıkan modeller ve hype dağılımı:
        </p>
        <ul class="space-y-2 text-slate-300">
          <li><strong>Claude 3.7 Sonnet (Skor: 9.8/10):</strong> Özellikle karmaşık mimari refactoring ve sıfır hata kod üretiminde tartışmasız sektör lideri. Thinking budget parametresiyle geliştiriciye düşünme süresini kontrol etme imkanı tanıması büyük övgü topladı.</li>
          <li><strong>Cursor Composer & Agent Mode (Skor: 9.6/10):</strong> Kendi terminalini yönetebilme, linter/derleme hatalarını terminalden okuyup otomatik düzeltme yeteneği ile vibe coding'in fiili işletim sistemi.</li>
          <li><strong>DeepSeek-R1 / V3 (Skor: 9.5/10):</strong> Açık ağırlıklı modellerde çıkarım maliyeti avantajı ve akıl yürütme kalitesiyle yerel kurulumlarda rakipsizliğini koruyor.</li>
          <li><strong>Cline (Claude Dev) (Skor: 8.9/10):</strong> Açık kaynak kodlu ve bağımsız API anahtarıyla çalışan terminal ajanı olarak büyük bir tırmanışta.</li>
          <li><strong>Google Gemini 2.5 Pro (Skor: 8.8/10):</strong> 2M devasa bağlam kapasitesi sayesinde 50.000 satırlık dev codebase'leri tek promptta hazmedebilen tek model.</li>
        </ul>
      `
    },
    {
      title: "BÖLÜM 2: 💡 DERİN TEKNİK İÇGÖRÜLER, MODELLER & VIBE CODING",
      badge: "Kodlama Devrimi",
      contentHtml: `
        <p class="mb-3 text-slate-300">
          Geliştirici topluluklarında <strong>"Vibe Coding"</strong> artık bir heves değil, kurumsal bir yazılım metodolojisine dönüştü. Öne çıkan kritik teknik pratikler:
        </p>
        <ul class="list-disc list-inside space-y-2 text-slate-300">
          <li><strong>.cursorrules ve AGENTS.md Standartlaşması:</strong> Geliştiriciler projelerine özel kuralları repo köküne koyarak ajanın her promptta aynı disiplinle kod yazmasını sağlıyor.</li>
          <li><strong>Terminal Yetkili Ajanlar (Cline & Aider):</strong> Ajanın yalnızca kod üretmesi değil; derleme, test koşma ve linter hatalarını kendi kendine fix etmesi geliştirme hızını 5-10 katına çıkarıyor.</li>
          <li><strong>PydanticAI & Minimalist Framework'ler:</strong> LangChain'in getirdiği aşırı soyutlamadan kaçınan mühendisler, Python tip güvenliğini merkeze alan PydanticAI ve yerel Ollama servislerini tercih ediyor.</li>
        </ul>
      `
    },
    {
      title: "BÖLÜM 3: 📉 MAKRO SEKTÖR TRENDLERİ VE REKABET DENGESİ",
      badge: "Pazar Dengesi",
      contentHtml: `
        <p class="mb-3 text-slate-300">
          Yapay zeka devleri arasındaki güç savaşında yeni eksenler oluşuyor:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 my-3">
          <div class="p-3 bg-slate-900/80 rounded border border-slate-800">
            <h4 class="font-bold text-amber-400 text-xs uppercase mb-1">Anthropic vs OpenAI Savaşları</h4>
            <p class="text-xs text-slate-400">Claude 3.7 ile geliştiricilerin kalbini kazanan Anthropic, kodlama pazarında OpenAI'nin o3-mini hamlesine karşı liderliği açık ara ele geçirdi.</p>
          </div>
          <div class="p-3 bg-slate-900/80 rounded border border-slate-800">
            <h4 class="font-bold text-emerald-400 text-xs uppercase mb-1">Açık Kaynak Baskısı (DeepSeek & Qwen)</h4>
            <p class="text-xs text-slate-400">Kapalı API sağlayıcıları fiyat kırmaya zorlanıyor. Şirketler hassas verilerini korumak için Ollama/vLLM üzerinde yerel açık modelleri hızla yaygınlaştırıyor.</p>
          </div>
        </div>
      `
    },
    {
      title: "BÖLÜM 4: 💼 BEYAZ YAKA ENTEGRASYON VE OPERASYON REHBERİ",
      badge: "İş Dünyası Rehberi",
      contentHtml: `
        <div class="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded text-slate-200 text-xs sm:text-sm space-y-3">
          <p class="font-bold text-emerald-300 text-sm">
            Teknik altyapısı olmayan bir iş profesyoneli bu haftaki gelişmelerden ne çıkarmalı?
          </p>
          <ol class="list-decimal list-inside space-y-2 text-slate-300">
            <li><strong>Tek Sayfalık İç Otomasyon Araçları:</strong> Artık yazılım ekibine bekleme listesi vermenize gerek yok. Cursor veya Windsurf kullanarak departmanınızın Excel raporlarını görselleştiren dahili web araçlarını doğal dille 2 saatte kurabilirsiniz.</li>
            <li><strong>Görsel Süreç Otomasyonu (n8n + AI):</strong> n8n gibi araçlarla; gelen müşteri e-postalarını okuyan, sınıflandıran, CRM'e işleyen ve otomatik teklif hazırlayan otonom iş akışlarını sıfır kodla canlıya alabilirsiniz.</li>
            <li><strong>Büyük Doküman & Sözleşme İncelemesi:</strong> Gemini 2.5'in devasa 2M bağlam kapasitesi sayesinde 500 sayfalık ihale şartnamesi veya şirket politikasını tek seferde yükleyip 'Riskli maddeleri tablo halinde çıkar' komutuyla saatler süren işleri dakikalara indirebilirsiniz.</li>
          </ol>
        </div>
      `
    }
  ]
};
