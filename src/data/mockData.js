export const SUBREDDITS_DATA = [
  // Vibe Coding & AI Editörler
  { name: "vibecoding", category: "Vibe Coding", desc: "Doğal dille kodlama, vibe mantığı ve akış pratikleri", status: "active", icon: "Code2" },
  { name: "CursorAI", category: "Vibe Coding", desc: "Cursor IDE, Composer, rule dosyaları ve eklentiler", status: "active", icon: "Sparkles" },
  { name: "windsurf", category: "Vibe Coding", desc: "Codeium Windsurf editörü ve Cascade akışları", status: "active", icon: "Compass" },
  { name: "ChatGPTCoding", category: "Vibe Coding", desc: "ChatGPT ile kod geliştirme ve otomasyon senaryoları", status: "active", icon: "Bot" },
  { name: "copilot", category: "Vibe Coding", desc: "GitHub Copilot Workspace ve Agent modları", status: "active", icon: "GitFork" },
  { name: "ClaudeAI", category: "Vibe Coding", desc: "Claude 3.7 Sonnet hibrit düşünme ve kodlama tartışmaları", status: "active", icon: "Brain" },

  // Otonom Ajanlar & Framework'ler
  { name: "AI_Agents", category: "Otonom Ajanlar", desc: "Otonom ajan mimarileri, multi-agent sistemler", status: "active", icon: "Cpu" },
  { name: "CrewAI", category: "Otonom Ajanlar", desc: "CrewAI rol tabanlı çoklu ajan framework'ü", status: "active", icon: "Users" },
  { name: "LangChain", category: "Otonom Ajanlar", desc: "LangChain & LangGraph ajan orkestrasyonu", status: "active", icon: "Network" },
  { name: "AutoGPT", category: "Otonom Ajanlar", desc: "Otonom hedef odaklı ajan deneyleri", status: "active", icon: "Zap" },
  { name: "Automate", category: "Otonom Ajanlar", desc: "İş süreçleri ve operasyonel otomasyonlar", status: "active", icon: "Repeat" },

  // Büyük Dil Modelleri & Çekirdek
  { name: "OpenAI", category: "Temel LLM", desc: "OpenAI ekosistemi, GPT-4o, o3-mini ve sora", status: "active", icon: "Hexagon" },
  { name: "GoogleGemini", category: "Temel LLM", desc: "Gemini 2.5/3 modelleri, Google AI Studio, 2M token bağlamı", status: "active", icon: "Orbit" },
  { name: "DeepSeek", category: "Temel LLM", desc: "DeepSeek-V3 ve R1 açık akıl yürütme modelleri", status: "active", icon: "Flame" },
  { name: "Singularity", category: "Temel LLM", desc: "AGI tartışmaları, makro teknolojik sıçramalar", status: "active", icon: "Eye" },
  { name: "ArtificialInteligence", category: "Temel LLM", desc: "Genel yapay zeka endüstrisi ve pazar analizleri", status: "active", icon: "Globe" },
  { name: "MachineLearning", category: "Temel LLM", desc: "Akademik makaleler, mimari yenilikler ve ML mühendisliği", status: "active", icon: "Binary" },

  // Açık Kaynak & Yerel Modeller
  { name: "LocalLLaMA", category: "Açık Kaynak", desc: "Yerel modeller (Llama, Mistral, Qwen), GPU optimizasyonu", status: "active", icon: "Server" },
  { name: "ollama", category: "Açık Kaynak", desc: "Ollama ile tek komutla yerel model çalıştırma", status: "active", icon: "Terminal" },
  { name: "vllm", category: "Açık Kaynak", desc: "Yüksek verimli LLM servis ve çıkarım motoru", status: "active", icon: "Gauge" },
  { name: "huggingface", category: "Açık Kaynak", desc: "Hugging Face model reposu, transformers ve datasetler", status: "active", icon: "Smile" },

  // Geliştirici & Prompt Mühendisliği
  { name: "LLMDevs", category: "Geliştirici", desc: "Production-ready LLM uygulamaları geliştirenler", status: "active", icon: "Laptop" },
  { name: "PromptEngineering", category: "Geliştirici", desc: "System prompt optimizasyonu ve reasoning teknikleri", status: "active", icon: "MessageSquareCode" },
  { name: "AI_Tools", category: "Geliştirici", desc: "Yeni çıkan yapay zeka araçları ve SaaS incelemeleri", status: "active", icon: "Wrench" },
  { name: "GenerativeAI", category: "Geliştirici", desc: "Üretken yapay zeka teknolojileri ve kullanım alanları", status: "active", icon: "Layers" },

  // Görsel & Video Üretimi
  { name: "ComfyUI", category: "Görsel & Medya", desc: "Node tabanlı ileri seviye Stable Diffusion / Flux iş akışları", status: "active", icon: "Palette" },
  { name: "StableDiffusion", category: "Görsel & Medya", desc: "Açık kaynak görsel üretimi, LoRA ve ControlNet", status: "active", icon: "Image" },
  { name: "Midjourney", category: "Görsel & Medya", desc: "Midjourney v6/v7 ve estetik prompt pratikleri", status: "active", icon: "Film" }
];

