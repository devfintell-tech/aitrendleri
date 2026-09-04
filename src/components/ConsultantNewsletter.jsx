import React, { useState } from 'react';
import { Sparkles, Bot, Cpu, Briefcase, TrendingUp, Copy, Check, ShieldCheck, Clock, Layers } from 'lucide-react';
import { LATEST_CONSULTANT_REPORT } from '../data/mockData';

export default function ConsultantNewsletter({ report = LATEST_CONSULTANT_REPORT }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `${report.title} (${report.date})\n\nÖZET:\n${report.executiveSummary}\n\nTam rapor için web sitemizi ziyaret edin.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full glass-panel rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl">
      
      {/* Header with Title and Metadata Badges */}
      <div className="border-b border-slate-800 pb-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              YAPAY ZEKA DANIŞMAN BÜLTENİ
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              {report.title}
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1">
              {report.date} • 30+ Seçkin Topluluk Veri Sentezi
            </p>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition self-start sm:self-auto"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Kopyalandı!' : 'Özeti Kopyala'}</span>
          </button>
        </div>

        {/* Metadata Badges */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full bg-indigo-950/60 text-indigo-300 border border-indigo-500/30">
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            <span>Model: {report.activeModel}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kaynak: {report.stats.successfulSubreddits}/{report.stats.totalSubreddits} Subreddit</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Süre: {report.stats.durationSeconds}s</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/30">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>{report.stats.totalPostsAnalyzed} Gönderi İncelendi</span>
          </span>
        </div>
      </div>

      {/* Executive Summary Callout */}
      <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900 border-l-4 border-indigo-500 text-sm sm:text-base text-slate-200 leading-relaxed">
        <span className="text-xs font-bold font-mono uppercase text-indigo-400 block mb-1">
          📌 Baş Danışman Özeti (Executive Brief)
        </span>
        {report.executiveSummary}
      </div>

      {/* Deep Sections */}
      <div className="space-y-6">
        {report.sections.map((sec, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/80 transition"
          >
            <div className="flex items-center justify-between mb-3 border-b border-slate-800/60 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{sec.title}</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {sec.badge}
              </span>
            </div>

            <div
              className="text-xs sm:text-sm text-slate-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sec.contentHtml }}
            />
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-8 pt-4 border-t border-slate-800/80 text-center text-xs text-slate-500 font-mono">
        Bu bülten, 30+ Reddit AI topluluğundan toplanan ham sinyallerin Gemini API ile sentezlenmesiyle otonom olarak üretilmiştir.
      </div>

    </div>
  );
}
