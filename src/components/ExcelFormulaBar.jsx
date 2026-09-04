import React from 'react';
import { Check, X, FunctionSquare } from 'lucide-react';

export default function ExcelFormulaBar({ selectedCellCoordinate = "B2", formulaValue = '=AI_HYPE_INDEX(sources="43_subreddits", timeframe="daily", algo="vibe_pulse")' }) {
  return (
    <div className="w-full bg-[#0b1120] border-b border-slate-800 flex items-center px-2 py-1 text-xs select-none">
      
      {/* Name Box (Hücre Adı) */}
      <div className="w-20 px-2 py-0.5 bg-slate-900 border border-slate-700 text-slate-200 font-mono font-bold text-center rounded text-[11px]">
        {selectedCellCoordinate}
      </div>

      {/* Function Buttons (fx) */}
      <div className="flex items-center space-x-1 px-2 text-slate-500 border-r border-slate-800">
        <span className="font-serif italic font-bold text-slate-400 text-xs px-1">fx</span>
      </div>

      {/* Formula Bar Content */}
      <div className="flex-1 px-2 font-mono text-[11px] text-slate-200 truncate">
        {formulaValue}
      </div>

    </div>
  );
}
