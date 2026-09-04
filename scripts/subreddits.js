/**
 * 50 Yüksek Sinyalli Yapay Zeka, Donanım (GPU/CPU) ve Yazılım Subreddit Havuzu
 * Reddit'in resmi Multi-Subreddit (+ operatörü) özelliği kullanılarak
 * 50 ayrı istek yerine 7 organize pakette çekilir.
 */

export const SUBREDDIT_BATCHES = [
  {
    name: "Vibe Coding & Yeni Nesil Editörler",
    slug: "vibecoding+CursorAI+windsurf+ChatGPTCoding+ClaudeAI+copilot+ClaudeDev+vscode",
    subreddits: ["vibecoding", "CursorAI", "windsurf", "ChatGPTCoding", "ClaudeAI", "copilot", "ClaudeDev", "vscode"]
  },
  {
    name: "Otonom Ajanlar & Süreç Otomasyonu",
    slug: "AI_Agents+CrewAI+LangChain+AutoGPT+Automate+n8n+agenticai",
    subreddits: ["AI_Agents", "CrewAI", "LangChain", "AutoGPT", "Automate", "n8n", "agenticai"]
  },
  {
    name: "Büyük Dil Modelleri & Araştırma Devleri",
    slug: "OpenAI+GoogleGemini+DeepSeek+Singularity+ArtificialInteligence+MachineLearning+Anthropic",
    subreddits: ["OpenAI", "GoogleGemini", "DeepSeek", "Singularity", "ArtificialInteligence", "MachineLearning", "Anthropic"]
  },
  {
    name: "Açık Kaynak, Yerel Modeller & Self-Hosted",
    slug: "LocalLLaMA+ollama+vllm+huggingface+OpenSourceAI+MistralAI+selfhosted",
    subreddits: ["LocalLLaMA", "ollama", "vllm", "huggingface", "OpenSourceAI", "MistralAI", "selfhosted"]
  },
  {
    name: "Yazılım Geliştirici, API & Kodlama Dünyası",
    slug: "LLMDevs+PromptEngineering+AI_Tools+GenerativeAI+webdev+programming",
    subreddits: ["LLMDevs", "PromptEngineering", "AI_Tools", "GenerativeAI", "webdev", "programming"]
  },
  {
    name: "Donanım, GPU, CPU & Bulut Altyapısı",
    slug: "hardware+nvidia+AMD_Stock+sysadmin+devops+Cloud+technology",
    subreddits: ["hardware", "nvidia", "AMD_Stock", "sysadmin", "devops", "Cloud", "technology"]
  },
  {
    name: "Görsel, Video & Medya Üretimi",
    slug: "ComfyUI+StableDiffusion+Midjourney+Sora+RunwayML+artificial",
    subreddits: ["ComfyUI", "StableDiffusion", "Midjourney", "Sora", "RunwayML", "artificial"]
  }
];

export const REDDIT_USER_AGENT = "web:aitrendleri.com:v3.0 (by /u/orhanerturk; contact: orhaner1907@gmail.com)";
