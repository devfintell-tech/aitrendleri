import React from 'react';
import { Flame, TrendingUp, Zap, Sparkles, MessageCircle, ArrowUpRight } from 'lucide-react';

export default function HypeRadarCards({ items = [] }) {
  if (!items || items.length === 0) return null;

  // Find top 3 items
  const leader = items[0];
  const highestDelta = [...items].sort((a, b) => b.scoreDelta - a.scoreDelta)[0] || items[1];
  const mostMentions = [...items].sort((a, b) => b.mentions - a.mentions)[0] || items[2];

  const cards = [
    {
      type: "LEADER",
      tag: "👑 ZİRVEDEKİ MODEL / ARAÇ",
      item: leader,
      borderColor: "border-amber-500/40",
      glowColor: "glow-indigo",
      bgGradient: "from-amber-950/30 via-slate-900 to-slate-950",
      accentText: "text-amber-400",
      icon: Flame
    },
    {
      type: "MOMENTUM",
      tag: "🚀 EN HIZLI FIRLAYAN (DELTA)",
      item: highestDelta,
      borderColor: "border-indigo-500/40",
      glowColor: "glow-indigo",
      bgGradient: "from-indigo-950/30 via-slate-900 to-slate-950",
      accentText: "text-indigo-400",
      icon: TrendingUp
    },
    {
      type: "BUZZ",
      tag: "⚡ EN ÇOK KONUŞULAN",
      item: mostMentions,
      borderColor: "border-cyan-500/40",
      glowColor: "glow-indigo",
      bgGradient: "from-cyan-950/30 via-slate-900 to-slate-950",
      accentText: "text-cyan-400",
      icon: MessageCircle
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((c, idx) => {
        const item = c.item;
        if (!item) return null;
        const Icon = c.icon;
        const isPositive = item.scoreDelta >= 0;

        return (
          <div
            key={idx}
            className={`relative rounded-2xl p-5 border ${c.borderColor} bg-gradient-to-b ${c.bgGradient} shadow-xl transition-all duration-300 hover:-translate-y-1`}
          >
            {/* Top Tag & Category */}
            <div className="flex items-center justify-between mb-3">
              <span className={`flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider ${c.accentText}`}>
                <Icon className="w-3.5 h-3.5" />
                {c.tag}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {item.category}
              </span>
            </div>

            {/* Name and Hype Score */}
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="text-lg font-bold text-white tracking-tight">
                {item.name}
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black font-mono tracking-tight text-white">
                  {item.hypeScore}
                </span>
                <span className="text-xs text-slate-400 font-mono">/10</span>
              </div>
            </div>

            {/* Delta & Mentions Bar */}
            <div className="flex items-center justify-between text-xs mb-3 font-mono">
              <div className={`inline-flex items-center gap-1 font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                <span>{isPositive ? `+${item.scoreDelta}` : item.scoreDelta}</span>
                <span className="text-[10px] text-slate-400 font-normal">delta</span>
              </div>
              <div className="text-slate-400 text-[11px]">
                💬 ~{item.mentions.toLocaleString()} bahsetme
              </div>
            </div>

            {/* Mini Hype Bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 rounded-full transition-all duration-700"
                style={{ width: `${(item.hypeScore / 10) * 100}%` }}
              ></div>
            </div>

            {/* Why Trending */}
            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
              {item.whyTrending}
            </p>

            {/* Sources footer */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 overflow-hidden">
                {item.sources.slice(0, 2).map((s, i) => (
                  <span key={i} className="font-mono text-slate-400 hover:text-slate-200">
                    {s}
                  </span>
                ))}
                {item.sources.length > 2 && (
                  <span className="text-slate-500 font-mono">+{item.sources.length - 2}</span>
                )}
              </div>
              <span className="text-slate-500 text-[10px] uppercase font-semibold tracking-wider">
                Yüksek Sinyal
              </span>
            </div>

          </div>
        );
      })}
    </div>
  );
}
