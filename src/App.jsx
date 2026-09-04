import React, { useState, useMemo } from 'react';
import { MOCK_TOOLS_DATA, LATEST_CONSULTANT_REPORT, CATEGORY_DEFINITIONS } from './data/mockData';
import latestReportData from './data/latest-report.json';
import toolHistoryData from './data/tool-history.json';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus, 
  ChevronDown, 
  ChevronUp, 
  History,
  FileSpreadsheet,
  Search,
  Filter,
  Info
} from 'lucide-react';

export default function App() {
  const [timeframe, setTimeframe] = useState('daily'); // 'daily' | 'weekly' | 'monthly' | 'report'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const report = latestReportData ? {
    date: latestReportData.date,
    executiveSummary: latestReportData.executiveSummary,
    sections: latestReportData.sections || LATEST_CONSULTANT_REPORT.sections
  } : LATEST_CONSULTANT_REPORT;

  const rawTools = {
    daily: latestReportData?.daily || MOCK_TOOLS_DATA.daily,
    weekly: latestReportData?.weekly || MOCK_TOOLS_DATA.weekly,
    monthly: latestReportData?.monthly || MOCK_TOOLS_DATA.monthly
  }[timeframe] || (latestReportData?.daily || MOCK_TOOLS_DATA.daily);

  // Filter tools by category and search
  const filteredTools = useMemo(() => {
    let result = rawTools;
    if (selectedCategory !== 'all') {
      result = result.filter(t => t.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.name?.toLowerCase().includes(q) || 
        t.primaryFunction?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [rawTools, selectedCategory, searchQuery]);

  // Average Hype calculation for status bar
  const avgHypeScore = useMemo(() => {
    if (!filteredTools.length) return '0.0';
    const sum = filteredTools.reduce((acc, t) => acc + (t.hypeScore || 0), 0);
    return (sum / filteredTools.length).toFixed(1);
  }, [filteredTools]);

  // Excel Category Badge Styles (Clean Excel Cell Style)
  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'LLM (Model)':
        return 'bg-amber-50 text-amber-900 border-amber-300';
      case 'Yerel Model':
        return 'bg-emerald-50 text-emerald-900 border-emerald-300';
      case 'IDE / Editör':
        return 'bg-blue-50 text-blue-900 border-blue-300';
      case 'CLI / Terminal':
        return 'bg-teal-50 text-teal-900 border-teal-300';
      case 'Otonom Agent':
        return 'bg-purple-50 text-purple-900 border-purple-300';
      case 'Otomasyon':
        return 'bg-cyan-50 text-cyan-900 border-cyan-300';
      case 'Altyapı & SDK':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'Medya / Üretim':
        return 'bg-rose-50 text-rose-900 border-rose-300';
      case 'Şirket / Lab':
        return 'bg-orange-50 text-orange-900 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const selectedTool = filteredTools.find(t => t.id === expandedId) || filteredTools[0];

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-800 font-sans antialiased flex flex-col selection:bg-[#107c41] selection:text-white">
      
      {/* 1. EXCEL YEŞİL BAŞLIK ÇUBUĞU (Office Ribbon Bar) */}
      <header className="bg-[#107c41] text-white select-none shadow-sm">
        {/* Üst Logo ve Dosya Adı */}
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-7 h-7 bg-white text-[#107c41] font-black rounded text-xs shadow-inner">
              X
            </div>
            <div>
              <span className="font-semibold text-sm tracking-wide font-mono">aitrendleri.xlsx</span>
              <p className="text-[11px] text-emerald-100/90 font-mono">
                50 Seçkin Topluluk • Günlük Yapay Zeka Hype ve Trend Tablosu ({report.date})
              </p>
            </div>
          </div>

          {/* Sağ Durum ve Saat Bilgisi */}
          <div className="flex items-center gap-4 text-xs font-mono text-emerald-100">
            <div className="flex items-center gap-1.5 bg-[#0e6b37] px-2.5 py-1 rounded">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
              <span>Canlı Veri Akışı</span>
            </div>
            <div className="hidden sm:block text-[11px] opacity-90">
              Güncelleme: 03:00 &amp; 15:00 TSİ
            </div>
          </div>
        </div>

        {/* 2. ZAMAN SEÇİCİ SEKMELER (24s, 1 Hafta, 1 Ay, Rapor - YUKARIDA!) */}
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 text-xs border-t border-[#0e6b37] pt-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'daily', label: '📊 24 Saatlik (Günlük)' },
            { id: 'weekly', label: '📈 1 Haftalık (Delta)' },
            { id: 'monthly', label: '🪐 1 Aylık (Pazar)' },
            { id: 'report', label: '📋 Danışman Raporu' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTimeframe(tab.id)}
              className={`px-4 py-2 transition font-mono text-xs font-bold rounded-t whitespace-nowrap ${
                timeframe === tab.id
                  ? 'bg-white text-[#107c41] shadow-xs'
                  : 'text-emerald-100 hover:bg-[#0e6b37]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* 3. EXCEL FORMÜL VE AD ÇUBUĞU (Formula Bar) */}
      <div className="bg-white border-b border-[#d1d5db] py-1.5 px-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-mono">
          {/* Ad Kutusu (Hücre Koordinatı) */}
          <div className="w-14 sm:w-16 bg-[#f9fafb] border border-[#d1d5db] px-2 py-1 text-center font-bold text-slate-700 select-none">
            {expandedId ? `B${filteredTools.findIndex(t => t.id === expandedId) + 2}` : 'A1'}
          </div>

          {/* fx İkonu */}
          <div className="flex items-center justify-center font-bold italic text-slate-500 px-1 border-r border-[#e5e7eb] pr-2">
            fx
          </div>

          {/* Formül Satırı */}
          <div className="flex-1 flex items-center bg-white border border-[#d1d5db] px-3 py-1 text-slate-700 truncate">
            <span className="text-[#107c41] font-bold mr-1.5">=HYPE.DEĞERLENDİR(</span>
            <span className="text-blue-600 font-semibold truncate">
              {selectedTool ? `"${selectedTool.name}", KATEGORİ="${selectedTool.category}", SKOR=${selectedTool.hypeScore}/10` : '"TÜM_MODELLER"'}
            </span>
            <span className="text-[#107c41] font-bold">)</span>
          </div>

          {/* Hızlı Arama */}
          <div className="relative hidden md:block w-48">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
            <input
              type="text"
              placeholder="Tabloda ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2 py-1 text-xs border border-[#d1d5db] rounded bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#107c41]"
            />
          </div>
        </div>
      </div>

      {/* 4. KATEGORİ VE ÇALIŞMA ALANI */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 py-4 w-full flex-1 space-y-4">
        
        {/* Kategori Filtre Çubuğu (Excel Veri Filtresi) */}
        <div className="bg-white border border-[#d1d5db] p-2 rounded-sm shadow-xs flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 font-bold px-2 whitespace-nowrap">
            <Filter className="w-3 h-3 text-[#107c41]" />
            <span>KATEGORİ:</span>
          </div>
          {CATEGORY_DEFINITIONS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 text-xs font-medium whitespace-nowrap transition border ${
                selectedCategory === cat.id
                  ? 'bg-[#107c41] text-white border-[#107c41] font-bold shadow-xs'
                  : 'bg-[#f9fafb] text-slate-700 hover:bg-slate-100 border-[#e5e7eb]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 5. EXCEL IZGARA TABLOSU (Tam Eşit Boyda Satırlar & Ekrana Sığan Tablo) */}
        {timeframe !== 'report' && (
          <div className="bg-white border border-[#d1d5db] shadow-xs overflow-hidden">
            <table className="w-full table-fixed text-left border-collapse font-sans text-xs">
              
              {/* Sütun Harfleri ve Başlıklar (A - G) */}
              <thead>
                {/* Excel Sütun Harfleri Satırı */}
                <tr className="bg-[#f8fafc] border-b border-[#d1d5db] text-[10px] font-mono text-slate-500 select-none">
                  <th className="w-12 text-center py-1 border-r border-[#e2e8f0]">A</th>
                  <th className="w-44 sm:w-52 px-3 py-1 border-r border-[#e2e8f0] text-left">B</th>
                  <th className="w-32 px-3 py-1 border-r border-[#e2e8f0] text-left">C</th>
                  <th className="px-3 py-1 border-r border-[#e2e8f0] text-left">D</th>
                  <th className="w-24 px-3 py-1 border-r border-[#e2e8f0] text-right">E</th>
                  <th className="w-20 px-3 py-1 border-r border-[#e2e8f0] text-right">F</th>
                  <th className="w-28 px-3 py-1 text-center">G</th>
                </tr>

                {/* Sütun İsimleri Satırı */}
                <tr className="bg-[#f1f5f9] border-b-2 border-[#cbd5e1] text-[11px] font-semibold text-slate-700 select-none">
                  <th className="w-12 text-center py-2.5 border-r border-[#cbd5e1]">Sıra</th>
                  <th className="w-44 sm:w-52 px-3 py-2.5 border-r border-[#cbd5e1] text-left">Model / Ürün Adı</th>
                  <th className="w-32 px-3 py-2.5 border-r border-[#cbd5e1] text-left">Kategori</th>
                  <th className="px-3 py-2.5 border-r border-[#cbd5e1] text-left">Temel Yetenek &amp; Fonksiyon</th>
                  <th className="w-24 px-3 py-2.5 border-r border-[#cbd5e1] text-right">Hype Skoru</th>
                  <th className="w-20 px-3 py-2.5 border-r border-[#cbd5e1] text-right">Delta (Δ)</th>
                  <th className="w-28 px-3 py-2.5 text-center">Topluluk Kaynak</th>
                </tr>
              </thead>

              {/* Tablo Satırları (Her Biri Tamamen Eşit Boyda h-11) */}
              <tbody className="divide-y divide-[#e2e8f0]">
                {filteredTools.map((tool, idx) => {
                  const isPositive = tool.scoreDelta > 0;
                  const isNegative = tool.scoreDelta < 0;
                  const isExpanded = expandedId === tool.id;

                  const historyRecord = toolHistoryData?.[tool.id] || 
                    Object.values(toolHistoryData || {}).find(h => h.name?.toLowerCase() === tool.name?.toLowerCase());
                  const historyEntries = historyRecord?.history || [];

                  return (
                    <React.Fragment key={tool.id}>
                      <tr 
                        onClick={() => setExpandedId(isExpanded ? null : tool.id)}
                        className={`h-11 cursor-pointer transition-colors select-none ${
                          isExpanded 
                            ? 'bg-[#e8f5e9] border-l-4 border-l-[#107c41]' 
                            : idx % 2 === 0 
                              ? 'bg-white hover:bg-[#f0fdf4]' 
                              : 'bg-[#fafafa] hover:bg-[#f0fdf4]'
                        }`}
                      >
                        {/* Kolon A: Sıra */}
                        <td className="w-12 text-center font-mono font-bold text-slate-600 border-r border-[#e2e8f0]">
                          #{idx + 1}
                        </td>

                        {/* Kolon B: Model Adı */}
                        <td className="w-44 sm:w-52 px-3 border-r border-[#e2e8f0] truncate">
                          <span className="font-bold text-slate-900 hover:text-[#107c41] transition truncate">
                            {tool.name}
                          </span>
                        </td>

                        {/* Kolon C: Kategori (DİKEY HİZALI) */}
                        <td className="w-32 px-3 border-r border-[#e2e8f0]">
                          <span className={`inline-block font-mono text-[11px] px-2 py-0.5 rounded border ${getCategoryBadgeClass(tool.category)} truncate max-w-full`}>
                            {tool.category}
                          </span>
                        </td>

                        {/* Kolon D: Temel Fonksiyon (Eşit Boy - Tıklayınca Tamamı Açılır) */}
                        <td className="px-3 border-r border-[#e2e8f0] text-slate-700">
                          <div className="truncate text-xs text-slate-700" title="Tüm açıklamayı okumak için tıklayın">
                            {tool.primaryFunction}
                          </div>
                        </td>

                        {/* Kolon E: Hype Skoru */}
                        <td className="w-24 px-3 text-right border-r border-[#e2e8f0] font-mono">
                          <span className="font-black text-slate-900 text-sm">
                            {tool.hypeScore}
                          </span>
                          <span className="text-[10px] text-slate-400">/10</span>
                        </td>

                        {/* Kolon F: Delta */}
                        <td className="w-20 px-3 text-right border-r border-[#e2e8f0] font-mono font-bold">
                          <div className="flex items-center justify-end gap-0.5">
                            {isPositive && <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />}
                            {isNegative && <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" />}
                            {!isPositive && !isNegative && <Minus className="w-3.5 h-3.5 text-slate-400" />}
                            <span className={isPositive ? 'text-emerald-700' : isNegative ? 'text-rose-700' : 'text-slate-500'}>
                              {isPositive ? `+${tool.scoreDelta}` : tool.scoreDelta}
                            </span>
                          </div>
                        </td>

                        {/* Kolon G: Kaynaklar / Açma Butonu */}
                        <td className="w-28 px-3 text-center text-slate-500 font-mono text-[11px]">
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 truncate">
                              {tool.sources?.[0] || 'r/ai'}
                            </span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-[#107c41] flex-shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />}
                          </div>
                        </td>
                      </tr>

                      {/* 6. SADE VE OKUNAKLI TIKLANAN DETAY KARTI */}
                      {isExpanded && (
                        <tr className="bg-[#f8fafc] border-b-2 border-[#107c41]">
                          <td colSpan={7} className="p-4 sm:p-5">
                            
                            <div className="bg-white border border-[#cbd5e1] rounded-md p-4 space-y-4 shadow-xs">
                              
                              {/* 1. Kısım: Modelin Tam Açıklaması (Tıklayınca Tam Okunur) */}
                              <div className="space-y-1 border-b border-[#e2e8f0] pb-3">
                                <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px] font-bold uppercase">
                                  <Info className="w-3.5 h-3.5 text-[#107c41]" />
                                  <span>{tool.name} — Temel Yetenek &amp; Fonksiyonu:</span>
                                </div>
                                <p className="text-slate-900 text-sm leading-relaxed font-medium">
                                  {tool.primaryFunction}
                                </p>
                              </div>

                              {/* 2. Kısım: Neden Trend Oldu & Kaynaklar */}
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 border-b border-[#e2e8f0] pb-3">
                                <div className="md:col-span-3 space-y-1">
                                  <span className="text-[11px] font-mono uppercase font-bold text-[#107c41]">
                                    🔥 Bugün Neden Trend Oldu? (Topluluk Görüşü)
                                  </span>
                                  <p className="text-slate-800 text-xs leading-relaxed">
                                    {tool.whyTrending}
                                  </p>
                                </div>
                                <div className="space-y-1 md:border-l border-[#e2e8f0] md:pl-3">
                                  <span className="text-[11px] font-mono uppercase font-bold text-slate-500">
                                    Kaynak Topluluklar
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {tool.sources.map((s, i) => (
                                      <span key={i} className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#f1f5f9] text-slate-700 border border-[#cbd5e1]">
                                        {s}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* 3. Kısım: Sade Tarihsel Topluluk Değerlendirmeleri (Karmaşık Olmayan Temiz Liste) */}
                              <div className="space-y-2 pt-1">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <History className="w-3.5 h-3.5 text-[#107c41]" />
                                    <span className="font-mono text-xs font-bold text-slate-800 uppercase tracking-wide">
                                      Geçmiş Topluluk Değerlendirmeleri &amp; Nabız
                                    </span>
                                  </div>
                                  <span className="text-[10px] font-mono text-slate-500">
                                    {historyEntries.length > 0 ? `${historyEntries.length} Günlük Kayıt` : 'Yeni Araç'}
                                  </span>
                                </div>

                                {historyEntries.length > 0 ? (
                                  <div className="space-y-1.5 pt-1">
                                    {historyEntries.map((entry, hIdx) => {
                                      const getSentBadge = (sent) => {
                                        switch (sent) {
                                          case 'coşkulu':
                                            return 'bg-emerald-100 text-emerald-800 border-emerald-300';
                                          case 'eleştirel':
                                            return 'bg-amber-100 text-amber-900 border-amber-300';
                                          case 'düşüş':
                                            return 'bg-rose-100 text-rose-800 border-rose-300';
                                          default:
                                            return 'bg-slate-100 text-slate-700 border-slate-300';
                                        }
                                      };

                                      const getSentLabel = (sent) => {
                                        switch (sent) {
                                          case 'coşkulu':
                                            return '🔥 Coşku';
                                          case 'eleştirel':
                                            return '⚠️ Eleştiri / Şikayet';
                                          case 'düşüş':
                                            return '📉 Düşüş / Rezalet';
                                          default:
                                            return '⚖️ Stabil';
                                        }
                                      };

                                      return (
                                        <div key={hIdx} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 py-1.5 border-b border-[#f1f5f9] last:border-0 text-xs">
                                          <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className="font-mono text-slate-500 text-[11px] w-24">{entry.date}</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSentBadge(entry.sentiment)}`}>
                                              {getSentLabel(entry.sentiment)}
                                            </span>
                                            <span className="font-mono font-bold text-slate-900">{entry.hypeScore}/10</span>
                                          </div>
                                          <div className="text-slate-700 text-xs flex-1">
                                            <strong className="text-slate-900 mr-1">{entry.headline}:</strong>
                                            {entry.summary}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div className="text-slate-500 text-xs font-mono py-2">
                                    ℹ️ Bu araç radarımıza yeni katıldı. Gün gün performans değişimi ve topluluk şikayet/övgü kayıtları sonraki taramalarda burada birikecektir.
                                  </div>
                                )}
                              </div>

                            </div>

                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 7. DANIŞMAN RAPORU (Bölüm 1 Dahil 4 Bölüm) */}
        {(timeframe === 'report' || timeframe === 'daily') && (
          <section className="bg-white border border-[#cbd5e1] shadow-xs rounded-sm p-4 sm:p-6 space-y-4">
            <div className="border-b border-[#e2e8f0] pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#107c41]" />
                <h2 className="font-bold text-base text-slate-900 font-mono uppercase tracking-wide">
                  Yapay Zeka &amp; Donanım Ekosistem Raporu ({report.date})
                </h2>
              </div>
              <span className="text-[11px] font-mono text-slate-500 bg-[#f1f5f9] px-2 py-0.5 rounded border border-[#cbd5e1]">
                50 Topluluk Sentezi
              </span>
            </div>

            {/* Yönetici Özeti */}
            <div className="p-3.5 rounded bg-[#f8fafc] border-l-4 border-[#107c41] text-xs sm:text-sm text-slate-800 leading-relaxed space-y-1">
              <span className="font-mono font-bold text-[#107c41] text-xs uppercase block">
                📌 YÖNETİCİ ÖZETİ
              </span>
              <p>{report.executiveSummary}</p>
            </div>

            {/* 4 Bölümlü Analizler */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {report.sections.map((sec, idx) => (
                <div key={idx} className="p-4 rounded bg-[#fafafa] border border-[#d1d5db] space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                      {sec.title}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#e8f5e9] text-[#107c41] border border-emerald-200 font-bold">
                      {sec.badge}
                    </span>
                  </div>
                  <div
                    className="text-xs text-slate-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: sec.contentHtml }}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* 8. SADE EXCEL DURUM ÇUBUĞU (Bottom Status Bar) */}
      <footer className="bg-[#e5e7eb] border-t border-[#d1d5db] px-4 py-1.5 flex items-center justify-between text-xs font-mono text-slate-600 select-none">
        <div className="flex items-center gap-4">
          <span className="font-bold text-[#107c41]">HAZIR</span>
          <span>TOPLAM: {filteredTools.length} MODEL</span>
          <span className="hidden sm:inline">ORTALAMA HYPE: {avgHypeScore}</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="hidden sm:inline">50 TOPLULUK</span>
          <span>%100 ZOOM</span>
        </div>
      </footer>

    </div>
  );
}
