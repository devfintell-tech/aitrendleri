import React, { useState } from 'react';
import { LineChart, Activity, Info, Eye } from 'lucide-react';
import { TREND_TIMELINE_SERIES } from '../data/mockData';

export default function HypeTrendChart() {
  const { days, models } = TREND_TIMELINE_SERIES;
  const [activeModel, setActiveModel] = useState(null); // hover or selected filter

  // Dimensions
  const width = 800;
  const height = 260;
  const paddingX = 40;
  const paddingY = 30;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Min and max for scale
  const minY = 6.0;
  const maxY = 10.0;

  // Helper to map data point to SVG x,y
  const getCoordinates = (val, dayIdx) => {
    const x = paddingX + (dayIdx / (days.length - 1)) * chartWidth;
    const y = paddingY + chartHeight - ((val - minY) / (maxY - minY)) * chartHeight;
    return { x, y };
  };

  return (
    <div className="w-full glass-panel rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl">
      
      {/* Title & Legend */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Model & Araç Hype Karşılaştırma Grafiği (Son 7 Gün)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Zirvedeki modellerin Reddit topluluklarındaki hype puanlarının zamana bağlı değişimi.
          </p>
        </div>

        {/* Legend buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {models.map((m) => {
            const isSelected = activeModel === m.name;
            return (
              <button
                key={m.name}
                onClick={() => setActiveModel(isSelected ? null : m.name)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition border ${
                  isSelected
                    ? 'bg-slate-800 text-white border-slate-600 shadow-md'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: m.color }}
                ></span>
                <span>{m.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[650px] overflow-visible font-mono text-[10px]"
        >
          {/* Horizontal Grid lines & Y-axis labels */}
          {[6.0, 7.0, 8.0, 9.0, 10.0].map((level) => {
            const y = paddingY + chartHeight - ((level - minY) / (maxY - minY)) * chartHeight;
            return (
              <g key={level}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  textAnchor="end"
                  fill="#64748b"
                >
                  {level.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Vertical lines & X-axis labels */}
          {days.map((day, idx) => {
            const x = paddingX + (idx / (days.length - 1)) * chartWidth;
            return (
              <g key={day}>
                <line
                  x1={x}
                  y1={paddingY}
                  x2={x}
                  y2={height - paddingY}
                  stroke="#1e293b"
                  strokeWidth="1"
                  strokeOpacity="0.5"
                />
                <text
                  x={x}
                  y={height - paddingY + 16}
                  textAnchor="middle"
                  fill="#94a3b8"
                >
                  {day}
                </text>
              </g>
            );
          })}

          {/* Model lines */}
          {models.map((m) => {
            const isDimmed = activeModel && activeModel !== m.name;
            const isHighlighted = activeModel === m.name;

            const pathCommands = m.data.map((val, idx) => {
              const { x, y } = getCoordinates(val, idx);
              return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
            }).join(' ');

            return (
              <g
                key={m.name}
                opacity={isDimmed ? 0.2 : 1}
                className="transition-opacity duration-300"
              >
                {/* Glow behind line when highlighted */}
                {isHighlighted && (
                  <path
                    d={pathCommands}
                    fill="none"
                    stroke={m.color}
                    strokeWidth="8"
                    strokeOpacity="0.25"
                    strokeLinecap="round"
                  />
                )}

                {/* Main line */}
                <path
                  d={pathCommands}
                  fill="none"
                  stroke={m.color}
                  strokeWidth={isHighlighted ? 3.5 : 2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Points */}
                {m.data.map((val, idx) => {
                  const { x, y } = getCoordinates(val, idx);
                  return (
                    <circle
                      key={idx}
                      cx={x}
                      cy={y}
                      r={isHighlighted ? 5 : 3.5}
                      fill={m.color}
                      stroke="#090d16"
                      strokeWidth="2"
                      className="cursor-pointer hover:r-6 transition-all"
                    >
                      <title>{`${m.name} (${days[idx]}): ${val}`}</title>
                    </circle>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>💡 Grafikteki çizgilere veya sağ üstteki etiketlere tıklayarak modeli izole edebilirsiniz.</span>
        <span>Skor Aralığı: 1.0 - 10.0</span>
      </div>

    </div>
  );
}
