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
  Info,
  Calendar,
  ExternalLink,
  BookOpen,
  Sparkles
} from 'lucide-react';

// Arşivlenen geçmiş günlük raporları dinamik olarak içeri aktar
const archiveModules = import.meta.glob('./data/archive/*.json', { eager: true });

export default function App() {
  const [timeframe, setTimeframe] = useState('daily'); // 'daily' | '12h' | 'weekly' | 'monthly' | 'report'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [expandedHfId, setExpandedHfId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Arşivlenmiş ve Canlı Tarihlerin Listesi (Geçmişte ne olmuştu diye seçebilmek için)
  const availableDates = useMemo(() => {
    const list = [];
    const seenDates = new Set();

    if (latestReportData?.date) {
      list.push({
        id: 'latest',
        label: `${latestReportData.date} (Canlı)`,
        dateStr: latestReportData.date,
        data: latestReportData
      });
      seenDates.add(latestReportData.date);
    }

    for (const [filePath, mod] of Object.entries(archiveModules)) {
      if (filePath.includes('archive-index.json')) continue;
      const data = mod.default || mod;
      if (data?.date && !seenDates.has(data.date)) {
        seenDates.add(data.date);
        list.push({
          id: data.date,
          label: `${data.date}`,
          dateStr: data.date,
          data: data
        });
      }
    }

    return list;
  }, []);

  const [selectedDateId, setSelectedDateId] = useState('latest');

  // Seçili tarihe ait rapor verisi (Tarih seçilince tüm sayfa o günün sıralamasına ve verisine döner)
  const activeReportData = useMemo(() => {
    if (selectedDateId === 'latest') return latestReportData;
    const found = availableDates.find(d => d.id === selectedDateId);
    return found?.data || latestReportData;
  }, [selectedDateId, availableDates]);

  const report = activeReportData ? {
    date: activeReportData.date,
    executiveSummary: activeReportData.executiveSummary,
    sections: activeReportData.sections || LATEST_CONSULTANT_REPORT.sections,
    arxivDaily: activeReportData.arxivDaily || [],
    arxivWeeklyBest: activeReportData.arxivWeeklyBest || [],
    huggingFaceBest: activeReportData.huggingFaceBest || [],
    huggingFaceTrending: activeReportData.huggingFaceTrending || activeReportData.huggingFaceTop || [],
    hackerNewsPulse: activeReportData.hackerNewsPulse || null
  } : LATEST_CONSULTANT_REPORT;

  const rawTools = {
    '12h': activeReportData?.twelveHours || activeReportData?.daily || MOCK_TOOLS_DATA.daily,
    daily: activeReportData?.daily || MOCK_TOOLS_DATA.daily,
    weekly: activeReportData?.weekly || MOCK_TOOLS_DATA.weekly,
    monthly: activeReportData?.monthly || MOCK_TOOLS_DATA.monthly
  }[timeframe] || (activeReportData?.daily || MOCK_TOOLS_DATA.daily);

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
      case 'Bulut & Platform':
        return 'bg-sky-50 text-sky-900 border-sky-300';
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
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 bg-white text-[#107c41] font-black rounded text-xs shadow-inner tracking-tighter">
              AI
            </div>
            <span className="font-bold text-base tracking-wide font-mono">aitrendleri.com</span>
          </div>

          {/* Sağ Durum, Geçmiş Tarih Seçici ve Saat Bilgisi */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono text-emerald-100 flex-wrap">
            {/* Geçmiş Tarih / Arşiv Seçici Dropdown */}
            <div className="flex items-center gap-1.5 bg-[#0e6b37] border border-emerald-400/40 px-2 py-1 rounded text-white shadow-xs">
              <Calendar className="w-3.5 h-3.5 text-emerald-300 flex-shrink-0" />
              <select
                value={selectedDateId}
                onChange={(e) => setSelectedDateId(e.target.value)}
                className="bg-transparent text-white font-mono text-[11px] sm:text-xs font-semibold focus:outline-none cursor-pointer pr-1"
                title="Geçmiş günlerin sıralamasını ve raporunu görüntüle"
              >
                {availableDates.map(d => (
                  <option key={d.id} value={d.id} className="bg-slate-800 text-white font-sans text-xs">
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden md:flex items-center gap-1.5 bg-[#0e6b37] px-2.5 py-1 rounded">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
              <span>Canlı Akış</span>
            </div>
          </div>
        </div>

        {/* 2. ZAMAN SEÇİCİ SEKMELER (Simetrik ve Birbirine Eşit Boyutta Butonlar) */}
        <div className="max-w-7xl mx-auto px-2 sm:px-4 border-t border-[#0e6b37] pt-2 pb-1.5">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 w-full">
            {[
              { id: 'daily', label: '📊 24 Saatlik' },
              { id: '12h', label: '⚡ 12 Saatlik' },
              { id: 'weekly', label: '📈 1 Haftalık' },
              { id: 'monthly', label: '🪐 1 Aylık' },
              { id: 'report', label: '📋 Danışman Raporu' }
            ].map((tab, idx) => (
              <button
                key={tab.id}
                onClick={() => setTimeframe(tab.id)}
                className={`h-9 flex items-center justify-center transition font-mono text-[11px] sm:text-xs font-bold rounded shadow-xs text-center ${
                  idx === 4 ? 'col-span-2 sm:col-span-1' : ''
                } ${
                  timeframe === tab.id
                    ? 'bg-white text-[#107c41] shadow-xs'
                    : 'text-emerald-100 bg-[#0e6b37] hover:bg-[#0b5e30]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
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
        
        {/* Kategori Filtre Çubuğu (Sağa kaydırma yok, flex-wrap ile ekrana tam oturur) */}
        <div className="bg-white border border-[#d1d5db] p-2 rounded-sm shadow-xs flex flex-wrap items-center gap-1 sm:gap-1.5">
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 font-bold px-1 sm:px-2 whitespace-nowrap">
            <Filter className="w-3 h-3 text-[#107c41]" />
            <span>KATEGORİ:</span>
          </div>
          {CATEGORY_DEFINITIONS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-medium whitespace-nowrap transition border rounded-xs ${
                selectedCategory === cat.id
                  ? 'bg-[#107c41] text-white border-[#107c41] font-bold shadow-xs'
                  : 'bg-[#f9fafb] text-slate-700 hover:bg-slate-100 border-[#e5e7eb]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 5. MASAÜSTÜ EXCEL IZGARA TABLOSU (hidden md:block) */}
        {timeframe !== 'report' && (
          <div className="hidden md:block bg-white border border-[#d1d5db] shadow-xs overflow-hidden">
            <table className="w-full table-fixed text-left border-collapse font-sans text-xs">
              
              {/* Sütun Harfleri ve Başlıklar (A - G) */}
              <thead>
                {/* Excel Sütun Harfleri Satırı */}
                <tr className="bg-[#f8fafc] border-b border-[#d1d5db] text-[10px] font-mono text-slate-500 select-none">
                  <th className="w-12 text-center py-1 border-r border-[#e2e8f0]">A</th>
                  <th className="w-52 px-3 py-1 border-r border-[#e2e8f0] text-left">B</th>
                  <th className="w-44 px-3 py-1 border-r border-[#e2e8f0] text-left">C</th>
                  <th className="px-3 py-1 border-r border-[#e2e8f0] text-left">D</th>
                  <th className="w-24 px-3 py-1 border-r border-[#e2e8f0] text-right">E</th>
                  <th className="w-20 px-3 py-1 border-r border-[#e2e8f0] text-right">F</th>
                  <th className="w-28 px-3 py-1 text-center">G</th>
                </tr>

                {/* Sütun İsimleri Satırı */}
                <tr className="bg-[#f1f5f9] border-b-2 border-[#cbd5e1] text-[11px] font-semibold text-slate-700 select-none">
                  <th className="w-12 text-center py-2.5 border-r border-[#cbd5e1]">Sıra</th>
                  <th className="w-52 px-3 py-2.5 border-r border-[#cbd5e1] text-left">Model / Ürün Adı</th>
                  <th className="w-44 px-3 py-2.5 border-r border-[#cbd5e1] text-left">Kategori</th>
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
                        <td className="w-52 px-3 border-r border-[#e2e8f0] truncate">
                          <span className="font-bold text-slate-900 hover:text-[#107c41] transition truncate block">
                            {tool.name}
                          </span>
                        </td>

                        {/* Kolon C: Kategori */}
                        <td className="w-44 px-3 border-r border-[#e2e8f0]">
                          <span className={`inline-block font-mono text-[11px] px-2 py-0.5 rounded border ${getCategoryBadgeClass(tool.category)} whitespace-nowrap`}>
                            {tool.category}
                          </span>
                        </td>

                        {/* Kolon D: Temel Fonksiyon */}
                        <td className="px-3 border-r border-[#e2e8f0] text-slate-700">
                          <div className="truncate text-xs text-slate-700" title="Tüm açıklamayı okumak için tıklayın">
                            {tool.primaryFunction}
                          </div>
                        </td>

                        {/* Kolon E: Hype Skoru */}
                        <td className="w-24 px-3 text-right border-r border-[#e2e8f0] font-mono">
                          <span className="font-black text-slate-900 text-sm">
                            {Number(tool.hypeScore || 0).toFixed(1)}
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal">/10</span>
                        </td>

                        {/* Kolon F: Delta Skoru */}
                        <td className="w-20 px-3 text-right border-r border-[#e2e8f0] font-mono">
                          <div className={`inline-flex items-center justify-end gap-0.5 text-xs font-bold ${
                            isPositive ? 'text-emerald-700' : isNegative ? 'text-rose-700' : 'text-slate-500'
                          }`}>
                            <span>{isPositive ? `+${tool.scoreDelta}` : tool.scoreDelta}</span>
                          </div>
                        </td>

                        {/* Kolon G: Topluluk Kaynak */}
                        <td className="w-28 px-3 text-center font-mono text-[11px] text-slate-600">
                          <div className="flex items-center justify-center gap-1">
                            <span className="truncate max-w-[80px]">
                              {tool.sources?.[0] || 'Reddit'}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-3 h-3 text-[#107c41] flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* 6. SADE VE OKUNAKLI TIKLANAN DETAY KARTI */}
                      {isExpanded && (
                        <tr className="bg-[#f8fafc] border-b-2 border-[#107c41]">
                          <td colSpan={7} className="p-2.5 sm:p-4 md:p-5">
                            
                            <div className="bg-white border border-[#cbd5e1] rounded-md p-3 sm:p-4 space-y-3 sm:space-y-4 shadow-xs">
                              
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

        {/* 5b. MOBİL KOMPAKT TABLO SIRALAMASI (block md:hidden - Sağa Kaydırma Yok, Başlığa Dokununca Açılır) */}
        {timeframe !== 'report' && (
          <div className="block md:hidden bg-white border border-[#cbd5e1] rounded-sm shadow-xs divide-y divide-[#e2e8f0] overflow-hidden">
            {filteredTools.map((tool, idx) => {
              const isPositive = tool.scoreDelta > 0;
              const isNegative = tool.scoreDelta < 0;
              const isExpanded = expandedId === tool.id;

              const historyRecord = toolHistoryData?.[tool.id] || 
                Object.values(toolHistoryData || {}).find(h => h.name?.toLowerCase() === tool.name?.toLowerCase());
              const historyEntries = historyRecord?.history || [];

              return (
                <div 
                  key={tool.id}
                  className={`transition-colors ${
                    isExpanded ? 'bg-[#f0fdf4]' : idx % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'
                  }`}
                >
                  {/* Tıklanabilir Kompakt Satır (İlk Bakışta Temiz Tablo Sıralaması) */}
                  <div 
                    onClick={() => setExpandedId(isExpanded ? null : tool.id)}
                    className="p-2.5 flex items-center justify-between gap-2 cursor-pointer select-none active:bg-[#e8f5e9]"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-slate-100 text-[#107c41] font-mono font-bold text-xs rounded border border-[#cbd5e1]">
                        #{idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                          {tool.name}
                        </div>
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <span className={`font-mono text-[9px] px-1.5 py-0.2 rounded border ${getCategoryBadgeClass(tool.category)} whitespace-nowrap`}>
                            {tool.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Sağ Taraf: Hype Skoru + Ok İkonu */}
                    <div className="flex items-center gap-2 flex-shrink-0 font-mono text-right">
                      <div className="w-14 text-right">
                        <span className="font-black text-slate-900 text-sm">
                          {Number(tool.hypeScore || 0).toFixed(1)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">/10</span>
                      </div>
                      <div className="text-slate-400">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#107c41]" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* TIKLANINCA AÇILAN DETAY PANELİ (Başlığa dokunulduğunda görünür) */}
                  {isExpanded && (
                    <div className="p-3 bg-white border-t border-[#cbd5e1] space-y-2.5 text-xs shadow-inner">
                      {/* Temel Yetenek & Fonksiyon */}
                      <div className="space-y-1 bg-[#fbfcfd] p-2.5 rounded border border-[#f1f5f9]">
                        <span className="text-[10px] font-mono font-bold text-[#107c41] uppercase flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#107c41]"></span>
                          TEMEL YETENEK &amp; FONKSİYONU:
                        </span>
                        <p className="text-slate-800 leading-relaxed font-medium">
                          {tool.primaryFunction}
                        </p>
                      </div>

                      {/* Neden Trend Oldu? (Topluluk Görüşü) */}
                      <div className="space-y-1 bg-[#f8fafc] p-2.5 rounded border border-[#e2e8f0]">
                        <span className="text-[10px] font-mono font-bold text-slate-700 uppercase flex items-center gap-1">
                          🔥 TOPLULUK ANALİZİ &amp; GEREKÇE:
                        </span>
                        <p className="text-slate-700 leading-relaxed">
                          {tool.whyTrending}
                        </p>
                        <div className="flex items-center gap-1 pt-1.5 flex-wrap">
                          <span className="text-[10px] font-mono text-slate-400">Kaynaklar:</span>
                          {tool.sources?.map((s, i) => (
                            <span key={i} className="text-[9px] font-mono px-1.5 py-0.5 bg-white text-slate-600 rounded border border-[#cbd5e1]">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Geçmiş Performans / Zaman Çizelgesi */}
                      {historyEntries.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#107c41] uppercase">
                            <History className="w-3.5 h-3.5" />
                            <span>Geçmiş Değerlendirmeler ({historyEntries.length} Gün):</span>
                          </div>
                          <div className="space-y-1 bg-[#f9fafb] p-2 rounded border border-[#e2e8f0]">
                            {historyEntries.map((entry, hIdx) => {
                              const getSentBadge = (sent) => {
                                switch (sent) {
                                  case 'coşkulu': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
                                  case 'eleştirel': return 'bg-amber-100 text-amber-900 border-amber-300';
                                  case 'düşüş': return 'bg-rose-100 text-rose-800 border-rose-300';
                                  default: return 'bg-slate-100 text-slate-700 border-slate-300';
                                }
                              };
                              const getSentLabel = (sent) => {
                                switch (sent) {
                                  case 'coşkulu': return '🔥 Coşku';
                                  case 'eleştirel': return '⚠️ Eleştiri';
                                  case 'düşüş': return '📉 Düşüş';
                                  default: return '⚖️ Stabil';
                                }
                              };
                              return (
                                <div key={hIdx} className="border-b border-[#e2e8f0] pb-1 last:border-0 last:pb-0 space-y-0.5">
                                  <div className="flex items-center justify-between font-mono text-[9px]">
                                    <span className="text-slate-500">{entry.date}</span>
                                    <span className={`px-1 py-0.2 rounded font-bold border ${getSentBadge(entry.sentiment)}`}>
                                      {getSentLabel(entry.sentiment)}
                                    </span>
                                    <span className="font-bold text-slate-900">{entry.hypeScore}/10</span>
                                  </div>
                                  <p className="text-slate-700 text-[10px] leading-tight">
                                    <strong className="text-slate-900">{entry.headline}: </strong>
                                    {entry.summary}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 7. DANIŞMAN RAPORU (Bölüm 1 Dahil 4 Bölüm - 12s ve 24s Dahil Her Görünümde) */}
        {(timeframe === 'report' || timeframe === 'daily' || timeframe === '12h' || timeframe === 'weekly' || timeframe === 'monthly') && (
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

            {/* 5. 🔬 ARXİV BİLİMSEL YAPAY ZEKA MAKALE RADARI */}
            {((timeframe === 'weekly' && report.arxivWeeklyBest?.length > 0) || report.arxivDaily?.length > 0) && (
              <div className="pt-2 border-t border-[#e2e8f0] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#107c41]" />
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-mono uppercase">
                      {timeframe === 'weekly' 
                        ? '🔬 ArXiv: Haftanın En Çarpıcı Yapay Zeka Makaleleri (7 Günlük Seçki)' 
                        : '🔬 ArXiv: Günün En Çarpıcı 3 Yapay Zeka Makalesi'}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 font-bold">
                    Akademik İstihbarat
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(timeframe === 'weekly' && report.arxivWeeklyBest?.length > 0 ? report.arxivWeeklyBest : report.arxivDaily).map((paper, pIdx) => (
                    <div key={pIdx} className="bg-white border border-[#cbd5e1] rounded-sm p-4 flex flex-col justify-between shadow-xs hover:border-[#107c41] transition">
                      <div className="space-y-3">
                        {/* 1. Rozet Satırı */}
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-[#107c41] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            #{pIdx + 1} • {paper.id}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">
                            {paper.category || 'cs.AI'}
                          </span>
                        </div>

                        {/* 2. Türkçe Başlık Satırı */}
                        <div className="min-h-[44px] flex items-start">
                          <a 
                            href={paper.arxivUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="font-bold text-xs sm:text-[13px] text-slate-900 hover:text-[#107c41] transition inline-flex items-start gap-1 group leading-snug"
                            title={paper.title}
                          >
                            <span className="group-hover:underline">{paper.titleTr || paper.title}</span>
                            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 text-slate-400 group-hover:text-[#107c41] mt-0.5" />
                          </a>
                        </div>

                        {/* 3. Sarı Kısım: Doğrudan konuya giren çarpıcı etki (başlık etiketsiz) */}
                        <div className="bg-[#fffbeb] border-l-4 border-l-amber-500 border border-amber-200 rounded-r p-3 min-h-[95px] flex items-center">
                          <p className="text-xs text-slate-900 font-medium leading-relaxed">
                            {paper.whyMad}
                          </p>
                        </div>

                        {/* 4. Alt Kısım: Doğrudan araştırma özeti (başlık etiketsiz) */}
                        <div className="min-h-[75px]">
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {paper.summary}
                          </p>
                        </div>
                      </div>

                      {/* 5. Alt Bar: Yazarlar ve İncele Linki */}
                      <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-[11px] font-mono text-slate-500">
                        <span className="truncate max-w-[180px]" title={paper.authors?.join(', ')}>
                          {paper.authors && paper.authors.length > 0 ? paper.authors.join(', ') : 'ArXiv Preprint'}
                        </span>
                        <a 
                          href={paper.arxivUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[#107c41] hover:underline flex items-center gap-0.5 font-bold whitespace-nowrap"
                        >
                          Makaleyi Aç →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. 🤗 HUGGING FACE YEREL MODEL & AÇIK KAYNAK NABZI (Sol 5 En İyiler, Sağ 5 Trending) */}
            {(report.huggingFaceBest?.length > 0 || report.huggingFaceTrending?.length > 0) && (
              <div className="pt-3 border-t border-[#e2e8f0] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🤗</span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-mono uppercase">
                      Hugging Face Yerel Model &amp; Açık Kaynak Liderlik Tablosu
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                    Gerçek İndirme Verileri
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* SOL 5: MEVCUT EN İYİLER (Pazar Standartları) */}
                  <div className="bg-white border border-[#cbd5e1] rounded shadow-xs overflow-hidden">
                    <div className="bg-[#f8fafc] border-b border-[#cbd5e1] px-3 py-2 flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-slate-800 flex items-center gap-1.5">
                        <span>🏆</span>
                        <span>Mevcut En İyiler (Endüstri Standartları)</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">Top 5 Model</span>
                    </div>

                    <div className="divide-y divide-[#e2e8f0]">
                      {(report.huggingFaceBest || []).slice(0, 5).map((model, idx) => {
                        const isExpanded = expandedHfId === model.id;
                        return (
                          <div key={idx} className="transition-colors">
                            {/* Satır Başlığı - Tıklanabilir */}
                            <div 
                              onClick={() => setExpandedHfId(isExpanded ? null : model.id)}
                              className={`h-11 px-3 flex items-center justify-between text-xs cursor-pointer select-none transition ${
                                isExpanded ? 'bg-emerald-50/70 font-semibold' : 'hover:bg-[#fbfcfd]'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <span className="w-5 font-mono text-slate-400 font-bold text-[11px]">
                                  #{idx + 1}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <span className="font-mono font-bold text-slate-900 truncate block text-xs" title={model.id}>
                                    {model.name || model.id}
                                  </span>
                                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-tight">
                                    {model.tag}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 pl-3 flex-shrink-0">
                                <div className="text-right font-mono">
                                  <span className="font-black text-emerald-700 text-xs block">
                                    ⬇ {model.downloads}
                                  </span>
                                  <span className="text-[9px] text-slate-400">
                                    ❤️ {model.likes?.toLocaleString()}
                                  </span>
                                </div>
                                <div className="text-slate-400">
                                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-[#107c41]" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                </div>
                              </div>
                            </div>

                            {/* Tıklanınca Açılan Detay Paneli */}
                            {isExpanded && (
                              <div className="p-3 bg-[#f8fafc] border-t border-[#e2e8f0] space-y-2.5 text-xs shadow-inner">
                                {/* 1. Ne İşe Yarar? (Temel Yetenek & Fonksiyon) */}
                                <div className="space-y-0.5">
                                  <span className="font-mono text-[10px] font-bold text-emerald-800 uppercase flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                    Ne İşe Yarar? (Temel Görev &amp; Fonksiyon)
                                  </span>
                                  <p className="text-slate-800 leading-relaxed pl-2.5">
                                    {model.function || 'Açık kaynaklı yapay zeka modeli.'}
                                  </p>
                                </div>

                                {/* 2. Diğerlerinden Farkı (Neden Bu Model?) */}
                                <div className="space-y-0.5">
                                  <span className="font-mono text-[10px] font-bold text-blue-800 uppercase flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                                    Diğerlerinden Farkı &amp; Ayrışan Yönü
                                  </span>
                                  <p className="text-slate-800 leading-relaxed pl-2.5">
                                    {model.distinction || 'Kendi kategorisinde optimize edilmiş açık mimari.'}
                                  </p>
                                </div>

                                {/* 3. Neden Hypelandı? (Topluluk Tercihi & Yükseliş Nedeni) */}
                                <div className="space-y-0.5">
                                  <span className="font-mono text-[10px] font-bold text-orange-800 uppercase flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                                    Neden Hypelandı? (Topluluk Tercihi)
                                  </span>
                                  <p className="text-slate-800 leading-relaxed pl-2.5">
                                    {model.whyHype || 'Topluluk tarafından yoğun talep gördü.'}
                                  </p>
                                </div>

                                {/* 4. Çalışma Ortamı & Donanım Gereksinimi */}
                                <div className="p-2 bg-white rounded border border-[#e2e8f0] space-y-1">
                                  <span className="font-mono text-[10px] font-bold text-purple-800 uppercase flex items-center gap-1">
                                    <span>⚙️</span>
                                    <span>Çalışma Ortamı &amp; Donanım Gereksinimi:</span>
                                  </span>
                                  <p className="text-slate-700 font-mono text-[11px] leading-relaxed">
                                    {model.environment || 'vLLM, Ollama, Hugging Face Transformers.'}
                                  </p>
                                </div>

                                {/* 5. Hugging Face Link Butonu */}
                                <div className="pt-1 flex items-center justify-between">
                                  <span className="text-[10px] font-mono text-slate-400">Model ID: {model.id}</span>
                                  <a 
                                    href={`https://huggingface.co/${model.id}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#107c41] hover:underline bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200"
                                  >
                                    <span>🤗 Hugging Face Sayfası</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* SAĞ 5: BUGÜN YÜKSELİŞE GEÇENLER (24s Trending) */}
                  <div className="bg-white border border-[#cbd5e1] rounded shadow-xs overflow-hidden">
                    <div className="bg-[#f8fafc] border-b border-[#cbd5e1] px-3 py-2 flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-slate-800 flex items-center gap-1.5">
                        <span>⚡</span>
                        <span>Bugün Yükselişe Geçenler (24s Trending)</span>
                      </span>
                      <span className="text-[10px] font-mono text-orange-600 font-bold">Top 5 Trending</span>
                    </div>

                    <div className="divide-y divide-[#e2e8f0]">
                      {(report.huggingFaceTrending || []).slice(0, 5).map((model, idx) => {
                        const isExpanded = expandedHfId === model.id;
                        return (
                          <div key={idx} className="transition-colors">
                            {/* Satır Başlığı - Tıklanabilir */}
                            <div 
                              onClick={() => setExpandedHfId(isExpanded ? null : model.id)}
                              className={`h-11 px-3 flex items-center justify-between text-xs cursor-pointer select-none transition ${
                                isExpanded ? 'bg-orange-50/70 font-semibold' : 'hover:bg-[#fbfcfd]'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <span className="w-5 font-mono text-slate-400 font-bold text-[11px]">
                                  #{idx + 1}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <span className="font-mono font-bold text-slate-900 truncate block text-xs" title={model.id}>
                                    {model.name || model.id}
                                  </span>
                                  <span className="text-[9px] font-mono text-orange-600 uppercase tracking-tight font-semibold">
                                    {model.tag || model.highlight}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 pl-3 flex-shrink-0">
                                <div className="text-right font-mono">
                                  <span className="font-black text-emerald-700 text-xs block">
                                    ⬇ {model.downloads}
                                  </span>
                                  <span className="text-[9px] text-slate-400">
                                    ❤️ {model.likes?.toLocaleString()}
                                  </span>
                                </div>
                                <div className="text-slate-400">
                                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-orange-600" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                </div>
                              </div>
                            </div>

                            {/* Tıklanınca Açılan Detay Paneli */}
                            {isExpanded && (
                              <div className="p-3 bg-[#f8fafc] border-t border-[#e2e8f0] space-y-2.5 text-xs shadow-inner">
                                {/* 1. Ne İşe Yarar? (Temel Yetenek & Fonksiyon) */}
                                <div className="space-y-0.5">
                                  <span className="font-mono text-[10px] font-bold text-orange-800 uppercase flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
                                    Ne İşe Yarar? (Temel Görev &amp; Fonksiyon)
                                  </span>
                                  <p className="text-slate-800 leading-relaxed pl-2.5">
                                    {model.function || 'Son 24 saatte hızla yükselen yerel model.'}
                                  </p>
                                </div>

                                {/* 2. Diğerlerinden Farkı (Neden Bu Model?) */}
                                <div className="space-y-0.5">
                                  <span className="font-mono text-[10px] font-bold text-blue-800 uppercase flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                                    Diğerlerinden Farkı &amp; Ayrışan Yönü
                                  </span>
                                  <p className="text-slate-800 leading-relaxed pl-2.5">
                                    {model.distinction || 'Önceki nesillere göre belirgin performans veya hız avantajı.'}
                                  </p>
                                </div>

                                {/* 3. Neden Hypelandı? (Topluluk Tercihi & Yükseliş Nedeni) */}
                                <div className="space-y-0.5">
                                  <span className="font-mono text-[10px] font-bold text-amber-800 uppercase flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                    Neden Hypelandı? (24 Saatlik Patlama Nedeni)
                                  </span>
                                  <p className="text-slate-800 leading-relaxed pl-2.5">
                                    {model.whyHype || 'Toplulukta yoğun indirme ve kullanım artışı yaşadı.'}
                                  </p>
                                </div>

                                {/* 4. Çalışma Ortamı & Donanım Gereksinimi */}
                                <div className="p-2 bg-white rounded border border-[#e2e8f0] space-y-1">
                                  <span className="font-mono text-[10px] font-bold text-purple-800 uppercase flex items-center gap-1">
                                    <span>⚙️</span>
                                    <span>Çalışma Ortamı &amp; Donanım Gereksinimi:</span>
                                  </span>
                                  <p className="text-slate-700 font-mono text-[11px] leading-relaxed">
                                    {model.environment || 'vLLM, Ollama, Hugging Face Transformers.'}
                                  </p>
                                </div>

                                {/* 5. Hugging Face Link Butonu */}
                                <div className="pt-1 flex items-center justify-between">
                                  <span className="text-[10px] font-mono text-slate-400">ID: {model.id}</span>
                                  <a 
                                    href={`https://huggingface.co/${model.id}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:underline bg-orange-50 px-2.5 py-1 rounded border border-orange-200"
                                  >
                                    <span>🤗 Hugging Face Sayfası</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 7. 🟠 HACKER NEWS: SON 24 SAAT GELİŞTİRİCİ NABZI & TARTIŞMALARI (Sıralamaya Etkisiz) */}
            {report.hackerNewsPulse && (
              <div className="pt-3 border-t border-[#e2e8f0] space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-[#ff6600] text-white font-black text-xs flex items-center justify-center rounded-xs font-mono shadow-2xs">
                      Y
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-mono uppercase">
                      Hacker News: Son 24 Saatin Geliştirici &amp; Mühendis Nabzı
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-50 text-orange-800 border border-orange-200 font-bold">
                    Sıralamaya Etkisiz • Saf Teknik İstihbarat
                  </span>
                </div>

                {/* 24 Saatlik Geliştirici Gündemi Özeti */}
                {report.hackerNewsPulse.summary24h && (
                  <div className="p-3 bg-[#fffaf5] border-l-4 border-l-[#ff6600] border-y border-r border-orange-200 rounded-r text-xs text-slate-800 leading-relaxed">
                    <span className="font-mono font-bold text-orange-950 uppercase text-[10px] block mb-0.5">
                      📌 SON 24 SAATİN ÖZETİ &amp; MÜHENDİS HİSSİYATI:
                    </span>
                    <p className="text-slate-800">{report.hackerNewsPulse.summary24h}</p>
                  </div>
                )}

                {/* Tartışmalar ve Yararlı Bilgiler Listesi */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(report.hackerNewsPulse.discussions || []).map((disc, dIdx) => (
                    <div 
                      key={dIdx} 
                      className="bg-white border border-[#cbd5e1] rounded-sm p-3.5 flex flex-col justify-between hover:border-[#ff6600] transition space-y-3 shadow-xs"
                    >
                      <div className="space-y-2.5">
                        {/* Üst Kategori ve Puan/Yorum Barı */}
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold border border-slate-200">
                            {disc.category || 'Geliştirici Tartışması'}
                          </span>
                          <div className="flex items-center gap-2 text-slate-500 font-bold">
                            <span className="text-[#ff6600]">▲ {disc.points} puan</span>
                            <span>•</span>
                            <span>💬 {disc.comments} yorum</span>
                          </div>
                        </div>

                        {/* Tartışma Başlığı */}
                        <div>
                          <a 
                            href={disc.hnUrl || disc.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="font-bold text-xs sm:text-[13px] text-slate-900 hover:text-[#ff6600] transition inline-flex items-start gap-1 group leading-snug"
                            title={disc.title}
                          >
                            <span className="group-hover:underline">{disc.titleTr || disc.title}</span>
                            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 text-slate-400 group-hover:text-[#ff6600] mt-0.5" />
                          </a>
                        </div>

                        {/* Derin Teknik Analiz (Doğrudan konuya girer, başlık etiketsiz) */}
                        <p className="text-xs text-slate-800 leading-relaxed font-normal">
                          {disc.analysis || disc.keyTakeaway}
                        </p>

                        {/* Mühendis Çıkarımı / Pratik Bilgi Kutusu (Etiketsiz, temiz ve vurgulu) */}
                        {disc.usefulInsight && (
                          <div className="bg-[#f0fdf4] border-l-2 border-emerald-600 p-2.5 rounded-r text-xs text-slate-900 leading-relaxed">
                            <p className="font-medium text-slate-800">{disc.usefulInsight}</p>
                          </div>
                        )}
                      </div>

                      {/* Alt Bar: HN Link */}
                      <div className="pt-2 border-t border-[#f1f5f9] flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span className="text-[10px] text-slate-400">Hacker News ID: #{disc.id || dIdx + 1}</span>
                        <a 
                          href={disc.hnUrl || disc.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[#ff6600] hover:underline flex items-center gap-0.5 font-bold"
                        >
                          HN Tartışmasını Aç →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
