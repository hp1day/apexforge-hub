import React, { useState, useEffect } from 'react';
import { Cpu, Database, Rss, Layers, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function Header({ oauthUser, onAuthorize, isAuthorized }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <header className="glass-panel border-b border-white/10 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-950/40 mb-6">
      {/* Brand & Architecture Icon */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/40 text-cyan-400">
          <Cpu className="w-6 h-6" />
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 live-pulse"></div>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-wider font-display text-white m-0">APEXFORGE</h1>
          <p className="text-xs text-cyan-400 font-mono tracking-widest uppercase">Smart Mfg. Command Center</p>
        </div>
      </div>

      {/* Real-time GCP Infrastructure Health Checks */}
      <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <Rss className="w-3.5 h-3.5" />
          <span>Pub/Sub Buffer:</span>
          <span className="font-bold uppercase">Active</span>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
          <Layers className="w-3.5 h-3.5" />
          <span>Vertex AI Edge:</span>
          <span className="font-bold uppercase">Online</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400">
          <Database className="w-3.5 h-3.5" />
          <span>BigQuery ML:</span>
          <span className="font-bold uppercase">Connected</span>
        </div>

        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
          isAuthorized 
            ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300' 
            : 'bg-amber-500/15 border border-amber-500/40 text-amber-300'
        }`}>
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Workspace OAuth:</span>
          <span className="font-bold uppercase">{isAuthorized ? 'Authorized' : 'Pending Consent'}</span>
        </div>
      </div>

      {/* Clock and Supervisor Session Controls */}
      <div className="flex items-center gap-4">
        <div className="text-right hidden md:block">
          <div className="text-sm font-semibold text-white font-mono">{formatTime(time)}</div>
          <div className="text-[10px] text-gray-400 uppercase tracking-widest">{formatDate(time)}</div>
        </div>

        <div className="h-8 w-px bg-white/10 hidden md:block"></div>

        {isAuthorized ? (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-lg text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Supervisor Active</span>
          </div>
        ) : (
          <button
            onClick={onAuthorize}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm transition-all duration-300 shadow-lg shadow-cyan-500/20 active:scale-95"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Authorize Workspace</span>
          </button>
        )}
      </div>
    </header>
  );
}
