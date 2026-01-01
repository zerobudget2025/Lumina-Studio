
import React from 'react';
import { Platform, Template } from '../types';

const TEMPLATES: Template[] = [
  // YouTube
  { id: 'yt-thumb', name: 'Thumbnail', platform: 'youtube', aspectRatio: '16:9', promptSuffix: 'high impact YouTube thumbnail, cinematic lighting, vibrant colors, professional graphic design', icon: '▶️' },
  { id: 'yt-banner', name: 'Channel Banner', platform: 'youtube', aspectRatio: '16:9', promptSuffix: 'panoramic YouTube channel art, wide landscape, professional aesthetic', icon: '📺' },
  { id: 'yt-logo', name: 'Channel Logo', platform: 'youtube', aspectRatio: '1:1', promptSuffix: 'circular profile logo, minimalistic vector, flat design, recognizable icon', icon: '👤' },
  // Instagram
  { id: 'ig-post', name: 'Post', platform: 'instagram', aspectRatio: '1:1', promptSuffix: 'aesthetic Instagram post, high quality photography, trendy, social media style', icon: '📸' },
  { id: 'ig-story', name: 'Story/Reel', platform: 'instagram', aspectRatio: '9:16', promptSuffix: 'vertical Instagram story, cinematic portrait, mobile layout optimized', icon: '📱' },
  // X (Twitter)
  { id: 'x-post', name: 'X Post', platform: 'x', aspectRatio: '16:9', promptSuffix: 'clean social media post for X/Twitter, high engagement, crisp visuals', icon: '𝕏' },
  { id: 'x-header', name: 'X Header', platform: 'x', aspectRatio: '16:9', promptSuffix: 'X profile header, panoramic, sleek modern aesthetic', icon: '🖼️' },
  // TikTok
  { id: 'tt-cover', name: 'Video Cover', platform: 'tiktok', aspectRatio: '9:16', promptSuffix: 'TikTok video cover, high energy, bold text area, attention-grabbing', icon: '🎵' },
  { id: 'tt-profile', name: 'Profile Pic', platform: 'tiktok', aspectRatio: '1:1', promptSuffix: 'TikTok profile avatar, bright, colorful, recognizable', icon: '🎭' },
  // Snapchat
  { id: 'sc-spotlight', name: 'Spotlight', platform: 'snapchat', aspectRatio: '9:16', promptSuffix: 'Snapchat spotlight frame, vibrant, mobile-first design, high contrast', icon: '👻' },
  // Twitch
  { id: 'tw-banner', name: 'Profile Banner', platform: 'twitch', aspectRatio: '16:9', promptSuffix: 'gaming stream banner, neon aesthetic, dark background, Twitch streamer style', icon: '🎮' },
  { id: 'tw-offline', name: 'Offline Screen', platform: 'twitch', aspectRatio: '16:9', promptSuffix: 'Twitch offline screen, professional stream overlay, gaming aesthetic', icon: '💤' },
  { id: 'tw-emote', name: 'Emote/Avatar', platform: 'twitch', aspectRatio: '1:1', promptSuffix: 'cute Twitch emote, vector art, thick outlines, expressive character', icon: '👾' },
  // Facebook
  { id: 'fb-cover', name: 'Cover Photo', platform: 'facebook', aspectRatio: '16:9', promptSuffix: 'Facebook cover photo, clean professional layout, corporate aesthetic', icon: '👥' },
  // DEV.to
  { id: 'dev-cover', name: 'Post Cover', platform: 'devto', aspectRatio: '16:9', promptSuffix: 'DEV.to blog post header, software development aesthetic, clean typography space, professional tech blog, minimalist code background', icon: '💻' },
  { id: 'dev-profile', name: 'Tech Avatar', platform: 'devto', aspectRatio: '1:1', promptSuffix: 'professional developer profile picture, tech-themed minimalistic icon, modern flat design, clean lines', icon: '👨‍💻' },
  // MUX
  { id: 'mux-poster', name: 'Video Poster', platform: 'mux', aspectRatio: '16:9', promptSuffix: 'high fidelity video poster image, cinematic frame, rich textures, 4k video production aesthetic', icon: '🎬' },
  { id: 'mux-branding', name: 'Asset Branding', platform: 'mux', aspectRatio: '1:1', promptSuffix: 'video infrastructure branding icon, abstract digital wave, professional tech logo, sleek geometry', icon: '⚡' },
];

