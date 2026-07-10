import React, { useMemo } from 'react';
import { useCovidGlobal, useCovidHistorical } from '../hooks/useCovidData';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import { Loader2, TrendingUp, Heart, Skull, AlertCircle } from 'lucide-react';

export const ChartsDashboard: React.FC = () => {
  const { data: globalStats, isLoading: globalLoading, error: globalError } = useCovidGlobal();
  const { data: historicalData, isLoading: historicalLoading, error: historicalError } = useCovidHistorical();

  const formattedStats = useMemo(() => {
    if (!globalStats) return null;
    return {
      cases: globalStats.cases.toLocaleString(),
      active: globalStats.active.toLocaleString(),
      recovered: globalStats.recovered.toLocaleString(),
      deaths: globalStats.deaths.toLocaleString(),
    };
  }, [globalStats]);

  const chartData = useMemo(() => {
    if (!historicalData) return [];
    const dates = Object.keys(historicalData.cases);
    return dates.map((date) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      cases: historicalData.cases[date],
      deaths: historicalData.deaths[date],
      recovered: historicalData.recovered[date],
    }));
  }, [historicalData]);

  const formatYAxis = (value: number) => {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
    return value.toString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-lg">
          <p className="text-xs font-semibold text-slate-500 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs font-bold flex items-center space-x-2" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
              <span className="text-slate-600 font-medium">{entry.name}:</span>
              <span>{entry.value.toLocaleString()}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const loading = globalLoading || historicalLoading;
  const error = globalError || historicalError;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[350px] text-slate-400 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        <p className="text-xs font-semibold">Loading stats and timeline...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="max-w-md w-full bg-rose-50 border border-rose-100 p-6 rounded-xl text-center">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800 mb-1">Failed to load data</h3>
          <p className="text-xs text-slate-500">
            Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 select-none">
      
      {formattedStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center space-x-4 relative overflow-hidden group hover:border-indigo-200 transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-650 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold block">Total Cases</span>
              <p className="text-base font-extrabold text-slate-900 mt-0.5">{formattedStats.cases}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center space-x-4 relative overflow-hidden group hover:border-amber-200 transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-650 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold block">Active Cases</span>
              <p className="text-base font-extrabold text-slate-900 mt-0.5">{formattedStats.active}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center space-x-4 relative overflow-hidden group hover:border-emerald-200 transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-650 shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold block">Recovered</span>
              <p className="text-base font-extrabold text-slate-900 mt-0.5">{formattedStats.recovered}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center space-x-4 relative overflow-hidden group hover:border-rose-200 transition-all duration-300">
            <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-650 shrink-0">
              <Skull className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold block">Total Deaths</span>
              <p className="text-base font-extrabold text-slate-900 mt-0.5">{formattedStats.deaths}</p>
            </div>
          </div>

        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-semibold text-slate-800">
            Historical Case Timeline
          </h3>
          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200/50 px-2 py-0.5 rounded-md">
            Last 120 Days
          </span>
        </div>
        
        <div className="h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRecovered" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDeaths" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              
              <XAxis
                dataKey="date"
                stroke="#94a3b8"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              
              <YAxis
                stroke="#94a3b8"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatYAxis}
                dx={-10}
              />
              
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} />
 
              <Area
                name="Confirmed"
                type="monotone"
                dataKey="cases"
                stroke="#4f46e5"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCases)"
              />
              <Area
                name="Recovered"
                type="monotone"
                dataKey="recovered"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRecovered)"
              />
              <Area
                name="Deaths"
                type="monotone"
                dataKey="deaths"
                stroke="#f43f5e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorDeaths)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
