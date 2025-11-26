import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import StatusBanner from './components/StatusBanner';
import TechTable from './components/TechTable';
import ActionCard from './components/ActionCard';
import LevelsCard from './components/LevelsCard';
import MarketContext from './components/MarketContext';
import BacktestStats from './components/BacktestStats';
import { getMockData } from './services/mockData';
import { analyzeTrend } from './utils/analysis';
import { fetchMarketContext } from './services/geminiService';
import { AssetData, TrendAnalysis, MarketContextData } from './types';

const App: React.FC = () => {
  const [qqq, setQqq] = useState<AssetData | null>(null);
  const [spy, setSpy] = useState<AssetData | null>(null);
  const [dia, setDia] = useState<AssetData | null>(null);
  const [qqqTrend, setQqqTrend] = useState<TrendAnalysis | null>(null);
  const [spyTrend, setSpyTrend] = useState<TrendAnalysis | null>(null);
  const [marketContext, setMarketContext] = useState<MarketContextData | null>(null);
  const [loadingContext, setLoadingContext] = useState(false);

  useEffect(() => {
    // 1. Fetch Market Data (Mock for demo, but structure allows real API replacement)
    const { qqq: qqqData, spy: spyData, dia: diaData } = getMockData();
    setQqq(qqqData);
    setSpy(spyData);
    setDia(diaData);

    // 2. Analyze Trends
    const qAnalysis = analyzeTrend(qqqData);
    const sAnalysis = analyzeTrend(spyData);
    setQqqTrend(qAnalysis);
    setSpyTrend(sAnalysis);

    // 3. Get AI Context
    // We only fetch this once on mount or explicitly requested to save tokens/quota
    const getContext = async () => {
      setLoadingContext(true);
      const context = await fetchMarketContext(qqqData, spyData, qAnalysis, sAnalysis);
      setMarketContext(context);
      setLoadingContext(false);
    };

    getContext();
  }, []);

  if (!qqq || !spy || !dia || !qqqTrend || !spyTrend) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400">正在加载市场数据...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <Header qqq={qqq} spy={spy} dia={dia} />

      <main className="max-w-5xl mx-auto px-4 pt-8 space-y-8">
        
        {/* Main Status Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatusBanner symbol="QQQ" trend={qqqTrend} />
          <StatusBanner symbol="SPY" trend={spyTrend} />
        </div>

        {/* Actionable Advice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ActionCard 
            symbol="QQQ" 
            trend={qqqTrend} 
            leverageTicker="TQQQ" 
            inverseTicker="SQQQ" 
          />
          <ActionCard 
            symbol="SPY" 
            trend={spyTrend} 
            leverageTicker="UPRO" 
            inverseTicker="SPXU" 
          />
        </div>

        {/* Technical Table */}
        <TechTable 
          qqq={qqq} 
          spy={spy} 
          qqqTrend={qqqTrend} 
          spyTrend={spyTrend} 
        />

        {/* Market Context & Levels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <MarketContext data={marketContext} loading={loadingContext} />
            <LevelsCard qqq={qqq} spy={spy} />
          </div>
          <div className="lg:col-span-1">
             <BacktestStats />
             <div className="mt-4 p-4 rounded-lg bg-slate-800/50 border border-slate-800 text-xs text-slate-500 text-center">
               <p>数据可能延迟 15 分钟。</p>
               <p className="mt-1">本页面仅供参考，不构成投资建议。</p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;