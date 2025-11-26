export enum TrendStatus {
  CONFIRMED_UPTREND = 'CONFIRMED_UPTREND',
  REBOUND_UNCONFIRMED = 'REBOUND_UNCONFIRMED',
  FAKEOUT_BEARISH = 'FAKEOUT_BEARISH',
  CONFIRMED_DOWNTREND = 'CONFIRMED_DOWNTREND',
}

export interface TechnicalIndicators {
  close: number;
  changePercent: number;
  sma50: number;
  sma20: number;
  volume: number;
  avgVolume20: number;
  rsi: number;
  macd: {
    line: number;
    signal: number;
    histogram: number;
  };
  bollinger: {
    upper: number;
    middle: number;
    lower: number;
  };
}

export interface PriceLevel {
  price: number;
  type: 'SUPPORT' | 'RESISTANCE';
  label: string; // e.g., "SMA 50", "Gap Fill", "Psychological"
  strength: 'STRONG' | 'MEDIUM' | 'WEAK';
}

export interface AssetData {
  symbol: string;
  name: string;
  indicators: TechnicalIndicators;
  levels: PriceLevel[];
}

export interface TrendAnalysis {
  score: number; // 0-10
  status: TrendStatus;
  details: {
    sma50: boolean; // Close > SMA50
    sma20: boolean; // Close > SMA20
    volume: boolean; // Volume > 1.1x Avg
    rsi: 'BULL' | 'NEUTRAL' | 'BEAR'; // >53, 45-53, <45
    macd: boolean; // Bullish cross
    bollinger: 'ABOVE' | 'AT' | 'BELOW'; // vs Middle band
  };
}

export interface LinkData {
  title: string;
  url: string;
}

export interface CryptoPrice {
  price: string;
  change: string;
}

export interface MarketContextData {
  summary: string;
  cryptoContext: string; // Analysis of BTC/ETH correlation
  cryptoPrices?: {
    btc: CryptoPrice;
    eth: CryptoPrice;
  };
  drivers: string[];
  watchList: string;
  calendar: string[]; // Upcoming events (FOMC, Earnings)
  sentimentTags: Array<{ tag: string; sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL' }>;
  links: LinkData[]; // Sources from search grounding
}