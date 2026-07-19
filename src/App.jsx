import React, { useState } from 'react';
import Header from './components/Header';
import TelemetryHUD from './components/TelemetryHUD';
import ProfitCalculator from './components/ProfitCalculator';
import DefectDetector from './components/DefectDetector';
import ForecastViewer from './components/ForecastViewer';
import WorkspaceHub from './components/WorkspaceHub';
import { ShieldAlert, X } from 'lucide-react';

export default function App() {
  const [telemetry, setTelemetry] = useState({
    vibration: 24.5,
    temperature: 52.4,
    rpm: 3600
  });

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);

  const handleAuthorizeTrigger = () => {
    setShowConsentModal(true);
  };

  const handleGrantConsent = () => {
    setShowConsentModal(false);
    setIsAuthorized(true);
  };

  return (
    <div className="min-h-screen bg-[#07080d] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-[#07080d] to-[#030407] text-gray-100 p-4 md:p-6 pb-12">
      {/* Title metadata for browser page audits */}
      <title>ApexForge Command Center</title>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Dynamic Nav Header */}
        <Header 
          isAuthorized={isAuthorized} 
          onAuthorize={handleAuthorizeTrigger} 
        />

        {/* Plant Overview Layout */}
        <TelemetryHUD 
          telemetry={telemetry} 
          onTelemetryChange={setTelemetry} 
        />

        {/* Middle Row: Vision Defect Line & BigQuery ARIMA projections */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <DefectDetector />
          <ForecastViewer />
        </div>

        {/* Profit optimization margins calculator */}
        <ProfitCalculator telemetry={telemetry} />

        {/* Sidecar Workspace Integrator */}
        <WorkspaceHub 
          telemetry={telemetry}
          isAuthorized={isAuthorized} 
          onAuthorize={handleAuthorizeTrigger}
        />
      </div>

      {/* Simulated Google Workspace OAuth 2.0 Consent Screen Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#0f111a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden font-sans">
            
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-slate-950/40">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span className="text-xs font-mono text-gray-400">Sign in with Google</span>
              </div>
              <button 
                onClick={() => setShowConsentModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-white">ApexForge requests access to your Google Account</h4>
                <p className="text-[11px] text-gray-400 leading-normal">
                  This will allow ApexForge Command Center to interact with the following Google Workspace APIs:
                </p>
              </div>

              {/* Scopes checklist */}
              <div className="space-y-3.5 bg-slate-950/40 p-4 rounded-xl border border-white/5 font-mono text-[10px]">
                
                <div className="flex items-start gap-3">
                  <input type="checkbox" defaultChecked disabled className="mt-0.5 accent-cyan-500 rounded" />
                  <div>
                    <span className="text-white font-semibold block">Gmail: Compose drafts</span>
                    <span className="text-gray-500 font-normal">https://www.googleapis.com/auth/gmail.compose</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input type="checkbox" defaultChecked disabled className="mt-0.5 accent-cyan-500 rounded" />
                  <div>
                    <span className="text-white font-semibold block">Google Docs: Export reports</span>
                    <span className="text-gray-500 font-normal">https://www.googleapis.com/auth/documents</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input type="checkbox" defaultChecked disabled className="mt-0.5 accent-cyan-500 rounded" />
                  <div>
                    <span className="text-white font-semibold block">Google Sheets: App telemetry logs</span>
                    <span className="text-gray-500 font-normal">https://www.googleapis.com/auth/spreadsheets</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input type="checkbox" defaultChecked disabled className="mt-0.5 accent-cyan-500 rounded" />
                  <div>
                    <span className="text-white font-semibold block">Google Tasks: Supervisor checklist</span>
                    <span className="text-gray-500 font-normal">https://www.googleapis.com/auth/tasks</span>
                  </div>
                </div>

              </div>

              {/* Warn info details */}
              <div className="flex items-start gap-2 bg-cyan-950/20 border border-cyan-800/30 p-3 rounded-lg text-[10px] text-cyan-400">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="leading-normal font-sans">
                  By clicking Allow, you authorize ApexForge to run integrated sidecar scripts. You can revoke this access at any time in your Google Settings page.
                </p>
              </div>

              {/* Accounts list selector */}
              <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                  XC
                </div>
                <div className="flex-1 font-mono text-[10px]">
                  <span className="text-white font-semibold block">Xuchen The Supervisor</span>
                  <span className="text-gray-500">thexuchen@google.com</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-white/10 flex justify-end gap-3 bg-slate-950/40">
              <button 
                onClick={() => setShowConsentModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-mono text-gray-400 hover:text-white hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleGrantConsent}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2 rounded-lg text-xs tracking-wider uppercase transition-all duration-300 active:scale-95 shadow-md shadow-cyan-500/10"
              >
                Grant Access
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
