import React from 'react';
import { TrendStatus, TrendAnalysis } from '../types';
import { getStatusBg, getStatusColor, getStatusLabel } from '../utils/analysis';

interface StatusBannerProps {
  symbol: string;
  trend: TrendAnalysis;
}

const StatusBanner: React.FC<StatusBannerProps> = ({ symbol, trend }) => {
  const bgClass = getStatusBg(trend.status);
  const textClass = getStatusColor(trend.status);
  const label = getStatusLabel(trend.status);

  // Determine brief action text based on status
  const getActionText = (status: TrendStatus) => {
    switch (status) {
      case TrendStatus.CONFIRMED_UPTREND: return "Leverage Longs (TQQQ/UPRO) Approved";
      case TrendStatus.REBOUND_UNCONFIRMED: return "Spot Only. Caution with Leverage.";
      case TrendStatus.FAKEOUT_BEARISH: return "Stay Cash or Light Short (SQQQ).";
      case TrendStatus.CONFIRMED_DOWNTREND: return "Shorts (SQQQ/SPXU) Favored.";
      default: return "Wait for clarity.";
    }
  };

  return (
    <div className={`p-6 rounded-xl border-2 ${bgClass} transition-all duration-300`}>
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-2xl font-black tracking-tighter text-white">{symbol}</h2>
        <div className="bg-slate-900/50 px-3 py-1 rounded text-xs font-mono text-slate-300">
           Score: <span className="text-white font-bold">{trend.score}</span>/10
        </div>
      </div>
      
      <div className={`text-xl md:text-2xl font-black uppercase tracking-tight mb-2 ${textClass}`}>
        {label}
      </div>
      
      <p className="text-slate-300 font-medium text-sm md:text-base border-t border-slate-600/30 pt-3 mt-1">
        Strategy: {getActionText(trend.status)}
      </p>
    </div>
  );
};

export default StatusBanner;