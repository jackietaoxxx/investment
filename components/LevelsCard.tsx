import React from 'react';
import { AssetData, PriceLevel } from '../types';

interface LevelsCardProps {
  qqq: AssetData;
  spy: AssetData;
}

const LevelRow: React.FC<{ level: PriceLevel }> = ({ level }) => {
  const isRes = level.type === 'RESISTANCE';
  const colorClass = isRes ? 'text-red-400' : 'text-emerald-400';
  const bgClass = isRes ? 'bg-red-900/20 border-red-900/30' : 'bg-emerald-900/20 border-emerald-900/30';
  
  return (
    <div className={`flex items-center justify-between p-3 rounded border ${bgClass} mb-2`}>
      <div className="flex flex-col">
        <span className="text-slate-500 text-xs font-bold uppercase tracking-wide">
          {level.label}
        </span>
        <span className={`text-lg font-mono font-bold ${colorClass}`}>
          {level.price.toFixed(2)}
        </span>
      </div>
      <div className="text-right">
        <span className={`text-xs px-2 py-1 rounded font-bold ${
            level.strength === 'STRONG' ? 'bg-slate-700 text-white border border-slate-500' : 
            'bg-slate-800 text-slate-400 border border-slate-700'
        }`}>
            {level.strength === 'STRONG' ? '强支撑/阻力' : (level.strength === 'MEDIUM' ? '中等' : '弱')}
        </span>
        <div className="text-[10px] text-slate-500 mt-1">
            {isRes ? '阻力 (Sell)' : '支撑 (Buy)'}
        </div>
      </div>
    </div>
  );
};

const AssetLevels: React.FC<{ asset: AssetData }> = ({ asset }) => {
    // Sort Resistance ascending (nearest first), Support descending (nearest first)
    const resistance = asset.levels.filter(l => l.type === 'RESISTANCE').sort((a, b) => a.price - b.price);
    const support = asset.levels.filter(l => l.type === 'SUPPORT').sort((a, b) => b.price - a.price);

    return (
        <div className="space-y-4">
             <div className="flex justify-between items-end border-b border-slate-700 pb-2">
                <span className="text-xl font-bold text-white">{asset.symbol}</span>
                <span className="text-slate-400 font-mono text-sm">现价: {asset.indicators.close}</span>
            </div>

            <div className="space-y-1">
                <h4 className="text-xs text-red-400 font-bold mb-2">上方阻力 (Resistance)</h4>
                {resistance.length > 0 ? resistance.map((l, i) => <LevelRow key={i} level={l} />) : <div className="text-slate-600 text-sm">暂无数据</div>}
            </div>

            <div className="relative h-4 w-full flex items-center justify-center my-2">
                <div className="h-px bg-slate-700 w-full absolute"></div>
                <span className="bg-slate-800 px-2 text-[10px] text-slate-500 z-10">CURRENT PRICE</span>
            </div>

            <div className="space-y-1">
                <h4 className="text-xs text-emerald-400 font-bold mb-2">下方支撑 (Support)</h4>
                {support.length > 0 ? support.map((l, i) => <LevelRow key={i} level={l} />) : <div className="text-slate-600 text-sm">暂无数据</div>}
            </div>
        </div>
    );
};

const LevelsCard: React.FC<LevelsCardProps> = ({ qqq, spy }) => {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 h-full">
      <h3 className="text-slate-100 font-bold text-lg mb-6 flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        关键点位详情 (Key Levels)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AssetLevels asset={qqq} />
        <AssetLevels asset={spy} />
      </div>
    </div>
  );
};

export default LevelsCard;