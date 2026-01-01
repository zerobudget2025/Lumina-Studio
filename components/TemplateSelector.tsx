
import React from 'react';
import { Platform, Template, AspectRatio } from '../types';

const TEMPLATES: Template[] = [
  // YouTube
  { id: 'yt-thumb', name: 'Thumbnail', platform: 'youtube', aspectRatio: '16:9', promptSuffix: 'high impact YouTube thumbnail, cinematic lighting, vibrant colors, professional graphic design', icon: '▶️' },
  { id: 'yt-banner', name: 'Channel Banner', platform: 'youtube', aspectRatio: '16:9', promptSuffix: 'panoramic YouTube channel art, wide landscape, professional aesthetic', icon: '📺' },
  { id: 'yt-logo', name: 'Channel Logo', platform: 'youtube', aspectRatio: '1:1', promptSuffix: 'circular profile logo, minimalistic vector, flat design, recognizable icon', icon: '👤' },
  // Instagram
  { id: 'ig-post', name: 'Post', platform: 'instagram', aspectRatio: '1:1', promptSuffix: 'aesthetic Instagram post, high quality photography, trendy, social media style', icon: '📸' },
  { id: 'ig-story', name: 'Story/Reel', platform: 'instagram', aspectRatio: '9:16', promptSuffix: 'vertical Instagram story, cinematic portrait, mobile layout optimized', icon: '📱' },
  // Twitch
  { id: 'tw-banner', name: 'Profile Banner', platform: 'twitch', aspectRatio: '16:9', promptSuffix: 'gaming stream banner, neon aesthetic, dark background, Twitch streamer style', icon: '🎮' },
  { id: 'tw-offline', name: 'Offline Screen', platform: 'twitch', aspectRatio: '16:9', promptSuffix: 'Twitch offline screen, professional stream overlay, gaming aesthetic', icon: '💤' },
  { id: 'tw-emote', name: 'Emote/Avatar', platform: 'twitch', aspectRatio: '1:1', promptSuffix: 'cute Twitch emote, vector art, thick outlines, expressive character', icon: '👾' },
  // Facebook
  { id: 'fb-cover', name: 'Cover Photo', platform: 'facebook', aspectRatio: '16:9', promptSuffix: 'Facebook cover photo, clean professional layout, corporate aesthetic', icon: '👥' },
  // DEV.to
  { id: 'dev-cover', name: 'Post Cover', platform: 'devto', aspectRatio: '16:9', promptSuffix: 'DEV.to blog post header, software development aesthetic, clean typography space, professional tech blog, minimalist code background', icon: '💻' },
  { id: 'dev-profile', name: 'Tech Avatar', platform: 'devto', aspectRatio: '1:1', promptSuffix: 'professional developer profile picture, tech-themed minimalistic icon, modern flat design, clean lines', icon: '👨‍💻' },
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
  const platforms: { id: Platform; label: string; color: string }[] = [
    { id: 'manual', label: 'Custom', color: 'bg-slate-700' },
    { id: 'youtube', label: 'YouTube', color: 'bg-red-600' },
    { id: 'instagram', label: 'Instagram', color: 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600' },
    { id: 'twitch', label: 'Twitch', color: 'bg-purple-600' },
    { id: 'facebook', label: 'Facebook', color: 'bg-blue-600' },
    { id: 'devto', label: 'DEV.to', color: 'bg-slate-900 border-slate-700' },
  ];

  const filteredTemplates = TEMPLATES.filter(t => t.platform === selectedPlatform);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {platforms.map(p => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelectedPlatform(p.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedPlatform === p.id 
                ? `${p.color} border-transparent text-white shadow-lg` 
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {selectedPlatform !== 'manual' && (
        <div className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2">
          {filteredTemplates.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectTemplate(t)}
              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                selectedTemplateId === t.id
                  ? 'bg-blue-600/10 border-blue-500/50 ring-1 ring-blue-500/30'
                  : 'bg-slate-900/30 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="text-xl">{t.icon}</span>
              <div className="flex flex-col">
                <span className={`text-[11px] font-bold ${selectedTemplateId === t.id ? 'text-blue-400' : 'text-slate-300'}`}>
                  {t.name}
                </span>
                <span className="text-[9px] text-slate-500 uppercase tracking-tighter">
                  {t.aspectRatio}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
