import React from 'react';
import { X, Calendar, ArrowRight, Bot, ShieldCheck, TrendingUp } from 'lucide-react';
import { ARCHIVE_REPORTS } from '../data/mockData';

export default function ArchiveModal({ isOpen, onClose, onSelectArchiveReport }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Geçmiş Raporlar & Trend Arşivi</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Previous Reports */}
        <div className="p-5 max-h-[65vh] overflow-y-auto space-y-3">
          <p className="text-xs text-slate-400 mb-2">
            Aşağıdan dilediğiniz tarihi seçerek o günkü model sıralamalarını ve bülten analizini inceleyebilirsiniz:
          </p>

          {ARCHIVE_REPORTS.map((rep) => (
            <div
              key={rep.id}
              onClick={() => {
                onSelectArchiveReport(rep);
                onClose();
              }}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/40 cursor-pointer transition group"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono text-cyan-400 font-bold">
                      {rep.date}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-500/20">
                      {rep.subredditsCount} Subreddit
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition">
                    {rep.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                    <span>👑 Zirve: <strong className="text-amber-400">{rep.topTool}</strong></span>
                    <span>📊 Ort. Hype: <strong className="text-emerald-400">{rep.avgHype}</strong></span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-950/50 transition">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
}
