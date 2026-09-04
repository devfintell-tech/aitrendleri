import React from 'react';
import { ChevronLeft, ChevronRight, Plus, Table2, FileText, Radio, Calendar } from 'lucide-react';

export default function ExcelSheetsTabs({ activeTab, onSelectTab }) {
  const tabs = [
    { id: "daily", label: "📈 Günlük Hype", sub: "24 Saat" },
    { id: "weekly", label: "📊 Haftalık Trend", sub: "7 Gün Delta" },
    { id: "monthly", label: "🪐 Aylık Makro", sub: "30 Gün Pazar" },
    { id: "chart", label: "📉 Trend Grafiği", sub: "Zaman Çizgisi" },
    { id: "newsletter", label: "📝 Danışman Bülteni", sub: "Yönetici Raporu" },
    { id: "subreddits", label: "📡 43+ Reddit Topluluğu", sub: "Sinyal Havuzu" },
    { id: "archive", label: "📂 Geçmiş Arşiv", sub: "Eski Raporlar" }
  ];

  return (
    <div className="w-full bg-[#0b1120] border-t border-slate-800 flex items-center justify-between px-2 py-1 select-none overflow-x-auto text-xs">
      
      {/* Left: Navigation and Tabs */}
      <div className="flex items-center space-x-1">
        
        {/* Navigation arrows */}
        <div className="flex items-center text-slate-500 mr-1">
          <button className="p-0.5 hover:text-white"><ChevronLeft className="w-3.5 h-3.5" /></button>
          <button className="p-0.5 hover:text-white"><ChevronRight className="w-3.5 h-3.5" /></button>
        </div>

        {/* Sheet Tabs */}
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-t text-xs font-medium transition-all duration-150 border-t-2 ${
                isActive
                  ? 'bg-slate-900 text-white border-[#107c41] shadow'
                  : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border-transparent'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">({tab.sub})</span>
            </button>
          );
        })}

        {/* Plus Button */}
        <button
          onClick={() => alert("Yeni analiz sayfası oluşturmak için 'Yenile (F9)' butonuna basınız.")}
          className="p-1 rounded text-slate-500 hover:text-white hover:bg-slate-800 ml-1"
          title="Yeni Sayfa Ekle"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

      </div>

    </div>
  );
}
