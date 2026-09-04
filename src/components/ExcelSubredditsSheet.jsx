import React from 'react';
import { ExternalLink, CheckCircle, Radio, Shield } from 'lucide-react';
import { SUBREDDITS_DATA } from '../data/mockData';

export default function ExcelSubredditsSheet() {
  return (
    <div className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-5 shadow-xl text-slate-200">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400" />
            <span>Katalog: Taranan 43+ Yapay Zeka Topluluğu</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Reddit'in en aktif mühendislik, araştırma ve operasyon toplulukları listesi.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-[#107c41]/20 px-2.5 py-1 rounded border border-emerald-500/30">
          <Shield className="w-3.5 h-3.5" />
          <span>Multi-Subreddit RSS Protokolü Aktif</span>
        </div>
      </div>

      {/* Excel Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs excel-grid-table border-collapse">
          <thead>
            <tr>
              <th className="excel-header-col w-8">#</th>
              <th className="excel-header-col w-44">Kategori</th>
              <th className="excel-header-col w-40">Subreddit</th>
              <th className="excel-header-col">Açıklama ve Kapsam</th>
              <th className="excel-header-col w-24 text-center">Durum</th>
              <th className="excel-header-col w-20 text-center">Link</th>
            </tr>
          </thead>
          <tbody>
            {SUBREDDITS_DATA.map((sub, idx) => (
              <tr key={sub.name} className="hover:bg-slate-800/40">
                <td className="excel-header-row text-[10px] text-slate-500 text-center">
                  {idx + 1}
                </td>
                <td className="excel-cell font-mono text-slate-400">
                  {sub.category}
                </td>
                <td className="excel-cell font-bold text-white font-mono">
                  r/{sub.name}
                </td>
                <td className="excel-cell text-slate-300">
                  {sub.desc}
                </td>
                <td className="excel-cell text-center">
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    <CheckCircle className="w-2.5 h-2.5" />
                    Aktif
                  </span>
                </td>
                <td className="excel-cell text-center">
                  <a
                    href={`https://reddit.com/r/${sub.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-emerald-400 inline-flex items-center p-0.5"
                    title="Reddit'te Aç"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
