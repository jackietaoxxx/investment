import React from 'react';
import { MarketContextData } from '../types';

interface MarketContextProps {
  data: MarketContextData | null;
  loading: boolean;
}

const MarketContext: React.FC<MarketContextProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 animate-pulse">
        <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-slate-700 rounded w-5/6 mb-4"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-indigo-400 font-bold text-lg tracking-wide flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          当日市场背景速览 (AI Context)
        </h3>
        <span className="text-xs text-slate-500 border border-slate-700 px-2 py-1 rounded">Gemini 2.5 Flash</span>
      </div>
      
      <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6 font-light">
        {data.summary}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">今日核心驱动</h4>
          <ul className="space-y-2">
            {data.drivers.map((driver, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-indigo-500 mt-1">●</span>
                {driver}
              </li>
            ))}
          </ul>
        </div>

        <div>
           <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">情绪与关注</h4>
           <p className="text-sm text-slate-300 mb-3"><span className="text-yellow-400 font-bold">明日关注:</span> {data.watchList}</p>
           <div className="flex flex-wrap gap-2">
             {data.sentimentTags.map((item, idx) => (
               <span key={idx} className={`text-xs px-2 py-1 rounded border ${
                 item.sentiment === 'BULLISH' ? 'bg-emerald-900/30 border-emerald-500/30 text-emerald-400' :
                 item.sentiment === 'BEARISH' ? 'bg-red-900/30 border-red-500/30 text-red-400' :
                 'bg-slate-700/30 border-slate-600 text-slate-400'
               }`}>
                 {item.tag}
               </span>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default MarketContext;