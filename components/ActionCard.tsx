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
              <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded">激进 (Aggressive)</span>
              <p className="text-emerald-100 font-medium">条件满足。{leverageTicker} (杠杆做多) 可执行。</p>
            </div>
            <p className="text-slate-400 text-sm">建议止损位设在昨日低点或 SMA20 跌破处。</p>
          </>
        );
      case TrendStatus.REBOUND_UNCONFIRMED:
        return (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-yellow-500 text-slate-900 text-xs font-bold px-2 py-0.5 rounded">谨慎 (Caution)</span>
              <p className="text-yellow-100 font-medium">仅限现货 ({symbol})，轻仓使用 {leverageTicker}。</p>
            </div>
            <p className="text-slate-400 text-sm">量能或均线未完全确认，需防范假突破。</p>
          </>
        );
      case TrendStatus.FAKEOUT_BEARISH:
        return (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded">防守 (Defensive)</span>
              <p className="text-orange-100 font-medium">现金为王。建议观望或轻仓 {inverseTicker}。</p>
            </div>
            <p className="text-slate-400 text-sm">未能站稳关键均线或 RSI 过弱，风险较高。</p>
          </>
        );
      case TrendStatus.CONFIRMED_DOWNTREND:
        return (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">做空 (Short)</span>
              <p className="text-red-100 font-medium">趋势向下。{inverseTicker} (做空) 机会较大。</p>
            </div>
            <p className="text-slate-400 text-sm">虽然可能有超卖反弹，但主趋势依然向下。</p>
          </>
        );
    }
  };

  return (
    <div className="bg-slate-800 p-5 rounded-lg border border-slate-700 h-full">
      <h4 className="text-slate-200 font-bold mb-3 border-b border-slate-700 pb-2">
        {symbol} 今日操作指令
      </h4>
      {renderAdvice()}
    </div>
  );
};

export default ActionCard;