import React, { useState } from 'react';
import { Mail, FileText, Grid, CheckSquare, Plus, Check, ShieldCheck, ExternalLink, Sparkles, RefreshCw } from 'lucide-react';

export default function WorkspaceHub({ telemetry, isAuthorized, onAuthorize }) {
  const [activeTab, setActiveTab] = useState('gmail'); // gmail, docs, sheets, tasks
  
  // Gmail Action States
  const [emailTo, setEmailTo] = useState('plant.manager@apexforge.com');
  const [emailAlert, setEmailAlert] = useState('Critical Vibration Spike Detected');
  const [emailNotes, setEmailNotes] = useState('Bearing vibration readings recorded anomaly thresholds (>32Hz). Automated Vertex Edge visual inspector flagged casing stress. Recommend preventative downtime.');
  const [gmailStatus, setGmailStatus] = useState('idle'); // idle, sending, success

  // Docs Action States
  const [docTitle, setDocTitle] = useState('Shift Briefing Report - Line 04');
  const [docsStatus, setDocsStatus] = useState('idle'); // idle, creating, success
  const [createdDocUrl, setCreatedDocUrl] = useState('');

  // Sheets Action States
  const [sheetsStatus, setSheetsStatus] = useState('idle');
  const [loggedRows, setLoggedRows] = useState([
    { timestamp: '16:30:12', machine: 'Spindle-04A', vibration: '24.2 Hz', temp: '54.5 °C', risk: '22%', status: 'NOMINAL' },
    { timestamp: '16:35:45', machine: 'Spindle-04A', vibration: '28.1 Hz', temp: '58.0 °C', risk: '34%', status: 'NOMINAL' },
    { timestamp: '16:40:22', machine: 'Spindle-04A', vibration: '33.8 Hz', temp: '68.2 °C', risk: '58%', status: 'STRESS_WARNING' }
  ]);

  // Tasks Action States
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Confirm spindle core shaft alignment on Line 04', done: false },
    { id: 2, text: 'Calibrate Vertex AI high-resolution vision camera focus', done: true },
    { id: 3, text: 'Schedule localized preventative maintenance downtime window', done: false },
  ]);
  const [newTaskText, setNewTaskText] = useState('');

  // Handlers
  const handleComposeDraft = (e) => {
    e.preventDefault();
    if (!isAuthorized) return;
    setGmailStatus('sending');
    setTimeout(() => {
      setGmailStatus('success');
      setTimeout(() => setGmailStatus('idle'), 4000);
    }, 1500);
  };

  const handleCreateDoc = () => {
    if (!isAuthorized) return;
    setDocsStatus('creating');
    setTimeout(() => {
      setDocsStatus('success');
      setCreatedDocUrl(`https://docs.google.com/document/d/mock-doc-id-${Math.floor(Math.random() * 100000)}/edit`);
      setTimeout(() => setDocsStatus('idle'), 6000);
    }, 1800);
  };

  const handleSyncSheets = () => {
    if (!isAuthorized) return;
    setSheetsStatus('syncing');
    setTimeout(() => {
      setSheetsStatus('success');
      const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
      const currentRisk = Math.round((Math.max(0, Math.min(1, (telemetry.vibration - 10) / 70)) * 0.5 + Math.max(0, Math.min(1, (telemetry.temperature - 30) / 90)) * 0.5) * 100);
      
      setLoggedRows(prev => [
        ...prev,
        {
          timestamp: timeStr,
          machine: 'Spindle-04A',
          vibration: `${telemetry.vibration} Hz`,
          temp: `${telemetry.temperature} °C`,
          risk: `${currentRisk}%`,
          status: currentRisk > 75 ? 'CRITICAL' : currentRisk > 40 ? 'STRESS_WARNING' : 'NOMINAL'
        }
      ]);
      setTimeout(() => setSheetsStatus('idle'), 3000);
    }, 1200);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks(prev => [
      ...prev,
      { id: Date.now(), text: newTaskText, done: false }
    ]);
    setNewTaskText('');
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div className="glass-panel p-6 mb-6">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white uppercase tracking-wider font-display">Google Workspace Sidecar Orchestrator</h2>
          <p className="text-xs text-gray-400 font-mono">Automates factory notifications, shift briefings, logs syncing, and check lists</p>
        </div>

        {/* OAuth lock banner */}
        {!isAuthorized && (
          <div className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 animate-pulse" />
            <span>Workspace APIs locked. Requires consent.</span>
          </div>
        )}
      </div>

      {/* Grid containing navigation and workspace tabs */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Navigation panel */}
        <div className="md:col-span-3 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
          <button
            onClick={() => setActiveTab('gmail')}
            className={`flex-1 md:flex-initial flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-xl font-mono text-xs border transition-all duration-300 ${
              activeTab === 'gmail'
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/40 font-bold'
                : 'bg-white/5 text-gray-400 border-white/5 hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Gmail Alerts</span>
          </button>
          
          <button
            onClick={() => setActiveTab('docs')}
            className={`flex-1 md:flex-initial flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-xl font-mono text-xs border transition-all duration-300 ${
              activeTab === 'docs'
                ? 'bg-purple-500/10 text-purple-400 border-purple-500/40 font-bold'
                : 'bg-white/5 text-gray-400 border-white/5 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Docs Exporter</span>
          </button>

          <button
            onClick={() => setActiveTab('sheets')}
            className={`flex-1 md:flex-initial flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-xl font-mono text-xs border transition-all duration-300 ${
              activeTab === 'sheets'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 font-bold'
                : 'bg-white/5 text-gray-400 border-white/5 hover:text-white'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Sheets Logging</span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 md:flex-initial flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-xl font-mono text-xs border transition-all duration-300 ${
              activeTab === 'tasks'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/40 font-bold'
                : 'bg-white/5 text-gray-400 border-white/5 hover:text-white'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Tasks checklist</span>
          </button>
        </div>

        {/* Dynamic Display workspace workspace Panel */}
        <div className="md:col-span-9 bg-slate-950/40 border border-white/10 rounded-xl p-5 min-h-[300px] flex flex-col justify-between">
          
          {/* Authorization Check Overlay */}
          {!isAuthorized ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10 space-y-4">
              <ShieldCheck className="w-12 h-12 text-cyan-400 opacity-60 animate-pulse" />
              <div className="space-y-1 max-w-sm">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">OAuth Consent Credentials Required</h4>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  ApexForge requests incremental permissions for Gmail Compose, Google Docs writes, Spreadsheets tracking, and Task creation.
                </p>
              </div>
              <button
                onClick={onAuthorize}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-xs tracking-wider uppercase transition-all duration-300 active:scale-95 shadow-lg shadow-cyan-500/20"
              >
                Request Authorization Scopes
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between">
              
              {/* TABS: Gmail Compose */}
              {activeTab === 'gmail' && (
                <form onSubmit={handleComposeDraft} className="space-y-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold">Write Gmail Draft Notification</span>
                    <span className="text-[9px] text-gray-500 font-mono">SCOPE: gmail.compose</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-mono text-gray-400 mb-1">Recipient Supervisor:</label>
                      <input
                        type="email"
                        value={emailTo}
                        onChange={(e) => setEmailTo(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-mono text-gray-400 mb-1">Alert Category Header:</label>
                      <input
                        type="text"
                        value={emailAlert}
                        onChange={(e) => setEmailAlert(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-mono text-gray-400 mb-1">Automated Log Context:</label>
                    <textarea
                      value={emailNotes}
                      onChange={(e) => setEmailNotes(e.target.value)}
                      rows="4"
                      className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-xs text-white leading-relaxed font-sans focus:border-cyan-500 focus:outline-none"
                      required
                    ></textarea>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] text-gray-500 font-mono italic">Draft will compile directly in supervisor's outbox.</span>
                    <button
                      type="submit"
                      disabled={gmailStatus === 'sending'}
                      className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2.5 rounded-lg text-xs uppercase tracking-wider transition-all duration-300 disabled:opacity-50"
                    >
                      {gmailStatus === 'sending' ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Creating Draft...</span>
                        </>
                      ) : gmailStatus === 'success' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Draft Synthesized!</span>
                        </>
                      ) : (
                        <span>Synthesize Gmail Draft</span>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* TABS: Docs Exporter */}
              {activeTab === 'docs' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] uppercase font-mono text-purple-400 font-bold">Shift Briefing Docs Compiler</span>
                    <span className="text-[9px] text-gray-500 font-mono">SCOPE: documents</span>
                  </div>

                  <div className="space-y-3 bg-slate-900/60 border border-white/5 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono text-gray-400">Document Export Title:</span>
                      <input
                        type="text"
                        value={docTitle}
                        onChange={(e) => setDocTitle(e.target.value)}
                        className="bg-slate-950 border border-white/10 rounded px-2.5 py-1 text-xs text-white font-mono focus:border-purple-500 focus:outline-none w-64"
                      />
                    </div>
                    
                    <div className="text-[10px] font-mono space-y-1 text-gray-400 bg-slate-950/40 p-3 rounded border border-white/5 leading-relaxed">
                      <div className="text-purple-400 font-bold uppercase mb-1">Shift Briefing Outline Structure:</div>
                      <div># ApexForge Smart Production Briefing</div>
                      <div>- Date/Time: {new Date().toLocaleString()}</div>
                      <div>- Operating Line Telemetry: Vibration {telemetry.vibration}Hz | Spindle Temp {telemetry.temperature}°C</div>
                      <div>- Predictive Risk Analysis Assessment: Critical threshold boundaries logged.</div>
                      <div>- preventative Margin Yield evaluation and maintenance timeline constraints.</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
                    {docsStatus === 'success' && createdDocUrl ? (
                      <a
                        href={createdDocUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-purple-400 hover:text-purple-300 font-mono flex items-center gap-1.5 underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open Document ({docTitle})</span>
                      </a>
                    ) : (
                      <span className="text-[10px] text-gray-500 font-mono italic">Exports markdown structural briefings directly to Google Docs.</span>
                    )}

                    <button
                      onClick={handleCreateDoc}
                      disabled={docsStatus === 'creating'}
                      className="flex items-center gap-2 bg-purple-500 hover:bg-purple-400 text-white font-bold px-5 py-2.5 rounded-lg text-xs uppercase tracking-wider transition-all duration-300 disabled:opacity-50 self-end"
                    >
                      {docsStatus === 'creating' ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Compiling Doc...</span>
                        </>
                      ) : docsStatus === 'success' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Briefing Saved!</span>
                        </>
                      ) : (
                        <span>Compile Google Doc</span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* TABS: Sheets Logging */}
              {activeTab === 'sheets' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold">IoT Telemetry Spreadsheet Logging</span>
                    <span className="text-[9px] text-gray-500 font-mono">SCOPE: spreadsheets</span>
                  </div>

                  {/* Spreadsheet Grid Log View */}
                  <div className="border border-white/10 rounded-lg overflow-hidden bg-slate-950/60 font-mono text-xs">
                    <div className="grid grid-cols-6 bg-slate-900 p-2.5 font-bold text-gray-400 border-b border-white/10 text-[9px] uppercase">
                      <div>Timestamp</div>
                      <div>Machine ID</div>
                      <div>Vibration</div>
                      <div>Temp</div>
                      <div>Risk</div>
                      <div>Status</div>
                    </div>
                    <div className="max-h-[140px] overflow-y-auto divide-y divide-white/5">
                      {loggedRows.map((row, idx) => (
                        <div key={idx} className="grid grid-cols-6 p-2 text-[10px] text-gray-300">
                          <div className="text-gray-500">{row.timestamp}</div>
                          <div>{row.machine}</div>
                          <div className="text-cyan-400">{row.vibration}</div>
                          <div className="text-emerald-400">{row.temp}</div>
                          <div className="text-purple-400">{row.risk}</div>
                          <div className={`font-bold ${
                            row.status === 'CRITICAL' 
                              ? 'text-rose-400' 
                              : row.status === 'STRESS_WARNING' 
                                ? 'text-amber-400' 
                                : 'text-emerald-400'
                          }`}>{row.status}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    {/* Sheets Smart Fill Simulation */}
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-md">
                      <Sparkles className="w-3 h-3 text-glow-emerald" />
                      <span>Smart Fill Predictions: Active</span>
                    </div>

                    <button
                      onClick={handleSyncSheets}
                      disabled={sheetsStatus === 'syncing'}
                      className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-lg text-xs uppercase tracking-wider transition-all duration-300 disabled:opacity-50"
                    >
                      {sheetsStatus === 'syncing' ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Appending row...</span>
                        </>
                      ) : (
                        <span>Sync Active Row</span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* TABS: Tasks Checklist */}
              {activeTab === 'tasks' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] uppercase font-mono text-amber-400 font-bold">Factory-Floor Task checklist</span>
                    <span className="text-[9px] text-gray-500 font-mono">SCOPE: tasks</span>
                  </div>

                  {/* Tasks List */}
                  <div className="space-y-2 max-h-[140px] overflow-y-auto">
                    {tasks.map(task => (
                      <div
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        className={`flex items-center gap-3 p-2.5 rounded-lg border font-sans text-xs cursor-pointer transition-all duration-300 ${
                          task.done
                            ? 'bg-slate-950/60 border-white/5 text-gray-500 line-through'
                            : 'bg-slate-900 border-white/10 text-white hover:border-amber-500/30'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                          task.done ? 'bg-amber-500 border-amber-500 text-slate-950' : 'border-white/20'
                        }`}>
                          {task.done && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="flex-1 font-mono text-[11px]">{task.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Add task form */}
                  <form onSubmit={handleAddTask} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add supervisor checkpoint..."
                      value={newTaskText}
                      onChange={(e) => setNewTaskText(e.target.value)}
                      className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center justify-center transition-all active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