export const MOCK_TOOLS_DATA = {
  daily: [
    {
      id: "claude-3-7-sonnet",
      name: "Claude 3.7 Sonnet",
      category: "Temel LLM",
      badge: "🔥 Günün Lideri",
      hypeScore: 9.8,
      prevScore: 8.9,
      scoreDelta: +0.9,
      trend: "skyrocketing",
      mentions: 842,
      sparkline: [8.1, 8.4, 8.7, 8.9, 9.2, 9.5, 9.8],
      primaryFunction: "Hibrit Düşünme (Standart Hız + Derin Akıl Yürütme) ve Üst Düzey Kod Yazımı",
      whyTrending: "Hibrit düşünme (thinking budget) modu geliştiriciler arasında fırtına kopardı; kod yazarken hata oranı en düşük model seçildi.",
      sources: ["r/ClaudeAI", "r/vibecoding", "r/CursorAI", "r/LocalLLaMA"]
    },
    {
      id: "cursor-composer",
      name: "Cursor (Agent Mode)",
      category: "Vibe Coding",
      badge: "⚡ Yüksek Hız",
      hypeScore: 9.6,
      prevScore: 9.2,
      scoreDelta: +0.4,
      trend: "rising",
      mentions: 710,
      sparkline: [8.8, 8.9, 9.0, 9.2, 9.3, 9.4, 9.6],
      primaryFunction: "Çok Dosyalı Otonom Kod Düzenleme ve Terminal Yetkili Editör",
      whyTrending: "Son güncelleme ile terminal komutlarını kendi kendine çalıştırıp hataları otomatik düzelten Agent modu övülüyor.",
      sources: ["r/CursorAI", "r/vibecoding", "r/LLMDevs"]
    },
    {
      id: "deepseek-r1",
      name: "DeepSeek-R1 / V3",
      category: "Açık Kaynak",
      badge: "💥 Açık Kaynak Şoku",
      hypeScore: 9.4,
      prevScore: 9.5,
      scoreDelta: -0.1,
      trend: "stable",
      mentions: 650,
      sparkline: [9.6, 9.7, 9.6, 9.5, 9.4, 9.5, 9.4],
      primaryFunction: "Açık Ağırlıklı Reasoning (Akıl Yürütme) Modeli ve Düşük Çıkarım Maliyeti",
      whyTrending: "Yerel Ollama kurulumları ve kurumsal API entegrasyonlarında maliyet/performans kralı olmaya devam ediyor.",
      sources: ["r/LocalLLaMA", "r/ollama", "r/Singularity", "r/MachineLearning"]
    },
    {
      id: "windsurf-cascade",
      name: "Windsurf Cascade",
      category: "Vibe Coding",
      badge: "🚀 Hızlı Yükselen",
      hypeScore: 8.9,
      prevScore: 8.1,
      scoreDelta: +0.8,
      trend: "skyrocketing",
      mentions: 430,
      sparkline: [7.2, 7.5, 7.8, 8.0, 8.3, 8.6, 8.9],
      primaryFunction: "Bağlam Farkındalıklı Akış (Cascade Flow) ve Canlı Önizleme Editörü",
      whyTrending: "Cursor'a güçlü bir rakip olarak 'Cascade' akışı ve daha az token tüketimiyle geliştirici topluluklarında viral oldu.",
      sources: ["r/windsurf", "r/vibecoding", "r/ChatGPTCoding"]
    },
    {
      id: "gemini-2-5-pro",
      name: "Google Gemini 2.5 Pro",
      category: "Temel LLM",
      badge: "🧠 2M Token Canavarı",
      hypeScore: 8.8,
      prevScore: 8.4,
      scoreDelta: +0.4,
      trend: "rising",
      mentions: 390,
      sparkline: [8.0, 8.1, 8.3, 8.4, 8.5, 8.6, 8.8],
      primaryFunction: "2 Milyon Token Devasa Bağlam Penceresi ve Multimodal Kod Analizi",
      whyTrending: "Tüm codebase'i tek promptta okuyup mimari refactoring yapabilmesi geliştiricilerin favorisi.",
      sources: ["r/GoogleGemini", "r/LLMDevs", "r/ArtificialInteligence"]
    },
    {
      id: "crewai-v1",
      name: "CrewAI Multi-Agent",
      category: "Otonom Ajanlar",
      badge: "🤖 Çoklu Ajan",
      hypeScore: 8.5,
      prevScore: 8.0,
      scoreDelta: +0.5,
      trend: "rising",
      mentions: 310,
      sparkline: [7.5, 7.7, 7.9, 8.0, 8.2, 8.3, 8.5],
      primaryFunction: "Rol ve Görev Tanımlı Otomasyon ve Otonom Ekip İş Akışları",
      whyTrending: "Finansal analiz ve pazar araştırması yapan otonom multi-agent ekipleri kurmak isteyen beyaz yakalılar arasında popülerleşti.",
      sources: ["r/AI_Agents", "r/CrewAI", "r/Automate"]
    },
    {
      id: "comfyui-flux",
      name: "ComfyUI + Flux.1",
      category: "Görsel & Medya",
      badge: "🎨 Üretici Sanat",
      hypeScore: 8.3,
      prevScore: 8.5,
      scoreDelta: -0.2,
      trend: "stable",
      mentions: 280,
      sparkline: [8.6, 8.7, 8.5, 8.5, 8.4, 8.4, 8.3],
      primaryFunction: "Düğüm Tabanlı (Node-Based) Kontrollü İleri Seviye Görsel Üretimi",
      whyTrending: "LoRA entegrasyonu ve kurumsal görsel üretim pipeline'larında standart araç haline geldi.",
      sources: ["r/ComfyUI", "r/StableDiffusion"]
    },
    {
      id: "ollama-vllm",
      name: "Ollama & vLLM",
      category: "Açık Kaynak",
      badge: "💻 Yerel Altyapı",
      hypeScore: 8.2,
      prevScore: 8.1,
      scoreDelta: +0.1,
      trend: "stable",
      mentions: 260,
      sparkline: [7.9, 8.0, 8.0, 8.1, 8.1, 8.2, 8.2],
      primaryFunction: "Yerel Cihazda veya Şirket İçi Sunucuda Tek Tıkla LLM Dağıtımı",
      whyTrending: "Veri gizliliğine önem veren kurumsal ekiplerin yerel modelleri offline çalıştırma standardı.",
      sources: ["r/LocalLLaMA", "r/ollama", "r/vllm"]
    }
  ],

  weekly: [
    {
      id: "claude-3-7-sonnet",
      name: "Claude 3.7 Sonnet",
      category: "Temel LLM",
      badge: "👑 Haftanın Şampiyonu",
      hypeScore: 9.7,
      prevScore: 8.2,
      scoreDelta: +1.5,
      trend: "skyrocketing",
      mentions: 4820,
      sparkline: [7.5, 7.8, 8.2, 8.6, 9.1, 9.5, 9.7],
      primaryFunction: "Hibrit Akıl Yürütme ve Karmaşık Kod Mimarisi Çözümleri",
      whyTrending: "Hafta boyunca tüm subredditlerde OpenAI o3-mini ile karşılaştırıldı ve kodlama kıyaslamalarında %85 oranında üstün çıktı.",
      sources: ["r/ClaudeAI", "r/vibecoding", "r/CursorAI", "r/MachineLearning"]
    },
    {
      id: "cursor-composer",
      name: "Cursor (Agent Mode)",
      category: "Vibe Coding",
      badge: "🔥 Vibe Coding Standardı",
      hypeScore: 9.5,
      prevScore: 8.8,
      scoreDelta: +0.7,
      trend: "rising",
      mentions: 4120,
      sparkline: [8.5, 8.7, 8.8, 9.0, 9.2, 9.4, 9.5],
      primaryFunction: "Gelişmiş IDE İçi Ajan ve Doğal Dille Tam Uygulama İnşası",
      whyTrending: "Vibe coding akımının fiili editörü olarak kabul görüyor. Yazılımcı olmayanlar bile tam ürün çıkarabiliyor.",
      sources: ["r/vibecoding", "r/CursorAI", "r/ChatGPTCoding"]
    },
    {
      id: "deepseek-r1",
      name: "DeepSeek-R1 / V3",
      category: "Açık Kaynak",
      badge: "⚡ Sarsılmaz Güç",
      hypeScore: 9.3,
      prevScore: 9.6,
      scoreDelta: -0.3,
      trend: "stable",
      mentions: 3950,
      sparkline: [9.7, 9.6, 9.6, 9.5, 9.4, 9.4, 9.3],
      primaryFunction: "Açık Ağırlıklı Akıl Yürütme ve Düşük Bütçeli API",
      whyTrending: "İlk lansman şoku yerini stabil üretim sistemlerine entegrasyon tartışmalarına bıraktı.",
      sources: ["r/LocalLLaMA", "r/Singularity", "r/huggingface"]
    },
    {
      id: "windsurf-cascade",
      name: "Windsurf",
      category: "Vibe Coding",
      badge: "🚀 En Hızlı Tırmanan",
      hypeScore: 8.8,
      prevScore: 7.4,
      scoreDelta: +1.4,
      trend: "skyrocketing",
      mentions: 2650,
      sparkline: [6.8, 7.1, 7.4, 7.9, 8.2, 8.5, 8.8],
      primaryFunction: "Codeium Destekli Akıllı IDE ve Cascade İş Akışı",
      whyTrending: "Cursor'un token kotalarından sıkılan geliştiricilerin haftalık göç adresi oldu.",
      sources: ["r/windsurf", "r/vibecoding", "r/ChatGPTCoding"]
    },
    {
      id: "gemini-2-5-pro",
      name: "Gemini 2.5 Pro",
      category: "Temel LLM",
      badge: "📚 Bağlam Devi",
      hypeScore: 8.7,
      prevScore: 8.1,
      scoreDelta: +0.6,
      trend: "rising",
      mentions: 2240,
      sparkline: [7.8, 8.0, 8.1, 8.3, 8.4, 8.5, 8.7],
      primaryFunction: "Büyük Kod Tabanları ve Video/Ses Analizi",
      whyTrending: "2M token penceresiyle tüm kütüphane dokümanlarını tek seferde yutması öne çıkıyor.",
      sources: ["r/GoogleGemini", "r/LLMDevs"]
    },
    {
      id: "langgraph-crewai",
      name: "LangGraph & CrewAI",
      category: "Otonom Ajanlar",
      badge: "🤖 Kurumsal Ajanlar",
      hypeScore: 8.4,
      prevScore: 7.9,
      scoreDelta: +0.5,
      trend: "rising",
      mentions: 1890,
      sparkline: [7.6, 7.7, 7.9, 8.0, 8.1, 8.3, 8.4],
      primaryFunction: "Döngüsel Çoklu Ajan ve Karar Destek Sistemleri",
      whyTrending: "Tekil promptlardan çoklu ajan sistemlerine geçiş bu hafta endüstriyel raporların odak noktasıydı.",
      sources: ["r/AI_Agents", "r/LangChain", "r/CrewAI"]
    }
  ],

  monthly: [
    {
      id: "claude-3-7-sonnet",
      name: "Claude 3.7 Sonnet / 3.5 Sonnet",
      category: "Temel LLM",
      badge: "🏆 Ayın Lideri",
      hypeScore: 9.6,
      prevScore: 8.0,
      scoreDelta: +1.6,
      trend: "skyrocketing",
      mentions: 18400,
      sparkline: [7.2, 7.6, 8.0, 8.4, 8.9, 9.3, 9.6],
      primaryFunction: "Kodlama, Mantık Yürütme ve Ajan Altyapısı",
      whyTrending: "Son 30 günde yazılımcı topluluklarında en çok tavsiye edilen ve vazgeçilmez model oldu.",
      sources: ["r/ClaudeAI", "r/vibecoding", "r/CursorAI"]
    },
    {
      id: "cursor-composer",
      name: "Cursor AI",
      category: "Vibe Coding",
      badge: "⭐ Yılın Dönüm Noktası",
      hypeScore: 9.4,
      prevScore: 8.3,
      scoreDelta: +1.1,
      trend: "rising",
      mentions: 16200,
      sparkline: [7.9, 8.1, 8.3, 8.7, 9.0, 9.2, 9.4],
      primaryFunction: "Yapay Zeka Destekli Yeni Nesil Kod Editörü",
      whyTrending: "Vibe coding terimini ana akım haline getirdi; hem acemiler hem de kıdemli mühendisler benimsedi.",
      sources: ["r/CursorAI", "r/vibecoding"]
    },
    {
      id: "deepseek-r1",
      name: "DeepSeek Ekolü (V3/R1)",
      category: "Açık Kaynak",
      badge: "🌍 Küresel Etki",
      hypeScore: 9.3,
      prevScore: 7.2,
      scoreDelta: +2.1,
      trend: "skyrocketing",
      mentions: 19800,
      sparkline: [6.5, 7.2, 8.2, 9.6, 9.5, 9.4, 9.3],
      primaryFunction: "Ekonomik Çıkarım, Açık Ağırlık ve Akıl Yürütme",
      whyTrending: "Yapay zeka modellerinin eğitim ve çalışma maliyetlerini radikal biçimde düşürerek pazar dinamiklerini sarstı.",
      sources: ["r/LocalLLaMA", "r/MachineLearning", "r/Singularity"]
    },
    {
      id: "windsurf-cascade",
      name: "Windsurf Editör",
      category: "Vibe Coding",
      badge: "📈 Güçlü Meydan Okuyucu",
      hypeScore: 8.6,
      prevScore: 6.8,
      scoreDelta: +1.8,
      trend: "skyrocketing",
      mentions: 9800,
      sparkline: [6.0, 6.4, 6.8, 7.5, 8.0, 8.3, 8.6],
      primaryFunction: "Bütüncül Akış Tabanlı Kodlama ve Cascade Ajanı",
      whyTrending: "Son 30 günde en yüksek kullanıcı büyüme oranını yakalayan kodlama asistanı editörü.",
      sources: ["r/windsurf", "r/ChatGPTCoding"]
    }
  ]
};

