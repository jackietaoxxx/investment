import { AssetData, TrendAnalysis, TrendStatus } from '../types';

export const analyzeTrend = (asset: AssetData): TrendAnalysis => {
  const { indicators } = asset;
  let score = 0;
  
  // 1. SMA 50 Logic (+2 points)
  const sma50Ok = indicators.close > indicators.sma50;
  if (sma50Ok) score += 2;

  // 2. SMA 20 Logic (+2 points)
  const sma20Ok = indicators.close > indicators.sma20;
  if (sma20Ok) score += 2;

  // 3. Volume Logic (+2 points)
  // PRD: Volume >= 20 Day Avg * 1.1
  const volumeOk = indicators.volume >= (indicators.avgVolume20 * 1.1);
  if (volumeOk) score += 2;

  // 4. RSI Logic (+2 points max)
  // PRD: Green > 53, Yellow 45-53, Red < 45
  let rsiStatus: 'BULL' | 'NEUTRAL' | 'BEAR' = 'NEUTRAL';
  if (indicators.rsi >= 53) {
    score += 2;
    rsiStatus = 'BULL';
  } else if (indicators.rsi >= 45) {
    score += 0.5; // Partial credit
    rsiStatus = 'NEUTRAL';
  } else {
    rsiStatus = 'BEAR';
  }

  // 5. MACD Logic (+1 point)
  const macdOk = indicators.macd.line > indicators.macd.signal;
  if (macdOk) score += 1;

  // 6. Bollinger Logic (+1 point)
  let bbStatus: 'ABOVE' | 'AT' | 'BELOW' = 'AT';
  if (indicators.close > indicators.bollinger.middle) {
    score += 1;
    bbStatus = 'ABOVE';
  } else {
    bbStatus = 'BELOW';
  }

  // Determine Status based on rules
  let status = TrendStatus.REBOUND_UNCONFIRMED;

  // Rule: Confirmed Uptrend (Score >= 8 or specifically satisfying the strict conditions)
  // PRD Strict: SMA50 & SMA20 & Vol & RSI>53 & MACD & BB -> Ideally 10/10, but let's say >= 8 is strong
  if (score >= 8.5) {
    status = TrendStatus.CONFIRMED_UPTREND;
  } else if (score >= 4.5) {
    status = TrendStatus.REBOUND_UNCONFIRMED;
  } else if (indicators.close < indicators.sma50 || (indicators.volume < indicators.avgVolume20 && indicators.rsi < 45)) {
    status = TrendStatus.FAKEOUT_BEARISH;
  } else {
    status = TrendStatus.CONFIRMED_DOWNTREND;
  }

  return {
    score: Math.min(10, parseFloat(score.toFixed(1))),
    status,
    details: {
      sma50: sma50Ok,
      sma20: sma20Ok,
      volume: volumeOk,
      rsi: rsiStatus,
      macd: macdOk,
      bollinger: bbStatus
    }
  };
};

export const getStatusColor = (status: TrendStatus): string => {
  switch (status) {
    case TrendStatus.CONFIRMED_UPTREND: return 'text-emerald-400';
    case TrendStatus.REBOUND_UNCONFIRMED: return 'text-yellow-400';
    case TrendStatus.FAKEOUT_BEARISH: return 'text-orange-400';
    case TrendStatus.CONFIRMED_DOWNTREND: return 'text-red-500';
    default: return 'text-gray-400';
  }
};

export const getStatusBg = (status: TrendStatus): string => {
  switch (status) {
    case TrendStatus.CONFIRMED_UPTREND: return 'bg-emerald-500/10 border-emerald-500/50';
    case TrendStatus.REBOUND_UNCONFIRMED: return 'bg-yellow-500/10 border-yellow-500/50';
    case TrendStatus.FAKEOUT_BEARISH: return 'bg-orange-500/10 border-orange-500/50';
    case TrendStatus.CONFIRMED_DOWNTREND: return 'bg-red-900/20 border-red-500/50';
    default: return 'bg-gray-800 border-gray-700';
  }
};

export const getStatusLabel = (status: TrendStatus): string => {
  switch (status) {
    case TrendStatus.CONFIRMED_UPTREND: return 'CONFIRMED UPTREND';
    case TrendStatus.REBOUND_UNCONFIRMED: return 'REBOUND (UNCONFIRMED)';
    case TrendStatus.FAKEOUT_BEARISH: return 'FAKEOUT / BEARISH';
    case TrendStatus.CONFIRMED_DOWNTREND: return 'CONFIRMED DOWNTREND';
    default: return 'NEUTRAL';
  }
};