interface PlatformTab {
  id: Platform;
  label: string;
  icon: string;
  color: string;
  category: 'core' | 'social' | 'dev';
}

const PLATFORMS: PlatformTab[] = [
  { id: 'manual', label: 'Custom', icon: '🛠️', color: 'bg-slate-600', category: 'core' },
  { id: 'devto', label: 'DEV.to', icon: '💻', color: 'bg-zinc-900', category: 'dev' },
  { id: 'mux', label: 'MUX', icon: '🎬', color: 'bg-rose-600', category: 'dev' },
  { id: 'youtube', label: 'YouTube', icon: '▶️', color: 'bg-red-600', category: 'social' },
  { id: 'instagram', label: 'Instagram', icon: '📸', color: 'bg-pink-600', category: 'social' },
  { id: 'x', label: 'X', icon: '𝕏', color: 'bg-slate-800', category: 'social' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵', color: 'bg-cyan-500', category: 'social' },
  { id: 'snapchat', label: 'Snapchat', icon: '👻', color: 'bg-yellow-400', category: 'social' },
  { id: 'twitch', label: 'Twitch', icon: '🎮', color: 'bg-purple-600', category: 'social' },
  { id: 'facebook', label: 'Facebook', icon: '👥', color: 'bg-blue-600', category: 'social' },
];

interface TemplateSelectorProps {
  selectedPlatform: Platform;
  setSelectedPlatform: (p: Platform) => void;
  selectedTemplateId: string | null;
  onSelectTemplate: (t: Template) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  selectedPlatform, 
  setSelectedPlatform,
  selectedTemplateId,
  onSelectTemplate
}) => {
  const filteredTemplates = TEMPLATES.filter(t => t.platform === selectedPlatform);

  const categories = [
    { id: 'core', label: 'Core' },
    { id: 'dev', label: 'Developer' },
    { id: 'social', label: 'Social' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/40 p-2 rounded-2xl border border-slate-800/50">
        <div className="space-y-4">
          {categories.map(cat => (
            <div key={cat.id} className="space-y-2">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-2">{cat.label}</span>
              <div className="flex flex-wrap gap-1.5">
                {PLATFORMS.filter(p => p.category === cat.id).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlatform(p.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 relative group ${
                      selectedPlatform === p.id 
                        ? `${p.color} text-white shadow-lg shadow-black/20 scale-105` 
                        : 'bg-slate-800/40 text-slate-500 hover:text-slate-300 hover:bg-slate-800/80 border border-slate-700/50'
                    }`}
                  >
                    <span className="text-sm group-hover:scale-110 transition-transform">
                      {p.icon}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-tighter">
                      {p.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedPlatform !== 'manual' && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="flex items-center gap-2 mb-3 px-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Available Templates</span>
            <div className="h-px flex-1 bg-slate-800/50"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredTemplates.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelectTemplate(t)}
                className={`flex items-center gap-4 p-3.5 rounded-2xl border text-left transition-all group/item ${
                  selectedTemplateId === t.id
                    ? 'bg-blue-600/10 border-blue-500/50 ring-1 ring-blue-500/30 shadow-lg shadow-blue-500/5'
                    : 'bg-slate-900/30 border-slate-800/60 hover:border-slate-700 hover:bg-slate-900/40'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-transform duration-300 group-hover/item:scale-110 ${
                  selectedTemplateId === t.id ? 'bg-blue-500/20' : 'bg-slate-800/50'
                }`}>
                  {t.icon}
                </div>
                <div className="flex flex-col">
                  <span className={`text-xs font-bold ${selectedTemplateId === t.id ? 'text-blue-400' : 'text-slate-200'}`}>
                    {t.name}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className={`w-1 h-1 rounded-full ${selectedTemplateId === t.id ? 'bg-blue-400' : 'bg-slate-600'}`}></div>
                    <span className="text-[10px] text-slate-500 font-mono uppercase">
                      {t.aspectRatio}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;