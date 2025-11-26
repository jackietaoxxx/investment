import React from 'react';

const BacktestStats: React.FC = () => {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 opacity-75 hover:opacity-100 transition-opacity">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wide">Backtest (Last 180 Days)</h3>
        <span className="text-xs text-slate-500">Historical performance != Future results</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-slate-500 border-b border-slate-700">
              <th className="pb-2 font-medium">Signal Type</th>
              <th className="pb-2 font-medium">Occurrences</th>
              <th className="pb-2 font-medium">Next Day Avg</th>
              <th className="pb-2 font-medium text-right">Max Drawdown</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            <tr>
              <td className="py-2 text-emerald-400">Confirmed Uptrend (Score &ge; 8)</td>
              <td className="py-2 text-slate-300">38</td>
              <td className="py-2 text-emerald-400 font-bold">+1.38%</td>
              <td className="py-2 text-right text-slate-400">-2.1%</td>
            </tr>
            <tr>
              <td className="py-2 text-yellow-400">Rebound (Unconfirmed)</td>
              <td className="py-2 text-slate-300">61</td>
              <td className="py-2 text-emerald-400/70">+0.41%</td>
              <td className="py-2 text-right text-slate-400">-3.8%</td>
            </tr>
            <tr>
              <td className="py-2 text-orange-400">Fakeout / Whipsaw</td>
              <td className="py-2 text-slate-300">29</td>
              <td className="py-2 text-red-400">-1.12%</td>
              <td className="py-2 text-right text-slate-400">-5.6%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BacktestStats;