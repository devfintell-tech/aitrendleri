/**
 * 43+ Yüksek Sinyalli Yapay Zeka Subreddit Grubu
 * Reddit'in resmi Multi-Subreddit (+ operatörü) özelliği kullanılarak
 * 43 ayrı istek yerine yalnızca 6 optimize pakette çekilir.
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
    name: "Büyük Dil Modelleri & Sektör Liderleri",
    slug: "OpenAI+GoogleGemini+DeepSeek+Singularity+ArtificialInteligence+MachineLearning+Anthropic",
    subreddits: ["OpenAI", "GoogleGemini", "DeepSeek", "Singularity", "ArtificialInteligence", "MachineLearning", "Anthropic"]
  },
  {
    name: "Açık Kaynak, Yerel Modeller & GPU",
    slug: "LocalLLaMA+ollama+vllm+huggingface+OpenSourceAI+MistralAI+selfhosted",
    subreddits: ["LocalLLaMA", "ollama", "vllm", "huggingface", "OpenSourceAI", "MistralAI", "selfhosted"]
  },
  {
    name: "Geliştirici, API & Prompt Mühendisliği",
    slug: "LLMDevs+PromptEngineering+AI_Tools+GenerativeAI+datascience",
    subreddits: ["LLMDevs", "PromptEngineering", "AI_Tools", "GenerativeAI", "datascience"]
  },
  {
    name: "Görsel, Video & Medya Üretimi",
    slug: "ComfyUI+StableDiffusion+Midjourney+Sora+RunwayML",
    subreddits: ["ComfyUI", "StableDiffusion", "Midjourney", "Sora", "RunwayML"]
  }
];

export const REDDIT_USER_AGENT = "web:aitrendleri.com:v2.0 (by /u/orhanerturk; contact: orhaner1907@gmail.com)";
