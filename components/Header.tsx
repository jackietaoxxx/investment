import React, { useState, useEffect } from 'react';
import { AssetData } from '../types';

interface HeaderProps {
  qqq: AssetData;
  spy: AssetData;
  dia?: AssetData;
}

const Header: React.FC<HeaderProps> = ({ qqq, spy, dia }) => {
  const [timeDisplay, setTimeDisplay] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isMarketOpen, setIsMarketOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      // 1. Format Date (Chinese)
      // Use "America/New_York" to ensure the date is correct for the market
      const dateStr = now.toLocaleDateString('zh-CN', { 
        timeZone: "America/New_York",
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        weekday: 'short' 
      });
      setCurrentDate(`美东时间 ${dateStr}`);

      // 2. Get Specific ET Time (HH:MM:SS)
      const etTimeStr = now.toLocaleTimeString('en-US', {
        timeZone: "America/New_York",
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      // 3. Market Status Logic
      // Create a Date object that represents the current time in ET
      // Note: We create a date string in ET, then parse it. This date object will have local timezone offset 
      // but the component values (hour, min) match ET.
      const etDate = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
      
      const marketOpen = new Date(etDate);
      marketOpen.setHours(9, 30, 0, 0);
      
      const marketClose = new Date(etDate);
      marketClose.setHours(16, 0, 0, 0);

      let statusText = '';
      let isOpen = false;

      // Check strictly against hours
      if (etDate < marketOpen) {
        // Pre-market / Morning
        const diff = marketOpen.getTime() - etDate.getTime();
        const hrs = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        statusText = `距开盘 ${hrs}小时 ${mins}分`;
        isOpen = false;
      } else if (etDate >= marketOpen && etDate < marketClose) {
        // Market Open
        const diff = marketClose.getTime() - etDate.getTime();
        const hrs = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        statusText = `距收盘 ${hrs}小时 ${mins}分`;
        isOpen = true;
      } else {
        // After Close
        // Calculate time to next open (approximate for next day 9:30)
        const tomorrowOpen = new Date(marketOpen);
        tomorrowOpen.setDate(tomorrowOpen.getDate() + 1);
        
        // Simple weekend handling (Fri -> Mon)
        // If current ET day is Friday (5), next open is Monday (add 3 days total from today, or logic below)
        const day = etDate.getDay();
        if (day === 5) tomorrowOpen.setDate(tomorrowOpen.getDate() + 2); // Fri -> Mon
        if (day === 6) tomorrowOpen.setDate(tomorrowOpen.getDate() + 1); // Sat -> Mon

        const diff = tomorrowOpen.getTime() - etDate.getTime();
        const hrs = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff / (1000 * 60)) % 60);

        statusText = `已收盘 (距开盘 ${hrs}小时 ${mins}分)`;
        isOpen = false;
      }

      setTimeDisplay(`${etTimeStr} | ${statusText}`);
      setIsMarketOpen(isOpen);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000); // Update every second
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
          <div className="text-white font-bold text-lg flex items-center gap-2 justify-center md:justify-start font-mono">
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isMarketOpen ? 'bg-emerald-400' : 'bg-orange-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isMarketOpen ? 'bg-emerald-500' : 'bg-orange-500'}`}></span>
            </span>
            {timeDisplay}
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