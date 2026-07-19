import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, AreaChart, Area } from 'recharts';
import { TrendingUp, Calendar, Box, Database } from 'lucide-react';

export default function ForecastViewer() {
  const [activeCategory, setActiveCategory] = useState('Spindles');

  // Pre-configured BQML ARIMA_PLUS dataset projections
  const forecastData = {
    Spindles: [
      { date: 'May 26', actual: 420 },
      { date: 'Jun 26', actual: 480 },
      { date: 'Jul 26', actual: 510 },
      { date: 'Aug 26', actual: 490 },
      { date: 'Sep 26', actual: 530 },
      { date: 'Oct 26', actual: null, forecast: 550, upper: 590, lower: 510 },
      { date: 'Nov 26', actual: null, forecast: 580, upper: 630, lower: 530 },
      { date: 'Dec 26', actual: null, forecast: 610, upper: 670, lower: 550 },
      { date: 'Jan 27', actual: null, forecast: 640, upper: 710, lower: 570 },
      { date: 'Feb 27', actual: null, forecast: 630, upper: 720, lower: 540 }
    ],
    Casings: [
      { date: 'May 26', actual: 120 },
      { date: 'Jun 26', actual: 140 },
      { date: 'Jul 26', actual: 130 },
      { date: 'Aug 26', actual: 165 },
      { date: 'Sep 26', actual: 180 },
      { date: 'Oct 26', actual: null, forecast: 190, upper: 215, lower: 165 },
      { date: 'Nov 26', actual: null, forecast: 210, upper: 245, lower: 175 },
      { date: 'Dec 26', actual: null, forecast: 220, upper: 260, lower: 180 },
      { date: 'Jan 27', actual: null, forecast: 235, upper: 285, lower: 185 },
      { date: 'Feb 27', actual: null, forecast: 250, upper: 310, lower: 190 }
    ],
    Bearings: [
      { date: 'May 26', actual: 850 },
      { date: 'Jun 26', actual: 910 },
      { date: 'Jul 26', actual: 960 },
      { date: 'Aug 26', actual: 920 },
      { date: 'Sep 26', actual: 1040 },
      { date: 'Oct 26', actual: null, forecast: 1080, upper: 1150, lower: 1010 },
      { date: 'Nov 26', actual: null, forecast: 1110, upper: 1210, lower: 1010 },
      { date: 'Dec 26', actual: null, forecast: 1150, upper: 1280, lower: 1020 },
      { date: 'Jan 27', actual: null, forecast: 1190, upper: 1340, lower: 1040 },
      { date: 'Feb 27', actual: null, forecast: 1220, upper: 1390, lower: 1050 }
    ]
  };

  return (
    <div className="glass-panel p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white uppercase tracking-wider font-display">BigQuery ML ARIMA_PLUS Demand Forecast</h2>
          <p className="text-xs text-gray-400 font-mono">Time-series projections trained on sales pipelines and regional index indices</p>
        </div>
        
        {/* Category Selector Tabs */}
        <div className="flex bg-slate-950 border border-white/10 rounded-lg p-1 text-xs font-mono">
          {['Spindles', 'Casings', 'Bearings'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-md font-semibold transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-purple-500 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {cat === 'Spindles' ? 'Steel Spindles' : cat === 'Casings' ? 'Composite Casings' : 'Roller Bearings'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Chart Projections Visuals */}
        <div className="lg:col-span-3">
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData[activeCategory]} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  {/* Confidence Interval Fill */}
                  <linearGradient id="colorInterval" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c084fc" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#c084fc" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#4b5563" fontSize={10} fontStyle="italic" />
                <YAxis stroke="#4b5563" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f111a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff', fontFamily: 'monospace', fontSize: '11px' }}
                  itemStyle={{ fontSize: '11px' }}
                />
                
                {/* Confidence Interval Range Area */}
                <Area type="monotone" dataKey="upper" stroke="none" fill="url(#colorInterval)" name="Confidence Bound Max" />
                <Area type="monotone" dataKey="lower" stroke="none" fill="transparent" name="Confidence Bound Min" />
                
                {/* Historical Actual line */}
                <Line type="monotone" dataKey="actual" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#08090d' }} name="Historical In-Line Demand" />
                
                {/* Projected Forecast line */}
                <Line type="monotone" dataKey="forecast" stroke="#8b5cf6" strokeWidth={3} strokeDasharray="5,5" dot={{ r: 4, strokeWidth: 2, fill: '#08090d' }} name="ARIMA_PLUS Projection" />
                
                {/* Transition Divider Reference line */}
                <ReferenceLine x="Sep 26" stroke="#f59e0b" strokeWidth={1} strokeDasharray="3,3" label={{ value: 'FORECAST HORIZON', fill: '#f59e0b', fontSize: 8, fontStyle: 'italic', position: 'top' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BigQuery ML Side Metrics Panel */}
        <div className="flex flex-col justify-between bg-slate-950/40 border border-white/10 rounded-xl p-5">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-400" />
              <span className="text-[10px] uppercase font-mono tracking-widest text-purple-400 font-bold">ARIMA Model Metrics</span>
            </div>
            
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-gray-400">Model Type:</span>
                <span className="text-white font-semibold">ARIMA_PLUS</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-gray-400">Data Interval:</span>
                <span className="text-white font-semibold">Monthly</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-gray-400">Confidence:</span>
                <span className="text-white font-semibold">95.0%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Model State:</span>
                <span className="text-emerald-400 font-bold">Optimized</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-white/10 my-4"></div>

          {/* Analysis breakdown */}
          <div className="space-y-2">
            <div className="text-[9px] font-mono text-gray-400 uppercase">Supervisor Log Interpretation:</div>
            <div className="text-xs text-gray-300 leading-relaxed font-sans">
              ARIMA projections predict inventory demand surges of approximately{' '}
              <span className="text-purple-400 font-bold">
                {activeCategory === 'Spindles' ? '20%' : activeCategory === 'Casings' ? '38%' : '17%'}
              </span>{' '}
              moving into next quarter. Schedule calibration line workloads accordingly to avoid material supply bottlenecks.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
