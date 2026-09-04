import React from 'react';
import { ZoomIn, ZoomOut, Minus, Plus } from 'lucide-react';

export default function ExcelStatusBar({ count = 15, avgHype = 8.85, maxHype = 9.8, activeSubreddits = 43, selectedCell = "B2" }) {
  return (
    <div className="w-full bg-[#0b1120] text-slate-400 border-t border-slate-800 flex items-center justify-between px-3 py-1 text-[11px] font-mono select-none">
      
      {/* Left Status */}
      <div className="flex items-center space-x-3">
        <span className="text-[#107c41] font-bold">● HAZIR</span>
        <span className="hidden sm:inline">Hücre: <strong className="text-slate-200">{selectedCell}</strong></span>
        <span>Kayıt: <strong className="text-slate-200">{count}</strong></span>
      </div>

      {/* Middle Aggregations (Auto Calculate like Excel) */}
      <div className="hidden md:flex items-center space-x-4">
        <span>Ortalama: <strong className="text-emerald-400">{avgHype}</strong></span>
        <span>En Yüksek: <strong className="text-amber-400">{maxHype}</strong></span>
        <span>Aktif Kaynak: <strong className="text-cyan-400">{activeSubreddits} Subreddit</strong></span>
      </div>

      {/* Right Zoom Control */}
      <div className="flex items-center space-x-2">
        <span className="text-slate-400">100%</span>
        <div className="w-16 bg-slate-800 h-1 rounded-full overflow-hidden hidden sm:block">
          <div className="bg-[#107c41] h-full w-1/2"></div>
        </div>
      </div>

    </div>
  );
}
