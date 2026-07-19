import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Thermometer, RotateCw, ShieldAlert, Cpu } from 'lucide-react';

export default function TelemetryHUD({ telemetry, onTelemetryChange }) {
  const [history, setHistory] = useState([]);
  const [lineLoad, setLineLoad] = useState('Normal'); // Normal, Heavy, Critical

  // Generate initial history
  useEffect(() => {
    const initialHistory = [];
    const baseTime = Date.now();
    for (let i = 19; i >= 0; i--) {
      initialHistory.push({
        time: new Date(baseTime - i * 3000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        vibration: 20 + Math.random() * 10,
        temperature: 45 + Math.random() * 8,
        rpm: 3600 + Math.floor(Math.random() * 100),
      });
    }
    setHistory(initialHistory);
  }, []);

  // Update telemetry based on load factor
  useEffect(() => {
    const interval = setInterval(() => {
      let vFactor = 1.0;
      let tFactor = 1.0;
      let rFactor = 1.0;

      if (lineLoad === 'Heavy') {
        vFactor = 1.6;
        tFactor = 1.4;
        rFactor = 1.35;
      } else if (lineLoad === 'Critical') {
        vFactor = 2.4;
        tFactor = 1.95;
        rFactor = 1.7;
      }

      const nextVib = parseFloat((18 + Math.random() * 12 * vFactor).toFixed(2));
      const nextTemp = parseFloat((42 + Math.random() * 10 * tFactor).toFixed(2));
      const nextRpm = Math.floor((3500 + Math.random() * 150) * rFactor);

      // Notify parent component
      onTelemetryChange({
        vibration: nextVib,
        temperature: nextTemp,
        rpm: nextRpm
      });

      // Update chart history
      setHistory(prev => {
        const updated = [
          ...prev.slice(1),
          {
            time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            vibration: nextVib,
            temperature: nextTemp,
            rpm: nextRpm
          }
        ];
        return updated;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [lineLoad, onTelemetryChange]);

  const getRiskColor = (score) => {
    if (score < 40) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score < 75) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  // Math formula for live risk calculation
  // normalized weights v_norm and T_norm:
  const vMin = 10, vMax = 80;
  const tMin = 30, tMax = 120;
  const vNorm = Math.max(0, Math.min(1, (telemetry.vibration - vMin) / (vMax - vMin)));
  const tNorm = Math.max(0, Math.min(1, (telemetry.temperature - tMin) / (tMax - tMin)));
  // Weighted Risk Score: 50% vibration, 50% temperature
  const calculatedRisk = Math.round((vNorm * 0.5 + tNorm * 0.5) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Real-time Telemetry Stats Cards */}
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Vibration Card */}
        <div className="glass-panel glass-panel-cyan p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-gray-400">Bearing Vibration</p>
              <h3 className="text-2xl font-bold font-display text-white mt-1 text-glow-cyan">{telemetry.vibration} <span className="text-sm font-normal text-cyan-400">Hz</span></h3>
            </div>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xs font-mono text-cyan-500/90 flex items-center gap-1.5 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 live-pulse"></span>
            <span>Sensor Range: 10 - 80 Hz</span>
          </div>
        </div>

        {/* Temperature Card */}
        <div className="glass-panel glass-panel-emerald p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-gray-400">Spindle Temp</p>
              <h3 className="text-2xl font-bold font-display text-white mt-1 text-glow-emerald">{telemetry.temperature} <span className="text-sm font-normal text-emerald-400">°C</span></h3>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Thermometer className="w-5 h-5" />
            </div>
          </div>
          <div className="text-xs font-mono text-emerald-500/90 flex items-center gap-1.5 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-pulse"></span>
            <span>Nominal Limit: 95°C</span>
          </div>
        </div>

        {/* Spindle RPM Card */}
        <div className="glass-panel p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-gray-400">Spindle Speed</p>
              <h3 className="text-2xl font-bold font-display text-white mt-1 text-white/95">{telemetry.rpm.toLocaleString()} <span className="text-sm font-normal text-gray-400">RPM</span></h3>
            </div>
            <div className="p-2 rounded-lg bg-white/5 text-gray-300">
              <RotateCw className="w-5 h-5 animate-spin" style={{ animationDuration: telemetry.rpm > 5000 ? '1s' : '2.5s' }} />
            </div>
          </div>
          <div className="text-xs font-mono text-gray-500 flex items-center gap-1.5 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
            <span>Target Line Speed: 3.6K</span>
          </div>
        </div>

        {/* Telemetry Chart Graph */}
        <div className="md:col-span-3 glass-panel p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">Vibration & Temperature Waveforms</h4>
              <p className="text-xs text-gray-400 font-mono">Continuous streams from Pub/Sub ingestion pipelines</p>
            </div>
            {/* Load Adjustment Toggles */}
            <div className="flex bg-slate-950 border border-white/10 rounded-lg p-1 text-xs font-mono">
              {['Normal', 'Heavy', 'Critical'].map(load => (
                <button
                  key={load}
                  onClick={() => setLineLoad(load)}
                  className={`px-3 py-1 rounded transition-all duration-300 ${
                    lineLoad === load
                      ? load === 'Critical' 
                        ? 'bg-rose-500 text-white font-bold'
                        : load === 'Heavy'
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {load}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVibration" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#4b5563" fontSize={9} fontStyle="italic" />
                <YAxis stroke="#4b5563" fontSize={9} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f111a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff', fontFamily: 'monospace', fontSize: '11px' }}
                  itemStyle={{ fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="vibration" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorVibration)" name="Vibration (Hz)" />
                <Area type="monotone" dataKey="temperature" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorTemp)" name="Temperature (°C)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Failure Risk Assessment Module */}
      <div className="glass-panel glass-panel-cyan p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">Failure Risk Score</h4>
          </div>
          <p className="text-xs text-gray-400 mb-6 font-mono">Vertex AI online probability engine output</p>

          {/* Large Gauge Indicator */}
          <div className="relative flex flex-col items-center justify-center py-6">
            <svg className="w-36 h-36 transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="64"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="64"
                stroke={calculatedRisk > 75 ? '#f43f5e' : calculatedRisk > 40 ? '#f59e0b' : '#06b6d4'}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="402.1"
                strokeDashoffset={402.1 - (402.1 * Math.min(100, Math.max(0, calculatedRisk))) / 100}
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className={`text-4xl font-extrabold font-display ${calculatedRisk > 75 ? 'text-rose-500' : calculatedRisk > 40 ? 'text-amber-500' : 'text-cyan-400'}`}>
                {calculatedRisk}%
              </span>
              <span className="text-[10px] uppercase font-mono text-gray-400 mt-1">Fault Risk</span>
            </div>
          </div>
        </div>

        {/* Context Status Alert Bar */}
        <div className={`border p-3.5 rounded-lg flex items-center gap-3 transition-colors duration-500 ${getRiskColor(calculatedRisk)}`}>
          <div className="w-2.5 h-2.5 rounded-full bg-current live-pulse"></div>
          <div className="flex-1 font-mono text-xs">
            <div className="font-bold uppercase">
              {calculatedRisk > 75 ? 'Critical Condition' : calculatedRisk > 40 ? 'Load Stress Warning' : 'Optimal Operation'}
            </div>
            <div className="text-[10px] opacity-80 mt-0.5">
              {calculatedRisk > 75 
                ? 'ARIMA model flags impending spindle line breakdown.' 
                : calculatedRisk > 40 
                  ? 'Elevated stress levels on spindle casing.' 
                  : 'Sensors recording values within standard specifications.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
