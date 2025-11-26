import { AssetData } from '../types';

// Helper to format large numbers
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  return num.toLocaleString();
};

export const getMockData = (): { qqq: AssetData; spy: AssetData; dia: AssetData } => {
  // Simulate QQQ Data
  const qqq: AssetData = {
    symbol: 'QQQ',
    name: 'Invesco QQQ Trust',
    indicators: {
      close: 608.89,
      changePercent: 0.62,
      sma50: 607.75,
      sma20: 612.93,
      volume: 56000000,
      avgVolume20: 61000000,
      rsi: 54.56,
      macd: {
        line: 1.5,
        signal: 1.4,
        histogram: 0.1
      },
      bollinger: {
        upper: 620.00,
        middle: 605.00,
        lower: 590.00
      }
    },
    levels: [
      { price: 612.93, type: 'RESISTANCE', label: '20日均线 (SMA20)', strength: 'STRONG' },
      { price: 610.00, type: 'RESISTANCE', label: '整数心理关口', strength: 'WEAK' },
      { price: 602.00, type: 'SUPPORT', label: '前期缺口支撑', strength: 'MEDIUM' },
      { price: 590.00, type: 'SUPPORT', label: '布林带下轨支撑', strength: 'STRONG' }
    ]
  };

  // Simulate SPY Data
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
    levels: [
        { price: 680.00, type: 'RESISTANCE', label: '历史前高 (ATH)', strength: 'STRONG' },
        { price: 676.00, type: 'RESISTANCE', label: '日内高点', strength: 'WEAK' },
        { price: 669.61, type: 'SUPPORT', label: '50日均线 (SMA50)', strength: 'STRONG' },
        { price: 660.00, type: 'SUPPORT', label: '周线支撑', strength: 'MEDIUM' }
    ]
  };

  // Simulate DIA Data
  const dia: AssetData = {
    symbol: 'DIA',
    name: 'SPDR Dow Jones Industrial Average ETF',
    indicators: {
      close: 447.20,
      changePercent: 0.45,
      sma50: 440.00,
      sma20: 445.00,
      volume: 4000000,
      avgVolume20: 4500000,
      rsi: 58.2,
      macd: { line: 0.5, signal: 0.4, histogram: 0.1 },
      bollinger: { upper: 450, middle: 445, lower: 440 }
    },
    levels: []
  };

  return { qqq, spy, dia };
};