
import { GoogleGenAI } from "@google/genai";
import { GenerationParams } from "../types";

export const generateImage = async (params: GenerationParams): Promise<{ imageUrl: string; model: string }> => {
  const modelName = params.isPro ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("API Key is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const parts: any[] = [{ text: params.prompt }];
  
  if (params.baseImage) {
    parts.unshift({
      inlineData: {
        data: params.baseImage.split(',')[1],
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
      }
    },
  });

  let imageUrl = '';
  if (response.candidates && response.candidates[0].content.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }
  }

  if (!imageUrl) {
    throw new Error("No image data returned from the model.");
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
