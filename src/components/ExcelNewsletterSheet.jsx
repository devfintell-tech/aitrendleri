import React, { useState } from 'react';
import { Copy, Check, FileText, Table2, Layers, Cpu, ShieldCheck } from 'lucide-react';
import { LATEST_CONSULTANT_REPORT } from '../data/mockData';

export default function ExcelNewsletterSheet({ report = LATEST_CONSULTANT_REPORT }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `${report.title} (${report.date})\n\nÖZET:\n${report.executiveSummary}\n\nTam rapor için: https://aitrendleri.com`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-5 sm:p-7 shadow-xl text-slate-200">
      
      {/* Sheet Header */}
      <div className="border-b border-slate-800 pb-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#107c41]"></span>
              <span className="font-mono text-xs text-emerald-400 font-bold tracking-wider uppercase">
                EXECUTIVE AI INTELLIGENCE MEMO
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {report.title}
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Tarih: {report.date} | Model: {report.activeModel} | Kapsam: {report.stats.totalSubreddits} Subreddit | Süre: {report.stats.durationSeconds}s
            </p>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 transition self-start sm:self-auto"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Kopyalandı' : 'Raporu Kopyala'}</span>
          </button>
        </div>

        {/* Excel Metric KPI Cells */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-xs font-mono">
          <div className="p-2.5 bg-slate-900 border border-slate-800 rounded">
            <span className="text-slate-400 block text-[10px]">TARANAN TOPLULUK</span>
            <strong className="text-white text-sm">{report.stats.totalSubreddits} Subreddit</strong>
          </div>
          <div className="p-2.5 bg-slate-900 border border-slate-800 rounded">
            <span className="text-slate-400 block text-[10px]">İNCELENEN GÖNDERİ</span>
            <strong className="text-white text-sm">{report.stats.totalPostsAnalyzed} Gönderi</strong>
          </div>
          <div className="p-2.5 bg-slate-900 border border-slate-800 rounded">
            <span className="text-slate-400 block text-[10px]">ORTALAMA HYPE İNDEKSİ</span>
            <strong className="text-emerald-400 text-sm">{report.stats.avgHypeIndex} / 10</strong>
          </div>
          <div className="p-2.5 bg-slate-900 border border-slate-800 rounded">
            <span className="text-slate-400 block text-[10px]">ANALİZ MOTORU</span>
            <strong className="text-slate-200 text-sm">{report.activeModel}</strong>
          </div>
        </div>
      </div>

      {/* Executive Summary Box */}
      <div className="mb-6 p-4 rounded bg-slate-900/80 border-l-4 border-[#107c41] text-xs sm:text-sm leading-relaxed text-slate-200">
        <span className="text-xs font-bold font-mono text-emerald-400 uppercase block mb-1">
          📌 Yönetici Özeti (Executive Brief)
        </span>
        {report.executiveSummary}
      </div>

      {/* Report Sections */}
      <div className="space-y-5">
        {report.sections.map((sec, idx) => (
          <div
            key={idx}
            className="p-4 sm:p-5 rounded bg-slate-900/40 border border-slate-800/80"
          >
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                {sec.title}
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

      {/* Footer */}
      <div className="mt-6 pt-3 border-t border-slate-800 text-center font-mono text-[11px] text-slate-500">
        aitrendleri.com • 43+ Reddit AI Topluluğu Sinyal Sentezi
      </div>

    </div>
  );
}
