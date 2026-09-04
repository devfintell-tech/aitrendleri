import React, { useState, useMemo } from 'react';
import { MOCK_TOOLS_DATA, LATEST_CONSULTANT_REPORT, CATEGORY_DEFINITIONS } from './data/mockData';
import latestReportData from './data/latest-report.json';
import toolHistoryData from './data/tool-history.json';
import { ArrowUpRight, ArrowDownRight, Minus, ChevronDown, ChevronUp, History } from 'lucide-react';

export default function App() {
  const [timeframe, setTimeframe] = useState('daily'); // 'daily' | 'weekly' | 'monthly'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const report = latestReportData ? {
    date: latestReportData.date,
    executiveSummary: latestReportData.executiveSummary,
    sections: latestReportData.sections || LATEST_CONSULTANT_REPORT.sections
  } : LATEST_CONSULTANT_REPORT;

  const rawTools = {
    daily: latestReportData?.daily || MOCK_TOOLS_DATA.daily,
    weekly: latestReportData?.weekly || MOCK_TOOLS_DATA.weekly,
    monthly: latestReportData?.monthly || MOCK_TOOLS_DATA.monthly
  }[timeframe] || MOCK_TOOLS_DATA.daily;

  // Filter tools by category
  const filteredTools = useMemo(() => {
    if (selectedCategory === 'all') return rawTools;
    return rawTools.filter(t => t.category === selectedCategory);
  }, [rawTools, selectedCategory]);

  // Helper for category badge color
  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'LLM (Model)':
        return 'bg-amber-950/70 text-amber-300 border-amber-500/30';
      case 'Yerel Model':
        return 'bg-teal-950/70 text-teal-300 border-teal-500/30';
      case 'IDE / Editör':
        return 'bg-blue-950/70 text-blue-300 border-blue-500/30';
      case 'CLI / Terminal':
        return 'bg-emerald-950/70 text-emerald-300 border-emerald-500/30';
      case 'Otonom Agent':
        return 'bg-purple-950/70 text-purple-300 border-purple-500/30';
      case 'Otomasyon':
        return 'bg-cyan-950/70 text-cyan-300 border-cyan-500/30';
      case 'Altyapı & SDK':
        return 'bg-slate-800/80 text-slate-300 border-slate-600/40';
      case 'Medya / Üretim':
        return 'bg-rose-950/70 text-rose-300 border-rose-500/30';
      case 'Şirket / Lab':
        return 'bg-orange-950/70 text-orange-300 border-orange-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-200 font-sans antialiased selection:bg-[#107c41] selection:text-white">
      
      {/* 1. Sade Üst Başlık & Zaman Seçici */}
      <header className="border-b border-slate-800 bg-[#070a12]/90 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#107c41]"></span>
              <h1 className="text-xl font-bold tracking-tight text-white font-mono">
                aitrendleri.com
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              50+ Reddit Yapay Zeka, Donanım &amp; Yazılım topluluğu sinyal analizi ve model sıralaması
            </p>
          </div>

          {/* 3 Sade Zaman Butonu */}
          <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setTimeframe('daily')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                timeframe === 'daily'
                  ? 'bg-[#107c41] text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Günlük (24s)
            </button>
            <button
              onClick={() => setTimeframe('weekly')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                timeframe === 'weekly'
                  ? 'bg-[#107c41] text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Haftalık (Delta)
            </button>
            <button
              onClick={() => setTimeframe('monthly')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                timeframe === 'monthly'
                  ? 'bg-[#107c41] text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Aylık (Pazar)
            </button>
          </div>
        </div>
      </header>

      {/* 2. Ana Çalışma Alanı */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        
        {/* Kategori Filtre Çubuğu */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-slate-500 font-mono text-[11px] mr-1 hidden sm:inline">Kategori:</span>
          {CATEGORY_DEFINITIONS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition border ${
                selectedCategory === cat.id
                  ? 'bg-[#107c41] text-white border-[#107c41]'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Ana Tablo / Hizalı Liste */}
        <section className="space-y-2">
          
          {/* Kolon Başlıkları (Masaüstü için Kusursuz Hiza) */}
          <div className="hidden md:flex items-center px-4 py-2 text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800/80">
            <span className="w-10 text-center">Sıra</span>
            <span className="w-48 pl-2">Model / Ürün</span>
            <span className="w-36 text-left pl-1">Kategori</span>
            <span className="flex-1 pl-3">Temel Yetenek &amp; İşlev</span>
            <span className="w-28 text-right pr-2">Hype &amp; Delta</span>
          </div>

          {/* Alt Alta Sıralı Liste (Hizalanmış Kolonlar) */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden shadow-xl divide-y divide-slate-800/80">
            {filteredTools.map((tool, idx) => {
              const isPositive = tool.scoreDelta > 0;
              const isNegative = tool.scoreDelta < 0;
              const isExpanded = expandedId === tool.id;

              return (
                <div
                  key={tool.id}
                  onClick={() => setExpandedId(isExpanded ? null : tool.id)}
                  className="p-3 sm:p-4 hover:bg-slate-800/30 transition cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-4">
                    
                    {/* 1. Sıra */}
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-slate-500 w-6 sm:w-10 text-center flex-shrink-0">
                        #{idx + 1}
                      </span>

                      {/* 2. Model / Ürün Adı */}
                      <div className="w-44 sm:w-48 flex-shrink-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm sm:text-base text-white hover:text-emerald-400 transition truncate">
                            {tool.name}
                          </span>
                        </div>
                        {tool.badge && (
                          <span className="text-[10px] font-mono text-slate-400 block sm:hidden">
                            {tool.badge}
                          </span>
                        )}
                      </div>

                      {/* 3. Kategori (HER SATIRDA TAM AYNI DİKEY HİZADA) */}
                      <div className="w-32 sm:w-36 flex-shrink-0">
                        <span className={`inline-block font-mono text-[11px] px-2.5 py-0.5 rounded border ${getCategoryBadgeClass(tool.category)}`}>
                          {tool.category}
                        </span>
                      </div>
                    </div>

                    {/* 4. Temel Yetenek / Açıklama */}
                    <div className="flex-1 md:px-3 text-xs text-slate-300 line-clamp-1 sm:line-clamp-2">
                      {tool.primaryFunction}
                    </div>

                    {/* 5. Hype Skoru ve Delta */}
                    <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-28 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/50">
                      
                      {/* Mobil Kategori Etiketi (Küçük ekranda da görünür) */}
                      <span className="md:hidden text-[10px] font-mono text-slate-500">
                        {tool.sources[0]}
                      </span>

                      <div className="text-right flex items-center md:flex-col md:items-end gap-2 md:gap-0">
                        <div className="flex items-baseline gap-1">
                          <span className="text-base sm:text-lg font-black font-mono text-white">
                            {tool.hypeScore}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">/10</span>
                        </div>

                        <div className="text-[11px] font-mono font-bold flex items-center gap-0.5">
                          {isPositive && <ArrowUpRight className="w-3 h-3 text-emerald-400" />}
                          {isNegative && <ArrowDownRight className="w-3 h-3 text-rose-400" />}
                          {!isPositive && !isNegative && <Minus className="w-3 h-3 text-slate-500" />}
                          <span className={isPositive ? 'text-emerald-400' : isNegative ? 'text-rose-400' : 'text-slate-400'}>
                            {isPositive ? `+${tool.scoreDelta}` : tool.scoreDelta}
                          </span>
                        </div>
                      </div>

                      <div className="text-slate-500">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>

                    </div>

                  </div>

                  {/* Tıklanınca Açılan Detay Kutusu */}
                  {isExpanded && (() => {
                    const historyRecord = toolHistoryData?.[tool.id] || 
                      Object.values(toolHistoryData || {}).find(h => h.name?.toLowerCase() === tool.name?.toLowerCase());
                    const historyEntries = historyRecord?.history || [];

                    const getSentimentBadge = (sent) => {
                      switch (sent) {
                        case 'coşkulu':
                          return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30';
                        case 'eleştirel':
                          return 'bg-amber-950/80 text-amber-300 border-amber-500/30';
                        case 'düşüş':
                          return 'bg-rose-950/80 text-rose-300 border-rose-500/30';
                        default:
                          return 'bg-slate-800/80 text-slate-300 border-slate-700';
                      }
                    };

                    const getSentimentLabel = (sent) => {
                      switch (sent) {
                        case 'coşkulu':
                          return '🔥 Hype / Coşku';
                        case 'eleştirel':
                          return '⚠️ Eleştiri / Şikayet';
                        case 'düşüş':
                          return '📉 Düşüş / Rezalet';
                        default:
                          return '⚖️ Stabil / Dengeli';
                      }
                    };

                    return (
                      <div className="mt-3 pt-3 border-t border-slate-800 text-xs bg-slate-900/60 p-3.5 rounded-lg space-y-3 animate-in fade-in">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2 space-y-1">
                            <span className="text-slate-400 font-mono block text-[10px] uppercase font-bold">
                              Bugün Neden Trend Oldu? (Güncel Sentez)
                            </span>
                            <p className="text-slate-200 leading-relaxed">
                              {tool.whyTrending}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <span className="text-slate-400 font-mono block text-[10px] uppercase font-bold">
                              Kaynak Topluluklar
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {tool.sources.map((s, i) => (
                                <span key={i} className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Tarihsel Seyir & Topluluk Değerlendirmeleri Günlüğü (Timeline) */}
                        <div className="pt-3 border-t border-slate-800/80">
                          <div className="flex items-center justify-between mb-2.5">
                            <div className="flex items-center gap-1.5">
                              <History className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-slate-300 font-mono text-[11px] uppercase font-bold tracking-wider">
                                Tarihsel Seyir &amp; Topluluk Değerlendirmeleri Günlüğü
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500">
                              {historyEntries.length > 0 ? `${historyEntries.length} Günlük Kayıt` : 'Yeni Araç'}
                            </span>
                          </div>

                          {historyEntries.length > 0 ? (
                            <div className="space-y-2">
                              {historyEntries.map((entry, hIdx) => (
                                <div key={hIdx} className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 hover:border-slate-700 transition">
                                  <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-mono text-slate-400 text-xs font-semibold">{entry.date}</span>
                                      <span className={`font-mono text-[10px] px-2 py-0.5 rounded border ${getSentimentBadge(entry.sentiment)}`}>
                                        {getSentimentLabel(entry.sentiment)}
                                      </span>
                                      <span className="font-bold text-white text-xs">{entry.headline}</span>
                                    </div>
                                    <div className="flex items-center gap-1 font-mono text-xs">
                                      <span className="text-slate-400">Skor:</span>
                                      <span className="font-black text-white">{entry.hypeScore}</span>
                                      <span className="text-slate-500 text-[10px]">/10</span>
                                    </div>
                                  </div>
                                  <p className="text-slate-300 text-xs leading-relaxed pl-2 border-l-2 border-slate-800">
                                    {entry.summary}
                                  </p>
                                  {entry.sources && entry.sources.length > 0 && (
                                    <div className="mt-2 flex items-center gap-1 text-[10px] font-mono text-slate-500">
                                      <span>Kaynaklar:</span>
                                      {entry.sources.map((src, sIdx) => (
                                        <span key={sIdx} className="text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800/80">
                                          {src}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="bg-slate-950/40 border border-slate-800/60 rounded-lg p-3 text-slate-400 text-xs font-mono">
                              ℹ️ Bu araç radarımıza yeni katıldı. Gün gün performans değişimi, ilk coşkusu ve sonrasındaki kullanıcı şikayet/övgü kayıtları bir sonraki otomatik taramalarda burada birikecektir.
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                </div>
              );
            })}
          </div>
        </section>

        {/* 3. Danışman Bülteni & Rapor Bölümü */}
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

          {/* 4 Bölümlü Analizler */}
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
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>aitrendleri.com • 43+ Reddit AI Topluluğu Sinyal Sentezi</span>
          <span>Her gün otomatik güncellenir</span>
        </div>
      </footer>

    </div>
  );
}
