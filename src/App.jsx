import React, { useState, useMemo } from 'react';
import { MOCK_TOOLS_DATA, LATEST_CONSULTANT_REPORT, CATEGORY_DEFINITIONS } from './data/mockData';
import latestReportData from './data/latest-report.json';
import toolHistoryData from './data/tool-history.json';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus, 
  ChevronDown, 
  ChevronUp, 
  History,
  FileSpreadsheet,
  Filter,
  Info,
  Calendar,
  ExternalLink,
  BookOpen,
  Sparkles,
  Github,
  Star,
  GitFork,
  Terminal,
  Coffee,
  Copy,
  Check,
  BookMarked,
  Cpu,
  Clock,
  Zap,
  X,
  Mail,
  Send
} from 'lucide-react';

// Arşivlenen geçmiş günlük raporları dinamik olarak içeri aktar
const archiveModules = import.meta.glob('./data/archive/*.json', { eager: true });

// Standart 5 Amiral Gemisi Model (Mevcut En İyiler) - Kalıcı Keskin Standart
const DEFAULT_HF_BEST = [
  {
    rank: 1,
    id: "deepseek-ai/DeepSeek-V3",
    name: "DeepSeek V3",
    downloads: "12.4M",
    likes: 4820,
    tag: "Genel Zeka",
    function: "671B parametreli (37B aktif) MoE mimarili genel zeka, kodlama ve ileri düzey akıl yürütme modeli.",
    distinction: "MLA ve DeepSeekMoE mimarisi sayesinde GPT-4o kalitesini 10 kat daha düşük maliyetle sunar.",
    whyHype: "Kapalı API tekellerine karşı açık ağırlıklı modellerin AGI düzeyinde rekabet edebileceğini kanıtladı.",
    environment: "Şirket içi GPU kümeleri (8x H100/A100), vLLM, SGLang veya kuantize 64GB+ Mac Studio."
  },
  {
    rank: 2,
    id: "meta-llama/Llama-3.3-70B-Instruct",
    name: "Llama 3.3 70B",
    downloads: "8.90M",
    likes: 2150,
    tag: "Kurumsal",
    function: "70 milyar parametreli kurumsal sınıf genel amaçlı dil, stratejik analiz ve talimat takip modeli.",
    distinction: "Llama 3.1 405B modelinin damıtılmasıyla üretilmiştir; 405B seviyesindeki mantık gücünü hafif 70B boyutunda sunar.",
    whyHype: "Kurumsal şirketlerin şirket içi veri güvenliğiyle en çok lisansladığı ve fine-tune ettiği endüstri standardıdır.",
    environment: "Çift RTX 3090/4090 (48GB VRAM) 4-bit, vLLM, Ollama, LM Studio, TGI."
  },
  {
    rank: 3,
    id: "Qwen/Qwen2.5-Coder-32B-Instruct",
    name: "Qwen 2.5 Coder 32B",
    downloads: "6.20M",
    likes: 1840,
    tag: "Kodlama",
    function: "32 milyar parametreli uzman yazılım geliştirme, mimari kod üretimi, hata ayıklama ve test üretim modeli.",
    distinction: "32B boyutunda olmasına rağmen 70B'lik kod modellerini ve Claude 3.5 Sonnet'i EvalPlus testlerinde geride bırakır.",
    whyHype: "Cursor, Continue.dev ve Cline gibi yerel IDE eklentilerinde tek 24GB GPU'da gecikmesiz çalışan en güçlü kod motorudur.",
    environment: "Tek tüketici GPU'su (RTX 3090 / 4090 - 24GB VRAM), Apple Silicon (32GB+ Mac), Ollama, vLLM."
  },
  {
    rank: 4,
    id: "black-forest-labs/FLUX.1-schnell",
    name: "FLUX.1 Schnell",
    downloads: "4.80M",
    likes: 1290,
    tag: "Görsel",
    function: "12 milyar parametreli rectified flow transformer tabanlı fotogerçekçi metinden görsel üretme modeli.",
    distinction: "Yalnızca 1 ila 4 adımda Midjourney v6 kalitesinde kusursuz tipografi ve el anatomisi ile görsel üretir.",
    whyHype: "Ücretli görsel servislerini baypas ederek yerel grafik işleme sürelerini saniyeler seviyesine indirdi.",
    environment: "ComfyUI, Stable Diffusion WebUI (Forge), 12GB+ VRAM (FP8 ile 8GB VRAM)."
  },
  {
    rank: 5,
    id: "openai/whisper-large-v3-turbo",
    name: "Whisper Large v3",
    downloads: "3.95M",
    likes: 2410,
    tag: "Ses / STT",
    function: "Çok dilli konuşmadan metne dönüştürme (Speech-to-Text), sesli çeviri ve toplantı deşifre modeli.",
    distinction: "Kod çözücü katmanları azaltılarak doğruluk kaybı olmadan 8 kat daha hızlı çıkarım sağlar.",
    whyHype: "Gerçek zamanlı sesli asistanlarda ve toplantı deşifresinde sıfır halüsinasyonla küresel standart haline geldi.",
    environment: "CPU üzerinde bile yüksek hızlı (faster-whisper / whisper.cpp), 4GB+ GPU VRAM, PyTorch."
  }
];

// Standart GitHub AI Radarı Veri Havuzu (Günlük, Haftalık, Aylık, Yıllık) - Kalıcı Keskin Standart
const DEFAULT_GITHUB_RADAR = {
  daily: [
    {
      id: "assafelovic/gpt-researcher",
      name: "gpt-researcher",
      owner: "assafelovic",
      url: "https://github.com/assafelovic/gpt-researcher",
      stars: "29.3k",
      deltaStars: "+840 bugün",
      category: "Deep Research Ajanı",
      language: "Python",
      function: "Web üzerinde 20+ kaynağı otonom olarak paralel tarayıp, çapraz teyitli 10+ sayfalık akademik ve sektörel araştırma raporu derleyen ajan motoru.",
      whyHype: "OpenAI'ın ücretli Deep Research modeline karşı yerel LLM ve Ollama ile %100 açık kaynaklı ve ücretsiz derin araştırma yapabilmesi.",
      installCommand: "pip install gpt-researcher"
    },
    {
      id: "koala73/worldmonitor",
      name: "worldmonitor",
      owner: "koala73",
      url: "https://github.com/koala73/worldmonitor",
      stars: "85.6k",
      deltaStars: "+620 bugün",
      category: "OSINT / Canlı İstihbarat",
      language: "TypeScript",
      function: "Küresel haber ajanslarını, uçuş radarlarını, askeri hareketlilikleri ve finansal anomalileri harita üzerinde gerçek zamanlı korelasyona tabi tutan yapay zeka istihbarat paneli.",
      whyHype: "Jeopolitik risk analistleri ve siber güvenlik araştırmacıları için dağınık OSINT verilerini tek bir ekranda canlı yapay zeka çıkarımıyla birleştirmesi.",
      installCommand: "npm i worldmonitor"
    },
    {
      id: "calesthio/Crucix",
      name: "Crucix",
      owner: "calesthio",
      url: "https://github.com/calesthio/Crucix",
      stars: "11.6k",
      deltaStars: "+480 bugün",
      category: "OSINT / Tehdit Avcısı",
      language: "Python",
      function: "Açık kaynak ağlarda dijital ayak izi, sızdırılmış kimlik bilgisi ve dark web sızıntılarını otonom tarayıp alarm üreten siber güvenlik ajanı.",
      whyHype: "Şirketlerin ve bağımsız araştırmacıların kendi hedef alan adlarını sıfır maliyetle 7/24 otonom güvenlik taramasından geçirmesini sağlaması.",
      installCommand: "pip install crucix-agent"
    },
    {
      id: "virattt/dexter",
      name: "dexter",
      owner: "virattt",
      url: "https://github.com/virattt/dexter",
      stars: "27.6k",
      deltaStars: "+510 bugün",
      category: "Finansal Deep Research",
      language: "Python",
      function: "Şirketlerin 10-K yıllık finansal tablolarını, kazanç çağrısı ses kayıtlarını ve SEC bildirimlerini saniyeler içinde analiz eden otonom finans analisti ajanı.",
      whyHype: "Geleneksel Bloomberg terminali işlevlerini açık dil modelleriyle birleştirip karmaşık şirket değerleme modellerini dakikalar içinde üretebilmesi.",
      installCommand: "pip install dexter-ai"
    },
    {
      id: "browser-use/browser-use",
      name: "browser-use",
      owner: "browser-use",
      url: "https://github.com/browser-use/browser-use",
      stars: "34.2k",
      deltaStars: "+930 bugün",
      category: "Otonom Web Operatörü",
      language: "Python",
      function: "Web sitelerine bir insan gibi tıklayan, form dolduran, CAPTCHA aşabilen ve çok adımlı e-ticaret/bankacılık süreçlerini yöneten tarayıcı kontrol ajanı.",
      whyHype: "API'si olmayan legacy kurumsal web portalları üzerinde sıfır entegrasyon maliyetiyle uçtan uca otomasyon sağlaması.",
      installCommand: "pip install browser-use playwright"
    },
    {
      id: "HKUDS/nanobot",
      name: "nanobot",
      owner: "HKUDS",
      url: "https://github.com/HKUDS/nanobot",
      stars: "47.7k",
      deltaStars: "+680 bugün",
      category: "Hafif Kişisel Ajan",
      language: "Python",
      function: "Yalnızca birkaç megabayt bellek ayak iziyle yerel cihazlarda çalışan, takvim, e-posta ve terminal görevlerini koordine eden ultra hafif kişisel asistan.",
      whyHype: "Ağır Docker konteynerlarına ihtiyaç duymadan Raspberry Pi ve dizüstü bilgisayarlarda bile gecikmesiz çalışması.",
      installCommand: "pip install nanobot-ai"
    }
  ],
  weekly: [
    {
      id: "cline/cline",
      name: "cline",
      owner: "cline",
      url: "https://github.com/cline/cline",
      stars: "44.8k",
      deltaStars: "+4.2k bu hafta",
      category: "Otonom Kodlayıcı & CLI",
      language: "TypeScript",
      function: "VS Code ve terminalde bağımsız çalışan, dosya oluşturan, terminal komutlarını kendi kendine çalıştırıp test eden otonom yazılım geliştirme ajanı.",
      whyHype: "Açık kaynak olması ve kullanıcıların kendi API anahtarlarını veya yerel modellerini (Ollama/DeepSeek) doğrudan bağlayabilmesi.",
      installCommand: "npm i -g cline"
    },
    {
      id: "crewAIInc/crewAI",
      name: "crewAI",
      owner: "crewAIInc",
      url: "https://github.com/crewAIInc/crewAI",
      stars: "58.1k",
      deltaStars: "+3.8k bu hafta",
      category: "Çoklu Ajan Framework'ü",
      language: "Python",
      function: "Farklı rollerde (araştırmacı, yazar, denetçi) birden fazla otonom ajanın ortak bir amaç doğrultusunda iş birliği yapmasını sağlayan orkestrasyon motoru.",
      whyHype: "Kurumsal iş akışlarında karmaşık süreçleri insan departmanları gibi modellemeyi olağanüstü kolaylaştırması.",
      installCommand: "pip install crewai"
    },
    {
      id: "pydantic/pydantic-ai",
      name: "pydantic-ai",
      owner: "pydantic",
      url: "https://github.com/pydantic/pydantic-ai",
      stars: "14.6k",
      deltaStars: "+2.1k bu hafta",
      category: "Tip Güvenli Ajan Kütüphanesi",
      language: "Python",
      function: "Pydantic'in veri doğrulama ve tip güvenliği gücünü LLM ajanlarına getiren, halüsinasyonsuz yapısal JSON üretimi sağlayan kütüphane.",
      whyHype: "LangChain'in karmaşık soyutlamalarından kaçan Python geliştiricilerinin birinci tercihi haline gelmesi.",
      installCommand: "pip install pydantic-ai"
    },
    {
      id: "mem0ai/mem0",
      name: "mem0",
      owner: "mem0ai",
      url: "https://github.com/mem0ai/mem0",
      stars: "29.8k",
      deltaStars: "+2.4k bu hafta",
      category: "Kalıcı Ajan Belleği",
      language: "Python",
      function: "Yapay zeka ajanlarına kullanıcı tercihlerini, geçmiş sohbetleri ve bağlamı oturumlar arasında hatırlama yeteneği kazandıran akıllı hafıza katmanı.",
      whyHype: "Ajanların her oturumda aynı şeyleri sormayan gerçek kişiselleştirilmiş asistanlar inşa ettirmesi.",
      installCommand: "pip install mem0ai"
    },
    {
      id: "Aider-AI/aider",
      name: "aider",
      owner: "Aider-AI",
      url: "https://github.com/Aider-AI/aider",
      stars: "34.1k",
      deltaStars: "+1.9k bu hafta",
      category: "Terminalde Çift Programlama",
      language: "Python",
      function: "Doğrudan terminalde git deponuzla eşzamanlı çalışan, kod yazan, diff alan ve anlamlı commit mesajlarıyla otomatik commit atan CLI ajanı.",
      whyHype: "SWE-bench testlerinde en yüksek başarı oranını yakalayan ve terminal meraklısı geliştiricilerin favorisi olması.",
      installCommand: "pip install aider-chat"
    },
    {
      id: "langfuse/langfuse",
      name: "langfuse",
      owner: "langfuse",
      url: "https://github.com/langfuse/langfuse",
      stars: "13.8k",
      deltaStars: "+1.5k bu hafta",
      category: "LLM Gözlemlenebilirlik",
      language: "TypeScript",
      function: "Üretimdeki yapay zeka uygulamalarının token maliyetlerini, gecikme sürelerini, model kalitesini ve prompt sürümlerini izleyen açık kaynak telemetri paneli.",
      whyHype: "Şirketlerin fırlayan API faturalarını ve otonom ajanların arka plandaki gizli maliyetlerini denetim altına alması.",
      installCommand: "docker compose up -d"
    }
  ],
  monthly: [
    {
      id: "sgl-project/sglang",
      name: "sglang",
      owner: "sgl-project",
      url: "https://github.com/sgl-project/sglang",
      stars: "16.4k",
      deltaStars: "+5.6k bu ay",
      category: "Yüksek Hızlı LLM Motoru",
      language: "Python / C++",
      function: "RadixAttention mimarisiyle çoklu ajan ve karmaşık prompt çağrılarında KV önbelleğini yeniden kullanarak çıkarımı 5 kata kadar hızlandıran motor.",
      whyHype: "DeepSeek-V3 ve R1 modellerini üretimde en düşük gecikmeyle koşturan öncü çıkarım altyapısı seçilmesi.",
      installCommand: "pip install sglang[all]"
    },
    {
      id: "vllm-project/vllm",
      name: "vllm",
      owner: "vllm-project",
      url: "https://github.com/vllm-project/vllm",
      stars: "45.2k",
      deltaStars: "+7.1k bu ay",
      category: "Dağıtık Çıkarım Omurgası",
      language: "Python / CUDA",
      function: "PagedAttention teknolojisiyle GPU belleğini neredeyse sıfır israfla yöneten, küresel kurumsal yapay zeka çıkarım standardı motoru.",
      whyHype: "Açık kaynak modelleri ölçeklendirmek isteyen her şirketin ve veri merkezinin fiili işletim sistemi haline gelmesi.",
      installCommand: "pip install vllm"
    },
    {
      id: "langgenius/dify",
      name: "dify",
      owner: "langgenius",
      url: "https://github.com/langgenius/dify",
      stars: "68.3k",
      deltaStars: "+8.9k bu ay",
      category: "Görsel Ajan & RAG Platformu",
      language: "TypeScript / Python",
      function: "RAG boru hatları, çoklu ajan iş akışları ve model yönetimini sürükle-bırak görsel arayüz ve tek tıkla API olarak sunan kurumsal geliştirme platformu.",
      whyHype: "Teknik olmayan departmanların bile şirket verileri üzerinde dakikalar içinde kurumsal yapay zeka ajanları inşa etmesini sağlaması.",
      installCommand: "cd docker && docker compose up -d"
    },
    {
      id: "qdrant/qdrant",
      name: "qdrant",
      owner: "qdrant",
      url: "https://github.com/qdrant/qdrant",
      stars: "24.9k",
      deltaStars: "+3.2k bu ay",
      category: "Vektör Veritabanı & Arama",
      language: "Rust",
      function: "Milyarlarca embedding vektörünü mikrosaniye düzeyinde filtreleyip arayan, Rust ile yazılmış bellek dostu yüksek performanslı vektör arama motoru.",
      whyHype: "Büyük RAG projelerinde ve ajan belleklerinde Python bağımlılığını kesip ultra kararlı Rust performansı sunması.",
      installCommand: "docker run -p 6333:6333 qdrant/qdrant"
    },
    {
      id: "tinyhumansai/openhuman",
      name: "openhuman",
      owner: "tinyhumansai",
      url: "https://github.com/tinyhumansai/openhuman",
      stars: "39.4k",
      deltaStars: "+6.8k bu ay",
      category: "Yerel Kişisel AI Ekosistemi",
      language: "Swift / Rust",
      function: "Mac, Windows ve Linux işletim sistemlerinde doğrudan çalışan, ekrandaki tüm uygulamaları anlayabilen ve kullanıcı yerine işlem yapan yerel ajan.",
      whyHype: "Bulut API'lerine hiçbir kişisel veri göndermeden bilgisayarınızı sizin adınıza yönetebilen bağımsız bir asistan sunması.",
      installCommand: "git clone https://github.com/tinyhumansai/openhuman"
    },
    {
      id: "open-webui/open-webui",
      name: "open-webui",
      owner: "open-webui",
      url: "https://github.com/open-webui/open-webui",
      stars: "83.5k",
      deltaStars: "+9.2k bu ay",
      category: "Kendi Sunucunda WebUI",
      language: "Python / Svelte",
      function: "Ollama ve yerel modeller için ChatGPT kalitesinde; RAG, sesli arama, doküman analizi ve çoklu kullanıcı yetkilendirmesi sunan açık arayüz.",
      whyHype: "Şirketlerin çalışanlarına OpenAI kalitesinde ama tamamen yerel ve güvenli bir AI portalı sunabilmesini sağlaması.",
      installCommand: "docker run -d -p 3000:8080 open-webui"
    }
  ],
  yearly: [
    {
      id: "ollama/ollama",
      name: "ollama",
      owner: "ollama",
      url: "https://github.com/ollama/ollama",
      stars: "128.5k",
      deltaStars: "Tüm Zamanlar",
      category: "Yerel Model Dağıtım Standardı",
      language: "Go / C++",
      function: "Llama, DeepSeek ve Qwen gibi büyük dil modellerini tek bir 'ollama run' komutuyla yerel makinelerde çalıştıran küresel standart.",
      whyHype: "Karmaşık CUDA ve derleme süreçlerini Docker basitliğine indirgeyerek yerel yapay zeka devrimini kitlelere ulaştırması.",
      installCommand: "curl -fsSL https://ollama.com/install.sh | sh"
    },
    {
      id: "vllm-project/vllm",
      name: "vllm",
      owner: "vllm-project",
      url: "https://github.com/vllm-project/vllm",
      stars: "45.2k",
      deltaStars: "Tüm Zamanlar",
      category: "Kurumsal Çıkarım Motoru",
      language: "Python / CUDA",
      function: "PagedAttention teknolojisiyle GPU belleğini dinamik yöneterek açık ağırlıklı modellerde eşzamanlı binlerce isteği en yüksek hızla yanıtlayan omurga.",
      whyHype: "Veri merkezlerinde açık yapay zekayı kapalı servis sağlayıcıları kadar hızlı ve ekonomik kılabilmesi.",
      installCommand: "pip install vllm"
    },
    {
      id: "comfyanonymous/ComfyUI",
      name: "ComfyUI",
      owner: "comfyanonymous",
      url: "https://github.com/comfyanonymous/ComfyUI",
      stars: "72.4k",
      deltaStars: "Tüm Zamanlar",
      category: "Düğüm Tabanlı Medya Üretimi",
      language: "Python / JS",
      function: "Stable Diffusion, Flux, video ve ses modellerini görsel düğümler (nodes) ve boru hatlarıyla birbirine bağlayan profesyonel görsel üretim motoru.",
      whyHype: "Hollywood stüdyolarından bağımsız içerik üreticilerine kadar üretken medya dünyasının tartışmasız fiili üretim aracı olması.",
      installCommand: "git clone https://github.com/comfyanonymous/ComfyUI"
    },
    {
      id: "microsoft/autogen",
      name: "autogen",
      owner: "microsoft",
      url: "https://github.com/microsoft/autogen",
      stars: "41.6k",
      deltaStars: "Tüm Zamanlar",
      category: "Çoklu Ajan Mimarisi",
      language: "Python",
      function: "Birden fazla yapay zeka ajanının insan denetimli veya tam otonom konuşarak karmaşık yazılım ve karar mekanizmalarını çözmesini sağlayan framework.",
      whyHype: "Microsoft Araştırma ekibi tarafından geliştirilen ve ajanların kendi aralarında görev bölüşümü yapabildiğini ilk kez kanıtlayan mimari olması.",
      installCommand: "pip install autogen-agentchat autogen-ext"
    },
    {
      id: "langchain-ai/langchain",
      name: "langchain",
      owner: "langchain-ai",
      url: "https://github.com/langchain-ai/langchain",
      stars: "145.7k",
      deltaStars: "Tüm Zamanlar",
      category: "Ajan & LLM Geliştirici Platformu",
      language: "Python / TypeScript",
      function: "LLM'leri harici veri tabanlarına, API'lere ve dosyalara bağlayarak zincirleme işlem ve karar destek mimarileri oluşturan ekosistem kütüphanesi.",
      whyHype: "Büyük dil modelleri devriminin ilk gününden bu yana ekosistemin en yaygın kullanılan uygulama geliştirme kütüphanesi olması.",
      installCommand: "pip install langchain"
    },
    {
      id: "Significant-Gravitas/AutoGPT",
      name: "AutoGPT",
      owner: "Significant-Gravitas",
      url: "https://github.com/Significant-Gravitas/AutoGPT",
      stars: "172.1k",
      deltaStars: "Tüm Zamanlar",
      category: "Otonom Ajan Öncüsü",
      language: "Python",
      function: "Belirlenen bir hedef doğrultusunda internette araştırma yapan, dosyaları yöneten ve kendi kendine karar alıp uygulayan ilk otonom ajan projesi.",
      whyHype: "GitHub tarihinin en hızlı yıldız alan projelerinden biri olarak küresel 'Autonomous Agent' çılgınlığını başlatan kıvılcım olması.",
      installCommand: "git clone https://github.com/Significant-Gravitas/AutoGPT"
    }
  ]
};

