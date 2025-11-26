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

  // Determine brief action text based on status in Chinese
  const getActionText = (status: TrendStatus) => {
    switch (status) {
      case TrendStatus.CONFIRMED_UPTREND: return `可大胆使用 T${symbol === 'QQQ' ? 'QQQ' : symbol === 'SPY' ? 'UPRO' : 'QQQ'} (杠杆做多)`;
      case TrendStatus.REBOUND_UNCONFIRMED: return `可用现货，轻仓 T${symbol === 'QQQ' ? 'QQQ' : symbol === 'SPY' ? 'UPRO' : 'QQQ'}`;
      case TrendStatus.FAKEOUT_BEARISH: return `建议观望或轻仓 S${symbol === 'QQQ' ? 'QQQ' : symbol === 'SPY' ? 'PXU' : 'QQQ'} (防守)`;
      case TrendStatus.CONFIRMED_DOWNTREND: return `趋势向下，可考虑 S${symbol === 'QQQ' ? 'QQQ' : symbol === 'SPY' ? 'PXU' : 'QQQ'} 多头`;
      default: return "等待信号明确";
    }
  };

  return (
    <div className={`p-6 rounded-xl border-2 ${bgClass} transition-all duration-300`}>
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-2xl font-black tracking-tighter text-white">{symbol}</h2>
        <div className="bg-slate-900/50 px-3 py-1 rounded text-xs font-mono text-slate-300">
           综合评分: <span className="text-white font-bold">{trend.score}</span>/10
        </div>
      </div>
      
      <div className={`text-xl md:text-2xl font-black tracking-tight mb-2 ${textClass}`}>
        {label}
      </div>
      
      <p className="text-slate-300 font-medium text-sm md:text-base border-t border-slate-600/30 pt-3 mt-1">
        操作建议：{getActionText(trend.status)}
      </p>
    </div>
  );
};

export default StatusBanner;