import React from 'react';
import { Zap, Calendar, Compass, Sparkles } from 'lucide-react';

export default function TimeframeSelector({ activeTimeframe, onSelectTimeframe }) {
  const options = [
    {
      id: "daily",
      label: "Günlük Hype",
      sublabel: "Son 24 Saat Sinyali",
      icon: Zap,
      accent: "from-amber-500 to-rose-500",
      pillColor: "text-amber-400 border-amber-500/30 bg-amber-950/30",
      description: "Son 24 saat içinde Reddit'te en çok konuşulan, ani hype yaşayan (spike) modeller ve araçlar."
    },
    {
      id: "weekly",
      label: "Haftalık Trend",
      sublabel: "7 Günlük Değişim (Delta)",
      icon: Calendar,
      accent: "from-indigo-500 to-cyan-500",
      pillColor: "text-indigo-400 border-indigo-500/30 bg-indigo-950/30",
      description: "Haftalık bazda yükselen (🔺) ve düşen (🔻) araçlar; stabilite ve geliştirici benimseme hızı."
    },
    {
      id: "monthly",
      label: "Aylık Makro",
      sublabel: "30 Günlük Endüstri Etkisi",
      icon: Compass,
      accent: "from-purple-500 to-emerald-500",
      pillColor: "text-emerald-400 border-emerald-500/30 bg-emerald-950/30",
      description: "30 günlük kalıcı sektör liderleri, geçici hevesler (fads) yerine üretimde kullanılan standartlar."
    }
  ];

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 glass-panel rounded-2xl border border-slate-800">
        
        {/* Timeframe Buttons */}
        <div className="grid grid-cols-3 gap-1.5 w-full sm:w-auto">
          {options.map((opt) => {
            const Icon = opt.icon;
            const isActive = activeTimeframe === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => onSelectTimeframe(opt.id)}
                className={`relative flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-800/90 text-white shadow-lg border border-slate-700/80'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                {isActive && (
                  <span className={`absolute inset-x-2 bottom-0 h-0.5 bg-gradient-to-r ${opt.accent} rounded-full`}></span>
                )}
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Current Timeframe Information Bar */}
        <div className="w-full sm:w-auto flex items-center justify-end px-3 py-1 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-300 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>
              {options.find(o => o.id === activeTimeframe)?.description}
            </span>
          </span>
        </div>

      </div>
    </div>
  );
}
