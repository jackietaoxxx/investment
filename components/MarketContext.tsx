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

  const getPriceColor = (change: string) => {
    if (change.includes('+')) return 'text-emerald-400';
    if (change.includes('-')) return 'text-red-400';
    return 'text-slate-200';
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4 border-b border-slate-700/50 pb-4">
        <h3 className="text-indigo-400 font-bold text-lg tracking-wide flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          当日市场背景 (AI Context)
        </h3>
        <span className="text-xs text-slate-500 border border-slate-700 px-2 py-1 rounded">Powered by Gemini + Google Search</span>
      </div>
      
      {/* Main Summary */}
      <div className="mb-6">
        <p className="text-slate-200 text-base font-medium leading-relaxed">
            {data.summary}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Drivers & Crypto */}
        <div className="space-y-6">
            <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                    今日核心驱动 (Drivers)
                </h4>
                <ul className="space-y-2">
                    {data.drivers.map((driver, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="text-indigo-500 mt-1">●</span>
                        {driver}
                    </li>
                    ))}
                </ul>
            </div>

            <div className="bg-indigo-900/10 p-4 rounded border border-indigo-500/20">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                     <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    加密市场联动 (Crypto)
                </h4>
                
                {/* Crypto Prices */}
                {data.cryptoPrices && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-500 text-xs font-bold">BTC</span>
                      <div className="flex items-end gap-2">
                        <span className="text-white font-mono font-bold">{data.cryptoPrices.btc.price}</span>
                        <span className={`text-xs ${getPriceColor(data.cryptoPrices.btc.change)}`}>
                          {data.cryptoPrices.btc.change}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs font-bold">ETH</span>
                      <div className="flex items-end gap-2">
                        <span className="text-white font-mono font-bold">{data.cryptoPrices.eth.price}</span>
                        <span className={`text-xs ${getPriceColor(data.cryptoPrices.eth.change)}`}>
                          {data.cryptoPrices.eth.change}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
            </div>
        </div>

        {/* Right Column: Calendar & Watchlist */}
        <div className="space-y-6">
           <div>
               <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">后续重要日程 (Calendar)</h4>
               <ul className="space-y-2">
                    {data.calendar && data.calendar.length > 0 ? data.calendar.map((event, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                            <span className="text-slate-500 text-[10px] bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">EVENT</span>
                            {event}
                        </li>
                    )) : <li className="text-slate-500 text-sm">暂无重大日程</li>}
               </ul>
           </div>

           <div>
               <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">明日关注 & 情绪</h4>
               <p className="text-sm text-slate-300 mb-3 border-l-2 border-yellow-500 pl-2">
                 {data.watchList}
               </p>
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

      {/* Footer Sources */}
      {data.links && data.links.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-700/50">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">参考来源 (Sources)</h4>
              <div className="flex flex-wrap gap-3">
                  {data.links.map((link, idx) => (
                      <a 
                        key={idx} 
                        href={link.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline truncate max-w-[250px] flex items-center gap-1"
                      >
                          <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                          {link.title || link.url}
                      </a>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
};

export default MarketContext;