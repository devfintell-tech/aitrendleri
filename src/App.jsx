import React, { useState } from 'react';
import { MOCK_TOOLS_DATA, LATEST_CONSULTANT_REPORT } from './data/mockData';
import latestReportData from './data/latest-report.json';
import { ArrowUpRight, ArrowDownRight, Minus, ExternalLink, RefreshCw } from 'lucide-react';

export default function App() {
  const [timeframe, setTimeframe] = useState('daily'); // 'daily' | 'weekly' | 'monthly'
  const [expandedId, setExpandedId] = useState(null);

  // Live report data fallback to mock
  const report = latestReportData ? {
    date: latestReportData.date,
    executiveSummary: latestReportData.executiveSummary,
    sections: latestReportData.sections || LATEST_CONSULTANT_REPORT.sections
  } : LATEST_CONSULTANT_REPORT;

  const tools = {
    daily: latestReportData?.daily || MOCK_TOOLS_DATA.daily,
    weekly: latestReportData?.weekly || MOCK_TOOLS_DATA.weekly,
    monthly: latestReportData?.monthly || MOCK_TOOLS_DATA.monthly
  }[timeframe] || MOCK_TOOLS_DATA.daily;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-200 font-sans antialiased selection:bg-[#107c41] selection:text-white">
      
      {/* 1. Sade ve Şık Üst Başlık */}
      <header className="border-b border-slate-800 bg-[#070a12]/80 sticky top-0 z-20 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#107c41]"></span>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white font-mono">
                aitrendleri.com
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              43+ Reddit topluluğundan toplanan yapay zeka araçları ve model sıralaması
            </p>
          </div>

          {/* Sadece 3 Temiz Zaman Butonu */}
          <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setTimeframe('daily')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                timeframe === 'daily'
                  ? 'bg-[#107c41] text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Günlük
            </button>
            <button
              onClick={() => setTimeframe('weekly')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                timeframe === 'weekly'
                  ? 'bg-[#107c41] text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Haftalık
            </button>
            <button
              onClick={() => setTimeframe('monthly')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                timeframe === 'monthly'
                  ? 'bg-[#107c41] text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Aylık
            </button>
          </div>
        </div>
      </header>

      {/* 2. Ana Gövde */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-10">
        
        {/* Alt Alta Sıralı Temiz Liste */}
        <section className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
            <span>
              {timeframe === 'daily' && "⚡ SON 24 SAATİN EN ÇOK KONUŞULANLARI"}
              {timeframe === 'weekly' && "📊 7 GÜNLÜK NET TREND VE DEĞİŞİM (DELTA)"}
              {timeframe === 'monthly' && "🪐 30 GÜNLÜK KALICI SEKTÖR LİDERLERİ"}
            </span>
            <span>{tools.length} Araç Listelendi</span>
          </div>

          <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden shadow-xl divide-y divide-slate-800/80">
            {tools.map((tool, idx) => {
              const isPositive = tool.scoreDelta > 0;
              const isNegative = tool.scoreDelta < 0;
              const isExpanded = expandedId === tool.id;

              return (
                <div
                  key={tool.id}
                  onClick={() => setExpandedId(isExpanded ? null : tool.id)}
                  className="p-4 sm:p-5 hover:bg-slate-850/50 hover:bg-slate-800/30 transition cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    
                    {/* Sol: Sıra ve İsim */}
                    <div className="flex items-start gap-3.5">
                      <span className="font-mono font-bold text-sm text-slate-500 pt-0.5 w-6 text-center">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-base text-white hover:text-emerald-400 transition">
                            {tool.name}
                          </h3>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {tool.category}
                          </span>
                          {tool.badge && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#107c41]/30 text-emerald-300 border border-emerald-500/20 font-mono">
                              {tool.badge}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-300 mt-1 line-clamp-1 sm:line-clamp-none">
                          {tool.primaryFunction}
                        </p>
                      </div>
                    </div>

                    {/* Sağ: Hype Skoru ve Değişim */}
                    <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                      <div className="text-right">
                        <div className="flex items-baseline justify-end gap-1">
                          <span className="text-lg font-black font-mono text-white">
                            {tool.hypeScore}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">/10</span>
                        </div>
                        <div className="text-[11px] font-mono font-bold flex items-center justify-end gap-0.5">
                          {isPositive && <ArrowUpRight className="w-3 h-3 text-emerald-400" />}
                          {isNegative && <ArrowDownRight className="w-3 h-3 text-rose-400" />}
                          {!isPositive && !isNegative && <Minus className="w-3 h-3 text-slate-500" />}
                          <span className={isPositive ? 'text-emerald-400' : isNegative ? 'text-rose-400' : 'text-slate-400'}>
                            {isPositive ? `+${tool.scoreDelta}` : tool.scoreDelta}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Tıklayınca Açılan Sade Detay Kutusu */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-900/50 p-3 rounded-lg animate-in fade-in">
                      <div className="sm:col-span-2">
                        <span className="text-slate-400 font-mono block text-[10px] uppercase font-bold mb-1">
                          Neden Trend Oldu?
                        </span>
                        <p className="text-slate-200 leading-relaxed">
                          {tool.whyTrending}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-mono block text-[10px] uppercase font-bold mb-1">
                          Kaynak Topluluklar
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {tool.sources.map((s, i) => (
                            <span key={i} className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </section>

        {/* 3. Danışman Bülteni ve Yönetici Raporu (Alt Kısımda Tertemiz) */}
        <section className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 sm:p-7 shadow-xl space-y-6">
          
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#107c41]"></span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                  GÜNLÜK ANALİZ &amp; DANIŞMAN BÜLTENİ
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                Yapay Zeka Sektör Değerlendirmesi
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {report.date}
            </span>
          </div>

          {/* Yönetici Özeti */}
          <div className="p-4 rounded-lg bg-slate-900 border-l-4 border-[#107c41] text-xs sm:text-sm text-slate-200 leading-relaxed">
            <span className="font-mono font-bold text-emerald-400 text-xs uppercase block mb-1">
              📌 Özet
            </span>
            {report.executiveSummary}
          </div>

          {/* 4 Bölümlü Bülten İçeriği */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.sections.map((sec, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-xs sm:text-sm font-bold text-white">
                    {sec.title}
                  </h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                    {sec.badge}
                  </span>
                </div>
                <div
                  className="text-xs text-slate-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: sec.contentHtml }}
                />
              </div>
            ))}
          </div>

        </section>

      </main>

      {/* 4. Sade Footer */}
      <footer className="border-t border-slate-800 bg-[#070a12] py-6 px-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>aitrendleri.com • 43+ Reddit AI Topluluğu Sinyal Sentezi</span>
          <span>Her gün otomatik güncellenir</span>
        </div>
      </footer>

    </div>
  );
}
