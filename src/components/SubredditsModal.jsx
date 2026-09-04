import React from 'react';
import { X, Radio, CheckCircle, ExternalLink, Shield } from 'lucide-react';
import { SUBREDDITS_DATA } from '../data/mockData';

export default function SubredditsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  // Group by category
  const categories = [...new Set(SUBREDDITS_DATA.map(s => s.category))];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
            <div>
              <h3 className="text-lg font-bold text-white">Taranan 30+ Reddit Topluluğu</h3>
              <p className="text-xs text-slate-400">Yüksek sinyal odaklı, gürültüden arındırılmış veri havuzu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Protection Banner */}
        <div className="p-4 bg-indigo-950/40 border-b border-indigo-900/40 flex items-center gap-3 text-xs text-indigo-200">
          <Shield className="w-4 h-4 text-indigo-400 flex-shrink-0" />
          <span>
            <strong>Reddit Koruma Protokolü:</strong> Subredditler 3-4'lü paketler halinde multi-RSS (<code>r/sub1+sub2</code>) ile tek seferde taranır. İstekler arası rastgele jitter uygulanır.
          </span>
        </div>

        {/* Subreddit Groups */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {categories.map((cat) => (
            <div key={cat}>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                <span>{cat}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SUBREDDITS_DATA.filter(s => s.category === cat).map((sub) => (
                  <a
                    key={sub.name}
                    href={`https://reddit.com/r/${sub.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-850 flex items-start justify-between gap-2 group transition"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-white group-hover:text-indigo-400 transition">
                          r/{sub.name}
                        </span>
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                        {sub.desc}
                      </p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Toplam <strong>{SUBREDDITS_DATA.length}</strong> Aktif Topluluk</span>
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
