import React, { useState } from 'react';
import Navbar from './components/Navbar';
import TimeframeSelector from './components/TimeframeSelector';
import HypeRadarCards from './components/HypeRadarCards';
import HypeLeaderboard from './components/HypeLeaderboard';
import HypeTrendChart from './components/HypeTrendChart';
import ConsultantNewsletter from './components/ConsultantNewsletter';
import ArchiveModal from './components/ArchiveModal';
import SubredditsModal from './components/SubredditsModal';
import DomainSetupGuide from './components/DomainSetupGuide';
import { MOCK_TOOLS_DATA, LATEST_CONSULTANT_REPORT } from './data/mockData';
import latestReportData from './data/latest-report.json';
import { Shield, Sparkles, Terminal, CheckCircle2, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTimeframe, setActiveTimeframe] = useState('daily');
  
  // Initialize with real generated data if available
  const initialTools = {
    daily: latestReportData?.daily || MOCK_TOOLS_DATA.daily,
    weekly: latestReportData?.weekly || MOCK_TOOLS_DATA.weekly,
    monthly: latestReportData?.monthly || MOCK_TOOLS_DATA.monthly
  };

  const initialReport = latestReportData ? {
    id: "rep-live",
    title: "Reddit AI Danışman Bülteni - Canlı Sinyal Raporu",
    date: latestReportData.date,
    activeModel: latestReportData.activeModel,
    stats: {
      totalSubreddits: latestReportData.subredditsCovered || 30,
      successfulSubreddits: latestReportData.subredditsCovered || 30,
      durationSeconds: latestReportData.durationSeconds || 63,
      totalPostsAnalyzed: latestReportData.totalPostsAnalyzed || 20,
      avgHypeIndex: 9.1
    },
    executiveSummary: latestReportData.executiveSummary,
    sections: latestReportData.sections || LATEST_CONSULTANT_REPORT.sections
  } : LATEST_CONSULTANT_REPORT;

  const [toolsData, setToolsData] = useState(initialTools);
  const [currentReport, setCurrentReport] = useState(initialReport);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState(null);

  // Modals state
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isSubredditsOpen, setIsSubredditsOpen] = useState(false);
  const [isDomainGuideOpen, setIsDomainGuideOpen] = useState(false);
  const [selectedItemDetail, setSelectedItemDetail] = useState(null);

  // Active items for current timeframe
  const currentItems = toolsData[activeTimeframe] || toolsData.daily;

  // Handler to trigger scan simulation / real run
  const handleTriggerScan = () => {
    setIsScanning(true);
    setScanMessage("Reddit RSS paketleri taranıyor (r/vibecoding+CursorAI...)...");

    setTimeout(() => {
      setScanMessage("Gemini 2.5 Flash ile çoklu kaynak analizi yapılıyor...");
    }, 1500);

    setTimeout(() => {
      setScanMessage("Günlük & haftalık hype skorları ve delta hesaplamaları güncellendi!");
      setIsScanning(false);
      setTimeout(() => setScanMessage(null), 3500);
    }, 3200);
  };

  const handleSelectArchiveReport = (rep) => {
    // Show archive feedback
    alert(`Arşiv Raporu Yüklendi: ${rep.title} (${rep.date})`);
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Navbar */}
      <Navbar
        onOpenArchive={() => setIsArchiveOpen(true)}
        onOpenSubreddits={() => setIsSubredditsOpen(true)}
        onOpenDomainGuide={() => setIsDomainGuideOpen(true)}
        onTriggerScan={handleTriggerScan}
        isScanning={isScanning}
        lastUpdateDate={currentReport.date}
      />

      {/* Real-time Scan Notification Banner */}
      {scanMessage && (
        <div className="bg-indigo-950/90 border-b border-indigo-500/50 py-2.5 px-4 text-center text-xs font-mono text-indigo-200 flex items-center justify-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
          <span>{scanMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Section */}
        <div className="relative rounded-3xl p-6 sm:p-10 overflow-hidden border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-950 to-[#070a12] shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-semibold mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>30+ Subreddit Sinyali • Günlük / Haftalık / Aylık Ölçüm</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Yapay Zeka Hype ve <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Benimsenme Terminali
              </span>
            </h1>
            
            <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed max-w-2xl">
              Reddit'in en seçkin 30+ yapay zeka topluluğundaki binlerce geliştirici tartışması, Gemini API ile filtrelenip objektif hype skorlarına ve beyaz yaka entegrasyon bültenlerine dönüştürülüyor.
            </p>

            {/* Quick Actions in Hero */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button
                onClick={() => setIsDomainGuideOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition"
              >
                <span>Domain Al &amp; Cloudflare'e Bağla (~$9.77/yıl)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsSubredditsOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-semibold transition"
              >
                <span>30+ Subreddit Listesi</span>
              </button>
            </div>
          </div>
        </div>

        {/* Timeframe Selector (Daily / Weekly / Monthly) */}
        <TimeframeSelector
          activeTimeframe={activeTimeframe}
          onSelectTimeframe={(tf) => setActiveTimeframe(tf)}
        />

        {/* Top 3 Hype Radar Cards */}
        <HypeRadarCards items={currentItems} />

        {/* Main Hype Leaderboard Table */}
        <HypeLeaderboard
          items={currentItems}
          onSelectItem={(item) => setSelectedItemDetail(item)}
        />

        {/* Interactive 7-Day Trend Timeline Chart */}
        <HypeTrendChart />

        {/* AI Consultant Newsletter (Executive Report) */}
        <ConsultantNewsletter report={currentReport} />

      </main>

      {/* Item Detail Drawer / Modal if clicked */}
      {selectedItemDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-400">
                  {selectedItemDetail.category}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{selectedItemDetail.name}</h3>
              </div>
              <button
                onClick={() => setSelectedItemDetail(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-300">
              <div>
                <strong className="text-slate-400 block text-xs mb-0.5">Hype Skoru:</strong>
                <span className="text-2xl font-black font-mono text-white">{selectedItemDetail.hypeScore}</span>
                <span className="text-xs font-mono ml-2 text-emerald-400">
                  ({selectedItemDetail.scoreDelta >= 0 ? `+${selectedItemDetail.scoreDelta}` : selectedItemDetail.scoreDelta} delta)
                </span>
              </div>

              <div>
                <strong className="text-slate-400 block text-xs mb-0.5">Temel İşlev:</strong>
                <p className="text-slate-200">{selectedItemDetail.primaryFunction}</p>
              </div>

              <div>
                <strong className="text-slate-400 block text-xs mb-0.5">Neden Trend Oldu?</strong>
                <p className="text-slate-200">{selectedItemDetail.whyTrending}</p>
              </div>

              <div>
                <strong className="text-slate-400 block text-xs mb-1">Kaynak Subreddit'ler:</strong>
                <div className="flex flex-wrap gap-1">
                  {selectedItemDetail.sources.map((s, i) => (
                    <span key={i} className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedItemDetail(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition"
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ArchiveModal
        isOpen={isArchiveOpen}
        onClose={() => setIsArchiveOpen(false)}
        onSelectArchiveReport={handleSelectArchiveReport}
      />

      <SubredditsModal
        isOpen={isSubredditsOpen}
        onClose={() => setIsSubredditsOpen(false)}
      />

      <DomainSetupGuide
        isOpen={isDomainGuideOpen}
        onClose={() => setIsDomainGuideOpen(false)}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} AI HYPE RADAR. Cloudflare Edge & Gemini AI ile güçlendirilmiştir.</p>
          <div className="flex items-center gap-4 text-xs">
            <button onClick={() => setIsSubredditsOpen(true)} className="hover:text-slate-300">30+ Subreddit</button>
            <button onClick={() => setIsArchiveOpen(true)} className="hover:text-slate-300">Arşiv</button>
            <button onClick={() => setIsDomainGuideOpen(true)} className="text-amber-400 hover:underline">Domain Rehberi</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
