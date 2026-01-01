import { GoogleGenAI } from "@google/genai";
import { GenerationParams } from "../types";

export const generateImage = async (params: GenerationParams): Promise<{ imageUrl: string; model: string }> => {
  const modelName = params.isPro ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("API Key is not configured. Please ensure you are in a supported environment.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const parts: any[] = [{ text: params.prompt }];
  
  if (params.baseImage) {
    const base64Data = params.baseImage.includes(',') 
      ? params.baseImage.split(',')[1] 
      : params.baseImage;
      
    parts.unshift({
      inlineData: {
        data: base64Data,
        mimeType: 'image/png'
      }
    });
  }

  const response = await ai.models.generateContent({
    model: modelName,
    contents: { parts },
    config: {
      imageConfig: {
        aspectRatio: params.aspectRatio,
        ...(params.isPro ? { imageSize: "1K" } : {})
      },
      // Pro model can use google search for better contextual understanding of current events
      ...(params.isPro ? { tools: [{ googleSearch: {} }] } : {})
    },
  });

  let imageUrl = '';
  const candidate = response.candidates?.[0];
  
  if (candidate?.content?.parts) {
    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }
  }

  if (!imageUrl) {
    throw new Error("No image data returned. The prompt might have been blocked by safety filters or a generation error occurred.");
  }

  return { imageUrl, model: modelName };
};

export const checkProAuth = async (): Promise<boolean> => {
  // @ts-ignore
  if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
    // @ts-ignore
    return await window.aistudio.hasSelectedApiKey();
  }
  return false;
};

export const requestProAuth = async (): Promise<void> => {
  // @ts-ignore
  if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
    // @ts-ignore
    await window.aistudio.openSelectKey();
  }
};