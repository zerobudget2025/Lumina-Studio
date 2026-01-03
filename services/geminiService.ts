
import { GoogleGenAI } from "@google/genai";
import { GenerationParams } from "../types";

/**
 * Uses Gemini Flash to expand simple prompts into professional, high-detail instructions.
 */
export const enhancePrompt = async (prompt: string, referenceCount: number = 0): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    let referenceContext = "";
    if (referenceCount === 1) {
      referenceContext = "CRITICAL: Maintain the exact facial identity of the person in the reference image.";
    } else if (referenceCount === 2) {
      referenceContext = `CRITICAL: The user has provided TWO different people. Create a realistic duo portrait where BOTH individuals' distinct identities from the references are clearly recognizable and preserved in the same scene.`;
    } else if (referenceCount === 3) {
      referenceContext = `CRITICAL: The user has provided THREE different people. Create a realistic trio portrait where EACH individual's distinct identity from the references is clearly recognizable and preserved.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a professional prompt engineer specializing in character consistency. 
      ${referenceContext}
      Take the following user idea and expand it into a highly detailed, descriptive multi-person portrait or scene prompt. 
      Include specifics about character interaction, realistic placement, cinematic lighting, and hyper-realistic skin textures. 
      Return ONLY the enhanced prompt text.
      
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

  // Specialized instruction for multi-subject synergy
  let finalPrompt = params.prompt;
  const imageCount = params.baseImages?.length || 0;

  if (imageCount > 1) {
    finalPrompt = `MULTI-IDENTITY SYNERGY (${imageCount} People): Attached are ${imageCount} reference images, each representing a unique person. Synthesize a single realistic shot where ALL these distinct identities are clearly recognizable and present. DO NOT blend their features; treat them as separate individuals in the following scene: ${params.prompt}`;
  } else if (imageCount === 1) {
    finalPrompt = `PHOTOREALISTIC CHARACTER SYNC: Use the person in the provided reference as the subject, maintaining their exact features. Scenario: ${params.prompt}`;
  }

  const parts: any[] = [{ text: finalPrompt }];
  
  if (params.baseImages && params.baseImages.length > 0) {
    // Reverse order to ensure text prompt is prioritized by some model implementations, 
    // but typically SDK handles sequence fine.
    params.baseImages.forEach(imgBase64 => {
      const base64Data = imgBase64.includes(',') 
        ? imgBase64.split(',')[1] 
        : imgBase64;
        
      parts.unshift({
        inlineData: {
          data: base64Data,
          mimeType: 'image/png'
        }
      });
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
      ...(params.isPro ? { tools: [{ googleSearch: {} }] } : {})
    },
  });

  let imageUrl = '';
  const candidate = response.candidates?.[0];
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
    throw new Error("Lumina Error: Content generation blocked. Multi-person synthesis requires clear prompts to pass safety filters.");
  }

  return { imageUrl, model: modelName, groundingSources };
};

export const checkProAuth = async (): Promise<boolean> => {
  // @ts-ignore
  return (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') 
    ? await window.aistudio.hasSelectedApiKey() 
    : false;
};

export const requestProAuth = async (): Promise<void> => {
  // @ts-ignore
  if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
    // @ts-ignore
    await window.aistudio.openSelectKey();
  }
};