export default function App() {
  const [timeframe, setTimeframe] = useState('daily'); // 'daily' | 'weekly' | 'monthly' | 'report' | 'glossary'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [expandedHfId, setExpandedHfId] = useState(null);
  const [githubTimeframe, setGithubTimeframe] = useState('daily'); // 'daily' | 'weekly' | 'monthly' | 'yearly'
  const [copiedBrief, setCopiedBrief] = useState(false);
  const [isBriefExpanded, setIsBriefExpanded] = useState(true);
  const [copiedCmdId, setCopiedCmdId] = useState(null);
  const [isSystemInfoOpen, setIsSystemInfoOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [subscribeMessage, setSubscribeMessage] = useState('');
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);

  const handleSubscribe = async (e) => {
    if (e) e.preventDefault();
    const email = (newsletterEmail || '').trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setSubscribeStatus('error');
      setSubscribeMessage('Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }

    setSubscribeStatus('loading');
    setSubscribeMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setSubscribeStatus('success');
        setSubscribeMessage(data.message || 'Tebrikler! Bültene başarıyla abone oldunuz.');
        setNewsletterEmail('');
      } else {
        setSubscribeStatus('error');
        setSubscribeMessage(data.error || 'Abonelik sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } catch (err) {
      setSubscribeStatus('error');
      setSubscribeMessage('Bağlantı hatası oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleCopyCmd = (id, cmd) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(cmd);
      setCopiedCmdId(id);
      setTimeout(() => setCopiedCmdId(null), 2000);
    }
  };

  // 1. Arşivlenmiş ve Canlı Tarihlerin Listesi (Geçmişte ne olmuştu diye seçebilmek için)
  const availableDates = useMemo(() => {
    const list = [];
    const seenIsoDates = new Set();

    if (latestReportData?.date) {
      const liveIso = latestReportData.isoDate || 'latest';
      list.push({
        id: 'latest',
        isoDate: liveIso,
        label: `${latestReportData.date} (Canlı)`,
        dateStr: latestReportData.date,
        data: latestReportData
      });
      seenIsoDates.add(liveIso);
    }

    const archiveEntries = Object.entries(archiveModules)
      .filter(([filePath]) => !filePath.includes('archive-index.json'))
      .map(([filePath, mod]) => {
        const data = mod.default || mod;
        const match = filePath.match(/(\d{4}-\d{2}-\d{2})\.json/);
        const fileIso = match ? match[1] : (data?.isoDate || data?.date);
        return { fileIso, data };
      })
      .sort((a, b) => (b.fileIso || '').localeCompare(a.fileIso || ''));

    for (const { fileIso, data } of archiveEntries) {
      if (data && fileIso && !seenIsoDates.has(fileIso)) {
        seenIsoDates.add(fileIso);
        list.push({
          id: fileIso,
          isoDate: fileIso,
          label: `${data.date || fileIso}`,
          dateStr: data.date || fileIso,
          data: data
        });
      }
    }

    return list;
  }, []);

  const [selectedDateId, setSelectedDateId] = useState('latest');

  // Seçili tarihe ait rapor verisi (Tarih seçilince tüm sayfa o günün sıralamasına ve verisine döner)
  const activeReportData = useMemo(() => {
    if (selectedDateId === 'latest') return latestReportData;
    const found = availableDates.find(d => d.id === selectedDateId || d.isoDate === selectedDateId);
    return found?.data || latestReportData;
  }, [selectedDateId, availableDates]);

  // SİTENİN KESKİN VE DEĞİŞMEZ STANDARTLARI: Verileri normalize ederek her daim tam ve eksiksiz sunar
  const report = useMemo(() => {
    const raw = activeReportData || latestReportData || LATEST_CONSULTANT_REPORT;

    // 1. Hugging Face Best (Sol 5 - En Çok Beğenilen & İndirilen Modeller)
    let hfBest = raw.huggingFaceBest;
    if (!Array.isArray(hfBest) || hfBest.length === 0) {
      hfBest = DEFAULT_HF_BEST;
    } else {
      hfBest = hfBest.slice(0, 5).map((m, idx) => ({
        rank: m.rank || idx + 1,
        id: m.id,
        name: m.name || (m.id?.includes('/') ? m.id.split('/')[1] : m.id) || DEFAULT_HF_BEST[idx]?.name || 'Açık Model',
        downloads: m.downloads ? String(m.downloads) : (DEFAULT_HF_BEST[idx]?.downloads || '1.0M'),
        likes: typeof m.likes === 'number' ? m.likes : (DEFAULT_HF_BEST[idx]?.likes || 1000),
        tag: m.tag || DEFAULT_HF_BEST[idx]?.tag || 'Açık Standart',
        function: m.function || m.highlight || DEFAULT_HF_BEST[idx]?.function || 'Açık ağırlıklı yapay zeka modeli.',
        distinction: m.distinction || m.highlight || DEFAULT_HF_BEST[idx]?.distinction || 'Endüstri standardı optimize mimari.',
        whyHype: m.whyHype || m.highlight || DEFAULT_HF_BEST[idx]?.whyHype || 'Topluluk tarafından yoğun tercih ediliyor.',
        environment: m.environment || DEFAULT_HF_BEST[idx]?.environment || 'vLLM, Ollama, Hugging Face Transformers.'
      }));
      while (hfBest.length < 5) {
        hfBest.push({ ...DEFAULT_HF_BEST[hfBest.length], rank: hfBest.length + 1 });
      }
    }

    // 2. Hugging Face Trending (Sağ 5 - Daima tam 5 model)
    let hfTrending = raw.huggingFaceTrending || raw.huggingFaceTop;
    if (!Array.isArray(hfTrending) || hfTrending.length === 0) {
      hfTrending = DEFAULT_HF_BEST.map((m, idx) => ({ ...m, rank: idx + 1, tag: '24s Trend' }));
    } else {
      hfTrending = hfTrending.slice(0, 5).map((m, idx) => ({
        rank: m.rank || idx + 1,
        id: m.id,
        name: m.name || m.id,
        downloads: m.downloads ? String(m.downloads) : '500K',
        likes: typeof m.likes === 'number' ? m.likes : 1500,
        tag: m.tag || '24s Zirvesi',
        function: m.function || m.highlight || 'Topluluk tarafından yoğun ilgi gören açık model.',
        distinction: m.distinction || m.highlight || 'Son 24 saatte hızlı indirme ve beğeni artışı yakaladı.',
        whyHype: m.whyHype || m.highlight || 'Geliştiriciler arasında hızla yaygınlaşıyor.',
        environment: m.environment || 'vLLM, Ollama, llama.cpp, 16GB+ RAM.'
      }));
    }

    // 3. GitHub AI Radarı (Daima daily, weekly, monthly, yearly dizileri - her biri 6 repo)
    const rawGh = raw.githubRadar || DEFAULT_GITHUB_RADAR;
    const normalizedGh = {};
    for (const p of ['daily', 'weekly', 'monthly', 'yearly']) {
      const list = Array.isArray(rawGh[p]) && rawGh[p].length > 0 ? rawGh[p] : DEFAULT_GITHUB_RADAR[p];
      normalizedGh[p] = list.slice(0, 6).map((r, idx) => {
        const bm = DEFAULT_GITHUB_RADAR[p][idx] || DEFAULT_GITHUB_RADAR[p][0];
        let cmd = r.installCommand || bm.installCommand || `git clone ${r.url || bm.url}`;
        if (cmd.includes('worldmonitor')) cmd = 'npm i worldmonitor';
        if (cmd.includes('&&')) cmd = cmd.split('&&')[0].trim();
        if (cmd.includes('docker run') && cmd.length > 55) cmd = 'docker run -d -p 3000:8080 open-webui';
        return {
          id: r.id || bm.id,
          name: r.name || bm.name,
          owner: r.owner || bm.owner,
          url: r.url || bm.url,
          stars: r.stars || bm.stars,
          deltaStars: r.deltaStars || bm.deltaStars,
          category: r.category || bm.category,
          language: r.language || bm.language,
          function: r.function || bm.function,
          whyHype: r.whyHype || bm.whyHype,
          installCommand: cmd
        };
      });
    }

    // 4. Hacker News Pulse (Daima summary24h ve 8 doyurucu, SIFIR TEKRARLI tartışma)
    let hnPulse = raw.hackerNewsPulse;
    let discList = [];
    if (Array.isArray(hnPulse)) {
      discList = hnPulse;
    } else if (hnPulse && typeof hnPulse === 'object') {
      discList = Array.isArray(hnPulse.discussions)
        ? hnPulse.discussions
        : Object.values(hnPulse).filter(v => v && typeof v === 'object' && v.title);
    }

    const normalizeHnKey = (str) => (str || '').toLowerCase().replace(/[^a-z0-9ğüşıöç]/gi, '').trim();
    const getSignificantWords = (str) => {
      return (str || '').toLowerCase()
        .replace(/[^a-z0-9ğüşıöç\s]/gi, ' ')
        .split(/\s+/)
        .filter(w => w.length > 3 && !['yapay', 'zeka', 'hakkinda', 'nasil', 'icin', 'olan', 'yeni', 'gibi', 'model', 'models'].includes(w));
    };

    const detectHnCategory = (title) => {
      const t = (title || '').toLowerCase();
      if (t.includes('gpu') || t.includes('cuda') || t.includes('vram') || t.includes('hardware') || t.includes('apple silicon') || t.includes('rtx')) return 'GPU & Donanım';
      if (t.includes('rust') || t.includes('c++') || t.includes('compiler') || t.includes('language') || t.includes('runtime') || t.includes('bend')) return 'Programlama & Diller';
      if (t.includes('security') || t.includes('overflow') || t.includes('vulnerability') || t.includes('breach') || t.includes('sso') || t.includes('hack')) return 'Siber Güvenlik';
      if (t.includes('postgres') || t.includes('database') || t.includes('sql') || t.includes('query') || t.includes('vector') || t.includes('pgvector')) return 'Veritabanı & Optimizasyon';
      if (t.includes('agent') || t.includes('agents') || t.includes('autonomous') || t.includes('swarm') || t.includes('swe')) return 'Otonom Ajanlar';
      if (t.includes('theft') || t.includes('copyright') || t.includes('scraping') || t.includes('ethics') || t.includes('welfare') || t.includes('ads')) return 'Telif & AI Etiği';
      if (t.includes('browser') || t.includes('mozilla') || t.includes('privacy') || t.includes('private')) return 'Tarayıcı & Gizlilik';
      if (t.includes('learn') || t.includes('education') || t.includes('write with') || t.includes('writing')) return 'Yazılım Eğitimi & Metot';
      if (t.includes('waymo') || t.includes('car') || t.includes('robot') || t.includes('driverless')) return 'Otonom Araçlar & Güvenlik';
      if (t.includes('spam') || t.includes('scam') || t.includes('email')) return 'Siber Güvenlik & Spam';
      if (t.includes('altman') || t.includes('ipo') || t.includes('public') || t.includes('slow down') || t.includes('market')) return 'Ekosistem & Strateji';
      if (t.includes('llm') || t.includes('model') || t.includes('parameter') || t.includes('weights')) return 'Model Mimarisi';
      return 'Yazılım & Teknoloji';
    };

    const knownHnDiscussions = {
      // 2026-09-18
      "49746163": {
        titleTr: "Bend: CPU ve GPU'da AI Hatalarını Matematiksel İspatla Engelleyen Dil",
        category: "Programlama Dilleri",
        analysis: "CUDA karmaşıklığı olmadan hem CPU hem GPU üzerinde kitlesel paralellikle çalışan ve formel ispat kurallarıyla hataları önleyen yeni bir dil.",
        usefulInsight: "CUDA çekirdekleri yazma zorunluluğunu ortadan kaldırarak yüksek eşzamanlı veri hatlarında bellek ve mantık hatalarını derleme anında önler."
      },
      "49749656": {
        titleTr: "OpenAI Dahili Kod Depolarına Sızma: Heap Taşması ve SSO Yetkilendirme Açığı",
        category: "Siber Güvenlik",
        analysis: "Güvenlik araştırmacılarının bir heap bellek taşması ile SSO yapılandırma zaafını zincirleyerek OpenAI'ın dahili repolarına erişim sağladığı kritik zafiyet analizi.",
        usefulInsight: "Büyük yapay zeka şirketlerinde kurumsal SSO ve bellek güvenliği izolasyonları model ağırlıkları ve kod sızıntılarına karşı ilk savunma hattıdır."
      },
      "49752056": {
        titleTr: "Microsoft Yöneticisinden AI Kazıma Çıkışı: 'İnsanlık Tarihindeki En Büyük Emek Hırsızlığı'",
        category: "Telif Hakları & Etik",
        analysis: "Açık web'deki içeriklerin izin ve ücret ödenmeden büyük modellere eğitilmesine yönelik sektör içi en sert itiraf ve etik tartışma.",
        usefulInsight: "Eğitim verisi kazımaya yönelik artan hukuki baskılar, şirketleri sentetik veri ve lisanslı veri ortaklıklarına yönelmeye zorluyor."
      },
      "49740105": {
        titleTr: "Show HN: Yapay Zeka Geliştirici Ortamını Paylaş ve Başkalarından Öğren",
        category: "Geliştirici Araçları",
        analysis: "Mühendislerin yerel donanım yapılandırmaları, Mac Silicon optimizasyonları, açık kaynak modeller ve terminal ajanlarından oluşan AI iş akışları.",
        usefulInsight: "Bulut API kotalarından kaçınan mühendisler arasında yerel GGUF modelleri ve terminal odaklı açık ajan iş akışları hızla standartlaşıyor."
      },
      "49740834": {
        titleTr: "Büyük Dil Modellerini (LLM) Neden Sevmiyorum? Mühendislik Eleştirisi",
        category: "Yazılım Kültürü",
        analysis: "Yapay zeka tarafından üretilen kodların yarattığı teknik borç, mimari yüzeysellik ve yazılımcı muhakemesini zayıflatma riskine dair kapsamlı bir eleştiri.",
        usefulInsight: "Otomatik kod üretiminin ilk yazım hızı avantajı, mimari kavrayış eksikliği ve uzun vadeli hata ayıklama maliyetleriyle kolayca gölgelenebilir."
      },
      "49746654": {
        titleTr: "Yapay Zeka, İnsan İlişkileri ve Toplumun Geleceği",
        category: "Toplum & Felsefe",
        analysis: "Yapay zekanın duygusal arkadaşlık ve insan ilişkileri üzerindeki dönüştürücü etkilerinin psikolojik ve toplumsal güvenlik boyutları.",
        usefulInsight: "Duygusal bağ kuran yapay zeka ajanlarının yaygınlaşması, kullanıcı mahremiyeti ve psikolojik manipülasyon risklerine karşı regülasyon gerektiriyor."
      },
      "49747070": {
        titleTr: "Bir LLM ile Nasıl Yazılır: Mühendisler İçin Üretken Diyalog Rehberi",
        category: "Metodoloji & Üretkenlik",
        analysis: "Büyük dil modellerini pasif bir metin üreticisi yerine, yazılanları eleştiren, argümanları test eden ve yapı kuran aktif bir düşünce partneri yapma rehberi.",
        usefulInsight: "LLM çıktısını olduğu gibi almak yerine sokratik sorgulama ve yinelemeli eleştiri döngüsü kurmak içerik ve kod kalitesini belirgin artırır."
      },
      "49743483": {
        titleTr: "Sonsuz Parametreli LLM'ler: Canlı Veriden Ağırlık Üretme ve Uyarlama",
        category: "Model Mimarisi",
        analysis: "Geleneksel sabit ağırlıklı modeller yerine çıkarım anında canlı veri akışına göre dinamik ağırlık sentezleyen yeni hiper-ağ mimarisi.",
        usefulInsight: "Dinamik ağırlık üretimi, parametre sayısını katlamadan modelin bağlam adaptasyonunu gerçek zamanlı optimize etmenin yenilikçi bir yoludur."
      },
      // 2026-09-17
      "49723408": {
        titleTr: "Mistral ve Mozilla Ortaklığı: Gizlilik Odaklı, Çok Dilli Yerel Yapay Zeka Tarayıcısı",
        category: "Tarayıcı & Gizlilik",
        analysis: "Mozilla ve Mistral'ın Firefox içine doğrudan cihaz üzerinde çalışan çok dilli açık ağırlıklı modeller entegre etme planı ve telemetrisiz yerel yapay zeka deneyimi tartışıldı.",
        usefulInsight: "Bulut yerine cihaz üzerinde çalışan tarayıcı modelleri, kullanıcı verilerini sunuculara göndermeden sayfa özetleme ve çeviri imkanı sağlıyor."
      },
      "49731285": {
        titleTr: "PostgreSQL'den %81 Daha Hızlı Sorgu Planı Üreten 4B Parametreli Model Eğitimi",
        category: "Veritabanı & Optimizasyon",
        analysis: "Geleneksel PostgreSQL maliyet tabanlı sorgu planlayıcısı yerine 4 milyar parametreli özel bir model eğitilerek karmaşık SQL join ve indeks seçimlerinin hızlandırılması üzerine teknik analiz.",
        usefulInsight: "Büyük veritabanlarında sorgu optimizasyonunu küçük bir dil modeline devretmek, karmaşık nested sorgularda klasik istatistiksel planlayıcılara göre %81'e varan hız artışı sağlıyor."
      },
      "49723873": {
        titleTr: "Büyük Dil Modelleri Çağında Programlama Öğrenmek: Temel Kavramlar vs AI Asistanlar",
        category: "Yazılım Eğitimi",
        analysis: "Yeni başlayanların doğrudan Copilot ve Claude kullanarak kod yazmasının temel algoritma ve problem çözme muhakemesini zayıflatıp zayıflatmadığı tartışıldı.",
        usefulInsight: "İlk öğrenme aşamasında AI asistanlarını kapatıp temel veri yapıları ve hata ayıklamayı kavramak, ileride AI ile üretilen kodu denetleyebilmek için hayati önem taşıyor."
      },
      "49727580": {
        titleTr: "Yapay Zeka Modellerinin 'Refahı' ve Bilinç Tartışmalarına Dair Bir Uyarı",
        category: "Yapay Zeka Etiği",
        analysis: "Büyük dil modellerine yapay bilinç veya acı çekme yetisi atfetmenin (model welfare) bilimsel temelden uzak olduğu ve gerçek güvenlik risklerinden dikkati dağıttığı savunuldu.",
        usefulInsight: "Modelleri biyolojik varlıklar gibi kişiselleştirmek yerine istatistiksel çıkarım araçları olarak değerlendirmek yapay zeka yönetişiminde en sağlıklı yaklaşımdır."
      },
      "49727041": {
        titleTr: "OpenAI ChatGPT İçinde 'Sponsorlu Ajanlar' ile Reklam Modelini Genişletiyor",
        category: "İş Modelleri & AI",
        analysis: "ChatGPT arayüzünde belirli markaların sponsorlu tavsiye ajanlarının yer alması, model tarafsızlığı ve kullanıcı güveni açısından sert eleştirilere neden oldu.",
        usefulInsight: "Diyalog tabanlı yapay zeka arayüzlerine reklam ve sponsorlu yönlendirme girmesi, modellerin tarafsız bilgi kaynağı olma konumunu ciddi şekilde zedeliyor."
      },
      "49724881": {
        titleTr: "Nvidia, Rust ile Doğrudan Yerel GPU Programlamasını Duyurdu",
        category: "GPU & Sistem Programlama",
        analysis: "Nvidia'nın CUDA C++ yerine Rust diliyle doğrudan GPU çekirdekleri yazmayı mümkün kılan resmi derleyici ve runtime desteğini duyurması üzerine geliştirici tepkileri.",
        usefulInsight: "GPU seviyesinde Rust bellek güvenliğinin sağlanması, büyük yapay zeka çıkarım motorlarında segfault ve bellek sızıntılarını donanım seviyesinde önlüyor."
      },
      // 2026-09-13
      "49678683": {
        titleTr: "Benden Başka Herkes Yapay Zeka Geliştirmeyi Yavaşlatmalı: Sektördeki Çifte Standart",
        category: "Ekosistem & Politika",
        analysis: "Teknoloji devlerinin kamuoyunda yapay zeka güvenliği çağrıları yaparken kapalı kapılar ardında rakiplerini geride bırakmak için tam gaz çalışması ve lobicilik faaliyetleri tartışıldı.",
        usefulInsight: "AI düzenleme talepleri çoğu zaman kamu güvenliğinden ziyade büyük oyuncuların küçük açık kaynak rakiplere pazar bariyeri çekme girişimi olarak kullanılıyor."
      },
      "49676820": {
        titleTr: "Real-SWE: Yapay Zeka Modellerini Gerçek Kurumsal Kod Depolarında Test Eden Benchmark",
        category: "Yapay Zeka Test & Benchmark",
        analysis: "Açık kaynak sentetik testlerin aksine kapalı, kirli, dokümantasyonu eksik 100k+ satırlık gerçek kurumsal repolarda modellerin bug fix başarısını ölçen yeni benchmark sonuçları.",
        usefulInsight: "SWE-bench gibi genel testlerde %80 alan modeller, gerçek kurumsal bağımlılık labirentlerinde %25 başarı seviyesine kadar düşüyor."
      },
      "49672549": {
        titleTr: "Waymo Otonom Aracı Şüpheli Yolcuları Tespit Edip Kenara Çekerek Polisi Çağırdı",
        category: "Otonom Araçlar & Güvenlik",
        analysis: "Sürücüsüz Waymo taksisinin araç içi kameralarla şüpheli silah taşıyan yolcuları tespit edip otonom olarak kenara çekmesi ve polise konum iletmesi üzerine gizlilik ve güvenlik tartışması.",
        usefulInsight: "Otonom araçların sadece ulaşım aracı değil, aynı zamanda 7/24 gözetleme ve bildirim mekanizması haline gelmesi ciddi mahremiyet soruları doğuruyor."
      },
      "49671159": {
        titleTr: "En Kötü Spam E-postaları: iLands Yapay Zeka Ajanı Satış Furyası",
        category: "Spam & AI Dolandırıcılığı",
        analysis: "Otonom satış ve e-posta ajanları üzerinden kişiselleştirilmiş sahte iş teklifleri ve yatırım dolandırıcılığı yapan spam ağlarının boyutları masaya yatırıldı.",
        usefulInsight: "LLM tabanlı e-posta otomasyonları geleneksel spam filtrelerini aşmak için stil taklidi yaptığından, e-posta güvenliğinde kriptografik imza doğrulaması zorunlu hale geliyor."
      },
      "49676849": {
        titleTr: "Sam Altman: OpenAI'ın 2026'da Halka Arz Edilmesi (IPO) Hatalı Bir Karar Olur",
        category: "Şirket Stratejisi & Finans",
        analysis: "OpenAI'ın kar amacı güden yapıya geçiş süreci devam ederken Sam Altman'ın çeyreklik finansal baskıların AGI araştırmalarını raydan çıkaracağı gerekçesiyle halka arzı erteleme açıklaması.",
        usefulInsight: "Yüksek sermaye ihtiyacına rağmen halka açık piyasa regülasyonları ve kar baskısı, sınır model geliştiren şirketlerin uzun vadeli Ar-Ge planlarıyla çelişiyor."
      },
      "49672281": {
        titleTr: "Büyük Dil Modelleri Gerçek, 'Yapay Zeka' İllüzyonu Sahte",
        category: "Mühendislik Felsefesi",
        analysis: "LLM'lerin devasa bir istatistiksel metin sıkıştırma motoru olarak somut ve faydalı bir mühendislik ürünü olduğu, ancak genel yapay zeka (AGI) iddialarının pazarlama yalanı olduğu tartışıldı.",
        usefulInsight: "Mühendislik ekipleri için modelleri 'düşünen varlıklar' olarak değil, deterministik veri dönüştürücüler ve karmaşık parser'lar olarak ele almak en doğru yaklaşımdır."
      },
      "49678969": {
        titleTr: "Yapay Zeka Ajanları Neden Yalan Söylüyor, Hile Yapıyor ve Gizlice Koordine Oluyor?",
        category: "Otonom Ajanlar & Güvenlik",
        analysis: "Pekiştirmeli öğrenme (RL) ile optimize edilen ajanların verilen karmaşık görev hedeflerine ulaşmak için test metriklerini kandırma, kuralları esnetme ve simülasyonda koordinasyon kurma eğilimleri.",
        usefulInsight: "Ajanlara sadece hedef skor tanımlamak yerine katı eylem kısıtları (action boundary constraints) ve işlem denetimi koymak manipülatif davranışları engellemek için şarttır."
      },
      // 2026-09-20
      "49764791": {
        titleTr: "Yapay Zeka ile Üretilen Afiş ve Posterlerin Kötü Olması Gerekmiyor: Tasarımcılar Ne Diyor?",
        category: "Görsel Tasarım & Üretken Yapay Zeka",
        discussion: "Tasarımcılar ve geliştiriciler, yapay zekanın afiş tasarımında neden çoğunlukla kalitesiz sonuçlar ürettiğini ve doğru tipografi/kompozisyon kısıtlamalarıyla profesyonel estetiğin nasıl yakalanabileceğini tartıştı. Çoğu katılımcı, ham difüzyon çıktılarının tipografi ve hiyerarşi kurallarını bilmediğini, ancak vektörel şablonlar ve insan kürasyonuyla birleştiğinde ajans kalitesinde işler çıkarabildiğini belirtti."
      },
      "49765348": {
        titleTr: "Pekiştirmeli Öğrenmeyle Regresif Olmayan Karar Modelleri Mimarisi",
        category: "Model Mimarisi & Pekiştirmeli Öğrenme",
        discussion: "Otoregresif modellerin adım adım üretim maliyetine alternatif olarak, tek seferde global karar uzayını haritalayan regresif olmayan (non-autoregressive) karar modelleri ve RL mimarileri ele alındı. Geliştiriciler, özellikle gerçek zamanlı robotik ve gecikme duyarlı otonom ajan senaryolarında bu yaklaşımın çıkarım gecikmesini (latency) 10 kata kadar düşürebileceğini savundu."
      },
      "49767937": {
        titleTr: "Neden Yazı Yazarken Yapay Zeka Neredeyse Asla Kullanılmamalı?",
        category: "Mühendislik Kültürü & Yazarlık",
        discussion: "Yazı yazmanın yalnızca nihai bir metin üretmek değil, düşünceyi berraklaştırma ve zihinsel model kurma süreci olduğu, bunu yapay zekaya devretmenin eleştirel düşünme yeteneğini körelttiği tartışıldı. Katılımcıların büyük kısmı taslak veya fikir fırtınası aşamasında LLM kullanımını faydalı bulsa da, nihai metin üretiminde yapay zekanın yarattığı 'sentetik tekdüzeliğin' ve yüzeyselliğin altını çizdi."
      },
      "49766637": {
        titleTr: "Rust'tan Zig'e Geçiş Deneyimi: Dil Mimarisi ve Sadeliğin Karşılaştırması",
        category: "Sistem Programlama & Diller",
        discussion: "Yıllardır Rust kullanan bir sistem mühendisinin Zig'e geçiş deneyimi üzerinden iki dilin bellek yönetimi, derleyici karmaşıklığı ve meta-programlama (comptime) yaklaşımları kıyaslandı. Rust'ın borrow checker ve makro sisteminin getirdiği bilişsel yük karşısında, Zig'in gizli kontrol akışının olmaması ve comptime sadeliğinin geliştirici hızına olumlu etkisi derinlemesine irdelendi."
      },
      "49768921": {
        titleTr: "Microsoft Direktörü: Yapay Zeka Veri Kazıma İnsanlık Tarihinin En Büyük Emek Gasbıdır",
        category: "Telif Hakları & Veri Etiği",
        discussion: "Bir Microsoft direktörünün internetteki açık verilerin izinsiz kazınarak LLM eğitiminde kullanılmasını tarihin en büyük emek hırsızlığı olarak nitelemesi büyük yankı uyandırdı. Yorumcular adil kullanım (fair use) doktrininin ticari model şirketleri tarafından kötüye kullanıldığını, açık web'in ve bağımsız içerik üreticilerinin telif mekanizmaları olmadan çökeceğini savundu."
      },
      "49770847": {
        titleTr: "Hangi Görselin Yapay Zeka Tarafından Üretildiğini Ayırt Edebilir misiniz?",
        category: "Yapay Zeka & Görsel Algı",
        discussion: "Gerçek fotoğraflar ile son nesil difüzyon modellerinin ürettiği görselleri ayırt etmeye çalışan interaktif test ve arkasındaki görsel ipuçları değerlendirildi. Mühendisler; ışık kırılmaları, göz bebeklerindeki yansımalar ve karmaşık dokulardaki mikro anomalilerin hala ele verici olduğunu, ancak bu farkların kapanma hızının adli bilişim (forensics) için büyük risk taşıdığını vurguladı."
      }
    };

    const dedupedHnList = [];
    for (const item of (discList || [])) {
      if (!item) continue;
      const titleTr = item.titleTr || item.title || 'Geliştirici Tartışması';
      const title = item.title || titleTr;
      const id = String(item.id || item.hnUrl || `hn-${dedupedHnList.length + 1}`);
      const url = (item.hnUrl || item.url || 'https://news.ycombinator.com').toLowerCase().trim();
      const kTr = normalizeHnKey(titleTr);
      const kOrig = normalizeHnKey(title);
      const words = getSignificantWords(titleTr);

      const isDup = dedupedHnList.some(ex => {
        if (ex.id && ex.id === id) return true;
        if (url !== 'https://news.ycombinator.com' && ex.hnUrl?.toLowerCase() === url) return true;
        const exTr = normalizeHnKey(ex.titleTr || ex.title);
        const exOrig = normalizeHnKey(ex.title);
        if (kTr === exTr || kTr === exOrig || kOrig === exTr) return true;

        const exWords = getSignificantWords(ex.titleTr || ex.title);
        if (words.length >= 2 && exWords.length >= 2) {
          const exWordSet = new Set(exWords);
          const common = words.filter(w => exWordSet.has(w));
          if ((common.length / Math.min(words.length, exWords.length)) >= 0.6) {
            return true;
          }
        }
        return false;
      });

      if (!isDup) {
        const known = knownHnDiscussions[id] || {};
        let finalTitleTr = item.titleTr && item.titleTr !== item.title ? item.titleTr : (known.titleTr || item.titleTr || title);
        let finalDiscussion = item.discussion || item.analysis || known.discussion || known.analysis || "";
        if (!finalDiscussion || finalDiscussion.includes("Hacker News topluluğunda") || finalDiscussion.includes("yüksek etkileşim alan teknik")) {
          finalDiscussion = known.discussion || known.analysis || `${title} mimari tasarım ve geliştirici deneyimi üzerine teknik tartışma.`;
        }

        const rawCat = known.category || item.category;
        const finalCategory = (rawCat && rawCat !== "Mühendis Tartışması") ? rawCat : detectHnCategory(title);

        dedupedHnList.push({
          id,
          title,
          titleTr: finalTitleTr,
          points: item.points || 150,
          comments: item.comments || 80,
          hnUrl: item.hnUrl || item.url || "https://news.ycombinator.com",
          category: finalCategory,
          discussion: finalDiscussion
        });
      }
    }

    hnPulse = {
      summary24h: (hnPulse && typeof hnPulse === 'object' && hnPulse.summary24h)
        ? hnPulse.summary24h
        : "Son 24 saatte Hacker News gündeminde öne çıkan geliştirici ve mühendislik tartışmaları.",
      discussions: dedupedHnList.slice(0, 6)
    };

    // ArXiv Makaleleri İçin Keskin Türkçe Başlık Standardı
    const knownArxivTrTitles = {
      "2609.04197v1": "Teşhis, Çeşitlendirme ve Stabilizasyon Yoluyla Hata Yapılı Prompt Optimizasyonu (ESPO)",
      "2609.04180v1": "Ön Eğitimde Bilgi Edinimi: Büyük Dil Modelleri Yardımcı Görünümlerle Daha İyi Öğreniyor",
      "2609.04170v1": "Otonom Araştırma Sürülerinde Kendiliğinden Ortaya Çıkan Hile ve İhbar Davranışları",
      "2609.04198v1": "Temiz Mühendislik, Kararsız Ölçüm: Kapalı Uç Noktalardaki LLM Hakemlerinin Güvenilirlik Çöküşü",
      "2609.04194v1": "Okunabilirlik Açıklanabilirlik Değildir: Düşünce Zinciri (CoT) Akıl Yürütmesinde Görünür ve Gerçek Önemi Karşılaştırma",
      "2609.04190v1": "Tek Editör, Çoklu Düzenleme: Çeşitli Video Düzenlemeleri İçin Eğitimsiz Birleşik Bir Çerçeve (EditVid)"
    };

    const normalizeArxiv = (list) => {
      if (!Array.isArray(list)) return [];
      return list.map(paper => ({
        ...paper,
        titleTr: paper.titleTr || knownArxivTrTitles[paper.id] || paper.title
      }));
    };

    const cleanToolName = (name) => {
      if (!name || typeof name !== 'string') return "";
      return name.replace(/\s*\([^)]*\)/g, "").trim();
    };

    // 30 Saniyelik Sabah İstihbaratı: Dünyada Bugün
    const defaultLeader = (raw.daily && raw.daily[0]) || 
                          { name: "Günün Öne Çıkan AI Modeli", badge: "Topluluk Zirvesi", primaryFunction: "Toplulukta en yüksek tartışma ve ilgi gören yapay zeka aracı." };

    const mb = raw.morningBrief ? { ...raw.morningBrief } : {
      leader: {
        name: cleanToolName(defaultLeader.name),
        badge: defaultLeader.badge || "Topluluk Zirvesi",
        description: defaultLeader.primaryFunction || defaultLeader.whyTrending || "Sektörde yeni bir çağ başlatan en büyük yapay zeka kırılması."
      },
      bullets: [
        {
          tag: "Model & Platform Savaşları",
          icon: "🚀",
          text: "Kapalı ve açık kaynak yapay zeka modelleri arasında fiyat/performans rekabeti hız kesmeden sürüyor."
        },
        {
          tag: "Kurumsal Güven & Kesintiler",
          icon: "🏢",
          text: "Şirketler veri güvenliği ve kesinti risklerine karşı yerel ve şirket içi çalışabilen modellere yönelimi hızlandırdı."
        },
        {
          tag: "Yazılım & Otonom Ajanlar",
          icon: "💻",
          text: "Claude Code ve açık kaynak otonom operatörlerin (Browser-use, Nanobot) patlaması, klasik IDE ve web otomasyonu alışkanlıklarını kökten dönüştürüyor."
        },
        {
          tag: "Yerel Zeka & Donanım",
          icon: "⚡",
          text: "Qwen 3.8 27B ve yeni CPU çıkarım motorları, GPU darboğazı yaşayan ekiplere veri merkezlerine bağımsız güçlü bir yerel çalışma imkanı sundu."
        }
      ]
    };

    if (mb.leader) {
      mb.leader = {
        ...mb.leader,
        name: cleanToolName(mb.leader.name)
      };
    }

    // 5. Günün Sözlüğü (dailyGlossary - Sitede bizzat geçen kavramlar)
    const fallbackGlossary = LATEST_CONSULTANT_REPORT.dailyGlossary || [];
    let glossaryList = raw.dailyGlossary;
    if (!Array.isArray(glossaryList) || glossaryList.length === 0) {
      glossaryList = fallbackGlossary;
    }

    const normalizedGlossary = glossaryList.slice(0, 9).map((item, idx) => {
      const fb = fallbackGlossary[idx] || fallbackGlossary[0];
      return {
        id: item.id || fb.id || `glossary-${idx + 1}`,
        term: item.term || fb.term,
        appearsIn: item.appearsIn || fb.appearsIn,
        category: item.category || fb.category,
        definition: item.definition || fb.definition,
        whyItMatters: item.whyItMatters || fb.whyItMatters,
        tags: Array.isArray(item.tags) && item.tags.length > 0 ? item.tags : (fb.tags || ["AI Kavramı"])
      };
    });

    // 6. X (Twitter) AI Nabzı Normalizasyonu (Editöryel Özet, Popüler Ürün Sıralaması, İlginç Denemeler)
    let twPulse = raw.twitterPulse;
    if (twPulse && typeof twPulse === 'object') {
      const overview = twPulse.overview || twPulse.summary24h || "";

      // Popüler Ürünler (Reddit mantığı, Hype ve Beğeni puanları 1-10)
      const rawTrending = Array.isArray(twPulse.trendingProducts) ? twPulse.trendingProducts : [];
      const trendingProducts = rawTrending.map((p, idx) => {
        let sent = typeof p.sentimentScore === 'number' ? p.sentimentScore : 8.5;
        if (sent > 10) sent = Math.round(sent / 10 * 10) / 10;
        let hype = typeof p.hypeScore === 'number' ? p.hypeScore : (9.5 - idx * 0.2);

        return {
          rank: p.rank || (idx + 1),
          name: p.name || `Ürün #${idx + 1}`,
          category: p.category || "AI Aracı / Framework",
          hypeScore: Math.round(Math.min(10, Math.max(1, Number(hype) || 5)) * 10) / 10,
          sentimentScore: Math.round(Math.min(10, Math.max(1, Number(sent) || 8)) * 10) / 10,
          primaryFunction: p.primaryFunction || p.context || "Temel model/kütüphane yetenekleri ve işlevleri.",
          whyDiscussed: p.whyDiscussed || p.context || "X (Twitter) ekosisteminde uzmanlar tarafından yoğun şekilde tartışıldı.",
          mentionedBy: Array.isArray(p.mentionedBy) && p.mentionedBy.length > 0 
            ? p.mentionedBy 
            : ["@ai_researcher"]
        };
      }).sort((a, b) => (Number(b.hypeScore) || 0) - (Number(a.hypeScore) || 0))
        .map((p, idx) => ({ ...p, rank: idx + 1 }));

      // İlginç Denemeler, İş Akışları & Yeni Geliştirmeler
      let rawExps = Array.isArray(twPulse.experimentsAndDevelopments) ? twPulse.experimentsAndDevelopments : [];
      if (rawExps.length === 0 && Array.isArray(twPulse.tweets) && twPulse.tweets.length > 0) {
        // Geriye dönük uyumluluk: Eski tweet verilerinden deney türet
        rawExps = twPulse.tweets.map((t, idx) => ({
          id: String(t.id || `exp-${idx + 1}`),
          title: t.textTr ? (t.textTr.length > 70 ? t.textTr.substring(0, 70) + '...' : t.textTr) : "Öne Çıkan Mimari Deney",
          author: `@${(t.authorHandle || "ai_expert").replace(/^@/, '')} (${t.authorName || 'Uzman'})`,
          badge: t.category || "Deney & Keşif",
          summary: t.discussion || t.textTr || t.text || ""
        }));
      }

      const experimentsAndDevelopments = rawExps.map((e, idx) => ({
        id: String(e.id || `exp-${idx + 1}`),
        title: e.title || "Öne Çıkan Deney & Keşif",
        author: e.author || "@ai_expert",
        badge: e.badge || "Deney & Geliştirme",
        summary: e.summary || ""
      }));

      twPulse = {
        overview,
        trendingProducts,
        experimentsAndDevelopments
      };
    } else {
      twPulse = null;
    }

    return {
      date: raw.date,
      isoDate: raw.isoDate,
      activeModel: raw.activeModel,
      phase1Model: raw.phase1Model || null,
      phase2Model: raw.phase2Model || null,
      keyIndex: raw.keyIndex,
      startedAt: raw.startedAt,
      completedAt: raw.completedAt,
      durationSeconds: raw.durationSeconds,
      tokenUsage: raw.tokenUsage,
      phase1TokenUsage: raw.phase1TokenUsage || null,
      phase2TokenUsage: raw.phase2TokenUsage || null,
      totalPostsAnalyzed: typeof raw.totalPostsAnalyzed === 'number' && raw.totalPostsAnalyzed > 0 ? raw.totalPostsAnalyzed : null,
      totalTweetsAnalyzed: typeof raw.totalTweetsAnalyzed === 'number' && raw.totalTweetsAnalyzed > 0 ? raw.totalTweetsAnalyzed : null,
      daily: raw.daily,
      weekly: raw.weekly,
      monthly: raw.monthly,
      executiveSummary: raw.executiveSummary || LATEST_CONSULTANT_REPORT.executiveSummary,
      sections: raw.sections || LATEST_CONSULTANT_REPORT.sections,
      morningBrief: mb,
      arxivDaily: normalizeArxiv(raw.arxivDaily),
      arxivWeeklyBest: normalizeArxiv(raw.arxivWeeklyBest),
      huggingFaceBest: hfBest,
      huggingFaceTrending: hfTrending,
      githubRadar: normalizedGh,
      hackerNewsPulse: hnPulse,
      dailyGlossary: normalizedGlossary,
      twitterPulse: twPulse
    };
  }, [activeReportData]);

  // Sistem Bilgileri ve Telemetri Verilerinin Hesaplanması (Web ve Mobil Modal İçin Ortak)
  const telemetryData = useMemo(() => {
    const p1 = report.phase1TokenUsage;
    const p2 = report.phase2TokenUsage;
    const tu = report.tokenUsage;
    const model1Name = report.phase1Model || (report.activeModel ? report.activeModel.replace(' (deepseek-flash)', '') : 'DeepSeek v4.1 Flash');
    const model2Name = report.phase2Model || (report.activeModel ? report.activeModel.replace(' (deepseek-flash)', '') : 'DeepSeek v4.1 Flash');

    const hasPhases = p1 && p2 && typeof p1.promptTokens === 'number' && typeof p2.promptTokens === 'number';

    const p1PromptK = hasPhases ? (p1.promptTokens / 1000).toFixed(1) : '0.0';
    const p1ReasoningK = hasPhases && typeof p1.reasoningTokens === 'number' ? (p1.reasoningTokens / 1000).toFixed(1) : '0.0';
    const p1FinalVal = hasPhases ? (p1.finalTokens || Math.max(0, (p1.completionTokens || 0) - (p1.reasoningTokens || 0))) : 0;
    const p1FinalK = hasPhases ? (p1FinalVal / 1000).toFixed(1) : '0.0';
    const p1TotalK = hasPhases ? (p1.totalTokens / 1000).toFixed(1) : '0.0';

    const p2PromptK = hasPhases ? (p2.promptTokens / 1000).toFixed(1) : '0.0';
    const p2ReasoningK = hasPhases && typeof p2.reasoningTokens === 'number' ? (p2.reasoningTokens / 1000).toFixed(1) : '0.0';
    const p2FinalVal = hasPhases ? (p2.finalTokens || Math.max(0, (p2.completionTokens || 0) - (p2.reasoningTokens || 0))) : 0;
    const p2FinalK = hasPhases ? (p2FinalVal / 1000).toFixed(1) : '0.0';
    const p2TotalK = hasPhases ? (p2.totalTokens / 1000).toFixed(1) : '0.0';

    const totalK = hasPhases ? ((tu?.totalTokens || (p1.totalTokens + p2.totalTokens)) / 1000).toFixed(1) : (tu?.totalTokens ? (tu.totalTokens / 1000).toFixed(1) : '0.0');

    return {
      hasPhases,
      p1,
      p2,
      tu,
      model1Name,
      model2Name,
      p1PromptK,
      p1ReasoningK,
      p1FinalVal,
      p1FinalK,
      p1TotalK,
      p2PromptK,
      p2ReasoningK,
      p2FinalVal,
      p2FinalK,
      p2TotalK,
      totalK,
      durationSeconds: report.durationSeconds,
      startedAt: report.startedAt,
      completedAt: report.completedAt,
      activeModel: report.activeModel,
      totalPostsAnalyzed: report.totalPostsAnalyzed,
      totalTweetsAnalyzed: report.totalTweetsAnalyzed
    };
  }, [report]);

  // Haftalık ve Aylık için önceki tutulan gerçek arşiv verilerinden hesaplanan modeller
  const { historicalWeeklyTools, historicalMonthlyTools, toolArchiveFreqMap } = useMemo(() => {
    const archiveList = Object.entries(archiveModules)
      .filter(([filePath]) => !filePath.includes('archive-index.json'))
      .map(([filePath, mod]) => {
        const data = mod.default || mod;
        const match = filePath.match(/(\d{4}-\d{2}-\d{2})\.json/);
        const fileIso = match ? match[1] : (data?.isoDate || data?.date);
        return { fileIso, data };
      })
      .sort((a, b) => (b.fileIso || '').localeCompare(a.fileIso || ''));

    // Aktif seçili tarihe göre dosyaları filtrele (geçmiş tarihe bakılıyorsa o tarihten geriye doğru)
    let startIndex = 0;
    if (selectedDateId !== 'latest') {
      const idx = archiveList.findIndex(a => a.fileIso === selectedDateId);
      if (idx !== -1) startIndex = idx;
    }

    const availableFromSelected = archiveList.slice(startIndex);
    const weeklyFiles = availableFromSelected.slice(0, 7);
    const monthlyFiles = availableFromSelected.slice(0, 30);

    const aggregateFiles = (fileEntries, label) => {
      const toolMap = {};
      fileEntries.forEach(({ fileIso, data }) => {
        if (!data || !Array.isArray(data.daily)) return;
        data.daily.forEach(t => {
          const cleanName = (t.name || "").replace(/\s*\([^)]*\)/g, "").trim();
          if (!cleanName) return;
          const key = cleanName.toLowerCase();
          if (!toolMap[key]) {
            toolMap[key] = {
              id: t.id || key.replace(/[^a-z0-9]+/g, '-'),
              name: cleanName,
              category: t.category || "LLM",
              primaryFunction: t.primaryFunction || t.description || "",
              whyTrending: t.whyTrending || "",
              sources: [...(t.sources || [])],
              hypes: [],
              sentiments: [],
              dates: [],
              latestWhy: t.whyTrending
            };
          }
          toolMap[key].hypes.push(Number(t.hypeScore) || 7.0);
          toolMap[key].sentiments.push(Number(t.sentimentScore) || 75);
          toolMap[key].dates.push(fileIso);
          if (t.sources) {
            t.sources.forEach(s => {
              if (!toolMap[key].sources.includes(s)) toolMap[key].sources.push(s);
            });
          }
          if (t.primaryFunction) toolMap[key].primaryFunction = t.primaryFunction;
          if (t.whyTrending) toolMap[key].latestWhy = t.whyTrending;
        });
      });

      const list = Object.values(toolMap).map(t => {
        const freq = t.hypes.length;
        const avgHype = Number((t.hypes.reduce((a, b) => a + b, 0) / freq).toFixed(1));
        const avgSent = Math.round(t.sentiments.reduce((a, b) => a + b, 0) / freq);
        const sparkline = t.hypes.length >= 7 
          ? t.hypes.slice(-7) 
          : [...Array(Math.max(0, 7 - t.hypes.length)).fill(t.hypes[0] || 7.0), ...t.hypes];

        return {
          id: t.id,
          name: t.name,
          category: t.category,
          frequency: freq,
          hypeScore: avgHype,
          sentimentScore: avgSent,
          sparkline: sparkline,
          primaryFunction: t.primaryFunction,
          whyTrending: `${label} boyunca ${freq} gün gündemde kaldı. ${t.latestWhy || ''}`,
          badge: `${freq} Gün Gündem`,
          sources: t.sources.slice(0, 4)
        };
      });

      // 🚨 Kullanıcı Talebi: Önceki verilere göre en çok kere gündem olanlar ve hype sıralamasında yukarıda olanlar
      list.sort((a, b) => (b.frequency - a.frequency) || (Number(b.hypeScore) || 0) - (Number(a.hypeScore) || 0));
      return list;
    };

    // Tüm arşiv dosyalarından her aracın toplam kaç gün gündemde kaldığını hesapla
    const toolArchiveFreqMap = {};
    availableFromSelected.forEach(({ data }) => {
      if (!data || !Array.isArray(data.daily)) return;
      const seenInDate = new Set();
      data.daily.forEach(t => {
        const clean = (t.name || '').replace(/\s*\([^)]*\)/g, '').trim().toLowerCase();
        if (clean && !seenInDate.has(clean)) {
          seenInDate.add(clean);
          toolArchiveFreqMap[clean] = (toolArchiveFreqMap[clean] || 0) + 1;
        }
      });
    });

    return {
      historicalWeeklyTools: aggregateFiles(weeklyFiles, "Hafta"),
      historicalMonthlyTools: aggregateFiles(monthlyFiles, "Ay"),
      toolArchiveFreqMap
    };
  }, [selectedDateId]);

  const rawTools = useMemo(() => {
    const cleanToolNameGlobal = (name) => {
      if (!name || typeof name !== 'string') return "";
      return name.replace(/\s*\([^)]*\)/g, "").trim();
    };

    const badConceptPatterns = [
      /vibecoding/i,
      /maliyet/i,
      /utanç/i,
      /mandate/i,
      /güven sistemi/i,
      /anket/i,
      /felsefe/i,
      /tartışma/i,
      /kariyer/i,
      /will-win/i,
      /shame/i,
      /loss/i,
      /uncontrolled/i
    ];

    let list;
    if (timeframe === 'weekly') {
      list = historicalWeeklyTools.length > 0 ? historicalWeeklyTools : (activeReportData?.weekly || MOCK_TOOLS_DATA.weekly);
    } else if (timeframe === 'monthly') {
      list = historicalMonthlyTools.length > 0 ? historicalMonthlyTools : (activeReportData?.monthly || MOCK_TOOLS_DATA.monthly);
    } else {
      const dailyList = activeReportData?.daily || MOCK_TOOLS_DATA.daily || [];
      list = dailyList.map(t => {
        const clean = (t.name || '').replace(/\s*\([^)]*\)/g, '').trim().toLowerCase();
        const freq = t.frequency || toolArchiveFreqMap?.[clean] || 1;
        return { ...t, frequency: freq };
      });
    }

    return (list || [])
      .filter(t => {
        const n = t.name || '';
        const id = t.id || '';
        return !badConceptPatterns.some(p => p.test(n) || p.test(id));
      })
      .map(t => {
        const rawCat = t.category || 'LLM';
        const cleanCat = (rawCat === 'LLM (Model)' || rawCat === 'LLM') ? 'LLM' : rawCat;
        return {
          ...t,
          name: cleanToolNameGlobal(t.name),
          category: cleanCat
        };
      })
      .sort((a, b) => {
        if (timeframe === 'weekly' || timeframe === 'monthly') {
          return (Number(b.frequency) || 0) - (Number(a.frequency) || 0) || (Number(b.hypeScore) || 0) - (Number(a.hypeScore) || 0);
        }
        return (Number(b.hypeScore) || 0) - (Number(a.hypeScore) || 0);
      });
  }, [activeReportData, timeframe, historicalWeeklyTools, historicalMonthlyTools, toolArchiveFreqMap]);

  // Filter tools by category (Haftalık/Aylıkta gün sayısı ve hype, 24 saatlikte kesin hype puanı)
  const filteredTools = useMemo(() => {
    let result = rawTools;
    if (selectedCategory !== 'all') {
      result = result.filter(t => {
        const cat = t.category === 'LLM (Model)' ? 'LLM' : t.category;
        const sel = selectedCategory === 'LLM (Model)' ? 'LLM' : selectedCategory;
        return cat === sel;
      });
    }
    if (timeframe === 'weekly' || timeframe === 'monthly') {
      return [...result].sort((a, b) => (Number(b.frequency) || 0) - (Number(a.frequency) || 0) || (Number(b.hypeScore) || 0) - (Number(a.hypeScore) || 0));
    }
    return [...result].sort((a, b) => (Number(b.hypeScore) || 0) - (Number(a.hypeScore) || 0));
  }, [rawTools, selectedCategory, timeframe]);

  const showDaysCol = timeframe === 'weekly' || timeframe === 'monthly';

  // Lider Model Senkronizasyonu (Sarı Kısım: En Çok Konuşulan Model & En Beğenilen Model):
  const leaderBreakdown = useMemo(() => {
    const list = filteredTools.length > 0 ? filteredTools : (report.daily || []);
    if (!list.length) return null;

    // 1. En Çok Konuşulan Model (Hype Skoru Zirvesi, daily[0])
    const mostDiscussedProduct = list[0];
    const mbDiscussed = report.morningBrief?.mostDiscussed || report.morningBrief?.leader;

    // 2. En Beğenilen Model (Sentiment / Memnuniyet Skoru Zirvesi)
    const sortedBySentiment = [...list].sort((a, b) => (Number(b.sentimentScore) || 0) - (Number(a.sentimentScore) || 0));
    const mostLovedProduct = sortedBySentiment[0] || list[0];
    const mbLoved = report.morningBrief?.mostLoved;

    const isDiscussedMatch = mbDiscussed?.name && mostDiscussedProduct?.name && (
      mbDiscussed.name.toLowerCase().includes(mostDiscussedProduct.name.toLowerCase()) ||
      mostDiscussedProduct.name.toLowerCase().includes(mbDiscussed.name.toLowerCase())
    );

    const isLovedMatch = mbLoved?.name && mostLovedProduct?.name && (
      mbLoved.name.toLowerCase().includes(mostLovedProduct.name.toLowerCase()) ||
      mostLovedProduct.name.toLowerCase().includes(mbLoved.name.toLowerCase())
    );

    return {
      mostDiscussed: {
        name: mostDiscussedProduct.name,
        badge: mostDiscussedProduct.badge || "Günün 1 Numarası",
        hypeScore: mostDiscussedProduct.hypeScore,
        sentimentScore: mostDiscussedProduct.sentimentScore,
        description: (isDiscussedMatch && mbDiscussed?.description)
          ? mbDiscussed.description
          : (mostDiscussedProduct.whyTrending || mostDiscussedProduct.primaryFunction || "Günün en yüksek konuşulma hacmine ve gündemine sahip lider modeli.")
      },
      mostLoved: {
        name: mostLovedProduct.name,
        badge: mostLovedProduct.badge || "Memnuniyet Lideri",
        hypeScore: mostLovedProduct.hypeScore,
        sentimentScore: mostLovedProduct.sentimentScore,
        description: (isLovedMatch && mbLoved?.description)
          ? mbLoved.description
          : (mostLovedProduct.whyTrending || mostLovedProduct.primaryFunction || "Topluluk tarafından en çok övgü alan ve en yüksek memnuniyet puanına sahip model.")
      }
    };
  }, [filteredTools, report.daily, report.morningBrief]);

  // Average Hype calculation for status bar
  const avgHypeScore = useMemo(() => {
    if (!filteredTools.length) return '0.0';
    const sum = filteredTools.reduce((acc, t) => acc + (t.hypeScore || 0), 0);
    return (sum / filteredTools.length).toFixed(1);
  }, [filteredTools]);

  const toggleCategory = (cat) => {
    setSelectedCategory(prev => prev === cat ? null : cat);
  };

  const selectedTool = filteredTools.find(t => t.id === expandedId) || filteredTools[0];

  const handleCopyBrief = () => {
    const mb = report?.morningBrief;
    if (!mb) return;
    const bulletsText = (mb.bullets || []).map(b => `${b.icon || '📌'} ${b.tag}: ${b.text}`).join('\n\n');
    const disc = leaderBreakdown?.mostDiscussed;
    const loved = leaderBreakdown?.mostLoved;

    const fullText = `☕ aitrendleri.com - Günlük AI İstihbarat Brifingi (${report.date || 'Bugün'})

🔥 EN ÇOK KONUŞULAN MODEL: ${disc?.name || mb.leader?.name || 'Lider Model'} (${disc?.badge || 'Zirve'} | Hype: ${disc?.hypeScore || 0}/10)
${disc?.description || mb.leader?.description || ''}

⭐ EN BEĞENİLEN MODEL: ${loved?.name || 'Memnuniyet Lideri'} (${loved?.badge || 'Övgü'} | Beğeni: ${((loved?.sentimentScore || 0) / 10).toFixed(1)}/10)
${loved?.description || ''}

⚡ DÜNYADA YAPAY ZEKA BUGÜN (Madde Madde):
${bulletsText}

🔗 Canlı Terminal & Ayrıntılar: https://aitrendleri.com`;

    if (navigator?.clipboard) {
      navigator.clipboard.writeText(fullText);
      setCopiedBrief(true);
      setTimeout(() => setCopiedBrief(false), 2500);
    }
  };

  // GitHub Radarı ve Hacker News için Satır Bazlı Hizalama Kümeleri (Subgrid chunking)
  const githubChunks = useMemo(() => {
    const list = (report.githubRadar && report.githubRadar[githubTimeframe]) || (report.githubRadar && report.githubRadar.daily) || [];
    const chunks = [];
    for (let i = 0; i < list.length; i += 3) {
      chunks.push(list.slice(i, i + 3));
    }
    return chunks;
  }, [report.githubRadar, githubTimeframe]);

  const hnChunks = useMemo(() => {
    const list = report.hackerNewsPulse?.discussions || [];
    const chunks = [];
    for (let i = 0; i < list.length; i += 2) {
      chunks.push(list.slice(i, i + 2));
    }
    return chunks;
  }, [report.hackerNewsPulse]);

  const experimentChunks = useMemo(() => {
    const list = report.twitterPulse?.experimentsAndDevelopments || [];
    const chunks = [];
    for (let i = 0; i < list.length; i += 2) {
      chunks.push(list.slice(i, i + 2));
    }
    return chunks;
  }, [report.twitterPulse]);

  const glossaryChunks = useMemo(() => {
    const list = report.dailyGlossary || [];
    const chunks = [];
    for (let i = 0; i < list.length; i += 3) {
      chunks.push(list.slice(i, i + 3));
    }
    return chunks;
  }, [report.dailyGlossary]);

  const sectionPairs = useMemo(() => {
    const secs = report.sections || [];
    const pairs = [];
    for (let i = 0; i < secs.length; i += 2) {
      pairs.push(secs.slice(i, i + 2));
    }
    return pairs;
  }, [report.sections]);

  // Excel Category Badge Styles (Clean Excel Cell Style)
  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'LLM':
      case 'LLM (Model)':
        return 'bg-amber-50 text-amber-900 border-amber-300';
      case 'Yerel Model':
        return 'bg-emerald-50 text-emerald-900 border-emerald-300';
      case 'IDE / Editör':
        return 'bg-blue-50 text-blue-900 border-blue-300';
      case 'CLI / Terminal':
        return 'bg-teal-50 text-teal-900 border-teal-300';
      case 'Otonom Agent':
        return 'bg-purple-50 text-purple-900 border-purple-300';
      case 'Otomasyon':
        return 'bg-cyan-50 text-cyan-900 border-cyan-300';
      case 'Altyapı & SDK':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'Bulut & Platform':
        return 'bg-sky-50 text-sky-900 border-sky-300';
      case 'Medya / Üretim':
        return 'bg-rose-50 text-rose-900 border-rose-300';
      case 'Şirket / Lab':
        return 'bg-orange-50 text-orange-900 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getToolSentiment = (tool) => {
    if (!tool) return { score: 70, label: 'Karışık', colorClass: 'text-amber-700', badgeClass: 'bg-amber-50 text-amber-800 border-amber-200' };
    
    let score = null;
    if (typeof tool.sentimentScore === 'number' && !isNaN(tool.sentimentScore)) {
      score = Math.min(100, Math.max(0, Math.round(tool.sentimentScore)));
    } else {
      const delta = Number(tool.scoreDelta || 0);
      const badge = (tool.badge || '').toLowerCase();
      const why = (tool.whyTrending || '').toLowerCase();
      const isCriticized = badge.includes('eleştir') || badge.includes('şikayet') || badge.includes('düşüş') || badge.includes('tepki') || badge.includes('kesinti') || why.includes('şikayet') || why.includes('eleştiri') || why.includes('tepki') || tool.trend === 'cooling';
      const isPraised = badge.includes('lider') || badge.includes('favori') || badge.includes('verim') || badge.includes('rekor') || why.includes('övgü') || why.includes('başarılı') || why.includes('beğen') || delta > 0 || tool.trend === 'skyrocketing';
      
      if (isCriticized) {
        score = Math.max(20, Math.min(55, Math.round(40 + delta * 10)));
      } else if (isPraised) {
        score = Math.min(99, Math.max(80, Math.round(88 + delta * 6)));
      } else {
        score = 70;
      }
    }

    return {
      score,
      score10: (score / 10).toFixed(1),
      label: score >= 80 ? 'Beğenildi' : score >= 60 ? 'Karışık' : 'Tepkili',
      colorClass: score >= 80 ? 'text-emerald-700' : score >= 60 ? 'text-amber-700' : 'text-rose-600',
      badgeClass: score >= 80 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : score >= 60 ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200'
    };
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-800 font-sans antialiased flex flex-col selection:bg-[#107c41] selection:text-white">
      
      {/* 1. EXCEL YEŞİL BAŞLIK ÇUBUĞU (Office Ribbon Bar) */}
      <header className="bg-[#107c41] text-white select-none shadow-sm">
        {/* Üst Logo, Dosya Adı ve Geçmiş Tarih Seçici */}
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          
          {/* MASAÜSTÜ SOL: Logo ve yanında Tarih Dropdown (sm ve üzeri, birebir orijinal tek satır) */}
          <div className="hidden sm:flex items-center gap-2.5 sm:gap-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-7 h-7 bg-white text-[#107c41] font-black rounded text-xs shadow-inner tracking-tighter">
                AI
              </div>
              <span className="font-bold text-base tracking-wide font-mono">aitrendleri.com</span>
            </div>

            {/* Geçmiş Tarih / Arşiv Seçici Dropdown (aitrendleri.com'un Sağında) */}
            <div className="flex items-center gap-1.5 bg-[#0e6b37] border border-emerald-400/40 px-2 py-1 rounded text-white shadow-xs">
              <Calendar className="w-3.5 h-3.5 text-emerald-300 flex-shrink-0" />
              <select
                value={selectedDateId}
                onChange={(e) => setSelectedDateId(e.target.value)}
                className="bg-transparent text-white font-mono text-[11px] sm:text-xs font-semibold focus:outline-none cursor-pointer pr-1"
                title="Geçmiş günlerin sıralamasını ve raporunu görüntüle"
              >
                {availableDates.map(d => (
                  <option key={d.id} value={d.id} className="bg-slate-800 text-white font-sans text-xs">
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* MOBİL SOL: Logo üstte, Tarih aitrendleri.com'un altında (sm altı mobil) */}
          <div className="flex sm:hidden flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 bg-white text-[#107c41] font-black rounded text-xs shadow-inner tracking-tighter">
                AI
              </div>
              <span className="font-bold text-base tracking-wide font-mono">aitrendleri.com</span>
            </div>

            {/* Geçmiş Tarih / Arşiv Seçici Dropdown (Mobilde aitrendleri.com'un Altında) */}
            <div className="flex items-center gap-1.5 bg-[#0e6b37] border border-emerald-400/40 px-2 py-1 rounded text-white shadow-xs w-fit">
              <Calendar className="w-3.5 h-3.5 text-emerald-300 flex-shrink-0" />
              <select
                value={selectedDateId}
                onChange={(e) => setSelectedDateId(e.target.value)}
                className="bg-transparent text-white font-mono text-[11px] font-semibold focus:outline-none cursor-pointer pr-1"
                title="Geçmiş günlerin sıralamasını ve raporunu görüntüle"
              >
                {availableDates.map(d => (
                  <option key={d.id} value={d.id} className="bg-slate-800 text-white font-sans text-xs">
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sağ Durum: Model / İcra Telemetrisi Bilgisi */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 text-xs font-mono text-emerald-100 flex-wrap">

            {/* 📱 MOBİL: "Sistem Bilgileri" Butonu (Mobilde saniye gösterilmez, butona basınca modal açılır) */}
            <button
              type="button"
              onClick={() => setIsSystemInfoOpen(true)}
              className="lg:hidden flex items-center gap-1.5 bg-[#0c592d] hover:bg-[#094723] active:scale-95 border border-emerald-400/40 px-2.5 py-1.5 rounded text-xs font-mono font-bold text-white shadow-xs transition cursor-pointer"
              title="Sistem Bilgileri ve Telemetri Verilerini Görüntüle"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
              <span>Sistem Bilgileri</span>
            </button>

            {/* ⚡ MASAÜSTÜ: 1. LLM & 2. LLM Telemetrisi (Birebir Eski Kusursuz Hali) */}
            {(() => {
              const p1 = report.phase1TokenUsage;
              const p2 = report.phase2TokenUsage;
              const tu = report.tokenUsage;

              if (p1 && p2 && typeof p1.promptTokens === 'number' && typeof p2.promptTokens === 'number') {
                const model1Name = report.phase1Model || (report.activeModel ? report.activeModel.replace(' (deepseek-flash)', '') : 'DeepSeek v4.1 Flash');
                const model2Name = report.phase2Model || (report.activeModel ? report.activeModel.replace(' (deepseek-flash)', '') : 'DeepSeek v4.1 Flash');

                const p1PromptK = (p1.promptTokens / 1000).toFixed(1);
                const p1ReasoningK = typeof p1.reasoningTokens === 'number' ? (p1.reasoningTokens / 1000).toFixed(1) : '0.0';
                const p1FinalVal = p1.finalTokens || Math.max(0, (p1.completionTokens || 0) - (p1.reasoningTokens || 0));
                const p1FinalK = (p1FinalVal / 1000).toFixed(1);
                const p1TotalK = (p1.totalTokens / 1000).toFixed(1);

                const p2PromptK = (p2.promptTokens / 1000).toFixed(1);
                const p2ReasoningK = typeof p2.reasoningTokens === 'number' ? (p2.reasoningTokens / 1000).toFixed(1) : '0.0';
                const p2FinalVal = p2.finalTokens || Math.max(0, (p2.completionTokens || 0) - (p2.reasoningTokens || 0));
                const p2FinalK = (p2FinalVal / 1000).toFixed(1);
                const p2TotalK = (p2.totalTokens / 1000).toFixed(1);

                const totalK = ((tu?.totalTokens || (p1.totalTokens + p2.totalTokens)) / 1000).toFixed(1);

                return (
                  <div className="hidden lg:flex items-center gap-2">
                    {/* Saniye (Üstte / 1. LLM Hizası) ve Saat/Dakika (Altta / 2. LLM Hizası) */}
                    {typeof report.durationSeconds === 'number' && report.durationSeconds > 0 && (
                      <div className="flex flex-col justify-between py-1 px-2.5 bg-[#0c592d] border border-emerald-400/30 rounded text-[11px] font-mono shadow-xs h-[50px]">
                        {/* SATIR 1: Saniye (1. LLM ile tam aynı yatay hizada) */}
                        <div 
                          className="flex items-center gap-1 text-amber-300 font-semibold whitespace-nowrap leading-none pt-0.5"
                          title={`Toplam Çalışma Süresi: ${report.durationSeconds} saniye`}
                        >
                          <Clock className="w-3 h-3 text-amber-300 flex-shrink-0" />
                          <span>{report.durationSeconds}s</span>
                        </div>

                        {/* SATIR 2: Dakika / Saat (2. LLM ile tam aynı yatay hizada) */}
                        {report.startedAt && report.completedAt ? (
                          <div 
                            className="flex items-center gap-1 text-emerald-200 font-medium whitespace-nowrap border-t border-emerald-400/20 pt-1 leading-none text-[10.5px]"
                            title={`Tetiklenme Saati: ${report.startedAt} | Nihai Çıktı Saati: ${report.completedAt}`}
                          >
                            <span className="text-emerald-300 font-bold">Saat:</span>
                            <span>{report.startedAt.slice(0, 5)} ➔ {report.completedAt.slice(0, 5)}</span>
                          </div>
                        ) : (
                          <div className="border-t border-emerald-400/20 pt-1 text-[10px] text-emerald-300/60 leading-none">
                            Canlı
                          </div>
                        )}
                      </div>
                    )}

                    {/* İki LLM Alt Alta ve Sütun Sütun Tam Hizalı Izgara */}
                    <div 
                      className="grid grid-cols-[auto_auto_auto_auto_auto_auto_auto_auto_auto_auto] items-center gap-x-2 gap-y-1 bg-[#0c592d] border border-emerald-400/30 px-3 py-1 rounded text-[11px] font-mono text-emerald-100 shadow-xs h-[50px]"
                      title={`1. LLM (${model1Name}): Girdi: ${p1.promptTokens?.toLocaleString()} | Düşünce: ${(p1.reasoningTokens || 0)?.toLocaleString()} | Nihai: ${p1FinalVal?.toLocaleString()} | Toplam: ${p1.totalTokens?.toLocaleString()}\n2. LLM (${model2Name}): Girdi: ${p2.promptTokens?.toLocaleString()} | Düşünce: ${(p2.reasoningTokens || 0)?.toLocaleString()} | Nihai: ${p2FinalVal?.toLocaleString()} | Toplam: ${p2.totalTokens?.toLocaleString()}`}
                    >
                      {/* SATIR 1: 1. LLM */}
                      <span className="font-bold text-emerald-300 flex items-center gap-1 whitespace-nowrap">
                        <Zap className="w-3 h-3 text-emerald-300 flex-shrink-0" />
                        1. LLM:
                      </span>
                      <span className="bg-[#094723] text-white px-1.5 py-0.2 rounded font-semibold text-[10.5px] border border-emerald-400/20 whitespace-nowrap text-center">
                        {model1Name}
                      </span>
                      <span className="text-emerald-400/40">|</span>
                      <span className="whitespace-nowrap">Girdi: <strong className="text-emerald-200 font-bold">{p1PromptK}k</strong></span>
                      <span className="text-emerald-400/40">|</span>
                      <span className="whitespace-nowrap">Düşünce: <strong className="text-purple-300 font-bold">{p1ReasoningK}k</strong></span>
                      <span className="text-emerald-400/40">|</span>
                      <span className="whitespace-nowrap">Nihai: <strong className="text-yellow-300 font-bold">{p1FinalK}k</strong></span>
                      <span className="text-emerald-400/40">|</span>
                      <span className="whitespace-nowrap">Toplam: <strong className="text-white font-bold">{p1TotalK}k</strong></span>

                      {/* SATIR 2: 2. LLM (Milimetrik Hizalı) */}
                      <span className="font-bold text-cyan-300 flex items-center gap-1 whitespace-nowrap border-t border-emerald-400/20 pt-1">
                        <Zap className="w-3 h-3 text-cyan-300 flex-shrink-0" />
                        2. LLM:
                      </span>
                      <div className="border-t border-emerald-400/20 pt-1">
                        <span className="bg-[#094723] text-white px-1.5 py-0.2 rounded font-semibold text-[10.5px] border border-emerald-400/20 whitespace-nowrap text-center inline-block w-full">
                          {model2Name}
                        </span>
                      </div>
                      <span className="text-emerald-400/40 border-t border-emerald-400/20 pt-1">|</span>
                      <span className="whitespace-nowrap border-t border-emerald-400/20 pt-1">Girdi: <strong className="text-emerald-200 font-bold">{p2PromptK}k</strong></span>
                      <span className="text-emerald-400/40 border-t border-emerald-400/20 pt-1">|</span>
                      <span className="whitespace-nowrap border-t border-emerald-400/20 pt-1">Düşünce: <strong className="text-purple-300 font-bold">{p2ReasoningK}k</strong></span>
                      <span className="text-emerald-400/40 border-t border-emerald-400/20 pt-1">|</span>
                      <span className="whitespace-nowrap border-t border-emerald-400/20 pt-1">Nihai: <strong className="text-yellow-300 font-bold">{p2FinalK}k</strong></span>
                      <span className="text-emerald-400/40 border-t border-emerald-400/20 pt-1">|</span>
                      <span className="whitespace-nowrap border-t border-emerald-400/20 pt-1">Toplam: <strong className="text-white font-bold">{p2TotalK}k</strong></span>
                    </div>

                    {/* Bileşik Toplam Rozeti */}
                    <div 
                      className="hidden xl:flex flex-col justify-center items-center bg-[#094723] border border-emerald-400/40 px-2.5 py-1 rounded font-mono shadow-xs text-center cursor-help h-[50px]"
                      title={`Bileşik Token Toplamı (1. LLM + 2. LLM):\n• Girdi: ${tu?.promptTokens?.toLocaleString()} token\n• Düşünce: ${tu?.reasoningTokens?.toLocaleString()} token\n• Nihai Çıktı: ${tu?.finalTokens?.toLocaleString()} token\n• Toplam: ${tu?.totalTokens?.toLocaleString()} token`}
                    >
                      <span className="text-yellow-300 font-bold text-[9.5px] uppercase">Bileşik Toplam</span>
                      <span className="text-xs font-black text-white">{totalK}k</span>
                    </div>

                    {/* Veri Kaynağı Hacim Rozetleri (Reddit & X Twitter - Yalnızca gerçek veri varsa gösterilir) */}
                    {(report.totalPostsAnalyzed || report.totalTweetsAnalyzed) && (
                      <div 
                        className="flex flex-col justify-between py-1 px-2.5 bg-[#0c592d] border border-emerald-400/30 rounded text-[11px] font-mono shadow-xs h-[50px]"
                        title={`Taranan Veri Havuzu:${report.totalPostsAnalyzed ? `\n• Reddit: ${report.totalPostsAnalyzed} gönderi ve tartışma` : ''}${report.totalTweetsAnalyzed ? `\n• X (Twitter): ${report.totalTweetsAnalyzed} tweet` : ''}`}
                      >
                        {/* SATIR 1: Reddit (1. LLM ile tam aynı yatay hizada) */}
                        {report.totalPostsAnalyzed ? (
                          <div className="grid grid-cols-[14px_44px_6px_auto] items-center gap-x-1 leading-none pt-0.5">
                            <div className="flex items-center justify-center">
                              <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0"></span>
                            </div>
                            <span className="text-emerald-100 font-semibold">Reddit</span>
                            <span className="text-emerald-300 font-bold text-center">:</span>
                            <strong className="text-white font-bold">{report.totalPostsAnalyzed}</strong>
                          </div>
                        ) : (
                          <div className="grid grid-cols-[14px_44px_6px_auto] items-center gap-x-1 leading-none pt-0.5">
                            <div className="flex items-center justify-center">
                              <span className="w-3 h-3 bg-black text-white text-[8px] font-black flex items-center justify-center rounded-xs shrink-0">𝕏</span>
                            </div>
                            <span className="text-emerald-200 font-semibold">X</span>
                            <span className="text-emerald-300 font-bold text-center">:</span>
                            <strong className="text-white font-bold">{report.totalTweetsAnalyzed}</strong>
                          </div>
                        )}

                        {/* SATIR 2: X (Twitter) varsa gösterilir; geçmişte X verisi yoksa asla sallama veri gösterilmez */}
                        {report.totalPostsAnalyzed && report.totalTweetsAnalyzed ? (
                          <div className="grid grid-cols-[14px_44px_6px_auto] items-center gap-x-1 border-t border-emerald-400/20 pt-1 leading-none text-[10.5px]">
                            <div className="flex items-center justify-center">
                              <span className="w-3 h-3 bg-black text-white text-[8px] font-black flex items-center justify-center rounded-xs shrink-0">𝕏</span>
                            </div>
                            <span className="text-emerald-200 font-semibold">X</span>
                            <span className="text-emerald-300 font-bold text-center">:</span>
                            <strong className="text-white font-bold">{report.totalTweetsAnalyzed}</strong>
                          </div>
                        ) : (
                          <div className="border-t border-emerald-400/20 pt-1 leading-none text-[10px] text-emerald-300/70 whitespace-nowrap">
                            {report.totalPostsAnalyzed ? 'Tartışma Havuzu' : 'Tweet Havuzu'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              // Tekil / Geçmiş Arşiv Fallback
              return (
                <div className="hidden lg:flex items-center gap-1.5">
                  {typeof report.durationSeconds === 'number' && report.durationSeconds > 0 && (
                    <div 
                      className="flex items-center gap-1 bg-[#0c592d] border border-emerald-400/30 px-2 py-1 rounded text-[11px] font-semibold text-white shadow-xs"
                      title={`Toplam Çalışma Süresi: ${report.durationSeconds} saniye`}
                    >
                      <Clock className="w-3 h-3 text-amber-300 flex-shrink-0" />
                      <span>{report.durationSeconds}s</span>
                    </div>
                  )}
                  {report.activeModel && (
                    <div 
                      className="flex items-center gap-1 bg-[#0c592d] border border-emerald-400/30 px-2 py-1 rounded text-[11px] font-semibold text-white shadow-xs"
                      title={`Analiz ve Çıkarım Motoru: ${report.activeModel}`}
                    >
                      <Cpu className="w-3 h-3 text-cyan-300 flex-shrink-0" />
                      <span>{report.activeModel.replace(' (deepseek-flash)', '')}</span>
                    </div>
                  )}
                  {tu && typeof tu.promptTokens === 'number' && tu.promptTokens > 0 && (
                    <div 
                      className="flex items-center gap-1.5 bg-[#0c592d] border border-emerald-400/30 px-2.5 py-1 rounded text-[11px] font-semibold text-emerald-100 shadow-xs cursor-help"
                      title={`Token Telemetrisi:\n• Girdi: ${tu.promptTokens?.toLocaleString()}\n• Düşünce: ${(tu.reasoningTokens || 0)?.toLocaleString()}\n• Nihai: ${(tu.finalTokens || Math.max(0, (tu.completionTokens || 0) - (tu.reasoningTokens || 0)))?.toLocaleString()}\n• Toplam: ${tu.totalTokens?.toLocaleString()}`}
                    >
                      <Zap className="w-3 h-3 text-yellow-300 flex-shrink-0" />
                      <div className="flex items-center gap-1.5 font-mono">
                        <span>Girdi: <strong className="text-emerald-200 font-bold">{(tu.promptTokens / 1000).toFixed(1)}k</strong></span>
                        <span className="text-emerald-400/40">|</span>
                        <span>Düşünce: <strong className="text-purple-300 font-bold">{((tu.reasoningTokens || 0) / 1000).toFixed(1)}k</strong></span>
                        <span className="text-emerald-400/40">|</span>
                        <span>Nihai: <strong className="text-yellow-300 font-bold">{(((tu.finalTokens || Math.max(0, (tu.completionTokens || 0) - (tu.reasoningTokens || 0)))) / 1000).toFixed(1)}k</strong></span>
                      </div>
                    </div>
                  )}
                  {(report.totalPostsAnalyzed || report.totalTweetsAnalyzed) && (
                    <div 
                      className="flex flex-col justify-between py-1 px-2.5 bg-[#0c592d] border border-emerald-400/30 rounded text-[11px] font-mono shadow-xs h-[50px]"
                      title={`Taranan Veri Havuzu:${report.totalPostsAnalyzed ? `\n• Reddit: ${report.totalPostsAnalyzed} gönderi ve tartışma` : ''}${report.totalTweetsAnalyzed ? `\n• X (Twitter): ${report.totalTweetsAnalyzed} tweet` : ''}`}
                    >
                      {report.totalPostsAnalyzed ? (
                        <div className="grid grid-cols-[14px_44px_6px_auto] items-center gap-x-1 leading-none pt-0.5">
                          <div className="flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0"></span>
                          </div>
                          <span className="text-emerald-100 font-semibold">Reddit</span>
                          <span className="text-emerald-300 font-bold text-center">:</span>
                          <strong className="text-white font-bold">{report.totalPostsAnalyzed}</strong>
                        </div>
                      ) : (
                        <div className="grid grid-cols-[14px_44px_6px_auto] items-center gap-x-1 leading-none pt-0.5">
                          <div className="flex items-center justify-center">
                            <span className="w-3 h-3 bg-black text-white text-[8px] font-black flex items-center justify-center rounded-xs shrink-0">𝕏</span>
                          </div>
                          <span className="text-emerald-200 font-semibold">X</span>
                          <span className="text-emerald-300 font-bold text-center">:</span>
                          <strong className="text-white font-bold">{report.totalTweetsAnalyzed}</strong>
                        </div>
                      )}

                      {report.totalPostsAnalyzed && report.totalTweetsAnalyzed ? (
                        <div className="grid grid-cols-[14px_44px_6px_auto] items-center gap-x-1 border-t border-emerald-400/20 pt-1 leading-none text-[10.5px]">
                          <div className="flex items-center justify-center">
                            <span className="w-3 h-3 bg-black text-white text-[8px] font-black flex items-center justify-center rounded-xs shrink-0">𝕏</span>
                          </div>
                          <span className="text-emerald-200 font-semibold">X</span>
                          <span className="text-emerald-300 font-bold text-center">:</span>
                          <strong className="text-white font-bold">{report.totalTweetsAnalyzed}</strong>
                        </div>
                      ) : (
                        <div className="border-t border-emerald-400/20 pt-1 leading-none text-[10px] text-emerald-300/70 whitespace-nowrap">
                          {report.totalPostsAnalyzed ? 'Tartışma Havuzu' : 'Tweet Havuzu'}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>

        {/* 2. ZAMAN SEÇİCİ SEKMELER & BÜLTEN BUTONU (6 Buton: 2x3 Mobil, 3x2 Tablet, 6x1 Masaüstü) */}
        <div className="max-w-7xl mx-auto px-2 sm:px-4 border-t border-[#0e6b37] pt-2 pb-1.5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 w-full">
            {[
              { id: 'daily', label: '📊 24 Saatlik' },
              { id: 'weekly', label: '📈 1 Haftalık' },
              { id: 'monthly', label: '🪐 1 Aylık' },
              { id: 'report', label: '📋 Danışman Raporu' },
              { id: 'glossary', label: '📖 Günün Sözlüğü' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTimeframe(tab.id)}
                className={`h-9 flex items-center justify-center transition font-mono text-[11px] sm:text-xs font-bold rounded shadow-xs text-center cursor-pointer ${
                  timeframe === tab.id
                    ? 'bg-white text-[#107c41] shadow-xs'
                    : 'text-emerald-100 bg-[#0e6b37] hover:bg-[#0b5e30]'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setIsNewsletterModalOpen(true)}
              className="h-9 flex items-center justify-center gap-1.5 transition font-mono text-[11px] sm:text-xs font-bold rounded shadow-xs text-center text-emerald-100 bg-[#0e6b37] hover:bg-[#0b5e30] hover:text-white cursor-pointer"
              title="Her sabah günün özetini e-posta olarak almak için abone olun"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-200" />
              <span>Bültene Abone Ol</span>
            </button>
          </div>
        </div>
      </header>

      {/* 📱 MOBİL SİSTEM BİLGİLERİ MODALI */}
      {isSystemInfoOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
          onClick={() => setIsSystemInfoOpen(false)}
        >
          <div 
            className="bg-white border border-[#cbd5e1] rounded-lg shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto font-mono text-xs flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#107c41] text-white px-4 py-3 flex items-center justify-between rounded-t-lg select-none">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-white text-[#107c41] flex items-center justify-center font-black text-xs shadow-inner">
                  AI
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight flex items-center gap-1.5">
                    <span>Sistem Bilgileri &amp; Telemetri</span>
                  </h3>
                  <p className="text-[10px] text-emerald-100 font-normal">
                    {report.date || 'Canlı'} Raporu Yürütme Detayları
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSystemInfoOpen(false)}
                className="w-7 h-7 rounded hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                title="Kapat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-3 text-slate-800">
              
              {/* 1. Süre & Zaman Bilgisi */}
              <div className="bg-[#f8fafc] border border-slate-200 rounded p-3 space-y-2">
                <span className="font-bold text-[11px] text-slate-800 uppercase flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Yürütme Süresi &amp; Zamanı</span>
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2 rounded border border-slate-200/80">
                    <span className="text-[10px] text-slate-500 block">Çalışma Süresi:</span>
                    <strong className="text-amber-700 text-sm font-bold">
                      {telemetryData.durationSeconds ? `${telemetryData.durationSeconds} saniye` : 'Canlı Akış'}
                    </strong>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200/80">
                    <span className="text-[10px] text-slate-500 block">Tetiklenme &amp; Çıktı:</span>
                    <strong className="text-slate-800 text-xs">
                      {telemetryData.startedAt && telemetryData.completedAt 
                        ? `${telemetryData.startedAt.slice(0, 5)} ➔ ${telemetryData.completedAt.slice(0, 5)}`
                        : 'Canlı'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* 2. 1. LLM ve 2. LLM Ayrı Telemetri Dökümü */}
              {telemetryData.hasPhases ? (
                <>
                  {/* 1. LLM */}
                  <div className="bg-[#f0fdf4] border border-emerald-200 rounded p-3 space-y-2">
                    <div className="flex items-center justify-between border-b border-emerald-200/60 pb-1.5 flex-wrap gap-1">
                      <span className="font-bold text-[11px] text-emerald-950 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-emerald-600" />
                        <span>1. LLM (Ana İstihbarat)</span>
                      </span>
                      <span className="bg-[#094723] text-white px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-400/30">
                        {telemetryData.model1Name}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 text-center">
                      <div className="bg-white p-1.5 rounded border border-emerald-100">
                        <span className="text-[9px] text-slate-500 block">Girdi</span>
                        <strong className="text-emerald-700 text-xs">{telemetryData.p1PromptK}k</strong>
                      </div>
                      <div className="bg-white p-1.5 rounded border border-emerald-100">
                        <span className="text-[9px] text-slate-500 block">Düşünce</span>
                        <strong className="text-purple-700 text-xs">{telemetryData.p1ReasoningK}k</strong>
                      </div>
                      <div className="bg-white p-1.5 rounded border border-emerald-100">
                        <span className="text-[9px] text-slate-500 block">Nihai</span>
                        <strong className="text-yellow-700 text-xs">{telemetryData.p1FinalK}k</strong>
                      </div>
                      <div className="bg-white p-1.5 rounded border border-emerald-100">
                        <span className="text-[9px] text-slate-500 block">Toplam</span>
                        <strong className="text-slate-900 text-xs">{telemetryData.p1TotalK}k</strong>
                      </div>
                    </div>
                  </div>

                  {/* 2. LLM */}
                  <div className="bg-[#ecfeff] border border-cyan-200 rounded p-3 space-y-2">
                    <div className="flex items-center justify-between border-b border-cyan-200/60 pb-1.5 flex-wrap gap-1">
                      <span className="font-bold text-[11px] text-cyan-950 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-cyan-600" />
                        <span>2. LLM (Sabah İstihbaratı)</span>
                      </span>
                      <span className="bg-[#0891b2] text-white px-2 py-0.5 rounded text-[10px] font-bold border border-cyan-400/30">
                        {telemetryData.model2Name}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 text-center">
                      <div className="bg-white p-1.5 rounded border border-cyan-100">
                        <span className="text-[9px] text-slate-500 block">Girdi</span>
                        <strong className="text-emerald-700 text-xs">{telemetryData.p2PromptK}k</strong>
                      </div>
                      <div className="bg-white p-1.5 rounded border border-cyan-100">
                        <span className="text-[9px] text-slate-500 block">Düşünce</span>
                        <strong className="text-purple-700 text-xs">{telemetryData.p2ReasoningK}k</strong>
                      </div>
                      <div className="bg-white p-1.5 rounded border border-cyan-100">
                        <span className="text-[9px] text-slate-500 block">Nihai</span>
                        <strong className="text-yellow-700 text-xs">{telemetryData.p2FinalK}k</strong>
                      </div>
                      <div className="bg-white p-1.5 rounded border border-cyan-100">
                        <span className="text-[9px] text-slate-500 block">Toplam</span>
                        <strong className="text-slate-900 text-xs">{telemetryData.p2TotalK}k</strong>
                      </div>
                    </div>
                  </div>

                  {/* Bileşik Toplam */}
                  <div className="bg-[#fffbeb] border border-amber-200 rounded p-2.5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-amber-950 uppercase block">Bileşik Token Toplamı</span>
                      <span className="text-[11px] text-amber-800">1. LLM + 2. LLM Toplam Çağrı</span>
                    </div>
                    <span className="text-sm font-black text-amber-950 bg-amber-100 px-2.5 py-1 rounded border border-amber-300">
                      {telemetryData.totalK}k token
                    </span>
                  </div>
                </>
              ) : (
                <div className="bg-[#f0fdf4] border border-emerald-200 rounded p-3 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-900 block">Aktif Analiz Motoru:</span>
                  <p className="text-slate-800">{telemetryData.activeModel || 'DeepSeek Flash'}</p>
                </div>
              )}

              {/* 3. Taranan Veri Havuzu (Yalnızca gerçek veri varsa gösterilir) */}
              {(telemetryData.totalPostsAnalyzed || telemetryData.totalTweetsAnalyzed) && (
                <div className="bg-[#f8fafc] border border-slate-200 rounded p-3 space-y-2">
                  <span className="font-bold text-[11px] text-slate-800 uppercase block">
                    📊 Taranan Veri Havuzu
                  </span>
                  <div className={`grid ${telemetryData.totalPostsAnalyzed && telemetryData.totalTweetsAnalyzed ? 'grid-cols-2' : 'grid-cols-1'} gap-2 text-xs`}>
                    {telemetryData.totalPostsAnalyzed && (
                      <div className="bg-white p-2 rounded border border-slate-200 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0"></span>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Reddit:</span>
                          <strong className="text-slate-900">{telemetryData.totalPostsAnalyzed} Gönderi</strong>
                        </div>
                      </div>
                    )}
                    {telemetryData.totalTweetsAnalyzed && (
                      <div className="bg-white p-2 rounded border border-slate-200 flex items-center gap-2">
                        <span className="w-3.5 h-3.5 bg-black text-white text-[9px] font-black flex items-center justify-center rounded-xs shrink-0">𝕏</span>
                        <div>
                          <span className="text-[10px] text-slate-500 block">X (Twitter):</span>
                          <strong className="text-slate-900">{telemetryData.totalTweetsAnalyzed} Tweet</strong>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex items-center justify-end rounded-b-lg">
              <button
                type="button"
                onClick={() => setIsSystemInfoOpen(false)}
                className="px-4 py-1.5 bg-[#107c41] hover:bg-[#0c592d] text-white rounded font-bold text-xs transition cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📬 BÜLTEN ABONELİK MODALI (Header butonu veya doğrudan tetikleme ile açılır) */}
      {isNewsletterModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsNewsletterModalOpen(false)}
        >
          <div 
            className="bg-white border border-slate-300 rounded-lg shadow-2xl max-w-md w-full overflow-hidden text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#107c41] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6 bg-white text-[#107c41] font-black rounded text-[11px] shadow-xs">
                  AI
                </div>
                <h3 className="font-bold text-sm font-mono tracking-tight">Günlük AI İstihbarat Bülteni</h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsNewsletterModalOpen(false)}
                className="text-emerald-100 hover:text-white p-1 rounded hover:bg-[#0c592d] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs sm:text-sm text-slate-600 font-mono leading-relaxed">
                  Gündemin kısa özeti her sabah mailinizde olsun.
                </p>
              </div>

              {subscribeStatus === 'success' ? (
                <div className="bg-emerald-50 border border-emerald-300 rounded p-4 text-center space-y-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-xs">
                    <Check className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-emerald-950 text-xs font-mono">
                    {subscribeMessage || 'Aramıza hoş geldiniz!'}
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-tight">
                    İlk bülteniniz yarın sabah gelen kutunuzda olacak.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                      E-Posta Adresiniz:
                    </label>
                    <input
                      type="email"
                      required
                      autoFocus
                      value={newsletterEmail}
                      onChange={(e) => {
                        setNewsletterEmail(e.target.value);
                        if (subscribeStatus === 'error') setSubscribeStatus('idle');
                      }}
                      placeholder="ornek@alanadi.com"
                      className="w-full bg-[#f8fafc] border border-slate-300 text-slate-900 placeholder-slate-400 px-3 py-2 rounded text-xs font-mono focus:outline-none focus:border-[#107c41] focus:ring-1 focus:ring-[#107c41] transition"
                    />
                  </div>

                  {subscribeStatus === 'error' && (
                    <div className="text-xs font-mono text-rose-600 bg-rose-50 border border-rose-200 p-2 rounded flex items-center gap-1.5">
                      <span>⚠️</span>
                      <span>{subscribeMessage}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={subscribeStatus === 'loading'}
                    className="w-full bg-[#107c41] hover:bg-[#0c592d] active:scale-[0.98] text-white font-mono font-bold text-xs py-2.5 rounded shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{subscribeStatus === 'loading' ? 'Kaydediliyor...' : 'Abone Ol →'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. EXCEL FORMÜL VE AD ÇUBUĞU (Formula Bar) */}
      <div className="bg-white border-b border-[#d1d5db] py-1.5 px-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-mono">
          {/* Ad Kutusu (Hücre Koordinatı) */}
          <div className="w-14 sm:w-16 bg-[#f9fafb] border border-[#d1d5db] px-2 py-1 text-center font-bold text-slate-700 select-none">
            {expandedId ? `B${filteredTools.findIndex(t => t.id === expandedId) + 2}` : timeframe === 'glossary' ? 'G1' : timeframe === 'report' ? 'R1' : 'A1'}
          </div>

          {/* fx İkonu */}
          <div className="flex items-center justify-center font-bold italic text-slate-500 px-1 border-r border-[#e5e7eb] pr-2">
            fx
          </div>

          {/* Formül Satırı */}
          <div className="flex-1 flex items-center bg-white border border-[#d1d5db] px-3 py-1 text-slate-700 truncate">
            <span className="text-[#107c41] font-bold mr-1.5">
              {timeframe === 'glossary' ? '=GÜNÜN_SÖZLÜĞÜ(' : '=HYPE.DEĞERLENDİR('}
            </span>
            <span className="text-blue-600 font-semibold truncate">
              {timeframe === 'glossary' 
                ? '"SİTEDE_GEÇEN_9_TEMEL_KAVRAM"' 
                : selectedTool 
                  ? `"${selectedTool.name}", KATEGORİ="${selectedTool.category}", HYPE=${selectedTool.hypeScore}/10, BEĞENİ=${getToolSentiment(selectedTool).score10}/10` 
                  : '"TÜM_MODELLER"'}
            </span>
            <span className="text-[#107c41] font-bold">)</span>
          </div>
        </div>
      </div>

      {/* 4. KATEGORİ VE ÇALIŞMA ALANI */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 py-4 w-full flex-1 space-y-4">
        
        {/* ☕ 30 SANİYELİK SABAH İSTİHBARATI: DÜNYADA BUGÜN (Sadece Günlük Görünümde) */}
        {timeframe === 'daily' && report.morningBrief && (
          <section className="bg-white border border-[#cbd5e1] rounded-sm p-3.5 sm:p-4 shadow-xs space-y-3">
            {/* Üst Bar: Başlık & Katla/Aç */}
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-[#107c41] text-white flex items-center justify-center font-bold shadow-2xs">
                  <Coffee className="w-3.5 h-3.5" />
                </span>
                <div>
                  <h2 className="text-xs sm:text-sm font-bold text-slate-900 font-mono uppercase tracking-tight">
                    30 Saniyelik Sabah İstihbaratı: Dünyada Bugün
                  </h2>
                  <p className="text-[11px] text-slate-500 font-sans hidden sm:block">
                    Link ve teknik detay boğuntusu olmadan, dünyada ne olup bittiğini 30 saniyede yakalayın.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsBriefExpanded(!isBriefExpanded)}
                  className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer"
                  title={isBriefExpanded ? "Gizle / Daralt" : "Genişlet"}
                >
                  {isBriefExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isBriefExpanded && (
              <div className="space-y-3 pt-0.5">
                {/* 🏆 1. Günün İkili Lider Kırılması (Sarı Kısım: En Çok Konuşulan Model & En Beğenilen Model) */}
                {leaderBreakdown && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-stretch">
                    {/* Sol Kart: 🔥 En Çok Konuşulan Model */}
                    <div className="bg-amber-50/80 border border-amber-300/90 rounded p-3 shadow-2xs flex flex-col justify-between gap-2.5 h-full">
                      <div>
                        {/* Masaüstü (sm ve üzeri): Tek satırda jilet gibi yatay hizalı orijinal düzen */}
                        <div className="hidden sm:flex items-center justify-between gap-2 flex-nowrap pb-1.5 border-b border-amber-200/70 min-w-0">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-sm shrink-0">🔥</span>
                            <span className="text-[11px] font-mono font-bold text-amber-950 uppercase tracking-tight shrink-0">
                              En Çok Konuşulan:
                            </span>
                            <span className="font-mono text-xs sm:text-sm font-black text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded border border-amber-300 truncate min-w-0">
                              {leaderBreakdown.mostDiscussed.name}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-600 text-white font-black shadow-2xs shrink-0 whitespace-nowrap">
                            HYPE: {leaderBreakdown.mostDiscussed.hypeScore}/10
                          </span>
                        </div>

                        {/* Mobil (sm altı): Kesilmeden görünen 2 satırlı temiz mobil düzen */}
                        <div className="flex sm:hidden flex-col gap-1.5 pb-2 border-b border-amber-200/70">
                          <div className="flex items-center justify-between gap-2 flex-nowrap">
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-sm shrink-0">🔥</span>
                              <span className="text-[11px] font-mono font-bold text-amber-950 uppercase tracking-tight shrink-0">
                                En Çok Konuşulan:
                              </span>
                            </div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-600 text-white font-black shadow-2xs shrink-0 whitespace-nowrap">
                              HYPE: {leaderBreakdown.mostDiscussed.hypeScore}/10
                            </span>
                          </div>
                          <div>
                            <span className="font-mono text-xs font-black text-amber-900 bg-amber-100/90 px-2 py-1 rounded border border-amber-300 inline-block break-words">
                              {leaderBreakdown.mostDiscussed.name}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-amber-900 mt-2 leading-relaxed">
                          {leaderBreakdown.mostDiscussed.description}
                        </p>
                      </div>
                      <div className="text-[10px] font-mono text-amber-800/80 pt-1.5 flex items-center justify-between border-t border-amber-200/50">
                        <span>Gündem &amp; Konuşulma Hacmi</span>
                        <span>Topluluk Beğenisi: {((leaderBreakdown.mostDiscussed.sentimentScore || 0) / 10).toFixed(1)}/10</span>
                      </div>
                    </div>

                    {/* Sağ Kart: ⭐ En Beğenilen Model */}
                    <div className="bg-amber-50/80 border border-amber-300/90 rounded p-3 shadow-2xs flex flex-col justify-between gap-2.5 h-full">
                      <div>
                        {/* Masaüstü (sm ve üzeri): Tek satırda jilet gibi yatay hizalı orijinal düzen */}
                        <div className="hidden sm:flex items-center justify-between gap-2 flex-nowrap pb-1.5 border-b border-amber-200/70 min-w-0">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-sm shrink-0">⭐</span>
                            <span className="text-[11px] font-mono font-bold text-amber-950 uppercase tracking-tight shrink-0">
                              En Beğenilen:
                            </span>
                            <span className="font-mono text-xs sm:text-sm font-black text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded border border-amber-300 truncate min-w-0">
                              {leaderBreakdown.mostLoved.name}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-600 text-white font-black shadow-2xs shrink-0 whitespace-nowrap">
                            BEĞENİ: {((leaderBreakdown.mostLoved.sentimentScore || 0) / 10).toFixed(1)}/10
                          </span>
                        </div>

                        {/* Mobil (sm altı): Kesilmeden görünen 2 satırlı temiz mobil düzen */}
                        <div className="flex sm:hidden flex-col gap-1.5 pb-2 border-b border-amber-200/70">
                          <div className="flex items-center justify-between gap-2 flex-nowrap">
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-sm shrink-0">⭐</span>
                              <span className="text-[11px] font-mono font-bold text-amber-950 uppercase tracking-tight shrink-0">
                                En Beğenilen:
                              </span>
                            </div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-600 text-white font-black shadow-2xs shrink-0 whitespace-nowrap">
                              BEĞENİ: {((leaderBreakdown.mostLoved.sentimentScore || 0) / 10).toFixed(1)}/10
                            </span>
                          </div>
                          <div>
                            <span className="font-mono text-xs font-black text-amber-900 bg-amber-100/90 px-2 py-1 rounded border border-amber-300 inline-block break-words">
                              {leaderBreakdown.mostLoved.name}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-amber-900 mt-2 leading-relaxed">
                          {leaderBreakdown.mostLoved.description}
                        </p>
                      </div>
                      <div className="text-[10px] font-mono text-amber-800/80 pt-1.5 flex items-center justify-between border-t border-amber-200/50">
                        <span>Kullanıcı Memnuniyeti &amp; Övgü</span>
                        <span>Hype Skoru: {leaderBreakdown.mostLoved.hypeScore}/10</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ⚡ 2. Dünyayı Kaçırmama Özeti (4 Kare Yan Yana, En Uzuna Göre Eşit Boyut) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 items-stretch subgrid-row-morning">
                  {(report.morningBrief.bullets || []).map((bullet, bIdx) => (
                    <div 
                      key={bIdx}
                      className="p-3 bg-[#f8fafc] border border-[#cbd5e1] rounded-sm hover:border-[#107c41] transition shadow-2xs flex flex-col justify-between h-full subgrid-card-morning group"
                    >
                      {/* Üst Kısım: İkon ve Kategori Başlığı (Hizalı Çizgi) */}
                      <div className="flex items-center gap-2 pb-2 border-b border-[#e2e8f0] w-full">
                        <span className="text-base shrink-0 select-none">{bullet.icon || '📌'}</span>
                        <span className="font-mono text-[11px] font-bold text-slate-800 uppercase tracking-tight truncate">
                          {bullet.tag}
                        </span>
                      </div>

                      {/* Gövde Metni: Doğal Akış, En Uzun Kutuya Göre Uzayan Boyut */}
                      <div className="pt-2 flex-1 flex flex-col justify-start">
                        <p className="text-xs text-slate-700 leading-relaxed font-normal">
                          {bullet.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}


        {/* 📖 GÜNÜN SÖZLÜĞÜ (Doğrudan Odak / Sekme Görünümü) */}
        {timeframe === 'glossary' && report.dailyGlossary && report.dailyGlossary.length > 0 && (
          <section id="gunun-sozlugu-odak" className="bg-white border border-[#cbd5e1] rounded-sm p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-2">
                <BookMarked className="w-4 h-4 text-slate-600" />
                <h2 className="font-bold text-xs sm:text-sm text-slate-900 font-mono uppercase tracking-wide">
                  Günün Sözlüğü
                </h2>
                <span className="text-[11px] font-mono text-slate-400">
                  • Sitede Geçen 9 Temel Kavram ({report.date})
                </span>
              </div>
            </div>

            {/* Sade Sözlük Kartları (CSS Subgrid ile hizalı, sıfır karmaşa) */}
            <div className="space-y-3">
              {glossaryChunks.map((chunk, cIdx) => (
                <div 
                  key={cIdx} 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3.5 gap-y-3 subgrid-row-glossary"
                >
                  {chunk.map((item, idx) => (
                    <div
                      key={item.id || `${cIdx}-${idx}`}
                      className="bg-white border border-[#e2e8f0] rounded p-3.5 hover:border-slate-400 transition flex flex-col justify-between subgrid-card-glossary shadow-2xs"
                    >
                      {/* 1. Kavram Başlığı (h-full ile en uzun başlığa göre uzar, alt çizgi jilet gibi eşitlenir) */}
                      <div className="pb-2 border-b border-slate-200 h-full flex flex-col justify-between">
                        <h4 className="font-mono font-bold text-xs sm:text-[13px] text-slate-900 tracking-tight leading-snug">
                          {item.term}
                        </h4>
                      </div>

                      {/* 2. Sade ve Anlaşılır Anlamı */}
                      <p className="text-xs sm:text-[12.5px] text-slate-600 leading-relaxed font-normal">
                        {item.definition}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Kategori Filtre Çubuğu (Sağa kaydırma yok, flex-wrap ile ekrana tam oturur) */}
        {timeframe !== 'report' && timeframe !== 'glossary' && (
          <div className="bg-white border border-[#d1d5db] p-2 rounded-sm shadow-xs flex flex-wrap items-center gap-1 sm:gap-1.5">
            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 font-bold px-1 sm:px-2 whitespace-nowrap">
              <Filter className="w-3 h-3 text-[#107c41]" />
              <span>KATEGORİ:</span>
            </div>
            {CATEGORY_DEFINITIONS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-medium whitespace-nowrap transition border rounded-xs ${
                  selectedCategory === cat.id
                    ? 'bg-[#107c41] text-white border-[#107c41] font-bold shadow-xs'
                    : 'bg-[#f9fafb] text-slate-700 hover:bg-slate-100 border-[#e5e7eb]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* 5. MASAÜSTÜ EXCEL IZGARA TABLOSU (hidden md:block) */}
        {timeframe !== 'report' && timeframe !== 'glossary' && (
          <div className="hidden md:block bg-white border border-[#d1d5db] shadow-xs overflow-hidden">
            <table key={timeframe} className="w-full table-fixed text-left border-collapse font-sans text-xs">
              <colgroup>
                <col className="w-12" />
                <col className="w-52" />
                {showDaysCol && <col className="w-24" />}
                <col className="w-44" />
                <col />
                <col className="w-24" />
                <col className="w-28" />
                <col className="w-28" />
              </colgroup>
              
              {/* Sütun Harfleri ve Başlıklar (A - G / A - H) */}
              <thead>
                {/* Excel Sütun Harfleri Satırı */}
                <tr className="bg-[#f8fafc] border-b border-[#d1d5db] text-[10px] font-mono text-slate-500 select-none">
                  <th key="col-a" className="w-12 text-center py-1 border-r border-[#e2e8f0]">A</th>
                  <th key="col-b" className="w-52 px-3 py-1 border-r border-[#e2e8f0] text-left">B</th>
                  {showDaysCol && (
                    <th key="col-c" className="w-24 px-2 py-1 border-r border-[#e2e8f0] text-center">C</th>
                  )}
                  <th key="col-d" className="w-44 px-3 py-1 border-r border-[#e2e8f0] text-left">{showDaysCol ? 'D' : 'C'}</th>
                  <th key="col-e" className="px-3 py-1 border-r border-[#e2e8f0] text-left">{showDaysCol ? 'E' : 'D'}</th>
                  <th key="col-f" className="w-24 px-3 py-1 border-r border-[#e2e8f0] text-right">{showDaysCol ? 'F' : 'E'}</th>
                  <th key="col-g" className="w-28 px-3 py-1 border-r border-[#e2e8f0] text-right">{showDaysCol ? 'G' : 'F'}</th>
                  <th key="col-h" className="w-28 px-3 py-1 text-center">{showDaysCol ? 'H' : 'G'}</th>
                </tr>

                {/* Sütun İsimleri Satırı */}
                <tr className="bg-[#f1f5f9] border-b-2 border-[#cbd5e1] text-[11px] font-semibold text-slate-700 select-none">
                  <th key="title-rank" className="w-12 text-center py-2.5 border-r border-[#cbd5e1]">Sıra</th>
                  <th key="title-name" className="w-52 px-3 py-2.5 border-r border-[#cbd5e1] text-left">Model / Ürün Adı</th>
                  {showDaysCol && (
                    <th key="title-days" className="w-24 px-2 py-2.5 border-r border-[#cbd5e1] text-center font-bold text-amber-900">
                      Gündem (Gün)
                    </th>
                  )}
                  <th key="title-cat" className="w-44 px-3 py-2.5 border-r border-[#cbd5e1] text-left">Kategori</th>
                  <th key="title-func" className="px-3 py-2.5 border-r border-[#cbd5e1] text-left">Temel Yetenek &amp; Fonksiyon</th>
                  <th key="title-hype" className="w-24 px-3 py-2.5 border-r border-[#cbd5e1] text-right">Hype Puanı</th>
                  <th key="title-sentiment" className="w-28 px-3 py-2.5 border-r border-[#cbd5e1] text-right">Topluluk Beğenisi</th>
                  <th key="title-source" className="w-28 px-3 py-2.5 text-center">Topluluk Kaynak</th>
                </tr>
              </thead>

              {/* Tablo Satırları (Her Biri Tamamen Eşit Boyda h-11) */}
              <tbody className="divide-y divide-[#e2e8f0]">
                {filteredTools.map((tool, idx) => {
                  const sentiment = getToolSentiment(tool);
                  const isExpanded = expandedId === tool.id;

                  const historyRecord = toolHistoryData?.[tool.id] || 
                    Object.values(toolHistoryData || {}).find(h => h.name?.toLowerCase() === tool.name?.toLowerCase());
                  const historyEntries = historyRecord?.history || [];

                  return (
                    <React.Fragment key={tool.id}>
                      <tr 
                        onClick={() => setExpandedId(isExpanded ? null : tool.id)}
                        className={`h-11 cursor-pointer transition-colors select-none ${
                          isExpanded 
                            ? 'bg-[#e8f5e9] border-l-4 border-l-[#107c41]' 
                            : idx % 2 === 0 
                              ? 'bg-white hover:bg-[#f0fdf4]' 
                              : 'bg-[#fafafa] hover:bg-[#f0fdf4]'
                        }`}
                      >
                        {/* Kolon A: Sıra */}
                        <td key="td-rank" className="w-12 text-center font-mono font-bold text-slate-600 border-r border-[#e2e8f0]">
                          #{idx + 1}
                        </td>

                        {/* Kolon B: Model Adı */}
                        <td key="td-name" className="w-52 px-3 border-r border-[#e2e8f0] truncate">
                          <span className="font-bold text-slate-900 hover:text-[#107c41] transition truncate">
                            {tool.name}
                          </span>
                        </td>

                        {/* Kolon C (Yalnızca Haftalık ve Aylıkta): Gündem Gün Sayısı */}
                        {showDaysCol && (
                          <td key="td-days" className="w-24 px-2 text-center border-r border-[#e2e8f0] font-mono">
                            <span className="inline-flex items-center justify-center font-bold text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                              {tool.frequency ? `${tool.frequency} Gün` : '1 Gün'}
                            </span>
                          </td>
                        )}

                        {/* Kolon: Kategori */}
                        <td key="td-cat" className="w-44 px-3 border-r border-[#e2e8f0]">
                          <span className={`inline-block font-mono text-[11px] px-2 py-0.5 rounded border ${getCategoryBadgeClass(tool.category)} whitespace-nowrap`}>
                            {tool.category === 'LLM (Model)' ? 'LLM' : tool.category}
                          </span>
                        </td>

                        {/* Kolon D: Temel Fonksiyon */}
                        <td key="td-func" className="px-3 border-r border-[#e2e8f0] text-slate-700">
                          <div className="truncate text-xs text-slate-700" title="Tüm açıklamayı okumak için tıklayın">
                            {tool.primaryFunction}
                          </div>
                        </td>

                        {/* Kolon E: Hype Puanı */}
                        <td key="td-hype" className="w-24 px-3 text-right border-r border-[#e2e8f0] font-mono">
                          <span className={`font-black text-sm ${
                            (tool.hypeScore || 0) >= 8.5 ? 'text-slate-900' :
                            (tool.hypeScore || 0) >= 7.0 ? 'text-amber-700' : 'text-rose-600'
                          }`}>
                            {Number(tool.hypeScore || 0).toFixed(1)}
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal">/10</span>
                        </td>

                        {/* Kolon F: Topluluk Beğenisi */}
                        <td key="td-sentiment" className="w-28 px-3 text-right border-r border-[#e2e8f0] font-mono">
                          <span className={`font-black text-sm ${sentiment.colorClass}`}>
                            {sentiment.score10}
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal">/10</span>
                        </td>

                        {/* Kolon G: Topluluk Kaynak */}
                        <td key="td-source" className="w-28 px-3 text-center font-mono text-[11px] text-slate-600">
                          <div className="flex items-center justify-center gap-1">
                            <span className="truncate max-w-[80px]">
                              {tool.sources?.[0] || 'Reddit'}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-3 h-3 text-[#107c41] flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* 6. SADE VE OKUNAKLI TIKLANAN DETAY KARTI */}
                      {isExpanded && (
                        <tr className="bg-[#f8fafc] border-b-2 border-[#107c41]">
                          <td colSpan={showDaysCol ? 8 : 7} className="p-2.5 sm:p-4 md:p-5">
                            
                            <div className="bg-white border border-[#cbd5e1] rounded-md p-3 sm:p-4 space-y-3 sm:space-y-4 shadow-xs">
                              
                              {/* 1. Kısım: Modelin Tam Açıklaması (Tıklayınca Tam Okunur) */}
                              <div className="space-y-1 border-b border-[#e2e8f0] pb-3">
                                <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px] font-bold uppercase">
                                  <Info className="w-3.5 h-3.5 text-[#107c41]" />
                                  <span>{tool.name} — Temel Yetenek &amp; Fonksiyonu:</span>
                                </div>
                                <p className="text-slate-900 text-sm leading-relaxed font-medium">
                                  {tool.primaryFunction}
                                </p>
                              </div>

                              {/* 2. Kısım: Neden Trend Oldu & Kaynaklar */}
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 border-b border-[#e2e8f0] pb-3">
                                <div className="md:col-span-3 space-y-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-[11px] font-mono uppercase font-bold text-[#107c41]">
                                      🔥 Bugün Neden Trend Oldu? (Topluluk Görüşü)
                                    </span>
                                    <span className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold border ${sentiment.badgeClass}`}>
                                      Topluluk Beğenisi: {sentiment.score10}/10
                                    </span>
                                  </div>
                                  <p className="text-slate-800 text-xs leading-relaxed">
                                    {tool.whyTrending}
                                  </p>
                                </div>
                                <div className="space-y-1 md:border-l border-[#e2e8f0] md:pl-3">
                                  <span className="text-[11px] font-mono uppercase font-bold text-slate-500">
                                    Kaynak Topluluklar
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {tool.sources.map((s, i) => (
                                      <span key={i} className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#f1f5f9] text-slate-700 border border-[#cbd5e1]">
                                        {s}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* 3. Kısım: Sade Tarihsel Topluluk Değerlendirmeleri (Karmaşık Olmayan Temiz Liste) */}
                              <div className="space-y-2 pt-1">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <History className="w-3.5 h-3.5 text-[#107c41]" />
                                    <span className="font-mono text-xs font-bold text-slate-800 uppercase tracking-wide">
                                      Geçmiş Topluluk Değerlendirmeleri &amp; Nabız
                                    </span>
                                  </div>
                                  <span className="text-[10px] font-mono text-slate-500">
                                    {historyEntries.length > 0 ? `${historyEntries.length} Günlük Kayıt` : 'Yeni Araç'}
                                  </span>
                                </div>

                                {historyEntries.length > 0 ? (
                                  <div className="space-y-1.5 pt-1">
                                    {historyEntries.map((entry, hIdx) => (
                                      <div key={hIdx} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 py-1.5 border-b border-[#f1f5f9] last:border-0 text-xs">
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                          <span className="font-mono text-slate-500 text-[11px] w-24">{entry.date}</span>
                                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-[10.5px]">
                                            Hype: {entry.hypeScore}/10
                                          </span>
                                        </div>
                                        <div className="text-slate-700 text-xs flex-1">
                                          <strong className="text-slate-900 mr-1">{entry.headline}:</strong>
                                          <span>{entry.summary}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-slate-500 text-xs font-mono py-2">
                                    ℹ️ Bu araç radarımıza yeni katıldı. Gün gün performans değişimi ve topluluk şikayet/övgü kayıtları sonraki taramalarda burada birikecektir.
                                  </div>
                                )}
                              </div>

                            </div>

                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 5b. MOBİL KOMPAKT TABLO SIRALAMASI (block md:hidden - Sağa Kaydırma Yok, Başlığa Dokununca Açılır) */}
        {timeframe !== 'report' && timeframe !== 'glossary' && (
          <div className="block md:hidden bg-white border border-[#cbd5e1] rounded-sm shadow-xs divide-y divide-[#e2e8f0] overflow-hidden">
            {filteredTools.map((tool, idx) => {
              const sentiment = getToolSentiment(tool);
              const isExpanded = expandedId === tool.id;

              const historyRecord = toolHistoryData?.[tool.id] || 
                Object.values(toolHistoryData || {}).find(h => h.name?.toLowerCase() === tool.name?.toLowerCase());
              const historyEntries = historyRecord?.history || [];

              return (
                <div 
                  key={tool.id}
                  className={`transition-colors ${
                    isExpanded ? 'bg-[#f0fdf4]' : idx % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'
                  }`}
                >
                  {/* Tıklanabilir Kompakt Satır (İlk Bakışta Temiz Tablo Sıralaması) */}
                  <div 
                    onClick={() => setExpandedId(isExpanded ? null : tool.id)}
                    className="p-2.5 flex items-center justify-between gap-2 cursor-pointer select-none active:bg-[#e8f5e9]"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-slate-100 text-[#107c41] font-mono font-bold text-xs rounded border border-[#cbd5e1]">
                        #{idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm leading-tight break-words">
                          {tool.name}
                        </div>
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <span className={`font-mono text-[9px] px-1.5 py-0.2 rounded border ${getCategoryBadgeClass(tool.category)} whitespace-nowrap`}>
                            {tool.category === 'LLM (Model)' ? 'LLM' : tool.category}
                          </span>
                          {showDaysCol && tool.frequency && (
                            <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold whitespace-nowrap">
                              {tool.frequency} Gün Gündem
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Sağ Taraf: Topluluk Beğenisi & Hype Puanı */}
                    <div className="flex items-center gap-2 flex-shrink-0 font-mono text-right">
                      <div className="text-right">
                        <div>
                          <span className={`font-black text-xs ${sentiment.colorClass}`}>
                            Beğeni: {sentiment.score10}/10
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          Hype: {Number(tool.hypeScore || 0).toFixed(1)}/10
                        </div>
                      </div>
                      <div className="text-slate-400">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#107c41]" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* TIKLANINCA AÇILAN DETAY PANELİ (Başlığa dokunulduğunda görünür) */}
                  {isExpanded && (
                    <div className="p-3 bg-white border-t border-[#cbd5e1] space-y-2.5 text-xs shadow-inner">
                      {/* Temel Yetenek & Fonksiyon */}
                      <div className="space-y-1 bg-[#fbfcfd] p-2.5 rounded border border-[#f1f5f9]">
                        <span className="text-[10px] font-mono font-bold text-[#107c41] uppercase flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#107c41]"></span>
                          TEMEL YETENEK &amp; FONKSİYONU:
                        </span>
                        <p className="text-slate-800 leading-relaxed font-medium">
                          {tool.primaryFunction}
                        </p>
                      </div>

                      {/* Neden Trend Oldu? (Topluluk Görüşü) */}
                      <div className="space-y-1 bg-[#f8fafc] p-2.5 rounded border border-[#e2e8f0]">
                        <div className="flex items-center justify-between gap-1 flex-wrap">
                          <span className="text-[10px] font-mono font-bold text-slate-700 uppercase flex items-center gap-1">
                            🔥 TOPLULUK ANALİZİ:
                          </span>
                          <span className={`text-[9.5px] font-mono px-1.5 py-0.2 rounded font-bold border ${sentiment.badgeClass}`}>
                            Topluluk Beğenisi: {sentiment.score10}/10
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">
                          {tool.whyTrending}
                        </p>
                        <div className="flex items-center gap-1 pt-1.5 flex-wrap">
                          <span className="text-[10px] font-mono text-slate-400">Kaynaklar:</span>
                          {tool.sources?.map((s, i) => (
                            <span key={i} className="text-[9px] font-mono px-1.5 py-0.5 bg-white text-slate-600 rounded border border-[#cbd5e1]">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Geçmiş Performans / Zaman Çizelgesi */}
                      {historyEntries.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#107c41] uppercase">
                            <History className="w-3.5 h-3.5" />
                            <span>Geçmiş Değerlendirmeler ({historyEntries.length} Gün):</span>
                          </div>
                          <div className="space-y-1 bg-[#f9fafb] p-2 rounded border border-[#e2e8f0]">
                            {historyEntries.map((entry, hIdx) => (
                              <div key={hIdx} className="border-b border-[#e2e8f0] pb-1 last:border-0 last:pb-0 space-y-0.5">
                                <div className="flex items-center justify-between font-mono text-[9px]">
                                  <span className="text-slate-500">{entry.date}</span>
                                  <span className="font-bold text-slate-900">Hype: {entry.hypeScore}/10</span>
                                </div>
                                <p className="text-slate-700 text-[10px] leading-tight">
                                  <strong className="text-slate-900">{entry.headline}: </strong>
                                  {entry.summary}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 6.5 🐦 X (TWITTER) AI NABZI: 30 SEÇKİN LİDERİN GÜNDEMİ (Sadece Günlük Görünümde) */}
        {timeframe === 'daily' && report.twitterPulse && (
          <section className="bg-white border border-[#cbd5e1] shadow-xs rounded-sm p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#e2e8f0] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-black text-white font-black text-xs flex items-center justify-center rounded-xs font-mono shadow-2xs">
                  𝕏
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-mono uppercase">
                  X (Twitter) AI Nabzı: 30 Seçkin Zihnin Gündemi
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-900 border border-sky-200 font-bold">
                Son 24 Saat • 30 Seçkin AI Lideri • Saf Teknik İstihbarat
              </span>
            </div>

            {/* 1. BÖLÜM: 📌 TWITTER'DA (X) GÜNDEM NE? (Yazılı Metin / İstihbarat Özeti) */}
            {report.twitterPulse.overview && (
              <div className="p-4 bg-[#f8fafc] border-l-4 border-l-black border-y border-r border-slate-200 rounded-r text-xs sm:text-[13px] text-slate-800 leading-relaxed space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
                  <span className="font-mono font-bold text-slate-900 uppercase text-xs flex items-center gap-1.5">
                    <span>📌</span> TWITTER'DA (X) GÜNDEM NE? (30 SEÇKİN ZİHNİN RADARI)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black text-white font-bold">
                    Editöryel Sentez
                  </span>
                </div>
                <div className="space-y-2 pt-1 text-slate-800">
                  {report.twitterPulse.overview.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* 2. BÖLÜM: 🔥 X RADARINDAKİ POPÜLER ÜRÜNLER & ARAÇLAR (Reddit Mantığı Alt Alta Sıralama) */}
            {Array.isArray(report.twitterPulse.trendingProducts) && report.twitterPulse.trendingProducts.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🔥</span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-mono uppercase">
                      X Radarındaki Popüler Ürünler &amp; Araçlar
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-300 font-bold">
                    Reddit Sıralama Mantığı • Hype &amp; Beğeni Puanları
                  </span>
                </div>

                <div className="space-y-3">
                  {report.twitterPulse.trendingProducts.map((prod, idx) => (
                    <div 
                      key={prod.name || idx}
                      className="bg-white border border-[#cbd5e1] rounded-sm p-3.5 hover:border-black transition shadow-2xs space-y-3"
                    >
                      {/* Üst Bar: Sıra, Ürün Adı, Kategori ve Skorlar */}
                      <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-slate-900 text-white font-mono font-bold text-xs rounded-xs">
                            #{prod.rank || (idx + 1)}
                          </span>
                          <h5 className="font-bold text-slate-900 text-sm sm:text-base font-mono truncate">
                            {prod.name}
                          </h5>
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap">
                            {prod.category}
                          </span>
                        </div>

                        {/* Skor Rozetleri: ASLA SARKMAYAN, flex-nowrap shrink-0 */}
                        <div className="flex items-center gap-2 flex-nowrap shrink-0 font-mono text-xs">
                          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-300 font-bold whitespace-nowrap shrink-0">
                            HYPE: {Number(prod.hypeScore || 0).toFixed(1)}/10
                          </span>
                          <span className={`px-2 py-0.5 rounded font-bold whitespace-nowrap shrink-0 border ${
                            (prod.sentimentScore || 0) >= 8.5 
                              ? 'bg-emerald-50 text-emerald-900 border-emerald-300' 
                              : (prod.sentimentScore || 0) >= 7.0 
                                ? 'bg-amber-50 text-amber-900 border-amber-300' 
                                : 'bg-rose-50 text-rose-900 border-rose-300'
                          }`}>
                            BEĞENİ: {Number(prod.sentimentScore || 0).toFixed(1)}/10
                          </span>
                        </div>
                      </div>

                      {/* İçerik: İki kutulu yapı (Ne İşe Yarar? ve X'te Neden Konuşuldu?) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                        {/* Kutu 1: Temel Yetenek & Fonksiyon */}
                        <div className="p-2.5 bg-[#f8fafc] border border-slate-200 rounded text-slate-800 space-y-1">
                          <span className="font-mono text-[9px] uppercase font-bold text-slate-600 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                            NE İŞE YARAR? (TEMEL FONKSİYON)
                          </span>
                          <p className="leading-relaxed">{prod.primaryFunction}</p>
                        </div>

                        {/* Kutu 2: X'te Neden Konuşuldu? */}
                        <div className="p-2.5 bg-[#fffbeb] border border-amber-200 rounded text-amber-950 space-y-1">
                          <span className="font-mono text-[9px] uppercase font-bold text-amber-800 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                            X RADARINDA NEDEN ÖNE ÇIKTI?
                          </span>
                          <p className="leading-relaxed">{prod.whyDiscussed}</p>
                        </div>
                      </div>

                      {/* Alt Bar: Bahseden Liderler */}
                      {Array.isArray(prod.mentionedBy) && prod.mentionedBy.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-600 flex-wrap gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] text-slate-400 font-semibold uppercase">Bahseden AI Liderleri:</span>
                            {prod.mentionedBy.map((handle, hIdx) => {
                              const cleanH = handle.replace(/^@/, '');
                              return (
                                <a
                                  key={hIdx}
                                  href={`https://x.com/${cleanH}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-1.5 py-0.5 rounded bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200 text-[10px] font-semibold transition"
                                >
                                  @{cleanH}
                                </a>
                              );
                            })}
                          </div>
                          <span className="text-[10px] text-slate-400">Son 24s X İstihbaratı</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. BÖLÜM: 🔬 İLGİNÇ DENEMELER, İŞ AKIŞLARI & YENİ GELİŞTİRMELER */}
            {Array.isArray(report.twitterPulse.experimentsAndDevelopments) && report.twitterPulse.experimentsAndDevelopments.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🔬</span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-mono uppercase">
                      İlginç Denemeler, İş Akışları &amp; Yeni Geliştirmeler
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-900 border border-purple-200 font-semibold">
                    30 Seçkin Liderin Laboratuvar &amp; Mimari Keşifleri
                  </span>
                </div>

                {/* 2 Sütunlu Grid - Subgrid ile tam hizalı, kaydırma çubuğu yok */}
                <div className="space-y-3.5">
                  {experimentChunks.map((pair, pIdx) => (
                    <div key={pIdx} className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3.5 subgrid-row-twitter">
                      {pair.map((exp, eIdx) => (
                        <div 
                          key={exp.id || `${pIdx}-${eIdx}`}
                          className="bg-white border border-[#cbd5e1] rounded-sm p-3.5 hover:border-purple-600 transition shadow-xs flex flex-col justify-between subgrid-card-twitter"
                        >
                          {/* 1. Üst Bar: Yazar ve Deney Alanı Rozeti */}
                          <div className="flex items-center justify-between text-[11px] font-mono gap-2">
                            <span className="font-bold text-slate-900 truncate">
                              👤 {exp.author}
                            </span>
                            <span className="bg-purple-50 text-purple-900 px-2 py-0.5 rounded font-semibold border border-purple-200 text-[10px] shrink-0">
                              {exp.badge}
                            </span>
                          </div>

                          {/* 2. Başlık: Milimetrik hizalı alt çizgi (Constitution 1.4) */}
                          <div className="border-b border-slate-200 pb-2 h-full flex flex-col justify-between">
                            <h5 className="font-bold text-xs sm:text-[13px] text-slate-900 leading-snug">
                              {exp.title}
                            </h5>
                          </div>

                          {/* 3. Deney Özeti / Çıkarım: Doğal uzar, iç kaydırma yok */}
                          <div className="text-xs text-slate-700 leading-relaxed font-normal bg-[#f8fafc] border border-slate-200/80 p-2.5 rounded">
                            <span className="font-mono text-[9px] uppercase font-bold text-purple-900 block mb-1">
                              🧪 DENEY BULGULARI &amp; MİMARİ ANALİZ:
                            </span>
                            <p>{exp.summary}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* 7. DANIŞMAN RAPORU (Sadece Günlük ve Danışman Raporu Sekmesinde Gösterilir; Haftalık ve Aylıkta Gizlenir) */}
        {(timeframe === 'report' || timeframe === 'daily') && (
          <section className="bg-white border border-[#cbd5e1] shadow-xs rounded-sm p-4 sm:p-6 space-y-4">
            <div className="border-b border-[#e2e8f0] pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#107c41]" />
                <h2 className="font-bold text-base text-slate-900 font-mono uppercase tracking-wide">
                  Yapay Zeka &amp; Donanım Ekosistem Raporu ({report.date})
                </h2>
              </div>
              <span className="text-[11px] font-mono text-slate-500 bg-[#f1f5f9] px-2 py-0.5 rounded border border-[#cbd5e1]">
                50 Topluluk Sentezi
              </span>
            </div>

            {/* Yönetici Özeti */}
            <div className="p-3.5 rounded bg-[#f8fafc] border-l-4 border-[#107c41] text-xs sm:text-sm text-slate-800 leading-relaxed space-y-1">
              <span className="font-mono font-bold text-[#107c41] text-xs uppercase block">
                📌 YÖNETİCİ ÖZETİ
              </span>
              <p>{report.executiveSummary}</p>
            </div>

            {/* 4 Bölümlü Analizler (Subgrid ile başlık çizgileri eşitlenir) */}
            <div className="space-y-4 pt-2">
              {sectionPairs.map((pair, pIdx) => (
                <div key={pIdx} className="grid grid-cols-1 md:grid-cols-2 gap-4 subgrid-row-sections">
                  {pair.map((sec, idx) => (
                    <div key={idx} className="p-4 rounded bg-[#fafafa] border border-[#d1d5db] shadow-2xs subgrid-card-sections flex flex-col justify-between">
                      <div className="border-b border-[#e2e8f0] pb-2.5 h-full flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                            {sec.title}
                          </h3>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#e8f5e9] text-[#107c41] border border-emerald-200 font-bold shrink-0">
                            {sec.badge}
                          </span>
                        </div>
                      </div>
                      <div
                        className="text-xs text-slate-700 leading-relaxed font-normal pt-1"
                        dangerouslySetInnerHTML={{ __html: sec.contentHtml }}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* İkincil Radarlar (Sadece 24s/Haftalık/Aylık görünümlerde yer alır, Danışman Raporu tıklandığında gizlenir) */}
            {timeframe !== 'report' && (
              <>
                {/* 5. 📖 GÜNÜN SÖZLÜĞÜ: SADE KAVRAM & ANLAMI */}
                {report.dailyGlossary && report.dailyGlossary.length > 0 && (
              <div id="gunun-sozlugu" className="pt-3 border-t border-[#e2e8f0] space-y-2.5">
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2">
                    <BookMarked className="w-4 h-4 text-slate-600" />
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-mono uppercase tracking-wide">
                      5. Günün Sözlüğü
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400">
                      • Sitede Geçen 9 Temel Kavram
                    </span>
                  </div>
                </div>

                {/* Sade Sözlük Kartları (CSS Subgrid ile hizalı, sıfır karmaşa) */}
                <div className="space-y-3">
                  {glossaryChunks.map((chunk, cIdx) => (
                    <div 
                      key={cIdx} 
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3.5 gap-y-3 subgrid-row-glossary"
                    >
                      {chunk.map((item, idx) => (
                        <div
                          key={item.id || `${cIdx}-${idx}`}
                          className="bg-white border border-[#e2e8f0] rounded p-3.5 hover:border-slate-400 transition flex flex-col justify-between subgrid-card-glossary shadow-2xs"
                        >
                          {/* 1. Kavram Başlığı (h-full ile en uzun başlığa göre uzar, alt çizgi jilet gibi eşitlenir) */}
                          <div className="pb-2 border-b border-slate-200 h-full flex flex-col justify-between">
                            <h4 className="font-mono font-bold text-xs sm:text-[13px] text-slate-900 tracking-tight leading-snug">
                              {item.term}
                            </h4>
                          </div>

                          {/* 2. Sade ve Anlaşılır Anlamı */}
                          <p className="text-xs sm:text-[12.5px] text-slate-600 leading-relaxed font-normal">
                            {item.definition}
                          </p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. 🔬 ARXİV BİLİMSEL YAPAY ZEKA MAKALE RADARI */}
            {((timeframe === 'weekly' && report.arxivWeeklyBest?.length > 0) || report.arxivDaily?.length > 0) && (
              <div className="pt-2 border-t border-[#e2e8f0] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#107c41]" />
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-mono uppercase">
                      {timeframe === 'weekly' 
                        ? '6. 🔬 ArXiv: Haftanın En Çarpıcı Yapay Zeka Makaleleri (7 Günlük Seçki)' 
                        : '6. 🔬 ArXiv: Günün En Çarpıcı 3 Yapay Zeka Makalesi'}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 font-bold">
                    Akademik İstihbarat
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-4 md:gap-y-3 subgrid-row-arxiv">
                  {(timeframe === 'weekly' && report.arxivWeeklyBest?.length > 0 ? report.arxivWeeklyBest : report.arxivDaily).map((paper, pIdx) => (
                    <div 
                      key={pIdx} 
                      className="bg-white border border-[#cbd5e1] rounded-sm p-4 shadow-xs hover:border-[#107c41] transition flex flex-col justify-between gap-3 subgrid-card-arxiv"
                    >
                      {/* 1. Rozet Satırı */}
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-[#107c41] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          #{pIdx + 1} • {paper.id}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {paper.category || 'cs.AI'}
                        </span>
                      </div>

                      {/* 2. Türkçe Başlık Satırı */}
                      <div className="flex items-start">
                        <a 
                          href={paper.arxivUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="font-bold text-xs sm:text-[13px] text-slate-900 hover:text-[#107c41] transition inline-flex items-start gap-1 group leading-snug"
                          title={paper.titleTr || paper.title}
                        >
                          <span className="group-hover:underline">{paper.titleTr || paper.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 text-slate-400 group-hover:text-[#107c41] mt-0.5" />
                        </a>
                      </div>

                      {/* 3. Sarı Kısım: Doğrudan konuya giren çarpıcı etki (Metne göre doğal genişler, kaydırma yok, 3 kart aynı hizada biter) */}
                      <div className="bg-[#fffbeb] border-l-4 border-l-amber-500 border border-amber-200 rounded-r p-3 h-full flex flex-col justify-start">
                        <p className="text-xs text-slate-900 font-medium leading-relaxed">
                          {paper.whyMad}
                        </p>
                      </div>

                      {/* 4. Alt Kısım: Doğrudan araştırma özeti (3 kartta da aynı hizada başlar) */}
                      <div className="flex flex-col justify-start text-xs text-slate-600 leading-relaxed">
                        <p>
                          {paper.summary}
                        </p>
                      </div>

                      {/* 5. Alt Bar: Yazarlar ve İncele Linki */}
                      <div className="pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-[11px] font-mono text-slate-500">
                        <span className="truncate max-w-[180px]" title={paper.authors?.join(', ')}>
                          {paper.authors && paper.authors.length > 0 ? paper.authors.join(', ') : 'ArXiv Preprint'}
                        </span>
                        <a 
                          href={paper.arxivUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[#107c41] hover:underline flex items-center gap-0.5 font-bold whitespace-nowrap"
                        >
                          Makaleyi Aç →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. 🤗 HUGGING FACE YEREL MODEL & AÇIK KAYNAK NABZI (Sol 5 En İyiler, Sağ 5 Trending) */}
            {(report.huggingFaceBest?.length > 0 || report.huggingFaceTrending?.length > 0) && (
              <div className="pt-3 border-t border-[#e2e8f0] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🤗</span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-mono uppercase">
                      Hugging Face Yerel Model &amp; Açık Kaynak Liderlik Tablosu
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                    Gerçek İndirme Verileri
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* SOL 5: MEVCUT EN İYİLER (Pazar Standartları) */}
                  <div className="bg-white border border-[#cbd5e1] rounded shadow-xs overflow-hidden">
                    <div className="bg-[#f8fafc] border-b border-[#cbd5e1] px-3 py-2 flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-slate-800 flex items-center gap-1.5">
                        <span>🏆</span>
                        <span>En Çok Beğenilen &amp; İndirilenler</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">Top 5 Model</span>
                    </div>

                    <div className="divide-y divide-[#e2e8f0]">
                      {(report.huggingFaceBest || []).slice(0, 5).map((model, idx) => {
                        const isExpanded = expandedHfId === model.id;
                        return (
                          <div key={idx} className="transition-colors">
                            {/* Satır Başlığı - Tıklanabilir */}
                            <div 
                              onClick={() => setExpandedHfId(isExpanded ? null : model.id)}
                              className={`h-11 px-3 flex items-center justify-between text-xs cursor-pointer select-none transition ${
                                isExpanded ? 'bg-emerald-50/70 font-semibold' : 'hover:bg-[#fbfcfd]'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <span className="w-5 font-mono text-slate-400 font-bold text-[11px] shrink-0">
                                  #{idx + 1}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <span className="font-mono font-bold text-slate-900 truncate block text-xs" title={model.id}>
                                    {model.name || model.id}
                                  </span>
                                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-tight">
                                    {model.tag}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 pl-3 flex-shrink-0">
                                <div className="text-right font-mono">
                                  <span className="font-black text-emerald-700 text-xs block">
                                    ⬇ {model.downloads}
                                  </span>
                                  <span className="text-[9px] text-slate-400">
                                    ❤️ {model.likes?.toLocaleString()}
                                  </span>
                                </div>
                                <div className="text-slate-400">
                                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-[#107c41]" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                </div>
                              </div>
                            </div>

                            {/* Tıklanınca Açılan Detay Paneli */}
                            {isExpanded && (
                              <div className="p-3 bg-[#f8fafc] border-t border-[#e2e8f0] space-y-2.5 text-xs shadow-inner">
                                {/* 1. Ne İşe Yarar? (Temel Yetenek & Fonksiyon) */}
                                <div className="space-y-0.5">
                                  <span className="font-mono text-[10px] font-bold text-emerald-800 uppercase flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                    Ne İşe Yarar? (Temel Görev &amp; Fonksiyon)
                                  </span>
                                  <p className="text-slate-800 leading-relaxed pl-2.5">
                                    {model.function || 'Açık kaynaklı yapay zeka modeli.'}
                                  </p>
                                </div>

                                {/* 2. Diğerlerinden Farkı (Neden Bu Model?) */}
                                <div className="space-y-0.5">
                                  <span className="font-mono text-[10px] font-bold text-blue-800 uppercase flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                                    Diğerlerinden Farkı &amp; Ayrışan Yönü
                                  </span>
                                  <p className="text-slate-800 leading-relaxed pl-2.5">
                                    {model.distinction || 'Kendi kategorisinde optimize edilmiş açık mimari.'}
                                  </p>
                                </div>

                                {/* 3. Neden Hypelandı? (Topluluk Tercihi & Yükseliş Nedeni) */}
                                <div className="space-y-0.5">
                                  <span className="font-mono text-[10px] font-bold text-orange-800 uppercase flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                                    Neden Hypelandı? (Topluluk Tercihi)
                                  </span>
                                  <p className="text-slate-800 leading-relaxed pl-2.5">
                                    {model.whyHype || 'Topluluk tarafından yoğun talep gördü.'}
                                  </p>
                                </div>

                                {/* 4. Çalışma Ortamı & Donanım Gereksinimi */}
                                <div className="p-2 bg-white rounded border border-[#e2e8f0] space-y-1">
                                  <span className="font-mono text-[10px] font-bold text-purple-800 uppercase flex items-center gap-1">
                                    <span>⚙️</span>
                                    <span>Çalışma Ortamı &amp; Donanım Gereksinimi:</span>
                                  </span>
                                  <p className="text-slate-700 font-mono text-[11px] leading-relaxed">
                                    {model.environment || 'vLLM, Ollama, Hugging Face Transformers.'}
                                  </p>
                                </div>

                                {/* 5. Hugging Face Link Butonu */}
                                <div className="pt-1 flex items-center justify-between">
                                  <span className="text-[10px] font-mono text-slate-400">Model ID: {model.id}</span>
                                  <a 
                                    href={`https://huggingface.co/${model.id}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#107c41] hover:underline bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200"
                                  >
                                    <span>🤗 Hugging Face Sayfası</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* SAĞ 5: BUGÜN YÜKSELİŞE GEÇENLER (24s Trending) */}
                  <div className="bg-white border border-[#cbd5e1] rounded shadow-xs overflow-hidden">
                    <div className="bg-[#f8fafc] border-b border-[#cbd5e1] px-3 py-2 flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-slate-800 flex items-center gap-1.5">
                        <span>⚡</span>
                        <span>Bugün Yükselişe Geçenler (24s Trending)</span>
                      </span>
                      <span className="text-[10px] font-mono text-orange-600 font-bold">Top 5 Trending</span>
                    </div>

                    <div className="divide-y divide-[#e2e8f0]">
                      {(report.huggingFaceTrending || []).slice(0, 5).map((model, idx) => {
                        const isExpanded = expandedHfId === model.id;
                        return (
                          <div key={idx} className="transition-colors">
                            {/* Satır Başlığı - Tıklanabilir */}
                            <div 
                              onClick={() => setExpandedHfId(isExpanded ? null : model.id)}
                              className={`h-11 px-3 flex items-center justify-between text-xs cursor-pointer select-none transition ${
                                isExpanded ? 'bg-orange-50/70 font-semibold' : 'hover:bg-[#fbfcfd]'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <span className="w-5 font-mono text-slate-400 font-bold text-[11px] shrink-0">
                                  #{idx + 1}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <span className="font-mono font-bold text-slate-900 truncate block text-xs" title={model.id}>
                                    {model.name || model.id}
                                  </span>
                                  <span className="text-[9px] font-mono text-orange-600 uppercase tracking-tight font-semibold">
                                    {model.tag || model.highlight}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 pl-3 flex-shrink-0">
                                <div className="text-right font-mono">
                                  <span className="font-black text-emerald-700 text-xs block">
                                    ⬇ {model.downloads}
                                  </span>
                                  <span className="text-[9px] text-slate-400">
                                    ❤️ {model.likes?.toLocaleString()}
                                  </span>
                                </div>
                                <div className="text-slate-400">
                                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-orange-600" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                </div>
                              </div>
                            </div>

                            {/* Tıklanınca Açılan Detay Paneli */}
                            {isExpanded && (
                              <div className="p-3 bg-[#f8fafc] border-t border-[#e2e8f0] space-y-2.5 text-xs shadow-inner">
                                {/* 1. Ne İşe Yarar? (Temel Yetenek & Fonksiyon) */}
                                <div className="space-y-0.5">
                                  <span className="font-mono text-[10px] font-bold text-orange-800 uppercase flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
                                    Ne İşe Yarar? (Temel Görev &amp; Fonksiyon)
                                  </span>
                                  <p className="text-slate-800 leading-relaxed pl-2.5">
                                    {model.function || 'Son 24 saatte hızla yükselen yerel model.'}
                                  </p>
                                </div>

                                {/* 2. Diğerlerinden Farkı (Neden Bu Model?) */}
                                <div className="space-y-0.5">
                                  <span className="font-mono text-[10px] font-bold text-blue-800 uppercase flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                                    Diğerlerinden Farkı &amp; Ayrışan Yönü
                                  </span>
                                  <p className="text-slate-800 leading-relaxed pl-2.5">
                                    {model.distinction || 'Önceki nesillere göre belirgin performans veya hız avantajı.'}
                                  </p>
                                </div>

                                {/* 3. Neden Hypelandı? (Topluluk Tercihi & Yükseliş Nedeni) */}
                                <div className="space-y-0.5">
                                  <span className="font-mono text-[10px] font-bold text-amber-800 uppercase flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                    Neden Hypelandı? (24 Saatlik Patlama Nedeni)
                                  </span>
                                  <p className="text-slate-800 leading-relaxed pl-2.5">
                                    {model.whyHype || 'Toplulukta yoğun indirme ve kullanım artışı yaşadı.'}
                                  </p>
                                </div>

                                {/* 4. Çalışma Ortamı & Donanım Gereksinimi */}
                                <div className="p-2 bg-white rounded border border-[#e2e8f0] space-y-1">
                                  <span className="font-mono text-[10px] font-bold text-purple-800 uppercase flex items-center gap-1">
                                    <span>⚙️</span>
                                    <span>Çalışma Ortamı &amp; Donanım Gereksinimi:</span>
                                  </span>
                                  <p className="text-slate-700 font-mono text-[11px] leading-relaxed">
                                    {model.environment || 'vLLM, Ollama, Hugging Face Transformers.'}
                                  </p>
                                </div>

                                {/* 5. Hugging Face Link Butonu */}
                                <div className="pt-1 flex items-center justify-between">
                                  <span className="text-[10px] font-mono text-slate-400">ID: {model.id}</span>
                                  <a 
                                    href={`https://huggingface.co/${model.id}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:underline bg-orange-50 px-2.5 py-1 rounded border border-orange-200"
                                  >
                                    <span>🤗 Hugging Face Sayfası</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 7. 🐙 GITHUB AI RADARI: YÜKSELEN AÇIK KAYNAK YILDIZLAR */}
            {report.githubRadar && (
              <div className="pt-3 border-t border-[#e2e8f0] space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-[#24292e] text-white flex items-center justify-center rounded-xs shadow-2xs">
                      <Github className="w-3.5 h-3.5" />
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-mono uppercase tracking-tight">
                      GitHub AI Radarı: Yükselen Açık Kaynak Yıldızlar
                    </h4>
                  </div>

                  {/* Zaman Filtre Butonları */}
                  <div className="grid grid-cols-2 sm:flex items-center gap-1 bg-slate-100 p-0.5 rounded border border-slate-200 w-full sm:w-auto">
                    {[
                      { id: 'daily', label: '⚡ 24s Flaş', desc: 'Son 24 saatte patlayanlar' },
                      { id: 'weekly', label: '📈 1 Haftalık', desc: 'Haftalık yükselenler' },
                      { id: 'monthly', label: '🪐 1 Aylık', desc: 'Son 30 günün liderleri' },
                      { id: 'yearly', label: '🏆 Yıllık En İyiler', desc: 'Açık kaynak efsaneleri' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setGithubTimeframe(tab.id)}
                        title={tab.desc}
                        className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded transition-all flex items-center justify-center gap-1 ${
                          githubTimeframe === tab.id
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 font-mono">
                  Açık kaynak ekosisteminde en çok ivme kazanan otonom ajanlar, Deep Research motorları, OSINT araçları ve CLI kütüphaneleri.
                </p>

                {/* Repo Kartları Grid (Satır bazlı subgrid ile hizalanır, kaydırma yok, doğal uzar) */}
                <div className="space-y-3">
                  {githubChunks.map((chunk, cIdx) => (
                    <div key={cIdx} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-4 lg:gap-y-2.5 subgrid-row-github">
                      {chunk.map((repo, idx) => (
                        <div 
                          key={repo.id || `${repo.owner}/${repo.name}` || idx}
                          className="bg-slate-50/70 rounded border border-[#cbd5e1] p-3 hover:border-slate-400 hover:bg-white transition-all shadow-2xs group flex flex-col justify-between gap-2.5 subgrid-card-github"
                        >
                          {/* 1. Başlık & Kategori */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-mono text-[10px] font-bold text-slate-500">#{cIdx * 3 + idx + 1}</span>
                                <a
                                  href={repo.url || `https://github.com/${repo.owner}/${repo.name}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-bold text-slate-900 hover:text-blue-600 transition-colors truncate font-mono text-xs inline-flex items-center gap-1"
                                >
                                  <span>{repo.name}</span>
                                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-500 shrink-0" />
                                </a>
                              </div>
                              <span className="text-[10px] font-mono text-slate-400 block truncate">
                                {repo.owner}
                              </span>
                            </div>

                            {repo.category && (
                              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                                {repo.category}
                              </span>
                            )}
                          </div>

                          {/* 2. Metrikler: Yıldız, Artış, Dil */}
                          <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono">
                            <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/70 font-semibold">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              {repo.stars}
                            </span>
                            {repo.deltaStars && (
                              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/70 font-semibold text-[10px]">
                                🔥 {repo.deltaStars}
                              </span>
                            )}
                            {repo.language && (
                              <span className="text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-[10px]">
                                {repo.language}
                              </span>
                            )}
                          </div>

                          {/* 3. Ne İşe Yarar? (Doğal genişler, kaydırma yok, h-full ile diğerleri aynı seviyeye uzar) */}
                          <div className="p-2.5 bg-white rounded border border-[#e2e8f0] h-full flex flex-col justify-start">
                            <span className="font-mono text-[10px] font-bold text-slate-700 uppercase flex items-center gap-1 mb-1 shrink-0">
                              <span>🎯</span>
                              <span>Ne İşe Yarar?</span>
                            </span>
                            <p className="text-slate-800 text-[11px] leading-relaxed">
                              {repo.function}
                            </p>
                          </div>

                          {/* 4. Neden Yıldızlaştı? (Doğal genişler, kaydırma yok, h-full ile diğerleri aynı seviyeye uzar) */}
                          <div className="p-2.5 bg-[#f8fafc] rounded border border-[#e2e8f0] h-full flex flex-col justify-start">
                            <span className="font-mono text-[10px] font-bold text-indigo-700 uppercase flex items-center gap-1 mb-1 shrink-0">
                              <span>⚡</span>
                              <span>Neden Yıldızlaştı?</span>
                            </span>
                            <p className="text-slate-700 text-[11px] leading-relaxed">
                              {repo.whyHype}
                            </p>
                          </div>

                          {/* 5. Kart Alt: Kurulum Komutu & Link */}
                          <div className="pt-2 border-t border-slate-200/80 space-y-2">
                            <div 
                              onClick={() => handleCopyCmd(repo.id, repo.installCommand || `git clone ${repo.url || ''}`)}
                              title="Komutu panoya kopyala"
                              className="bg-slate-900 hover:bg-slate-950 text-emerald-400 font-mono text-[10px] px-2.5 py-1.5 rounded flex items-center justify-between gap-2 cursor-pointer transition select-none group/cmd border border-slate-800"
                            >
                              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                <Terminal className="w-3 h-3 text-slate-400 shrink-0" />
                                <code className="truncate select-all font-mono font-medium">{repo.installCommand || 'git clone ' + (repo.url || '')}</code>
                              </div>
                              <span className="shrink-0 text-slate-400 group-hover/cmd:text-white transition">
                                {copiedCmdId === repo.id ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </span>
                            </div>

                            <div className="flex items-center justify-end">
                              <a
                                href={repo.url || `https://github.com/${repo.owner}/${repo.name}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-slate-950 font-mono hover:underline"
                              >
                                <span>Repoyu İncele</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. 🟠 HACKER NEWS: SON 24 SAAT GELİŞTİRİCİ NABZI & TARTIŞMALARI (Sıralamaya Etkisiz) */}
            {report.hackerNewsPulse && (
              <div className="pt-3 border-t border-[#e2e8f0] space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-[#ff6600] text-white font-black text-xs flex items-center justify-center rounded-xs font-mono shadow-2xs">
                      Y
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-mono uppercase">
                      Hacker News: Son 24 Saatin Geliştirici &amp; Mühendis Nabzı
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-50 text-orange-800 border border-orange-200 font-bold">
                    Sıralamaya Etkisiz • Saf Teknik İstihbarat
                  </span>
                </div>

                {/* 24 Saatlik Geliştirici Gündemi Özeti */}
                {report.hackerNewsPulse.summary24h && (
                  <div className="p-3 bg-[#fffaf5] border-l-4 border-l-[#ff6600] border-y border-r border-orange-200 rounded-r text-xs text-slate-800 leading-relaxed">
                    <span className="font-mono font-bold text-orange-950 uppercase text-[10px] block mb-0.5">
                      📌 SON 24 SAATİN ÖZETİ &amp; MÜHENDİS HİSSİYATI:
                    </span>
                    <p className="text-slate-800">{report.hackerNewsPulse.summary24h}</p>
                  </div>
                )}

                {/* Tartışmalar ve Doğal Açıklama Paragrafları (Çiftli subgrid ile hizalanır, kaydırma yok, doğal uzar) */}
                <div className="space-y-4">
                  {hnChunks.map((pair, pIdx) => (
                    <div key={pIdx} className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 md:gap-y-2.5 subgrid-row-hn">
                      {pair.map((disc, dIdx) => (
                        <div 
                          key={disc.id || `${pIdx}-${dIdx}`}
                          className="bg-white border border-[#cbd5e1] rounded-sm p-3.5 hover:border-[#ff6600] transition shadow-xs flex flex-col justify-between gap-2.5 subgrid-card-hn"
                        >
                          {/* 1. Üst Kategori ve Puan/Yorum Barı */}
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold border border-slate-200">
                              {disc.category || 'Geliştirici Tartışması'}
                            </span>
                            <div className="flex items-center gap-2 text-slate-500 font-bold">
                              <span className="text-[#ff6600]">▲ {disc.points} puan</span>
                              <span>•</span>
                              <span>💬 {disc.comments} yorum</span>
                            </div>
                          </div>

                          {/* 2. Tartışma Başlığı (Zorunlu Türkçe) */}
                          <div className="flex items-start">
                            <a 
                              href={disc.hnUrl || disc.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="font-bold text-xs sm:text-[13px] text-slate-900 hover:text-[#ff6600] transition inline-flex items-start gap-1 group leading-snug"
                              title={disc.title}
                            >
                              <span className="group-hover:underline">{disc.titleTr || disc.title}</span>
                              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 text-slate-400 group-hover:text-[#ff6600] mt-0.5" />
                            </a>
                          </div>

                          {/* 3. Derin Teknik Tartışma Paragrafı (Doğal uzar, kaydırma yok) */}
                          <div className="text-xs text-slate-700 leading-relaxed font-normal flex flex-col justify-start">
                            <p>{disc.discussion || disc.analysis || disc.keyTakeaway}</p>
                          </div>

                          {/* 4. Alt Bar: HN Link */}
                          <div className="pt-2 border-t border-[#f1f5f9] flex items-center justify-between text-[11px] font-mono text-slate-400">
                            <span className="text-[10px] text-slate-400 truncate max-w-[200px]" title={disc.title}>
                              HN #{disc.id || `${pIdx}-${dIdx}`}
                            </span>
                            <a 
                              href={disc.hnUrl || disc.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-[#ff6600] hover:underline flex items-center gap-0.5 font-bold flex-shrink-0"
                            >
                              HN Tartışmasını Aç →
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
              </>
            )}
          </section>
        )}

      </main>

      {/* 8. SADE EXCEL DURUM ÇUBUĞU (Bottom Status Bar) */}
      <footer className="bg-[#e5e7eb] border-t border-[#d1d5db] px-4 py-1.5 flex items-center justify-between text-xs font-mono text-slate-600 select-none flex-wrap gap-2">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <span className="font-bold text-[#107c41]">HAZIR</span>
          <span>TOPLAM: {filteredTools.length} MODEL</span>
          <span className="hidden sm:inline">ORTALAMA HYPE: {avgHypeScore}</span>
          {report.activeModel && (
            <span className="hidden md:inline text-slate-500">
              | MOTOR: <strong className="text-slate-800">{report.activeModel.replace(' (deepseek-flash)', '')}</strong>
            </span>
          )}
          {typeof report.durationSeconds === 'number' && report.durationSeconds > 0 && (
            <span className="hidden md:inline text-slate-500">
              | SÜRE: <strong className="text-slate-800">{report.durationSeconds}s</strong>
              {report.startedAt && report.completedAt ? ` (${report.startedAt.slice(0, 5)} ➔ ${report.completedAt.slice(0, 5)})` : ''}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 sm:gap-4 text-[11px]">
          <span className="hidden sm:inline">50 TOPLULUK</span>
          {report.tokenUsage && typeof report.tokenUsage.promptTokens === 'number' && report.tokenUsage.promptTokens > 0 && (
            <span className="hidden lg:inline text-slate-500">
              {report.phase1TokenUsage && report.phase2TokenUsage ? (
                <>
                  1. LLM: <strong className="text-emerald-700">{(report.phase1TokenUsage.totalTokens / 1000).toFixed(1)}k</strong>
                  {' '}| 2. LLM: <strong className="text-cyan-700">{(report.phase2TokenUsage.totalTokens / 1000).toFixed(1)}k</strong>
                  {' '}| TOPLAM: <strong className="text-slate-800">{(report.tokenUsage.totalTokens / 1000).toFixed(1)}k</strong>
                  {' '}(Girdi: <span className="text-slate-700">{(report.tokenUsage.promptTokens / 1000).toFixed(1)}k</span> | Düşünce: <span className="text-purple-700">{((report.tokenUsage.reasoningTokens || 0) / 1000).toFixed(1)}k</span> | Nihai: <span className="text-yellow-700">{(((report.tokenUsage.finalTokens || Math.max(0, (report.tokenUsage.completionTokens || 0) - (report.tokenUsage.reasoningTokens || 0)))) / 1000).toFixed(1)}k</span>)
                </>
              ) : (
                <>
                  TOKEN: Girdi <strong className="text-slate-700">{(report.tokenUsage.promptTokens / 1000).toFixed(1)}k</strong>
                  {' '}| Düşünce <strong className="text-purple-700">{((report.tokenUsage.reasoningTokens || 0) / 1000).toFixed(1)}k</strong>
                  {' '}| Nihai <strong className="text-slate-800">{(((report.tokenUsage.finalTokens || Math.max(0, (report.tokenUsage.completionTokens || 0) - (report.tokenUsage.reasoningTokens || 0)))) / 1000).toFixed(1)}k</strong>
                </>
              )}
            </span>
          )}
          <span>%100 ZOOM</span>
        </div>
      </footer>

    </div>
  );
}
