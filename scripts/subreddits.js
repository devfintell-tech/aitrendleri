/**
 * 30+ Yüksek Sinyalli Yapay Zeka Subreddit Grubu
 * Reddit'in resmi Multi-Subreddit (+ operatörü) özelliği kullanılarak
 * 30 ayrı istek yerine yalnızca 5 güvenli pakette çekilir.
 */

export const SUBREDDIT_BATCHES = [
  {
    name: "Vibe Coding & Editörler",
    slug: "vibecoding+CursorAI+windsurf+ChatGPTCoding+ClaudeAI+copilot",
    subreddits: ["vibecoding", "CursorAI", "windsurf", "ChatGPTCoding", "ClaudeAI", "copilot"]
  },
  {
    name: "Otonom Ajanlar & Otomasyon",
    slug: "AI_Agents+CrewAI+LangChain+AutoGPT+Automate",
    subreddits: ["AI_Agents", "CrewAI", "LangChain", "AutoGPT", "Automate"]
  },
  {
    name: "Büyük Dil Modelleri & Çekirdek",
    slug: "OpenAI+GoogleGemini+DeepSeek+Singularity+ArtificialInteligence+MachineLearning",
    subreddits: ["OpenAI", "GoogleGemini", "DeepSeek", "Singularity", "ArtificialInteligence", "MachineLearning"]
  },
  {
    name: "Açık Kaynak & Yerel Modeller",
    slug: "LocalLLaMA+ollama+vllm+huggingface",
    subreddits: ["LocalLLaMA", "ollama", "vllm", "huggingface"]
  },
  {
    name: "Geliştirici & Üretken Medya",
    slug: "LLMDevs+PromptEngineering+AI_Tools+ComfyUI+StableDiffusion+Midjourney",
    subreddits: ["LLMDevs", "PromptEngineering", "AI_Tools", "ComfyUI", "StableDiffusion", "Midjourney"]
  }
];

export const REDDIT_USER_AGENT = "web:ai-hype-dashboard:v1.0 (by /u/orhanerturk; contact: orhaner1907@gmail.com)";
