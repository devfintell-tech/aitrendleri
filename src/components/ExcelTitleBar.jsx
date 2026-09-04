import React from 'react';
import { FileSpreadsheet, RefreshCw, Download, Radio, Calendar, Share2, Search, CheckCircle } from 'lucide-react';

export default function ExcelTitleBar({ onTriggerScan, isScanning, lastUpdateDate, onExportCsv }) {
  return (
    <div className="w-full bg-[#107c41] text-white flex flex-col sm:flex-row items-center justify-between px-3 py-1.5 border-b border-[#0b5e30] shadow-sm select-none">
      
      {/* Left: Excel File Info & AutoSave */}
      <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded bg-white text-[#107c41] flex items-center justify-center font-black text-xs shadow-inner">
            X
          </div>
          <span className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
            <span>aitrendleri.com</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0b5e30] text-emerald-200 border border-emerald-400/30">
              Otomatik Kaydedildi
            </span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1 text-[11px] text-emerald-100 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
          <span>43+ Reddit Sub Sinyali • {lastUpdateDate || "Bugün"}</span>
        </div>
      </div>

      {/* Right: Quick Tools */}
      <div className="flex items-center space-x-1.5 mt-1 sm:mt-0">
        
        {/* CSV Export */}
        <button
          onClick={onExportCsv}
          className="flex items-center gap-1 px-2.5 py-1 rounded text-xs text-white hover:bg-[#0b5e30] transition"
          title="Verileri CSV / Excel olarak indir"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px]">CSV İndir</span>
        </button>

        {/* Refresh / Scan */}
        <button
          onClick={onTriggerScan}
          disabled={isScanning}
          className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#0b5e30] hover:bg-[#094d27] text-xs font-semibold text-white transition border border-emerald-400/30 disabled:opacity-60"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          <span className="text-[11px]">{isScanning ? 'Hesaplanıyor...' : 'Yenile (F9)'}</span>
        </button>

      </div>
    </div>
  );
}
