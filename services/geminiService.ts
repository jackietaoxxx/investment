import { GoogleGenAI, Type } from "@google/genai";
import { MarketContextData, AssetData, TrendAnalysis } from "../types";
import { getStatusLabel } from "../utils/analysis";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables. Gemini features will use fallback mock data.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const fetchMarketContext = async (
  qqq: AssetData, 
  spy: AssetData,
  qqqTrend: TrendAnalysis,
  spyTrend: TrendAnalysis
): Promise<MarketContextData> => {
  const client = getClient();
  
  // Fallback data if no API key
  const fallbackData: MarketContextData = {
    summary: "Markets are showing resilience with retail sales exceeding expectations. Volatility is contracting as VIX drops below 16.",
    drivers: ["Strong Retail Sales data", "VIX Pullback", "Tech sector rotation"],
    watchList: "PPI Data tomorrow at 8:30 AM ET + Upcoming Market Holiday",
    sentimentTags: [
      { tag: "#QQQGoldenCross", sentiment: "BULLISH" },
      { tag: "#LowVolumeConsolidation", sentiment: "NEUTRAL" }
    ]
  };

  if (!client) return fallbackData;

  const prompt = `
    Analyze the following stock market data for QQQ and SPY to provide a daily market context summary for traders.
    
    Data:
    QQQ: Close ${qqq.indicators.close}, Change ${qqq.indicators.changePercent}%, Trend: ${getStatusLabel(qqqTrend.status)}, Score: ${qqqTrend.score}/10.
    SPY: Close ${spy.indicators.close}, Change ${spy.indicators.changePercent}%, Trend: ${getStatusLabel(spyTrend.status)}, Score: ${spyTrend.score}/10.
    
    Current Date: ${new Date().toLocaleDateString()}.
    
    Generate a JSON response with:
    1. A short summary (max 2 sentences) of the market background.
    2. A list of 3 key market drivers (e.g. macro events, sector moves).
    3. What to watch tomorrow (1 short sentence).
    4. 2-3 trending sentiment hashtags with sentiment (BULLISH, BEARISH, NEUTRAL).
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            drivers: { type: Type.ARRAY, items: { type: Type.STRING } },
            watchList: { type: Type.STRING },
            sentimentTags: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  tag: { type: Type.STRING },
                  sentiment: { type: Type.STRING, enum: ["BULLISH", "BEARISH", "NEUTRAL"] }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as MarketContextData;
    }
    return fallbackData;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return fallbackData;
  }
};