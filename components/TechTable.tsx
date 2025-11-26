import React from 'react';
import { AssetData, TrendAnalysis } from '../types';
import { formatNumber } from '../services/mockData';

interface TechTableProps {
  qqq: AssetData;
  spy: AssetData;
  qqqTrend: TrendAnalysis;
  spyTrend: TrendAnalysis;
  fearGreedIndex?: number; // From AI Market Context
}

const TechTable: React.FC<TechTableProps> = ({ qqq, spy, qqqTrend, spyTrend, fearGreedIndex }) => {
  
  // Helper for conditional styling of cells
  const renderCell = (label: string, isOk: boolean, valueDisplay: React.ReactNode, isNegativeBad = true) => {
    let colorClass = 'text-slate-400';
    if (isNegativeBad) {
        colorClass = isOk ? 'text-emerald-400 font-bold' : 'text-red-400';
    } else {
        // For neutral checks like Bollinger mid
        colorClass = isOk ? 'text-emerald-400 font-bold' : 'text-yellow-400';
    }

    return (
      <div className="flex flex-col text-sm">
        <span className={`${colorClass}`}>{valueDisplay}</span>
      </div>
    );
  };

  const getFearGreedLabel = (value: number | undefined) => {
    if (value === undefined) return { label: '加载中...', color: 'text-slate-500 animate-pulse' };
    if (value >= 75) return { label: '极度贪婪 (Extreme Greed)', color: 'text-emerald-400 font-bold' };
    if (value >= 56) return { label: '贪婪 (Greed)', color: 'text-emerald-400' };
    if (value >= 45) return { label: '中性 (Neutral)', color: 'text-yellow-400' };
    if (value >= 25) return { label: '恐慌 (Fear)', color: 'text-orange-400' };
    return { label: '极度恐慌 (Extreme Fear)', color: 'text-red-500 font-bold' };
  };

  const fgDisplay = getFearGreedLabel(fearGreedIndex);

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
      <div className="p-4 border-b border-slate-700 bg-slate-800/50">
        <h3 className="text-slate-100 font-bold text-lg">核心技术确认表 (Technical Matrix)</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 text-slate-400 text-xs font-bold tracking-wider">
              <th className="p-4">技术指标 (Indicator)</th>
              <th className="p-4 border-l border-slate-700">QQQ</th>
              <th className="p-4 border-l border-slate-700">SPY</th>
              <th className="p-4 hidden md:table-cell text-right">判断标准</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {/* SMA 50 */}
            <tr>
              <td className="p-4 text-slate-300 font-medium">收盘价 vs 50日均线</td>
              <td className="p-4 border-l border-slate-700">
                {renderCell('SMA50', qqqTrend.details.sma50, `${qqq.indicators.close} ${qqqTrend.details.sma50 ? '>' : '<'} ${qqq.indicators.sma50}`)}
              </td>
              <td className="p-4 border-l border-slate-700">
                {renderCell('SMA50', spyTrend.details.sma50, `${spy.indicators.close} ${spyTrend.details.sma50 ? '>' : '<'} ${spy.indicators.sma50}`)}
              </td>
              <td className="p-4 hidden md:table-cell text-right text-xs text-slate-500">价格 > 50日线 = 趋势向上</td>
            </tr>

            {/* SMA 20 */}
            <tr>
              <td className="p-4 text-slate-300 font-medium">收盘价 vs 20日均线</td>
              <td className="p-4 border-l border-slate-700">
                {renderCell('SMA20', qqqTrend.details.sma20, `${qqq.indicators.close} ${qqqTrend.details.sma20 ? '>' : '<'} ${qqq.indicators.sma20}`)}
              </td>
              <td className="p-4 border-l border-slate-700">
                {renderCell('SMA20', spyTrend.details.sma20, `${spy.indicators.close} ${spyTrend.details.sma20 ? '>' : '<'} ${spy.indicators.sma20}`)}
              </td>
              <td className="p-4 hidden md:table-cell text-right text-xs text-slate-500">短期动能确认</td>
            </tr>

            {/* Volume */}
            <tr>
              <td className="p-4 text-slate-300 font-medium">今日成交量 (vs 20日均量)</td>
              <td className="p-4 border-l border-slate-700">
                {renderCell('Volume', qqqTrend.details.volume, `${formatNumber(qqq.indicators.volume)} (${(qqq.indicators.volume / qqq.indicators.avgVolume20).toFixed(2)}倍)`)}
              </td>
              <td className="p-4 border-l border-slate-700">
                {renderCell('Volume', spyTrend.details.volume, `${formatNumber(spy.indicators.volume)} (${(spy.indicators.volume / spy.indicators.avgVolume20).toFixed(2)}倍)`)}
              </td>
              <td className="p-4 hidden md:table-cell text-right text-xs text-slate-500">&gt; 1.1倍均量 (放量确认)</td>
            </tr>

            {/* RSI */}
            <tr>
              <td className="p-4 text-slate-300 font-medium">RSI (14) 强弱指标</td>
              <td className="p-4 border-l border-slate-700">
                 <span className={
                    qqqTrend.details.rsi === 'BULL' ? 'text-emerald-400 font-bold' : 
                    qqqTrend.details.rsi === 'NEUTRAL' ? 'text-yellow-400' : 'text-red-400'
                 }>
                    {qqq.indicators.rsi}
                 </span>
              </td>
              <td className="p-4 border-l border-slate-700">
                <span className={
                    spyTrend.details.rsi === 'BULL' ? 'text-emerald-400 font-bold' : 
                    spyTrend.details.rsi === 'NEUTRAL' ? 'text-yellow-400' : 'text-red-400'
                 }>
                    {spy.indicators.rsi}
                 </span>
              </td>
              <td className="p-4 hidden md:table-cell text-right text-xs text-slate-500">&gt;53 强势, &lt;45 弱势</td>
            </tr>

             {/* MACD */}
             <tr>
              <td className="p-4 text-slate-300 font-medium">MACD 金叉/死叉</td>
              <td className="p-4 border-l border-slate-700">
                {renderCell('MACD', qqqTrend.details.macd, qqqTrend.details.macd ? '金叉 (Bullish)' : '死叉 (Bearish)')}
              </td>
              <td className="p-4 border-l border-slate-700">
                {renderCell('MACD', spyTrend.details.macd, spyTrend.details.macd ? '金叉 (Bullish)' : '死叉 (Bearish)')}
              </td>
              <td className="p-4 hidden md:table-cell text-right text-xs text-slate-500">快线 > 慢线</td>
            </tr>

             {/* Bollinger */}
             <tr>
              <td className="p-4 text-slate-300 font-medium">布林带位置</td>
              <td className="p-4 border-l border-slate-700">
                <span className={qqqTrend.details.bollinger === 'ABOVE' ? 'text-emerald-400' : 'text-yellow-400'}>
                    {qqqTrend.details.bollinger === 'ABOVE' ? '中轨上方' : '中轨下方'}
                </span>
              </td>
              <td className="p-4 border-l border-slate-700">
                <span className={spyTrend.details.bollinger === 'ABOVE' ? 'text-emerald-400' : 'text-yellow-400'}>
                    {spyTrend.details.bollinger === 'ABOVE' ? '中轨上方' : '中轨下方'}
                </span>
              </td>
              <td className="p-4 hidden md:table-cell text-right text-xs text-slate-500">位于中轨上方为佳</td>
            </tr>
            
            {/* Fear & Greed Index */}
            <tr className="bg-slate-900/20">
              <td className="p-4 text-slate-300 font-medium border-t border-slate-700">CNN Fear & Greed Index</td>
              {/* Combine cells since it's a market-wide metric */}
              <td className="p-4 border-l border-t border-slate-700" colSpan={2}>
                 <div className="flex flex-col items-center md:items-start">
                   <span className="text-white font-mono font-bold text-lg">{fearGreedIndex ?? '---'}</span>
                   <span className={`text-xs ${fgDisplay.color}`}>{fgDisplay.label}</span>
                 </div>
              </td>
              <td className="p-4 hidden md:table-cell text-right text-xs text-slate-500 border-t border-slate-700">市场情绪参考 (0-100)</td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TechTable;