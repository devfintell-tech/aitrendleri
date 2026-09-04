import React from 'react';
import { Activity, Radio, Calendar, Database, Globe, RefreshCw, Layers } from 'lucide-react';

export default function Navbar({ onOpenArchive, onOpenSubreddits, onOpenDomainGuide, onTriggerScan, isScanning, lastUpdateDate }) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1px] flex items-center justify-center glow-indigo">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  AI HYPE RADAR
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase rounded-full bg-indigo-950/80 text-indigo-400 border border-indigo-500/30">
                  Cloudflare Edge
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>30+ Reddit Sub Canlı Sinyal</span>
                <span className="text-slate-600">•</span>
                <span>{lastUpdateDate || "Bugün"}</span>
              </p>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* 30+ Subreddits Button */}
            <button
              onClick={onOpenSubreddits}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 transition"
              title="Taranan 30+ Subreddit Listesi"
            >
              <Radio className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden md:inline">30+ Subreddit</span>
            </button>

            {/* Archive / History Button */}
            <button
              onClick={onOpenArchive}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 transition"
              title="Geçmiş Raporlar ve Arşiv"
            >
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Geçmiş Arşiv</span>
            </button>

            {/* Domain Setup Guide */}
            <button
              onClick={onOpenDomainGuide}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-600/40 transition"
              title="Domain Alma ve Cloudflare Kurulum Rehberi"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Domain & Yayın</span>
            </button>

            {/* Trigger Scan / Refresh Button */}
            <button
              onClick={onTriggerScan}
              disabled={isScanning}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition active:scale-95"
              title="Reddit Verilerini Şimdi Tara ve Analiz Et"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Analiz Ediliyor...' : 'Canlı Tara'}</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
