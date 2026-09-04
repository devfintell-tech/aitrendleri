import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpRight, ArrowDownRight, Minus, Sparkles, SlidersHorizontal, ChevronRight } from 'lucide-react';

export default function HypeLeaderboard({ items = [], onSelectItem }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('hypeScore'); // 'hypeScore' | 'scoreDelta' | 'mentions'

  const categories = [
    { id: 'all', label: 'Tümü' },
    { id: 'Vibe Coding', label: 'Vibe Coding' },
    { id: 'Temel LLM', label: 'Temel LLM' },
    { id: 'Otonom Ajanlar', label: 'Otonom Ajanlar' },
    { id: 'Açık Kaynak', label: 'Açık Kaynak' },
    { id: 'Görsel & Medya', label: 'Görsel & Medya' }
  ];

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesSearch =
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.primaryFunction.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.whyTrending.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.sources.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'scoreDelta') return b.scoreDelta - a.scoreDelta;
        if (sortBy === 'mentions') return b.mentions - a.mentions;
        return b.hypeScore - a.hypeScore;
      });
  }, [items, searchQuery, selectedCategory, sortBy]);

  // Helper to generate a clean SVG sparkline
  const renderSparkline = (points, isPositive) => {
    if (!points || points.length < 2) return null;
    const min = Math.min(...points) * 0.95;
    const max = Math.max(...points) * 1.05;
    const width = 80;
    const height = 24;

    const coords = points.map((val, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - ((val - min) / (max - min || 1)) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const strokeColor = isPositive ? '#34d399' : '#f87171';

    return (
      <svg width={width} height={height} className="overflow-visible inline-block">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={coords.join(' ')}
        />
      </svg>
    );
  };

  return (
    <div className="w-full glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      
      {/* Header & Controls Bar */}
      <div className="p-4 sm:p-6 border-b border-slate-800/80 bg-slate-900/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
              <span>🛠️ Hype & Benimsenme Sıralaması</span>
              <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {filteredItems.length} Model / Araç
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Reddit geliştirici ve araştırma topluluklarının anlık sentiment ve etkileşim frekansı.
            </p>
          </div>

          {/* Search and Sort controls */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Search Box */}
            <div className="relative min-w-[200px] flex-1 sm:flex-initial">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Model, kütüphane veya prompt ara..."
                className="w-full bg-slate-950/80 text-xs text-slate-200 pl-9 pr-3 py-2 rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none placeholder:text-slate-500 transition"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-slate-200 text-xs focus:outline-none cursor-pointer"
              >
                <option value="hypeScore" className="bg-slate-900">En Yüksek Hype</option>
                <option value="scoreDelta" className="bg-slate-900">En Çok Yükselen (Delta)</option>
                <option value="mentions" className="bg-slate-900">En Çok Bahsedilen</option>
              </select>
            </div>

          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>

      {/* Responsive Table / Cards */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400 bg-slate-950/40">
              <th className="py-3 px-4 sm:px-6 w-12 text-center">#</th>
              <th className="py-3 px-4">Model & Araç</th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4 text-center">Hype Skoru</th>
              <th className="py-3 px-4 text-center">Trend (Delta)</th>
              <th className="py-3 px-4 hidden md:table-cell">7 Günlük Seyir</th>
              <th className="py-3 px-4 hidden lg:table-cell">Temel Fonksiyon</th>
              <th className="py-3 px-4 text-right">Kaynaklar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs sm:text-sm">
            {filteredItems.map((item, index) => {
              const isPositive = item.scoreDelta > 0;
              const isNegative = item.scoreDelta < 0;
              const rank = index + 1;

              return (
                <tr
                  key={item.id}
                  onClick={() => onSelectItem && onSelectItem(item)}
                  className="hover:bg-slate-850/50 hover:bg-slate-900/60 transition group cursor-pointer"
                >
                  {/* Rank */}
                  <td className="py-4 px-4 sm:px-6 text-center font-mono font-bold">
                    {rank === 1 && <span className="text-amber-400 text-base">🥇</span>}
                    {rank === 2 && <span className="text-slate-300 text-base">🥈</span>}
                    {rank === 3 && <span className="text-amber-600 text-base">🥉</span>}
                    {rank > 3 && <span className="text-slate-500">#{rank}</span>}
                  </td>

                  {/* Tool Name & Badge */}
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white group-hover:text-indigo-400 transition">
                          {item.name}
                        </span>
                        {item.badge && (
                          <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-500/20">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 lg:hidden">
                        {item.primaryFunction}
                      </span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="font-mono text-[11px] px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60">
                      {item.category}
                    </span>
                  </td>

                  {/* Hype Score */}
                  <td className="py-4 px-4 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className="text-base sm:text-lg font-black font-mono text-white tracking-tight">
                        {item.hypeScore}
                      </span>
                      <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-amber-400 rounded-full"
                          style={{ width: `${(item.hypeScore / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>

                  {/* Trend Delta */}
                  <td className="py-4 px-4 text-center whitespace-nowrap font-mono font-bold">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs ${
                        isPositive
                          ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                          : isNegative
                          ? 'bg-rose-950/40 text-rose-400 border border-rose-500/30'
                          : 'bg-slate-800/40 text-slate-400 border border-slate-700/30'
                      }`}
                    >
                      {isPositive && <ArrowUpRight className="w-3.5 h-3.5" />}
                      {isNegative && <ArrowDownRight className="w-3.5 h-3.5" />}
                      {!isPositive && !isNegative && <Minus className="w-3.5 h-3.5" />}
                      <span>{isPositive ? `+${item.scoreDelta}` : item.scoreDelta}</span>
                    </span>
                  </td>

                  {/* Sparkline */}
                  <td className="py-4 px-4 hidden md:table-cell">
                    {renderSparkline(item.sparkline, isPositive)}
                  </td>

                  {/* Primary Function */}
                  <td className="py-4 px-4 hidden lg:table-cell max-w-xs text-slate-300 text-xs">
                    <p className="line-clamp-2 leading-relaxed">
                      {item.primaryFunction}
                    </p>
                  </td>

                  {/* Sources */}
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1 font-mono text-[11px]">
                      {item.sources.slice(0, 2).map((s, idx) => (
                        <span key={idx} className="text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          {s}
                        </span>
                      ))}
                      {item.sources.length > 2 && (
                        <span className="text-slate-500 text-[10px]">+{item.sources.length - 2}</span>
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition ml-1" />
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
