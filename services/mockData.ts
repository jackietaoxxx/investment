import { AssetData } from '../types';

// Helper to format large numbers
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  return num.toLocaleString();
};

export const getMockData = (): { qqq: AssetData; spy: AssetData } => {
  // Simulate QQQ Data (Slightly Bullish Scenario)
  const qqq: AssetData = {
    symbol: 'QQQ',
    name: 'Invesco QQQ Trust',
    indicators: {
      close: 608.89,
      changePercent: 0.62,
      sma50: 607.75,
      sma20: 612.93,
      volume: 56000000,
      avgVolume20: 61000000, // Volume not quite 1.1x
      rsi: 54.56,
      macd: {
        line: 1.5,
        signal: 1.4, // Just crossed up
        histogram: 0.1
      },
      bollinger: {
        upper: 620.00,
        middle: 605.00,
        lower: 590.00
      }
    },
    supportLevels: [602, 597],
    resistanceLevels: [610, 615]
  };

  // Simulate SPY Data (Stronger Bullish Scenario)
  const spy: AssetData = {
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF',
    indicators: {
      close: 675.02,
      changePercent: 0.94,
      sma50: 669.61,
      sma20: 673.11,
      volume: 80000000,
      avgVolume20: 83000000,
      rsi: 50.3,
      macd: {
        line: 2.2,
        signal: 2.0,
        histogram: 0.2
      },
      bollinger: {
        upper: 685.00,
        middle: 670.00,
        lower: 655.00
      }
    },
    supportLevels: [668, 660],
    resistanceLevels: [676, 680]
  };

  return { qqq, spy };
};