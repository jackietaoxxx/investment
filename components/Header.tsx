import React, { useState, useEffect } from 'react';
import { AssetData } from '../types';

interface HeaderProps {
  qqq: AssetData;
  spy: AssetData;
  dia?: AssetData; // Optional to prevent breaking if not loaded immediately
}

const Header: React.FC<HeaderProps> = ({ qqq, spy, dia }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format to Chinese Date: 2025年11月26日 (周三)
      const dateStr = now.toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        weekday: 'short' 
      });
      setCurrentDate(`美东时间 ${dateStr}`);

      // Calculate time to 4:00 PM ET (16:00)
      const etNow = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
      const marketClose = new Date(etNow);
      marketClose.setHours(16, 0, 0, 0);

      if (etNow > marketClose) {
        setTimeLeft('已收盘');
      } else {
        const diff = marketClose.getTime() - etNow.getTime();
        const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        setTimeLeft(`距收盘还剩 ${hrs}小时 ${mins}分`);
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-slate-900 border-b border-slate-700 p-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Date & Timer */}
        <div className="text-center md:text-left">
          <div className="text-slate-400 text-sm font-medium uppercase tracking-wide mb-1">
            {currentDate}
          </div>
          <div className="text-white font-bold text-lg flex items-center gap-2 justify-center md:justify-start">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            {timeLeft}
          </div>
        </div>

        {/* Ticker Tape Look */}
        <div className="flex gap-6 md:gap-8 overflow-x-auto w-full md:w-auto justify-center md:justify-end">
          <div className="flex flex-col items-end min-w-[80px]">
            <span className="text-slate-400 text-xs font-bold tracking-widest">QQQ</span>
            <span className={`text-xl font-mono font-bold ${qqq.indicators.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {qqq.indicators.changePercent >= 0 ? '+' : ''}{qqq.indicators.changePercent}%
            </span>
          </div>
          <div className="w-px bg-slate-700 h-10"></div>
          <div className="flex flex-col items-end min-w-[80px]">
            <span className="text-slate-400 text-xs font-bold tracking-widest">SPY</span>
            <span className={`text-xl font-mono font-bold ${spy.indicators.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {spy.indicators.changePercent >= 0 ? '+' : ''}{spy.indicators.changePercent}%
            </span>
          </div>
          
          {dia && (
            <>
              <div className="w-px bg-slate-700 h-10"></div>
              <div className="flex flex-col items-end min-w-[80px]">
                <span className="text-slate-400 text-xs font-bold tracking-widest">DIA (道指)</span>
                <span className={`text-xl font-mono font-bold ${dia.indicators.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {dia.indicators.changePercent >= 0 ? '+' : ''}{dia.indicators.changePercent}%
                </span>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default Header;