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
  Search,
  Filter,
  Info,
  Calendar,
  ExternalLink,
  BookOpen,
  Sparkles,
  Github,
  Star,
  GitFork,
  Terminal
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
      installCommand: "git clone https://github.com/koala73/worldmonitor && npm i"
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
      installCommand: "code --install-extension saoudrizwan.claude-dev"
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
      installCommand: "docker run -d -p 3000:8080 -v open-webui:/app/backend/data --name open-webui ghcr.io/open-webui/open-webui:main"
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
  const [timeframe, setTimeframe] = useState('daily'); // 'daily' | '12h' | 'weekly' | 'monthly' | 'report'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [expandedHfId, setExpandedHfId] = useState(null);
  const [githubTimeframe, setGithubTimeframe] = useState('daily'); // 'daily' | 'weekly' | 'monthly' | 'yearly'
  const [searchQuery, setSearchQuery] = useState('');

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

    // 1. Hugging Face Best (Sol 5 - Daima tam 5 model)
    let hfBest = raw.huggingFaceBest;
    if (!Array.isArray(hfBest) || hfBest.length === 0) {
      hfBest = DEFAULT_HF_BEST;
    } else {
      hfBest = hfBest.slice(0, 5).map((m, idx) => ({
        rank: m.rank || idx + 1,
        id: m.id,
        name: m.name || m.id,
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
          installCommand: r.installCommand || bm.installCommand
        };
      });
    }

    // 4. Hacker News Pulse (Daima summary24h ve 8 doyurucu tartışma)
    let hnPulse = raw.hackerNewsPulse;
    if (Array.isArray(hnPulse)) {
      hnPulse = {
        summary24h: "Son 24 saatte Hacker News gündeminde öne çıkan geliştirici ve mühendislik tartışmaları.",
        discussions: hnPulse.map((item, idx) => ({
          id: item.url || item.title || `hn-${idx}`,
          title: item.title || "Geliştirici Tartışması",
          titleTr: item.titleTr || item.title || "Geliştirici Tartışması",
          points: item.points || 150,
          comments: item.comments || 80,
          hnUrl: item.url || item.hnUrl || "https://news.ycombinator.com",
          category: item.category || "Mühendis Tartışması",
          analysis: item.analysis || item.takeaway || "Teknik ekosistemde dikkat çeken konu.",
          usefulInsight: item.usefulInsight || item.takeaway || "Geliştiriciler için doğrudan işe yarar pratik çıkarım."
        }))
      };
    } else if (hnPulse && typeof hnPulse === 'object') {
      let discList = hnPulse.discussions;
      if (!Array.isArray(discList)) {
        discList = Object.values(hnPulse).filter(v => v && typeof v === 'object' && v.title);
      }
      hnPulse = {
        summary24h: hnPulse.summary24h || "Son 24 saatte Hacker News gündeminde öne çıkan geliştirici tartışmaları.",
        discussions: (discList || []).map((item, idx) => ({
          id: item.id || item.hnUrl || `hn-${idx}`,
          title: item.title || "Geliştirici Tartışması",
          titleTr: item.titleTr || item.title || "Geliştirici Tartışması",
          points: item.points || 150,
          comments: item.comments || 80,
          hnUrl: item.hnUrl || item.url || "https://news.ycombinator.com",
          category: item.category || "Mühendis Tartışması",
          analysis: item.analysis || item.takeaway || "Teknik ekosistemde dikkat çeken konu.",
          usefulInsight: item.usefulInsight || item.takeaway || "Geliştiriciler için doğrudan işe yarar pratik çıkarım."
        }))
      };
    }

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

    return {
      date: raw.date,
      executiveSummary: raw.executiveSummary || LATEST_CONSULTANT_REPORT.executiveSummary,
      sections: raw.sections || LATEST_CONSULTANT_REPORT.sections,
      arxivDaily: normalizeArxiv(raw.arxivDaily),
      arxivWeeklyBest: normalizeArxiv(raw.arxivWeeklyBest),
      huggingFaceBest: hfBest,
      huggingFaceTrending: hfTrending,
      githubRadar: normalizedGh,
      hackerNewsPulse: hnPulse
    };
  }, [activeReportData]);

  const rawTools = {
    '12h': activeReportData?.twelveHours || activeReportData?.daily || MOCK_TOOLS_DATA.daily,
    daily: activeReportData?.daily || MOCK_TOOLS_DATA.daily,
    weekly: activeReportData?.weekly || MOCK_TOOLS_DATA.weekly,
    monthly: activeReportData?.monthly || MOCK_TOOLS_DATA.monthly
  }[timeframe] || (activeReportData?.daily || MOCK_TOOLS_DATA.daily);

  // Filter tools by category and search
  const filteredTools = useMemo(() => {
    let result = rawTools;
    if (selectedCategory !== 'all') {
      result = result.filter(t => t.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.name?.toLowerCase().includes(q) || 
        t.primaryFunction?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [rawTools, selectedCategory, searchQuery]);

  // Average Hype calculation for status bar
  const avgHypeScore = useMemo(() => {
    if (!filteredTools.length) return '0.0';
    const sum = filteredTools.reduce((acc, t) => acc + (t.hypeScore || 0), 0);
    return (sum / filteredTools.length).toFixed(1);
  }, [filteredTools]);

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

  // Excel Category Badge Styles (Clean Excel Cell Style)
  const getCategoryBadgeClass = (category) => {
    switch (category) {
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

  const selectedTool = filteredTools.find(t => t.id === expandedId) || filteredTools[0];

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-800 font-sans antialiased flex flex-col selection:bg-[#107c41] selection:text-white">
      
      {/* 1. EXCEL YEŞİL BAŞLIK ÇUBUĞU (Office Ribbon Bar) */}
      <header className="bg-[#107c41] text-white select-none shadow-sm">
        {/* Üst Logo ve Dosya Adı */}
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 bg-white text-[#107c41] font-black rounded text-xs shadow-inner tracking-tighter">
              AI
            </div>
            <span className="font-bold text-base tracking-wide font-mono">aitrendleri.com</span>
          </div>

          {/* Sağ Durum, Geçmiş Tarih Seçici ve Saat Bilgisi */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono text-emerald-100 flex-wrap">
            {/* Geçmiş Tarih / Arşiv Seçici Dropdown */}
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

            <div className="hidden md:flex items-center gap-1.5 bg-[#0e6b37] px-2.5 py-1 rounded">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
              <span>Canlı Akış</span>
            </div>
          </div>
        </div>

        {/* 2. ZAMAN SEÇİCİ SEKMELER (Simetrik ve Birbirine Eşit Boyutta Butonlar) */}
        <div className="max-w-7xl mx-auto px-2 sm:px-4 border-t border-[#0e6b37] pt-2 pb-1.5">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 w-full">
            {[
              { id: 'daily', label: '📊 24 Saatlik' },
              { id: '12h', label: '⚡ 12 Saatlik' },
              { id: 'weekly', label: '📈 1 Haftalık' },
              { id: 'monthly', label: '🪐 1 Aylık' },
              { id: 'report', label: '📋 Danışman Raporu' }
            ].map((tab, idx) => (
              <button
                key={tab.id}
                onClick={() => setTimeframe(tab.id)}
                className={`h-9 flex items-center justify-center transition font-mono text-[11px] sm:text-xs font-bold rounded shadow-xs text-center ${
                  idx === 4 ? 'col-span-2 sm:col-span-1' : ''
                } ${
                  timeframe === tab.id
                    ? 'bg-white text-[#107c41] shadow-xs'
                    : 'text-emerald-100 bg-[#0e6b37] hover:bg-[#0b5e30]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 3. EXCEL FORMÜL VE AD ÇUBUĞU (Formula Bar) */}
      <div className="bg-white border-b border-[#d1d5db] py-1.5 px-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-mono">
          {/* Ad Kutusu (Hücre Koordinatı) */}
          <div className="w-14 sm:w-16 bg-[#f9fafb] border border-[#d1d5db] px-2 py-1 text-center font-bold text-slate-700 select-none">
            {expandedId ? `B${filteredTools.findIndex(t => t.id === expandedId) + 2}` : 'A1'}
          </div>

          {/* fx İkonu */}
          <div className="flex items-center justify-center font-bold italic text-slate-500 px-1 border-r border-[#e5e7eb] pr-2">
            fx
          </div>

          {/* Formül Satırı */}
          <div className="flex-1 flex items-center bg-white border border-[#d1d5db] px-3 py-1 text-slate-700 truncate">
            <span className="text-[#107c41] font-bold mr-1.5">=HYPE.DEĞERLENDİR(</span>
            <span className="text-blue-600 font-semibold truncate">
              {selectedTool ? `"${selectedTool.name}", KATEGORİ="${selectedTool.category}", SKOR=${selectedTool.hypeScore}/10` : '"TÜM_MODELLER"'}
            </span>
            <span className="text-[#107c41] font-bold">)</span>
          </div>

          {/* Hızlı Arama */}
          <div className="relative hidden md:block w-48">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
            <input
              type="text"
              placeholder="Tabloda ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2 py-1 text-xs border border-[#d1d5db] rounded bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#107c41]"
            />
          </div>
        </div>
      </div>

      {/* 4. KATEGORİ VE ÇALIŞMA ALANI */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 py-4 w-full flex-1 space-y-4">
        
        {/* Kategori Filtre Çubuğu (Sağa kaydırma yok, flex-wrap ile ekrana tam oturur) */}
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

        {/* 5. MASAÜSTÜ EXCEL IZGARA TABLOSU (hidden md:block) */}
        {timeframe !== 'report' && (
          <div className="hidden md:block bg-white border border-[#d1d5db] shadow-xs overflow-hidden">
            <table className="w-full table-fixed text-left border-collapse font-sans text-xs">
              
              {/* Sütun Harfleri ve Başlıklar (A - G) */}
              <thead>
                {/* Excel Sütun Harfleri Satırı */}
                <tr className="bg-[#f8fafc] border-b border-[#d1d5db] text-[10px] font-mono text-slate-500 select-none">
                  <th className="w-12 text-center py-1 border-r border-[#e2e8f0]">A</th>
                  <th className="w-52 px-3 py-1 border-r border-[#e2e8f0] text-left">B</th>
                  <th className="w-44 px-3 py-1 border-r border-[#e2e8f0] text-left">C</th>
                  <th className="px-3 py-1 border-r border-[#e2e8f0] text-left">D</th>
                  <th className="w-24 px-3 py-1 border-r border-[#e2e8f0] text-right">E</th>
                  <th className="w-20 px-3 py-1 border-r border-[#e2e8f0] text-right">F</th>
                  <th className="w-28 px-3 py-1 text-center">G</th>
                </tr>

                {/* Sütun İsimleri Satırı */}
                <tr className="bg-[#f1f5f9] border-b-2 border-[#cbd5e1] text-[11px] font-semibold text-slate-700 select-none">
                  <th className="w-12 text-center py-2.5 border-r border-[#cbd5e1]">Sıra</th>
                  <th className="w-52 px-3 py-2.5 border-r border-[#cbd5e1] text-left">Model / Ürün Adı</th>
                  <th className="w-44 px-3 py-2.5 border-r border-[#cbd5e1] text-left">Kategori</th>
                  <th className="px-3 py-2.5 border-r border-[#cbd5e1] text-left">Temel Yetenek &amp; Fonksiyon</th>
                  <th className="w-24 px-3 py-2.5 border-r border-[#cbd5e1] text-right">Hype Skoru</th>
                  <th className="w-20 px-3 py-2.5 border-r border-[#cbd5e1] text-right">Delta (Δ)</th>
                  <th className="w-28 px-3 py-2.5 text-center">Topluluk Kaynak</th>
                </tr>
              </thead>

              {/* Tablo Satırları (Her Biri Tamamen Eşit Boyda h-11) */}
              <tbody className="divide-y divide-[#e2e8f0]">
                {filteredTools.map((tool, idx) => {
                  const isPositive = tool.scoreDelta > 0;
                  const isNegative = tool.scoreDelta < 0;
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
                        <td className="w-12 text-center font-mono font-bold text-slate-600 border-r border-[#e2e8f0]">
                          #{idx + 1}
                        </td>

                        {/* Kolon B: Model Adı */}
                        <td className="w-52 px-3 border-r border-[#e2e8f0] truncate">
                          <span className="font-bold text-slate-900 hover:text-[#107c41] transition truncate block">
                            {tool.name}
                          </span>
                        </td>

                        {/* Kolon C: Kategori */}
                        <td className="w-44 px-3 border-r border-[#e2e8f0]">
                          <span className={`inline-block font-mono text-[11px] px-2 py-0.5 rounded border ${getCategoryBadgeClass(tool.category)} whitespace-nowrap`}>
                            {tool.category}
                          </span>
                        </td>

                        {/* Kolon D: Temel Fonksiyon */}
                        <td className="px-3 border-r border-[#e2e8f0] text-slate-700">
                          <div className="truncate text-xs text-slate-700" title="Tüm açıklamayı okumak için tıklayın">
                            {tool.primaryFunction}
                          </div>
                        </td>

                        {/* Kolon E: Hype Skoru */}
                        <td className="w-24 px-3 text-right border-r border-[#e2e8f0] font-mono">
                          <span className="font-black text-slate-900 text-sm">
                            {Number(tool.hypeScore || 0).toFixed(1)}
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal">/10</span>
                        </td>

                        {/* Kolon F: Delta Skoru */}
                        <td className="w-20 px-3 text-right border-r border-[#e2e8f0] font-mono">
                          <div className={`inline-flex items-center justify-end gap-0.5 text-xs font-bold ${
                            isPositive ? 'text-emerald-700' : isNegative ? 'text-rose-700' : 'text-slate-500'
                          }`}>
                            <span>{isPositive ? `+${tool.scoreDelta}` : tool.scoreDelta}</span>
                          </div>
                        </td>

                        {/* Kolon G: Topluluk Kaynak */}
                        <td className="w-28 px-3 text-center font-mono text-[11px] text-slate-600">
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
                          <td colSpan={7} className="p-2.5 sm:p-4 md:p-5">
                            
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
                                  <span className="text-[11px] font-mono uppercase font-bold text-[#107c41]">
                                    🔥 Bugün Neden Trend Oldu? (Topluluk Görüşü)
                                  </span>
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
                                    {historyEntries.map((entry, hIdx) => {
                                      const getSentBadge = (sent) => {
                                        switch (sent) {
                                          case 'coşkulu':
                                            return 'bg-emerald-100 text-emerald-800 border-emerald-300';
                                          case 'eleştirel':
                                            return 'bg-amber-100 text-amber-900 border-amber-300';
                                          case 'düşüş':
                                            return 'bg-rose-100 text-rose-800 border-rose-300';
                                          default:
                                            return 'bg-slate-100 text-slate-700 border-slate-300';
                                        }
                                      };

                                      const getSentLabel = (sent) => {
                                        switch (sent) {
                                          case 'coşkulu':
                                            return '🔥 Coşku';
                                          case 'eleştirel':
                                            return '⚠️ Eleştiri / Şikayet';
                                          case 'düşüş':
                                            return '📉 Düşüş / Rezalet';
                                          default:
                                            return '⚖️ Stabil';
                                        }
                                      };

                                      return (
                                        <div key={hIdx} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 py-1.5 border-b border-[#f1f5f9] last:border-0 text-xs">
                                          <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className="font-mono text-slate-500 text-[11px] w-24">{entry.date}</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSentBadge(entry.sentiment)}`}>
                                              {getSentLabel(entry.sentiment)}
                                            </span>
                                            <span className="font-mono font-bold text-slate-900">{entry.hypeScore}/10</span>
                                          </div>
                                          <div className="text-slate-700 text-xs flex-1">
                                            <strong className="text-slate-900 mr-1">{entry.headline}:</strong>
                                            {entry.summary}
                                          </div>
                                        </div>
                                      );
                                    })}
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
        {timeframe !== 'report' && (
          <div className="block md:hidden bg-white border border-[#cbd5e1] rounded-sm shadow-xs divide-y divide-[#e2e8f0] overflow-hidden">
            {filteredTools.map((tool, idx) => {
              const isPositive = tool.scoreDelta > 0;
              const isNegative = tool.scoreDelta < 0;
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
                        <div className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                          {tool.name}
                        </div>
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <span className={`font-mono text-[9px] px-1.5 py-0.2 rounded border ${getCategoryBadgeClass(tool.category)} whitespace-nowrap`}>
                            {tool.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Sağ Taraf: Hype Skoru + Ok İkonu */}
                    <div className="flex items-center gap-2 flex-shrink-0 font-mono text-right">
                      <div className="w-14 text-right">
                        <span className="font-black text-slate-900 text-sm">
                          {Number(tool.hypeScore || 0).toFixed(1)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">/10</span>
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
                        <span className="text-[10px] font-mono font-bold text-slate-700 uppercase flex items-center gap-1">
                          🔥 TOPLULUK ANALİZİ &amp; GEREKÇE:
                        </span>
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
                            {historyEntries.map((entry, hIdx) => {
                              const getSentBadge = (sent) => {
                                switch (sent) {
                                  case 'coşkulu': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
                                  case 'eleştirel': return 'bg-amber-100 text-amber-900 border-amber-300';
                                  case 'düşüş': return 'bg-rose-100 text-rose-800 border-rose-300';
                                  default: return 'bg-slate-100 text-slate-700 border-slate-300';
                                }
                              };
                              const getSentLabel = (sent) => {
                                switch (sent) {
                                  case 'coşkulu': return '🔥 Coşku';
                                  case 'eleştirel': return '⚠️ Eleştiri';
                                  case 'düşüş': return '📉 Düşüş';
                                  default: return '⚖️ Stabil';
                                }
                              };
                              return (
                                <div key={hIdx} className="border-b border-[#e2e8f0] pb-1 last:border-0 last:pb-0 space-y-0.5">
                                  <div className="flex items-center justify-between font-mono text-[9px]">
                                    <span className="text-slate-500">{entry.date}</span>
                                    <span className={`px-1 py-0.2 rounded font-bold border ${getSentBadge(entry.sentiment)}`}>
                                      {getSentLabel(entry.sentiment)}
                                    </span>
                                    <span className="font-bold text-slate-900">{entry.hypeScore}/10</span>
                                  </div>
                                  <p className="text-slate-700 text-[10px] leading-tight">
                                    <strong className="text-slate-900">{entry.headline}: </strong>
                                    {entry.summary}
                                  </p>
                                </div>
                              );
                            })}
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

        {/* 7. DANIŞMAN RAPORU (Bölüm 1 Dahil 4 Bölüm - 12s ve 24s Dahil Her Görünümde) */}
        {(timeframe === 'report' || timeframe === 'daily' || timeframe === '12h' || timeframe === 'weekly' || timeframe === 'monthly') && (
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

            {/* 4 Bölümlü Analizler */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {report.sections.map((sec, idx) => (
                <div key={idx} className="p-4 rounded bg-[#fafafa] border border-[#d1d5db] space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                      {sec.title}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#e8f5e9] text-[#107c41] border border-emerald-200 font-bold">
                      {sec.badge}
                    </span>
                  </div>
                  <div
                    className="text-xs text-slate-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: sec.contentHtml }}
                  />
                </div>
              ))}
            </div>

            {/* 5. 🔬 ARXİV BİLİMSEL YAPAY ZEKA MAKALE RADARI */}
            {((timeframe === 'weekly' && report.arxivWeeklyBest?.length > 0) || report.arxivDaily?.length > 0) && (
              <div className="pt-2 border-t border-[#e2e8f0] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#107c41]" />
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-mono uppercase">
                      {timeframe === 'weekly' 
                        ? '🔬 ArXiv: Haftanın En Çarpıcı Yapay Zeka Makaleleri (7 Günlük Seçki)' 
                        : '🔬 ArXiv: Günün En Çarpıcı 3 Yapay Zeka Makalesi'}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 font-bold">
                    Akademik İstihbarat
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-4 md:[grid-template-rows:auto_auto_auto_1fr_auto] md:gap-y-3">
                  {(timeframe === 'weekly' && report.arxivWeeklyBest?.length > 0 ? report.arxivWeeklyBest : report.arxivDaily).map((paper, pIdx) => (
                    <div 
                      key={pIdx} 
                      className="bg-white border border-[#cbd5e1] rounded-sm p-4 shadow-xs hover:border-[#107c41] transition flex flex-col justify-between gap-3 md:row-span-5 md:grid md:[grid-template-rows:subgrid] md:gap-y-3"
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
                        <span>Mevcut En İyiler (Endüstri Standartları)</span>
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
                                <span className="w-5 font-mono text-slate-400 font-bold text-[11px]">
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
                                <span className="w-5 font-mono text-slate-400 font-bold text-[11px]">
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
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded border border-slate-200">
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
                        className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded transition-all flex items-center gap-1 ${
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
                    <div key={cIdx} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-4 lg:[grid-template-rows:auto_auto_auto_auto_auto] lg:gap-y-2.5">
                      {chunk.map((repo, idx) => (
                        <div 
                          key={repo.id || `${repo.owner}/${repo.name}` || idx}
                          className="bg-slate-50/70 rounded border border-[#cbd5e1] p-3 hover:border-slate-400 hover:bg-white transition-all shadow-2xs group flex flex-col justify-between gap-2.5 lg:row-span-5 lg:grid lg:[grid-template-rows:subgrid] lg:gap-y-2.5"
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
                            <div className="bg-slate-900 text-emerald-400 font-mono text-[10px] px-2 py-1.5 rounded flex items-center justify-between gap-2 overflow-x-auto">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <Terminal className="w-3 h-3 text-slate-400 shrink-0" />
                                <code className="truncate select-all">{repo.installCommand || 'git clone ' + (repo.url || '')}</code>
                              </div>
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

                {/* Tartışmalar ve Yararlı Bilgiler Listesi (Çiftli subgrid ile hizalanır, kaydırma yok, doğal uzar) */}
                <div className="space-y-4">
                  {hnChunks.map((pair, pIdx) => (
                    <div key={pIdx} className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 md:[grid-template-rows:auto_auto_1fr_auto_auto] md:gap-y-2.5">
                      {pair.map((disc, dIdx) => (
                        <div 
                          key={disc.id || `${pIdx}-${dIdx}`}
                          className="bg-white border border-[#cbd5e1] rounded-sm p-3.5 hover:border-[#ff6600] transition shadow-xs flex flex-col justify-between gap-2.5 md:row-span-5 md:grid md:[grid-template-rows:subgrid] md:gap-y-2.5"
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

                          {/* 2. Tartışma Başlığı */}
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

                          {/* 3. Derin Teknik Analiz */}
                          <div className="text-xs text-slate-800 leading-relaxed font-normal flex flex-col justify-start">
                            <p>{disc.analysis || disc.keyTakeaway}</p>
                          </div>

                          {/* 4. Mühendis Çıkarımı / Pratik Bilgi Kutusu (Yeşil Kutu - Doğal uzar, kaydırma yok, iki kart aynı hizada başlar ve biter) */}
                          <div className="bg-[#f0fdf4] border-l-2 border-emerald-600 p-2.5 rounded-r text-xs text-slate-900 leading-relaxed h-full flex flex-col justify-start">
                            <p className="font-medium text-slate-800">{disc.usefulInsight || 'Topluluk tartışmasında kritik teknik içgörüler paylaşıldı.'}</p>
                          </div>

                          {/* 5. Alt Bar: HN Link */}
                          <div className="pt-2 border-t border-[#f1f5f9] flex items-center justify-between text-[11px] font-mono text-slate-400">
                            <span className="text-[10px] text-slate-400">Hacker News ID: #{disc.id || `${pIdx}-${dIdx}`}</span>
                            <a 
                              href={disc.hnUrl || disc.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-[#ff6600] hover:underline flex items-center gap-0.5 font-bold"
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
          </section>
        )}

      </main>

      {/* 8. SADE EXCEL DURUM ÇUBUĞU (Bottom Status Bar) */}
      <footer className="bg-[#e5e7eb] border-t border-[#d1d5db] px-4 py-1.5 flex items-center justify-between text-xs font-mono text-slate-600 select-none">
        <div className="flex items-center gap-4">
          <span className="font-bold text-[#107c41]">HAZIR</span>
          <span>TOPLAM: {filteredTools.length} MODEL</span>
          <span className="hidden sm:inline">ORTALAMA HYPE: {avgHypeScore}</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="hidden sm:inline">50 TOPLULUK</span>
          <span>%100 ZOOM</span>
        </div>
      </footer>

    </div>
  );
}
