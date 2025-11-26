import React from 'react';
import { AssetData, TrendAnalysis } from '../types';
import { formatNumber } from '../services/mockData';

interface TechTableProps {
  qqq: AssetData;
  spy: AssetData;
  qqqTrend: TrendAnalysis;
  spyTrend: TrendAnalysis;
}

const TechTable: React.FC<TechTableProps> = ({ qqq, spy, qqqTrend, spyTrend }) => {
  
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

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
      <div className="p-4 border-b border-slate-700 bg-slate-800/50">
        <h3 className="text-slate-100 font-bold text-lg">Technical Confirmation Matrix</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
              <th className="p-4 font-medium">Indicator</th>
              <th className="p-4 font-medium border-l border-slate-700">QQQ</th>
              <th className="p-4 font-medium border-l border-slate-700">SPY</th>
              <th className="p-4 font-medium hidden md:table-cell text-right">Criteria</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {/* SMA 50 */}
            <tr>
              <td className="p-4 text-slate-300 font-medium">Price vs SMA 50d</td>
              <td className="p-4 border-l border-slate-700">
                {renderCell('SMA50', qqqTrend.details.sma50, `${qqq.indicators.close} > ${qqq.indicators.sma50}`)}
              </td>
              <td className="p-4 border-l border-slate-700">
                {renderCell('SMA50', spyTrend.details.sma50, `${spy.indicators.close} > ${spy.indicators.sma50}`)}
              </td>
              <td className="p-4 hidden md:table-cell text-right text-xs text-slate-500">Bullish if Price &gt; SMA</td>
            </tr>

            {/* SMA 20 */}
            <tr>
              <td className="p-4 text-slate-300 font-medium">Price vs SMA 20d</td>
              <td className="p-4 border-l border-slate-700">
                {renderCell('SMA20', qqqTrend.details.sma20, `${qqq.indicators.close} ${qqqTrend.details.sma20 ? '>' : '<'} ${qqq.indicators.sma20}`)}
              </td>
              <td className="p-4 border-l border-slate-700">
                {renderCell('SMA20', spyTrend.details.sma20, `${spy.indicators.close} ${spyTrend.details.sma20 ? '>' : '<'} ${spy.indicators.sma20}`)}
              </td>
              <td className="p-4 hidden md:table-cell text-right text-xs text-slate-500">Short-term momentum</td>
            </tr>

            {/* Volume */}
            <tr>
              <td className="p-4 text-slate-300 font-medium">Volume Surge</td>
              <td className="p-4 border-l border-slate-700">
                {renderCell('Volume', qqqTrend.details.volume, `${formatNumber(qqq.indicators.volume)} (${(qqq.indicators.volume / qqq.indicators.avgVolume20).toFixed(2)}x)`)}
              </td>
              <td className="p-4 border-l border-slate-700">
                {renderCell('Volume', spyTrend.details.volume, `${formatNumber(spy.indicators.volume)} (${(spy.indicators.volume / spy.indicators.avgVolume20).toFixed(2)}x)`)}
              </td>
              <td className="p-4 hidden md:table-cell text-right text-xs text-slate-500">&gt; 1.1x Avg (Strong Conviction)</td>
            </tr>

            {/* RSI */}
            <tr>
              <td className="p-4 text-slate-300 font-medium">RSI (14)</td>
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
              <td className="p-4 hidden md:table-cell text-right text-xs text-slate-500">&gt;53 Bull, &lt;45 Bear</td>
            </tr>

             {/* MACD */}
             <tr>
              <td className="p-4 text-slate-300 font-medium">MACD Crossover</td>
              <td className="p-4 border-l border-slate-700">
                {renderCell('MACD', qqqTrend.details.macd, qqqTrend.details.macd ? 'Golden Cross' : 'Bear Cross')}
              </td>
              <td className="p-4 border-l border-slate-700">
                {renderCell('MACD', spyTrend.details.macd, spyTrend.details.macd ? 'Golden Cross' : 'Bear Cross')}
              </td>
              <td className="p-4 hidden md:table-cell text-right text-xs text-slate-500">Line &gt; Signal</td>
            </tr>

             {/* Bollinger */}
             <tr>
              <td className="p-4 text-slate-300 font-medium">Bollinger Position</td>
              <td className="p-4 border-l border-slate-700">
                <span className={qqqTrend.details.bollinger === 'ABOVE' ? 'text-emerald-400' : 'text-yellow-400'}>
                    {qqqTrend.details.bollinger === 'ABOVE' ? 'Above Mid' : 'Below Mid'}
                </span>
              </td>
              <td className="p-4 border-l border-slate-700">
                <span className={spyTrend.details.bollinger === 'ABOVE' ? 'text-emerald-400' : 'text-yellow-400'}>
                    {spyTrend.details.bollinger === 'ABOVE' ? 'Above Mid' : 'Below Mid'}
                </span>
              </td>
              <td className="p-4 hidden md:table-cell text-right text-xs text-slate-500">Above Middle Band</td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TechTable;