export const TREND_TIMELINE_SERIES = {
  days: ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"],
  models: [
    { name: "Claude 3.7 Sonnet", color: "#f97316", data: [8.2, 8.5, 8.9, 9.2, 9.5, 9.7, 9.8] },
    { name: "Cursor Agent", color: "#6366f1", data: [8.8, 8.9, 9.1, 9.2, 9.4, 9.5, 9.6] },
    { name: "DeepSeek-R1", color: "#06b6d4", data: [9.6, 9.5, 9.5, 9.4, 9.4, 9.4, 9.4] },
    { name: "Windsurf", color: "#10b981", data: [7.2, 7.6, 7.9, 8.2, 8.5, 8.7, 8.9] },
    { name: "Gemini 2.5 Pro", color: "#8b5cf6", data: [8.0, 8.1, 8.3, 8.5, 8.6, 8.7, 8.8] }
  ]
};

export const LATEST_CONSULTANT_REPORT = {
  id: "rep-2026-09-04",
  title: "Reddit AI Danışman Bülteni - Günlük Sinyal Raporu",
  date: "4 Eylül 2026",
  activeModel: "gemini-2.5-flash",
  stats: {
    totalSubreddits: 30,
    successfulSubreddits: 30,
    durationSeconds: 94,
    totalPostsAnalyzed: 180,
    avgHypeIndex: 8.8
  },
  executiveSummary: "Bu hafta yapay zeka ekosisteminde iki devrimsel dalga çarpışıyor: Claude 3.7 Sonnet'in 'hibrit düşünme' kabiliyeti ile kod kalitesinde çıtayı arşa çıkarması ve Cursor/Windsurf üzerinden yürütülen 'Vibe Coding' felsefesinin geleneksel yazılım geliştirme metodolojilerini kökten değiştirmesi.",
  sections: [
    {
      title: "🛠️ Model Sıralaması & Radar",
      badge: "Liderlik Tablosu",
      contentHtml: `
        <p class="text-slate-300 leading-relaxed mb-4">
          Son 24 saatlik ve haftalık Reddit tartışmalarında öne çıkan modeller ve hype dağılımı aşağıdaki gibidir:
        </p>
        <ul class="space-y-2 text-slate-300">
          <li><strong class="text-amber-400">Claude 3.7 Sonnet (Skor: 9.8/10):</strong> Özellikle karmaşık algoritmalar ve büyük mimari refactoring'lerde açık ara lider. Thinking budget özelliği sayesinde geliştiricinin istediği derinlikte düşünebilmesi övülüyor.</li>
          <li><strong class="text-indigo-400">Cursor Composer & Agent (Skor: 9.6/10):</strong> Kendi terminalini yönetebilme ve hata çıktısını okuyup kodu otomatik düzeltme yeteneği ile vibe coding'in ana karargahı konumunda.</li>
          <li><strong class="text-cyan-400">DeepSeek-R1 / V3 (Skor: 9.4/10):</strong> Yerel barındırma maliyetlerinde ve açık model kıyaslamalarında rakipsiz cazibesini sürdürüyor.</li>
          <li><strong class="text-emerald-400">Windsurf Cascade (Skor: 8.9/10):</strong> Cursor'a karşı en ciddi alternatif; daha az kaynak tüketimi ve entegre canlı önizleme ile hızla pazar payı kazanıyor.</li>
          <li><strong class="text-purple-400">Google Gemini 2.5 Pro (Skor: 8.8/10):</strong> 2M token bağlamı sayesinde 50.000 satırlık dev depoları tek bir istemde sindirip mimari harita çıkarmada alternatifi yok.</li>
        </ul>
      `
    },
    {
      title: "💡 Vibe Coding & Teknik İçgörüler",
      badge: "Kodlama Devrimi",
      contentHtml: `
        <p class="text-slate-300 leading-relaxed mb-3">
          Geliştirici topluluklarında <strong>"Vibe Coding"</strong> artık bir heves değil, fiili bir endüstri standardına dönüşmüş durumda. Öne çıkan kritik teknik pratikler:
        </p>
        <ul class="list-disc list-inside space-y-2 text-slate-300">
          <li><strong>.cursorrules ve AGENTS.md Standartlaşması:</strong> Geliştiriciler projelerine özel kuralları (TypeScript katı kuralları, Tailwind yönergeleri, mimari desenler) repo köküne koyarak ajanın her promptta aynı disiplinle kod yazmasını sağlıyor.</li>
          <li><strong>Terminal Yetkili Ajanlar:</strong> Ajanın yalnızca kod üretmesi değil; <code>npm run build</code>, test koşma ve linter hatalarını kendi kendine fix etmesi geliştirme hızını 5-10 katına çıkarıyor.</li>
          <li><strong>Hafıza & Context Mühendisliği:</strong> Modellerin context window'u büyüse de gürültüyü azaltmak için yerel vektör arama (RAG) ve modüler prompt şablonları tercih ediliyor.</li>
        </ul>
      `
    },
    {
      title: "📉 Makro Sektör Trendleri & Rekabet Dengesi",
      badge: "Pazar Analizi",
      contentHtml: `
        <p class="text-slate-300 leading-relaxed mb-3">
          Yapay zeka devleri arasındaki güç mücadelesinde dengeler değişiyor:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 my-3">
          <div class="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <h4 class="font-semibold text-orange-400 text-sm mb-1">Anthropic vs OpenAI</h4>
            <p class="text-xs text-slate-400">Claude 3.7 ile geliştiricilerin kalbini kazanan Anthropic, kodlama pazarında OpenAI'nin o3-mini hamlesine karşı liderliği ele geçirdi.</p>
          </div>
          <div class="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <h4 class="font-semibold text-cyan-400 text-sm mb-1">Açık Kaynak Baskısı (DeepSeek & Llama)</h4>
            <p class="text-xs text-slate-400">Kapalı API sağlayıcıları fiyat kırmaya zorlanıyor. Şirketler hassas verilerini korumak için Ollama/vLLM üzerinde yerel açık modelleri yaygınlaştırıyor.</p>
          </div>
        </div>
      `
    },
    {
      title: "💼 Beyaz Yaka Entegrasyon ve Operasyon Rehberi",
      badge: "İş Dünyası Uygulaması",
      contentHtml: `
        <div class="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-4 text-slate-300 text-sm space-y-3">
          <p class="font-medium text-indigo-300">
            Teknik altyapısı olmayan bir iş profesyoneli bu haftaki gelişmelerden ne çıkarmalı?
          </p>
          <ol class="list-decimal list-inside space-y-2 text-slate-300">
            <li><strong>Tek Sayfalık İç Otomasyon Araçları:</strong> Artık yazılım ekibine bekleme listesi vermenize gerek yok. Cursor veya Windsurf kullanarak departmanınızın Excel raporlarını görselleştiren dahili web araçlarını doğal dille 2 saatte kurabilirsiniz.</li>
            <li><strong>Çoklu Ajan (Multi-Agent) Pazar Analizi:</strong> CrewAI gibi yapıları kullanarak; biri rakip bültenlerini okuyan, biri özet çıkaran, biri de e-posta taslağı yazan 3 kişilik sanal asistan ekibini tek tıkla çalıştırabilirsiniz.</li>
            <li><strong>Büyük Doküman & Sözleşme İncelemesi:</strong> Gemini 2.5'in devasa bağlam kapasitesi sayesinde 500 sayfalık ihale şartnamesi veya şirket politikasını tek seferde yükleyip 'Riskli maddeleri tablo halinde çıkar' komutuyla saatler süren işleri dakikalara indirebilirsiniz.</li>
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
    avgHype: "9.2/10",
    topTool: "Claude 3.7 Sonnet",
    subredditsCount: 30
  },
  {
    id: "rep-2026-09-03",
    title: "Cursor Agentic Mode ve Otonom Terminal Entegrasyonları",
    date: "3 Eylül 2026",
    activeModel: "gemini-2.5-flash",
    avgHype: "8.9/10",
    topTool: "Cursor (Agent Mode)",
    subredditsCount: 30
  },
  {
    id: "rep-2026-09-02",
    title: "DeepSeek-R1 Açık Kaynak Çıkarım Maliyeti Devrimi",
    date: "2 Eylül 2026",
    activeModel: "gemini-2.5-flash",
    avgHype: "9.4/10",
    topTool: "DeepSeek-R1",
    subredditsCount: 28
  },
  {
    id: "rep-2026-09-01",
    title: "Windsurf Cascade Akışı ve Çok Dosyalı Bağlam Yönetimi",
    date: "1 Eylül 2026",
    activeModel: "gemini-2.5-flash",
    avgHype: "8.7/10",
    topTool: "Windsurf Cascade",
    subredditsCount: 28
  },
  {
    id: "rep-2026-08-31",
    title: "Haftalık Makro Özet: Kapalı API'ler vs Yerel Modellerin Yükselişi",
    date: "31 Ağustos 2026",
    activeModel: "gemini-2.5-flash",
    avgHype: "8.8/10",
    topTool: "Claude 3.5 / 3.7 Sonnet",
    subredditsCount: 26
  }
];
