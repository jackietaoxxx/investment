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
    summary: "零售销售数据超预期，VIX 回落至 16 以下，市场表现出较强韧性。科技股轮动支撑了大盘。",
    drivers: ["零售销售数据强劲", "VIX 回落", "科技板块轮动"],
    watchList: "明日关注 PPI 数据 (8:30 ET) 及感恩节假期休市安排",
    sentimentTags: [
      { tag: "#QQQ金叉", sentiment: "BULLISH" },
      { tag: "#缩量盘整", sentiment: "NEUTRAL" }
    ]
  };

  if (!client) return fallbackData;

  const prompt = `
    Analyze the following stock market data for QQQ and SPY to provide a daily market context summary for traders.
    Output must be in Chinese (Simplified).
    
    Data:
    QQQ: Close ${qqq.indicators.close}, Change ${qqq.indicators.changePercent}%, Trend: ${getStatusLabel(qqqTrend.status)}, Score: ${qqqTrend.score}/10.
    SPY: Close ${spy.indicators.close}, Change ${spy.indicators.changePercent}%, Trend: ${getStatusLabel(spyTrend.status)}, Score: ${spyTrend.score}/10.
    
    Current Date: ${new Date().toLocaleDateString()}.
    
    Generate a JSON response with:
    1. summary: A short summary (max 2 sentences) of the market background in Chinese.
    2. drivers: A list of 3 key market drivers (e.g. macro events, sector moves) in Chinese.
    3. watchList: What to watch tomorrow (1 short sentence) in Chinese.
    4. sentimentTags: 2-3 trending sentiment hashtags (in Chinese or English common terms) with sentiment (BULLISH, BEARISH, NEUTRAL).
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