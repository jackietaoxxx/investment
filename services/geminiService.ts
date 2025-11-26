import { GoogleGenAI } from "@google/genai";
import { MarketContextData, AssetData, TrendAnalysis, LinkData } from "../types";
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
  
  // Fallback data
  const fallbackData: MarketContextData = {
    summary: "市场数据获取中，请稍候...",
    cryptoContext: "",
    cryptoPrices: {
      btc: { price: "---", change: "---" },
      eth: { price: "---", change: "---" }
    },
    fearAndGreedIndex: undefined,
    drivers: ["数据加载中...", "数据加载中...", "数据加载中..."],
    watchList: "等待 API 响应...",
    calendar: ["即将更新...", "即将更新...", "即将更新..."],
    sentimentTags: [
      { tag: "#等待更新", sentiment: "NEUTRAL" }
    ],
    links: []
  };

  if (!client) return fallbackData;

  const prompt = `
    You are a professional financial analyst. Analyze the current market situation for QQQ and SPY.
    
    TASK 1: Use Google Search to find the EXACT REAL-TIME PRICE of Bitcoin (BTC) and Ethereum (ETH) right now in USD.
    
    TASK 2: Use Google Search to find the current "CNN Fear and Greed Index" score. 
    - Search specifically for "CNN Fear and Greed Index current score today". 
    - The value MUST be an integer between 0 and 100. 
    - Do NOT return a decimal (e.g., if 13.89, round to 14).
    - Source context: https://edition.cnn.com/markets/fear-and-greed
    
    TASK 3: Identify the TOP 3 specific market drivers for TODAY. 
    CRITICAL: Be extremely specific and detailed. 
    - Do NOT say "Tech stocks rose". 
    - DO say "Google surged 5% on news of Gemini 3 TPU integration" or "Meta and Apple partnership rumors lifted sentiment".
    - DO say "Fed Chair Powell's hawkish comments on 3.5% CPI caused a selloff".
    
    Data provided:
    QQQ: Close ${qqq.indicators.close}, Change ${qqq.indicators.changePercent}%, Trend: ${getStatusLabel(qqqTrend.status)}.
    SPY: Close ${spy.indicators.close}, Change ${spy.indicators.changePercent}%, Trend: ${getStatusLabel(spyTrend.status)}.
    Current Date: ${new Date().toLocaleDateString()}.
    
    OUTPUT FORMAT:
    Return a valid JSON string. Do not include markdown formatting (like \`\`\`json).
    
    JSON Structure:
    {
      "summary": "A concise market summary (max 2 sentences) in Chinese.",
      "drivers": [
        "Detailed driver 1 (e.g. Specific company news/partnerships) in Chinese.", 
        "Detailed driver 2 (e.g. Specific Macro data/Fed quotes) in Chinese.", 
        "Detailed driver 3 (e.g. Sector specific news) in Chinese."
      ],
      "cryptoPrices": {
        "btc": { "price": "$96,250", "change": "+3.5%" },
        "eth": { "price": "$3,450", "change": "-1.2%" }
      },
      "fearAndGreedIndex": 16,
      "watchList": "What to watch tomorrow (Important Data, Speeches) in Chinese.",
      "calendar": ["Date: Event 1", "Date: Event 2"],
      "sentimentTags": [
        { "tag": "#Tag1", "sentiment": "BULLISH" },
        { "tag": "#Tag2", "sentiment": "BEARISH" }
      ],
      "cryptoContext": ""
    }
  `;

  try {
    // Note: When using googleSearch, we cannot strictly enforce responseMimeType: "application/json".
    // We must rely on the prompt to generate JSON and parse the text manually.
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    // Extract Text Content
    let parsedData = fallbackData;
    const responseText = response.text || "";

    if (responseText) {
      try {
        // Clean markdown code blocks if present
        const jsonString = responseText.replace(/```json|```/g, '').trim();
        parsedData = JSON.parse(jsonString) as MarketContextData;
      } catch (e) {
        console.error("JSON Parse error", e);
        console.log("Raw response text:", responseText);
      }
    }

    // Extract Grounding Metadata (Links)
    const links: LinkData[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          links.push({
            title: chunk.web.title,
            url: chunk.web.uri
          });
        }
      });
    }

    return {
      ...parsedData,
      links: links.slice(0, 5) // Limit to top 5 links
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return fallbackData;
  }
};