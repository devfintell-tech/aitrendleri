import React, { useState } from 'react';
import ExcelTitleBar from './components/ExcelTitleBar';
import ExcelFormulaBar from './components/ExcelFormulaBar';
import ExcelSpreadsheetTable from './components/ExcelSpreadsheetTable';
import ExcelSheetsTabs from './components/ExcelSheetsTabs';
import ExcelStatusBar from './components/ExcelStatusBar';
import ExcelNewsletterSheet from './components/ExcelNewsletterSheet';
import ExcelSubredditsSheet from './components/ExcelSubredditsSheet';
import ExcelArchiveSheet from './components/ExcelArchiveSheet';
import HypeTrendChart from './components/HypeTrendChart';
import { MOCK_TOOLS_DATA, LATEST_CONSULTANT_REPORT } from './data/mockData';
import latestReportData from './data/latest-report.json';

export default function App() {
  const [activeTab, setActiveTab] = useState('daily');
  const [selectedCellCoord, setSelectedCellCoord] = useState('B2');
  const [formulaValue, setFormulaValue] = useState('=AI_HYPE_INDEX(sources="43_subreddits", timeframe="daily", algo="vibe_pulse")');
  const [isScanning, setIsScanning] = useState(false);
  const [notification, setNotification] = useState(null);

  // Initialize data with latest generated report if available
  const initialTools = {
    daily: latestReportData?.daily || MOCK_TOOLS_DATA.daily,
    weekly: latestReportData?.weekly || MOCK_TOOLS_DATA.weekly,
    monthly: latestReportData?.monthly || MOCK_TOOLS_DATA.monthly
  };

  const initialReport = latestReportData ? {
    id: "rep-live",
    title: "Reddit AI Danışman Bülteni - Günlük Sinyal Raporu",
    date: latestReportData.date,
    activeModel: latestReportData.activeModel,
    stats: {
      totalSubreddits: 43,
      successfulSubreddits: 43,
      durationSeconds: latestReportData.durationSeconds || 63,
      totalPostsAnalyzed: latestReportData.totalPostsAnalyzed || 240,
      avgHypeIndex: 8.85
    },
    executiveSummary: latestReportData.executiveSummary,
    sections: latestReportData.sections || LATEST_CONSULTANT_REPORT.sections
  } : LATEST_CONSULTANT_REPORT;

  const [toolsData, setToolsData] = useState(initialTools);
  const [currentReport, setCurrentReport] = useState(initialReport);

  const currentItems = toolsData[activeTab] || toolsData.daily;

  // Cell click handler in table
  const handleCellSelect = (coord, val) => {
    setSelectedCellCoord(coord);
    setFormulaValue(val);
  };

  // Trigger scan
  const handleTriggerScan = () => {
    setIsScanning(true);
    setNotification("43 Subreddit taranıyor ve Gemini 2.5 Flash ile hesaplanıyor...");

    setTimeout(() => {
      setNotification("Formüller yeniden hesaplandı! Hype skorları ve deltalar güncellendi.");
      setIsScanning(false);
      setTimeout(() => setNotification(null), 3500);
    }, 2800);
  };

  // Export current table as CSV file
  const handleExportCsv = () => {
    const items = currentItems;
    const headers = ["Sıra", "Model / Araç", "Kategori", "Hype Skoru", "Delta", "Bahsedilme", "Temel Fonksiyon", "Neden Trend Oldu", "Kaynaklar"];
    const rows = items.map((item, idx) => [
      `#${idx + 1}`,
      `"${item.name}"`,
      `"${item.category}"`,
      item.hypeScore,
      item.scoreDelta,
      item.mentions,
      `"${item.primaryFunction.replace(/"/g, '""')}"`,
      `"${item.whyTrending.replace(/"/g, '""')}"`,
      `"${item.sources.join(', ')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `aitrendleri_${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Stats calculation
  const totalCount = currentItems.length;
  const avgHype = (currentItems.reduce((acc, curr) => acc + curr.hypeScore, 0) / (totalCount || 1)).toFixed(2);
  const maxHype = Math.max(...currentItems.map(i => i.hypeScore), 9.8);

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans select-none">
      
      {/* 1. Excel Top Green Title Bar */}
      <ExcelTitleBar
        onTriggerScan={handleTriggerScan}
        isScanning={isScanning}
        lastUpdateDate={currentReport.date}
        onExportCsv={handleExportCsv}
      />

      {/* 2. Excel Formula Bar */}
      <ExcelFormulaBar
        selectedCellCoordinate={selectedCellCoord}
        formulaValue={formulaValue}
      />

      {/* Real-time Calculation Banner */}
      {notification && (
        <div className="bg-[#107c41] text-white py-1 px-4 text-center text-xs font-mono flex items-center justify-center gap-2">
          <span>{notification}</span>
        </div>
      )}

      {/* 3. Main Workspace Area */}
      <main className="flex-1 w-full max-w-[1500px] mx-auto p-3 sm:p-4 space-y-4">
        
        {/* Spreadsheet Table View (Daily, Weekly, Monthly) */}
        {(activeTab === 'daily' || activeTab === 'weekly' || activeTab === 'monthly') && (
          <div className="space-y-4">
            
            {/* Top Sheet Description Header */}
            <div className="bg-[#0b1120] border border-slate-800 rounded p-3 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#107c41]"></span>
                <span className="font-bold text-white uppercase tracking-wider font-mono">
                  {activeTab === 'daily' && "SAYFA 1: GÜNLÜK HYPE ÖLÇÜMÜ (SON 24 SAAT)"}
                  {activeTab === 'weekly' && "SAYFA 2: HAFTALIK TREND DEĞİŞİMİ (7 GÜNLÜK DELTA)"}
                  {activeTab === 'monthly' && "SAYFA 3: AYLIK MAKRO SEKTÖR LİDERLİĞİ (30 GÜNLÜK PAZAR)"}
                </span>
              </div>
              <div className="text-slate-400 font-mono text-[11px]">
                Kaynak: 43+ Seçkin Reddit AI Topluluğu • Model: Gemini 2.5 Flash
              </div>
            </div>

            {/* The Main Excel Grid Table */}
            <ExcelSpreadsheetTable
              items={currentItems}
              onCellSelect={handleCellSelect}
              selectedCell={selectedCellCoord}
            />

            {/* Trend Chart embedded in Spreadsheet */}
            <div className="mt-6">
              <HypeTrendChart />
            </div>

          </div>
        )}

        {/* Trend Chart Tab */}
        {activeTab === 'chart' && (
          <div className="space-y-4">
            <HypeTrendChart />
          </div>
        )}

        {/* AI Consultant Newsletter Tab */}
        {activeTab === 'newsletter' && (
          <ExcelNewsletterSheet report={currentReport} />
        )}

        {/* 43+ Reddit Communities Tab */}
        {activeTab === 'subreddits' && (
          <ExcelSubredditsSheet />
        )}

        {/* Historical Archive Tab */}
        {activeTab === 'archive' && (
          <ExcelArchiveSheet onSelectReport={(rep) => alert(`Arşiv Raporu Seçildi: ${rep.title} (${rep.date})`)} />
        )}

      </main>

      {/* 4. Excel Bottom Sheet Tabs */}
      <ExcelSheetsTabs
        activeTab={activeTab}
        onSelectTab={(tabId) => {
          setActiveTab(tabId);
          setSelectedCellCoord('A1');
          if (tabId === 'daily') setFormulaValue('=SUM_HYPE(timeframe="daily", range=A2:J25)');
          else if (tabId === 'weekly') setFormulaValue('=DELTA_ANALYSIS(timeframe="weekly", delta_range=E2:E25)');
          else if (tabId === 'monthly') setFormulaValue('=MACRO_STABILITY(timeframe="monthly", pazar_payi=D2:D25)');
          else if (tabId === 'newsletter') setFormulaValue('=EXECUTIVE_MEMO(date="4_eylul_2026")');
          else if (tabId === 'subreddits') setFormulaValue('=INDEX_SOURCES(count=43)');
          else if (tabId === 'archive') setFormulaValue('=QUERY_LOGS(limit=100)');
        }}
      />

      {/* 5. Excel Bottom Status Bar */}
      <ExcelStatusBar
        count={totalCount}
        avgHype={avgHype}
        maxHype={maxHype}
        activeSubreddits={43}
        selectedCell={selectedCellCoord}
      />

    </div>
  );
}
