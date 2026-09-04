import React from 'react';
import { Calendar, ArrowRight, Eye, Check } from 'lucide-react';
import { ARCHIVE_REPORTS } from '../data/mockData';

export default function ExcelArchiveSheet({ onSelectReport }) {
  return (
    <div className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-5 shadow-xl text-slate-200">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span>Geçmiş Rapor ve Trend Kayıtları Arşivi</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Tarih bazlı bülten kayıtları ve o günkü model sıralamaları.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs excel-grid-table border-collapse">
          <thead>
            <tr>
              <th className="excel-header-col w-8">#</th>
              <th className="excel-header-col w-32">Tarih</th>
              <th className="excel-header-col">Rapor Başlığı & Ana Gündem</th>
              <th className="excel-header-col w-32">Günün Lideri</th>
              <th className="excel-header-col w-28 text-center">Ort. Hype</th>
              <th className="excel-header-col w-28 text-center">Subreddit</th>
              <th className="excel-header-col w-20 text-center">İncele</th>
            </tr>
          </thead>
          <tbody>
            {ARCHIVE_REPORTS.map((rep, idx) => (
              <tr key={rep.id} className="hover:bg-slate-800/40">
                <td className="excel-header-row text-[10px] text-slate-500 text-center">
                  {idx + 1}
                </td>
                <td className="excel-cell font-mono font-bold text-slate-300">
                  {rep.date}
                </td>
                <td className="excel-cell font-medium text-white">
                  {rep.title}
                </td>
                <td className="excel-cell font-mono text-amber-400 font-bold">
                  {rep.topTool}
                </td>
                <td className="excel-cell text-center font-mono text-emerald-400">
                  {rep.avgHype}
                </td>
                <td className="excel-cell text-center font-mono text-slate-400">
                  {rep.subredditsCount} Sub
                </td>
                <td className="excel-cell text-center">
                  <button
                    onClick={() => onSelectReport(rep)}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    title="Görüntüle"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
