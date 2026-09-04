import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, ChevronDown, Filter } from 'lucide-react';

export default function ExcelSpreadsheetTable({ items = [], onCellSelect, selectedCell = "B2" }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortColumn, setSortColumn] = useState('hypeScore'); // 'rank' | 'hypeScore' | 'scoreDelta' | 'mentions'
  const [sortAsc, setSortAsc] = useState(false);

  const categories = ['all', 'Vibe Coding', 'Temel LLM', 'Otonom Ajanlar', 'Açık Kaynak', 'Geliştirici', 'Görsel & Medya'];

  // Filter and sort items
  const processedItems = useMemo(() => {
    return items
      .filter((item) => {
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesSearch =
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.primaryFunction.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.whyTrending.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.sources.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortColumn === 'hypeScore') diff = b.hypeScore - a.hypeScore;
        else if (sortColumn === 'scoreDelta') diff = b.scoreDelta - a.scoreDelta;
        else if (sortColumn === 'mentions') diff = b.mentions - a.mentions;
        else if (sortColumn === 'name') diff = a.name.localeCompare(b.name);
        return sortAsc ? -diff : diff;
      });
  }, [items, searchQuery, selectedCategory, sortColumn, sortAsc]);

  const handleHeaderSort = (col) => {
    if (sortColumn === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortColumn(col);
      setSortAsc(false);
    }
  };

  const renderSparkline = (points, isPositive) => {
    if (!points || points.length < 2) return null;
    const min = Math.min(...points) * 0.95;
    const max = Math.max(...points) * 1.05;
    const width = 64;
    const height = 18;

    const coords = points.map((val, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - ((val - min) / (max - min || 1)) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const strokeColor = isPositive ? '#107c41' : '#dc2626';

    return (
      <svg width={width} height={height} className="overflow-visible inline-block">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={coords.join(' ')}
        />
      </svg>
    );
  };

  return (
    <div className="w-full bg-[#0f172a] border border-slate-800 rounded-lg overflow-hidden shadow-xl">
      
      {/* Search & Quick Category Filter Toolbar */}
      <div className="bg-[#0b1120] px-3 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-mono text-[11px]">Kategori Filtresi:</span>
          <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-[#107c41] text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat === 'all' ? 'Tümü' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Excel Filter Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tabloda Ara (Ctrl+F)..."
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 pl-8 pr-3 py-1 rounded w-52 focus:outline-none focus:border-[#107c41] transition"
          />
        </div>

      </div>

      {/* Spreadsheet Grid View */}
      <div className="overflow-x-auto max-h-[680px]">
        <table className="w-full text-left border-collapse text-xs excel-grid-table">
          
          {/* Column Alphabet Headers (A, B, C, D...) */}
          <thead>
            <tr>
              <th className="excel-header-col w-10 text-center select-none bg-slate-950">◢</th>
              <th className="excel-header-col w-12">A</th>
              <th className="excel-header-col w-48">B</th>
              <th className="excel-header-col w-32">C</th>
              <th className="excel-header-col w-32">D</th>
              <th className="excel-header-col w-28">E</th>
              <th className="excel-header-col w-24">F</th>
              <th className="excel-header-col w-28">G</th>
              <th className="excel-header-col min-w-[240px]">H</th>
              <th className="excel-header-col min-w-[280px]">I</th>
              <th className="excel-header-col min-w-[180px]">J</th>
            </tr>

            {/* Logical Field Headers */}
            <tr className="bg-slate-900 text-slate-300 font-bold border-b border-slate-700">
              <th className="excel-header-row text-center text-slate-500 font-mono select-none">#</th>
              
              <th className="excel-cell text-center">Sıra</th>
              
              <th className="excel-cell cursor-pointer hover:bg-slate-800" onClick={() => handleHeaderSort('name')}>
                <div className="flex items-center justify-between">
                  <span>Model / Araç</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>

              <th className="excel-cell">Kategori</th>

              <th className="excel-cell text-center cursor-pointer hover:bg-slate-800" onClick={() => handleHeaderSort('hypeScore')}>
                <div className="flex items-center justify-between">
                  <span>Hype (1-10)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>

              <th className="excel-cell text-center cursor-pointer hover:bg-slate-800" onClick={() => handleHeaderSort('scoreDelta')}>
                <div className="flex items-center justify-between">
                  <span>Delta (Değişim)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>

              <th className="excel-cell text-center">7G Seyir</th>

              <th className="excel-cell text-center cursor-pointer hover:bg-slate-800" onClick={() => handleHeaderSort('mentions')}>
                <div className="flex items-center justify-between">
                  <span>Bahsedilme</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>

              <th className="excel-cell">Temel Fonksiyon</th>

              <th className="excel-cell">Neden Trend Oldu? (Analiz)</th>

              <th className="excel-cell">Kaynak Topluluklar</th>
            </tr>
          </thead>

          {/* Spreadsheet Data Rows */}
          <tbody className="divide-y divide-slate-800/80 font-normal text-slate-200">
            {processedItems.map((item, idx) => {
              const rowNum = idx + 2; // Row number in Excel
              const isPositive = item.scoreDelta > 0;
              const isNegative = item.scoreDelta < 0;
              const isSelected = selectedCell.startsWith(`B${rowNum}`);

              return (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-800/40 transition-colors ${idx % 2 === 0 ? 'bg-slate-900/30' : 'bg-slate-900/10'}`}
                >
                  {/* Excel Row Index */}
                  <td className="excel-header-row font-mono text-[10px] text-slate-500 select-none">
                    {rowNum}
                  </td>

                  {/* A: Rank */}
                  <td
                    onClick={() => onCellSelect && onCellSelect(`A${rowNum}`, `Sıra: #${idx + 1}`)}
                    className="excel-cell text-center font-mono font-bold text-slate-400"
                  >
                    #{idx + 1}
                  </td>

                  {/* B: Tool Name */}
                  <td
                    onClick={() => onCellSelect && onCellSelect(`B${rowNum}`, item.name)}
                    className={`excel-cell font-bold text-white cursor-pointer ${selectedCell === `B${rowNum}` ? 'excel-cell-selected' : ''}`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{item.name}</span>
                      {item.badge && (
                        <span className="text-[9px] px-1 rounded bg-[#107c41]/30 text-emerald-300 border border-emerald-500/20 font-mono">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* C: Category */}
                  <td
                    onClick={() => onCellSelect && onCellSelect(`C${rowNum}`, item.category)}
                    className="excel-cell font-mono text-[11px] text-slate-400"
                  >
                    {item.category}
                  </td>

                  {/* D: Hype Score with Conditional Data Bar */}
                  <td
                    onClick={() => onCellSelect && onCellSelect(`D${rowNum}`, `${item.hypeScore} / 10.0`)}
                    className="excel-cell text-center font-mono font-bold text-white relative overflow-hidden"
                  >
                    {/* Excel Conditional Formatting Data Bar */}
                    <div
                      className="absolute inset-y-1 left-1 bg-[#107c41]/30 rounded-sm pointer-events-none transition-all"
                      style={{ width: `${(item.hypeScore / 10) * 85}%` }}
                    ></div>
                    <span className="relative z-10">{item.hypeScore}</span>
                  </td>

                  {/* E: Delta with Conditional Formatting Cell Fill */}
                  <td
                    onClick={() => onCellSelect && onCellSelect(`E${rowNum}`, `${item.scoreDelta} delta`)}
                    className={`excel-cell text-center font-mono font-bold ${
                      isPositive
                        ? 'bg-emerald-950/40 text-emerald-400'
                        : isNegative
                        ? 'bg-rose-950/40 text-rose-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {isPositive ? `+${item.scoreDelta}` : item.scoreDelta}
                  </td>

                  {/* F: Sparkline */}
                  <td className="excel-cell text-center">
                    {renderSparkline(item.sparkline, isPositive)}
                  </td>

                  {/* G: Mentions */}
                  <td
                    onClick={() => onCellSelect && onCellSelect(`G${rowNum}`, `${item.mentions} mentions`)}
                    className="excel-cell text-right font-mono text-slate-300"
                  >
                    {item.mentions ? item.mentions.toLocaleString() : '—'}
                  </td>

                  {/* H: Primary Function */}
                  <td
                    onClick={() => onCellSelect && onCellSelect(`H${rowNum}`, item.primaryFunction)}
                    className="excel-cell text-slate-300 truncate max-w-xs"
                    title={item.primaryFunction}
                  >
                    {item.primaryFunction}
                  </td>

                  {/* I: Why Trending */}
                  <td
                    onClick={() => onCellSelect && onCellSelect(`I${rowNum}`, item.whyTrending)}
                    className="excel-cell text-slate-300 truncate max-w-sm"
                    title={item.whyTrending}
                  >
                    {item.whyTrending}
                  </td>

                  {/* J: Sources */}
                  <td className="excel-cell text-slate-400 font-mono text-[10px]">
                    <div className="flex items-center gap-1">
                      {item.sources.slice(0, 3).map((s, i) => (
                        <span key={i} className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">
                          {s}
                        </span>
                      ))}
                      {item.sources.length > 3 && (
                        <span className="text-slate-500">+{item.sources.length - 3}</span>
                      )}
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
