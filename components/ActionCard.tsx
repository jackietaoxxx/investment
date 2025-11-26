import React from 'react';
import { TrendAnalysis, TrendStatus } from '../types';

interface ActionCardProps {
  symbol: string;
  trend: TrendAnalysis;
  leverageTicker: string;
  inverseTicker: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ symbol, trend, leverageTicker, inverseTicker }) => {
  
  const renderAdvice = () => {
    switch (trend.status) {
      case TrendStatus.CONFIRMED_UPTREND:
        return (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded">AGGRESSIVE</span>
              <p className="text-emerald-100 font-medium">Conditions met. {leverageTicker} (Leverage Long) is actionable.</p>
            </div>
            <p className="text-slate-400 text-sm">Stop loss suggested at previous day low or SMA20 breach.</p>
          </>
        );
      case TrendStatus.REBOUND_UNCONFIRMED:
        return (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-yellow-500 text-slate-900 text-xs font-bold px-2 py-0.5 rounded">CAUTION</span>
              <p className="text-yellow-100 font-medium">Use Spot ({symbol}) or very light {leverageTicker}.</p>
            </div>
            <p className="text-slate-400 text-sm">Missing volume or SMA validation. High risk of whip-saw.</p>
          </>
        );
      case TrendStatus.FAKEOUT_BEARISH:
        return (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded">DEFENSIVE</span>
              <p className="text-orange-100 font-medium">Cash is king. Consider light {inverseTicker}.</p>
            </div>
            <p className="text-slate-400 text-sm">Failed to hold key moving averages or RSI is weak.</p>
          </>
        );
      case TrendStatus.CONFIRMED_DOWNTREND:
        return (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">SHORT</span>
              <p className="text-red-100 font-medium">Trend is down. {inverseTicker} is actionable.</p>
            </div>
            <p className="text-slate-400 text-sm">RSI oversold bounces possible, but primary trend is down.</p>
          </>
        );
    }
  };

  return (
    <div className="bg-slate-800 p-5 rounded-lg border border-slate-700 h-full">
      <h4 className="text-slate-200 font-bold mb-3 border-b border-slate-700 pb-2">
        {symbol} Action Plan
      </h4>
      {renderAdvice()}
    </div>
  );
};

export default ActionCard;