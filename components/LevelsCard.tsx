import React from 'react';
import { AssetData, PriceLevel } from '../types';

interface LevelsCardProps {
  qqq: AssetData;
  spy: AssetData;
}

const LevelRow: React.FC<{ level: PriceLevel }> = ({ level }) => {
  const isRes = level.type === 'RESISTANCE';
  const colorClass = isRes ? 'text-red-400' : 'text-emerald-400';
  const bgClass = isRes ? 'bg-red-900/10 border-red-900/20' : 'bg-emerald-900/10 border-emerald-900/20';
  
  return (
    <div className={`flex items-center justify-between p-2 rounded border ${bgClass} mb-1`}>
      <div className="flex flex-col">
        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wide leading-none mb-0.5">
          {level.label}
        </span>
        <span className={`text-sm font-mono font-bold leading-tight ${colorClass}`}>
          {level.price.toFixed(2)}
        </span>
      </div>
      <div className="text-right">
        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
            level.strength === 'STRONG' ? 'bg-slate-700 text-white border border-slate-600' : 
            'bg-slate-800 text-slate-500 border border-slate-700'
        }`}>
            {level.strength === 'STRONG' ? '强' : (level.strength === 'MEDIUM' ? '中' : '弱')}
        </span>
      </div>
    </div>
  );
};

const AssetLevels: React.FC<{ asset: AssetData }> = ({ asset }) => {
    // Sort Resistance ascending (nearest first), Support descending (nearest first)
    const resistance = asset.levels.filter(l => l.type === 'RESISTANCE').sort((a, b) => a.price - b.price);
    const support = asset.levels.filter(l => l.type === 'SUPPORT').sort((a, b) => b.price - a.price);

    return (
        <div className="space-y-2">
             <div className="flex justify-between items-end border-b border-slate-700 pb-1 mb-2">
                <span className="text-lg font-bold text-white leading-none">{asset.symbol}</span>
                <span className="text-slate-400 font-mono text-xs">现价: {asset.indicators.close}</span>
            </div>

            <div className="space-y-0.5">
                <div className="flex justify-between items-center mb-1">
                   <h4 className="text-[10px] text-red-400 font-bold uppercase">阻力 (Res)</h4>
                </div>
                {resistance.length > 0 ? resistance.map((l, i) => <LevelRow key={i} level={l} />) : <div className="text-slate-600 text-xs py-1">暂无数据</div>}
            </div>

            <div className="relative h-3 w-full flex items-center justify-center my-1.5">
                <div className="h-px bg-slate-700 w-full absolute"></div>
                <span className="bg-slate-800 px-2 text-[10px] text-slate-500 z-10 font-mono">CURRENT PRICE</span>
            </div>

            <div className="space-y-0.5">
                <div className="flex justify-between items-center mb-1">
                    <h4 className="text-[10px] text-emerald-400 font-bold uppercase">支撑 (Supp)</h4>
                </div>
                {support.length > 0 ? support.map((l, i) => <LevelRow key={i} level={l} />) : <div className="text-slate-600 text-xs py-1">暂无数据</div>}
            </div>
        </div>
    );
};

const LevelsCard: React.FC<LevelsCardProps> = ({ qqq, spy }) => {
  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
      <h3 className="text-slate-100 font-bold text-base mb-4 flex items-center gap-2">
        <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        关键点位详情 (Key Levels)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AssetLevels asset={qqq} />
        <AssetLevels asset={spy} />
      </div>
    </div>
  );
};

export default LevelsCard;