import React from 'react';

const BacktestStats: React.FC = () => {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 opacity-75 hover:opacity-100 transition-opacity">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wide">历史回测 (过去180天)</h3>
        <span className="text-xs text-slate-500">历史表现 ≠ 未来收益</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-slate-500 border-b border-slate-700">
              <th className="pb-2 font-medium">信号类型</th>
              <th className="pb-2 font-medium">出现次数</th>
              <th className="pb-2 font-medium">次日平均收益</th>
              <th className="pb-2 font-medium text-right">最大回撤</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            <tr>
              <td className="py-2 text-emerald-400">确认上涨 (评分 &ge; 8.5)</td>
              <td className="py-2 text-slate-300">38</td>
              <td className="py-2 text-emerald-400 font-bold">+1.38%</td>
              <td className="py-2 text-right text-slate-400">-2.1%</td>
            </tr>
            <tr>
              <td className="py-2 text-yellow-400">反弹未确认 (评分 4.5 - 8.4)</td>
              <td className="py-2 text-slate-300">61</td>
              <td className="py-2 text-emerald-400/70">+0.41%</td>
              <td className="py-2 text-right text-slate-400">-3.8%</td>
            </tr>
            <tr>
              <td className="py-2 text-orange-400">假突破 / 回调 (评分 &lt; 4.5)</td>
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