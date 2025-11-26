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

  const renderTickerItem = (label: string, price: number, change: number) => {
    const isUp = change >= 0;
    const colorClass = isUp ? 'text-emerald-400' : 'text-red-400';
    const sign = isUp ? '+' : '';

    return (
      <div className="flex flex-col items-end min-w-[120px]">
        <span className="text-slate-400 text-xs font-bold tracking-widest mb-0.5">{label}</span>
        <div className="flex items-baseline gap-2">
           <span className="text-xl font-mono font-bold text-white tracking-tight">
             {price.toFixed(2)}
           </span>
           <span className={`text-sm font-mono font-bold ${colorClass}`}>
             {sign}{change}%
           </span>
        </div>
      </div>
    );
  };

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
          {renderTickerItem('QQQ', qqq.indicators.close, qqq.indicators.changePercent)}
          
          <div className="w-px bg-slate-700 h-10"></div>
          
          {renderTickerItem('SPY', spy.indicators.close, spy.indicators.changePercent)}
          
          {dia && (
            <>
              <div className="w-px bg-slate-700 h-10"></div>
              {renderTickerItem('DIA', dia.indicators.close, dia.indicators.changePercent)}
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default Header;