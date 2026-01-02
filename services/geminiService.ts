
import { GoogleGenAI } from "@google/genai";
import { GenerationParams } from "../types";

/**
 * Uses Gemini Flash to expand simple prompts into professional, high-detail instructions
 * for the image generation model.
 */
export const enhancePrompt = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a professional prompt engineer for state-of-the-art AI image generators. 
      Take the following user idea and expand it into a highly detailed, descriptive, and artistic prompt. 
      Include specifics about lighting (e.g., volumetric, cinematic), texture (e.g., detailed skin, fabric weave), 
      camera angle (e.g., low angle, macro), and artistic style (e.g., photorealistic, cyberpunk, oil painting). 
      Return ONLY the enhanced prompt text without any preamble.
      
      User idea: "${prompt}"`,
    });
    return response.text?.trim() || prompt;
  } catch (e) {
    console.error("[LUMINA_CORE] Prompt enhancement failed", e);
    return prompt;
  }
};

export const generateImage = async (params: GenerationParams): Promise<{ imageUrl: string; model: string; groundingSources?: any[] }> => {
  const modelName = params.isPro ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("LUMINA_CORE: API Key missing.");
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
      // Grounding is mandatory for certain Pro queries
      ...(params.isPro ? { tools: [{ googleSearch: {} }] } : {})
    },
  });

  let imageUrl = '';
  const candidate = response.candidates?.[0];
  
  // Extract Grounding Chunks if present
  const groundingSources = candidate?.groundingMetadata?.groundingChunks || [];

  if (candidate?.content?.parts) {
    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }
  }

  if (!imageUrl) {
    throw new Error("Lumina Error: Content generation blocked by safety filters.");
  }

  return { imageUrl, model: modelName, groundingSources };
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
