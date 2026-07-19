import React, { useState, useEffect } from 'react';
import { DollarSign, Percent, TrendingUp, Info, HelpCircle } from 'lucide-react';

export default function ProfitCalculator({ telemetry }) {
  // Calculator parameter states
  const [wv, setWv] = useState(0.6); // Weight for vibration
  const [wt, setWt] = useState(0.4); // Weight for temp
  const [unplannedCostHr, setUnplannedCostHr] = useState(15000); // C_unplanned hourly cost
  const [maintenanceCost, setMaintenanceCost] = useState(2500); // C_maintenance
  const [shutdownHours, setShutdownHours] = useState(4); // Average unplanned downtime hours

  // Live telemetry overrides (toggles whether sliders or sensor telemetry drives the math)
  const [useLiveSensors, setUseLiveSensors] = useState(true);
  const [customVib, setCustomVib] = useState(25);
  const [customTemp, setCustomTemp] = useState(55);

  const activeVib = useLiveSensors ? telemetry.vibration : customVib;
  const activeTemp = useLiveSensors ? telemetry.temperature : customTemp;

  // Normalization boundaries
  const vMin = 10, vMax = 80;
  const tMin = 30, tMax = 120;

  // Formula 1: Failure Risk Index
  const vNorm = Math.max(0, Math.min(1, (activeVib - vMin) / (vMax - vMin)));
  const tNorm = Math.max(0, Math.min(1, (activeTemp - tMin) / (tMax - tMin)));
  
  // Risk index score
  const pFailure = Math.max(0.01, Math.min(0.99, (wv * vNorm + wt * tNorm)));

  // Formula 2: Expected value calculations
  // E(unplanned shutdown cost if unserviced) = P_failure * C_unplanned
  const expectedUnplannedCost = pFailure * (unplannedCostHr * shutdownHours);
  
  // Preventative maintenance cost is flat scheduled cost
  const expectedMaintenanceCost = maintenanceCost;

  // Net Savings (Expected cost of inaction vs cost of action)
  const netSavings = expectedUnplannedCost - expectedMaintenanceCost;

  return (
    <div className="glass-panel p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white uppercase tracking-wider font-display">Margin Protection Math Desk</h2>
          <p className="text-xs text-gray-400 font-mono">Real-time expected cost evaluation & preventative calibration optimization</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-gray-400">Sensor Override:</span>
          <button
            onClick={() => setUseLiveSensors(!useLiveSensors)}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all duration-300 ${
              useLiveSensors
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/40'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/40'
            }`}
          >
            {useLiveSensors ? 'USING LIVE SENSORS' : 'MANUAL INPUT OVERRIDE'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Math Equation & Live Output Visuals */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Formula Display Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Index Equation */}
            <div className="bg-slate-950/60 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-wider font-mono text-gray-400">Risk Probability Equation</span>
                <span className="px-1.5 py-0.5 rounded text-[8px] bg-cyan-500/20 text-cyan-400 font-mono">P(v, T)</span>
              </div>
              
              {/* Equation Visual Representation */}
              <div className="my-4 text-center font-mono text-cyan-300 py-3 bg-slate-900/60 rounded-lg select-none">
                <div className="inline-flex items-center gap-1.5 text-sm">
                  <span>P = </span>
                  <span>(w<sub>v</sub> &middot; v<sub>norm</sub>) + (w<sub>T</sub> &middot; T<sub>norm</sub>)</span>
                </div>
                <div className="text-[9px] text-gray-500 mt-1.5 italic font-sans">
                  v<sub>norm</sub> = (v - v<sub>min</sub>) / (v<sub>max</sub> - v<sub>min</sub>)
                </div>
              </div>

              <div className="text-[10px] text-gray-400 leading-relaxed font-sans">
                Calculates probability score <span className="text-white font-semibold">P</span> based on weighted vibration <span className="text-cyan-400">v</span> and temperature load <span className="text-emerald-400">T</span>.
              </div>
            </div>

            {/* expected cost equation */}
            <div className="bg-slate-950/60 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-wider font-mono text-gray-400">Margin Risk Model</span>
                <span className="px-1.5 py-0.5 rounded text-[8px] bg-purple-500/20 text-purple-400 font-mono">E(Cost)</span>
              </div>

              {/* Equation Visual Representation */}
              <div className="my-4 text-center font-mono text-purple-300 py-3 bg-slate-900/60 rounded-lg select-none">
                <div className="inline-flex items-center gap-1.5 text-sm">
                  <span>E(Cost) = P &middot; C<sub>unplanned</sub></span>
                </div>
                <div className="text-[9px] text-gray-500 mt-1.5 italic font-sans">
                  Savings = E(Cost) - C<sub>maintenance</sub>
                </div>
              </div>

              <div className="text-[10px] text-gray-400 leading-relaxed font-sans">
                Evaluates expected monetary impact of component breakdown if line operation continues unserviced.
              </div>
            </div>
          </div>

          {/* Interactive Parameters Adjusters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Column A: Telemetry inputs */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase font-mono tracking-widest text-cyan-400 border-b border-cyan-500/10 pb-1 font-semibold">Asset Load Controls</h3>
              
              {/* Vibration input slider */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-gray-400">Bearing Vibration (v)</span>
                  <span className="text-white font-bold">{activeVib} Hz</span>
                </div>
                <input
                  type="range"
                  min={vMin}
                  max={vMax}
                  step="0.5"
                  value={activeVib}
                  onChange={(e) => setCustomVib(parseFloat(e.target.value))}
                  disabled={useLiveSensors}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Temp input slider */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-gray-400">Spindle Temp (T)</span>
                  <span className="text-white font-bold">{activeTemp} °C</span>
                </div>
                <input
                  type="range"
                  min={tMin}
                  max={tMax}
                  step="0.5"
                  value={activeTemp}
                  onChange={(e) => setCustomTemp(parseFloat(e.target.value))}
                  disabled={useLiveSensors}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Weights wv and wt */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-gray-400">Vibration Parameter Weight (w_v)</span>
                  <span className="text-cyan-400 font-bold">{(wv * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={wv}
                  onChange={(e) => {
                    const newWv = parseFloat(e.target.value);
                    setWv(newWv);
                    setWt(parseFloat((1 - newWv).toFixed(2)));
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            </div>

            {/* Column B: Financial weights */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase font-mono tracking-widest text-purple-400 border-b border-purple-500/10 pb-1 font-semibold">Cost Constraints</h3>
              
              {/* Unplanned Shutdown cost */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-gray-400">Hourly Unplanned Penalty (C_unplanned)</span>
                  <span className="text-white font-bold">${unplannedCostHr.toLocaleString()}/hr</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="40000"
                  step="1000"
                  value={unplannedCostHr}
                  onChange={(e) => setUnplannedCostHr(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              {/* Maintenance cost */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-gray-400">Scheduled Shutdown Cost (C_maintenance)</span>
                  <span className="text-white font-bold">${maintenanceCost.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="250"
                  value={maintenanceCost}
                  onChange={(e) => setMaintenanceCost(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              {/* Duration of shutdown */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-gray-400">Average Down Time Duration</span>
                  <span className="text-white font-bold">{shutdownHours} hrs</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="1"
                  value={shutdownHours}
                  onChange={(e) => setShutdownHours(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Real-time Savings Visual Outcome Display */}
        <div className="flex flex-col justify-between bg-slate-950/40 border border-white/10 rounded-xl p-5">
          <div className="space-y-4">
            <h3 className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-bold">Risk Assessment Yield</h3>
            
            {/* Risk Probability Index Output */}
            <div>
              <span className="text-[10px] font-mono text-gray-400 uppercase">Calculated Failure Index (P):</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-extrabold font-display text-white">{(pFailure * 100).toFixed(1)}%</span>
                <span className="text-xs text-gray-500 font-mono">probability</span>
              </div>
            </div>

            {/* Expected breakdown penalty */}
            <div>
              <span className="text-[10px] font-mono text-gray-400 uppercase">Expected Breakdown Risk E(Cost):</span>
              <div className="text-xl font-bold font-mono text-rose-400 mt-0.5">
                ${Math.round(expectedUnplannedCost).toLocaleString()}
              </div>
            </div>

            {/* Scheduled Maintenance cost */}
            <div>
              <span className="text-[10px] font-mono text-gray-400 uppercase">Preventative Service Cost C_maint:</span>
              <div className="text-lg font-bold font-mono text-cyan-400 mt-0.5">
                ${expectedMaintenanceCost.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="h-px bg-white/10 my-4"></div>

          {/* Margin Protection Yield Outcome */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-gray-400 uppercase">Net Real-Time Yield Savings:</span>
            <div className={`p-4 rounded-lg flex flex-col justify-center border ${
              netSavings > 0 
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
                : 'bg-rose-500/10 border-rose-500/40 text-rose-400'
            }`}>
              <span className="text-[9px] uppercase font-mono tracking-widest opacity-80">Margin Protection Net Yield</span>
              <span className="text-2xl font-extrabold font-mono mt-1 flex items-center">
                {netSavings > 0 ? '+' : ''}${Math.round(netSavings).toLocaleString()}
              </span>
              <span className="text-[9px] mt-1 italic leading-tight">
                {netSavings > 0 
                  ? 'Scheduling preventatitive calibration saves line overhead.' 
                  : 'Maintain normal telemetry line operation, risk index low.'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
