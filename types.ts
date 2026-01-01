
export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';

export type Platform = 'youtube' | 'instagram' | 'twitch' | 'facebook' | 'devto' | 'mux' | 'manual' | 'x' | 'snapchat' | 'tiktok';

export interface Template {
  id: string;
  name: string;
  platform: Platform;
  aspectRatio: AspectRatio;
  promptSuffix?: string;
  icon: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  aspectRatio: AspectRatio;
  model: string;
  templateName?: string;
}

export interface GenerationParams {
  prompt: string;
  aspectRatio: AspectRatio;
  baseImage?: string; // base64
  isPro?: boolean;
  templateId?: string;
}