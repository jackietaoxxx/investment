import React from 'react';
import { AssetData } from '../types';

interface LevelsCardProps {
  qqq: AssetData;
  spy: AssetData;
}

const LevelsCard: React.FC<LevelsCardProps> = ({ qqq, spy }) => {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <h3 className="text-slate-100 font-bold text-lg mb-4">关键支撑/阻力位 (Key Levels)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* QQQ Levels */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-emerald-400 font-bold text-lg">QQQ</span>
            <span className="text-slate-500 text-xs">现价: {qqq.indicators.close}</span>
          </div>
          <div className="space-y-2">
             <div className="flex justify-between text-sm">
                <span className="text-red-300 font-medium">阻力位 (Resistance)</span>
                <span className="text-slate-300">{qqq.resistanceLevels.join(' / ')}</span>
             </div>
             <div className="w-full h-1 bg-slate-700 rounded relative">
                <div className="absolute top-0 bottom-0 bg-slate-500 w-1" style={{ left: '50%' }}></div>
             </div>
             <div className="flex justify-between text-sm">
                <span className="text-emerald-300 font-medium">支撑位 (Support)</span>
                <span className="text-slate-300">{qqq.supportLevels.join(' / ')}</span>
             </div>
          </div>
        </div>

        {/* SPY Levels */}
        <div>
          <div className="flex justify-between items-center mb-2">
             <span className="text-emerald-400 font-bold text-lg">SPY</span>
             <span className="text-slate-500 text-xs">现价: {spy.indicators.close}</span>
          </div>
          <div className="space-y-2">
             <div className="flex justify-between text-sm">
                <span className="text-red-300 font-medium">阻力位 (Resistance)</span>
                <span className="text-slate-300">{spy.resistanceLevels.join(' / ')}</span>
             </div>
             <div className="w-full h-1 bg-slate-700 rounded relative">
                <div className="absolute top-0 bottom-0 bg-slate-500 w-1" style={{ left: '50%' }}></div>
             </div>
             <div className="flex justify-between text-sm">
                <span className="text-emerald-300 font-medium">支撑位 (Support)</span>
                <span className="text-slate-300">{spy.supportLevels.join(' / ')}</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LevelsCard;