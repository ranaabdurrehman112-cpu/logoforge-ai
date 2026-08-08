'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Wand2, Loader2, Download, Palette, Type } from 'lucide-react';

const FONT_STYLES = [
  { id: 'serif', name: 'Luxury Serif (Cinzel)', font: 'Cinzel, serif', style: 'SERIF' },
  { id: 'modern', name: 'Modern Clean (Montserrat)', font: 'Montserrat, sans-serif', style: 'MODERN' },
  { id: 'playfair', name: 'Elegant Fashion (Playfair)', font: 'Playfair Display, serif', style: 'ELEGANT' },
  { id: 'tech', name: 'Futuristic Bold (Orbitron)', font: 'Orbitron, sans-serif', style: 'FUTURISTIC' },
  { id: 'script', name: 'Handwritten Script (Great Vibes)', font: 'Great Vibes, cursive', style: 'SCRIPT' },
];

const COLOR_THEMES = [
  { id: 'gold', name: 'Luxury Gold', primary: '#FDE047', secondary: '#EAB308', bg1: '#111827', bg2: '#030712' },
  { id: 'rosegold', name: 'Rose Gold & Pink', primary: '#F472B6', secondary: '#FB7185', bg1: '#1F111D', bg2: '#0F070E' },
  { id: 'neon', name: 'Cyber Neon Cyan', primary: '#22D3EE', secondary: '#38BDF8', bg1: '#071626', bg2: '#020912' },
  { id: 'emerald', name: 'Emerald & Gold', primary: '#34D399', secondary: '#FBBF24', bg1: '#062016', bg2: '#020C08' },
  { id: 'monochrome', name: 'Silver & White', primary: '#FFFFFF', secondary: '#94A3B8', bg1: '#1E293B', bg2: '#0F172A' },
  { id: 'ruby', name: 'Crimson Red', primary: '#F87171', secondary: '#EF4444', bg1: '#260B0E', bg2: '#120305' },
];

export default function GenerateLogoPage() {
  // Empty initial state so new users get a clean form
  const [brandName, setBrandName] = useState('');
  const [slogan, setSlogan] = useState('');
  const [prompt, setPrompt] = useState('');

  const [selectedFont, setSelectedFont] = useState(FONT_STYLES[2]); // Playfair by default
  const [selectedTheme, setSelectedTheme] = useState(COLOR_THEMES[1]); // Rose Gold by default
  const [loading, setLoading] = useState(false);

  const [logoData, setLogoData] = useState<{ iconUrl: string; brandName: string; slogan: string } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load Google Fonts for Canvas
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Great+Vibes&family=Montserrat:wght@600;800&family=Orbitron:wght@800&family=Playfair+Display:ital,wght@0,700;1,400&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLogoData(null);

    try {
      const response = await fetch('/api/generate-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName,
          slogan,
          prompt,
          themeColor: selectedTheme.name,
          fontStyle: selectedFont.id
        }),
      });

      const data = await response.json();
      if (data.iconUrl) {
        setLogoData(data);
      } else {
        alert(data.error || 'Failed to generate logo');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to logo generation service');
    } finally {
      setLoading(false);
    }
  };

  // Canvas Renderer (Dynamic Typography & Colors)
  useEffect(() => {
    if (!logoData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = logoData.iconUrl;

    img.onload = () => {
      // 1. Dynamic Background Gradient based on Selected Theme
      const bgGradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 50, canvas.width / 2, canvas.height / 2, 320);
      bgGradient.addColorStop(0, selectedTheme.bg1);
      bgGradient.addColorStop(1, selectedTheme.bg2);
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Dynamic Outer Glow Ring
      ctx.save();
      ctx.beginPath();
      ctx.arc(canvas.width / 2, 155, 110, 0, Math.PI * 2);
      ctx.strokeStyle = selectedTheme.primary + '33'; // 20% opacity
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // 3. Draw 3D Icon with Matching Color Shadow
      ctx.save();
      ctx.shadowColor = selectedTheme.secondary + '66';
      ctx.shadowBlur = 30;

      const iconSize = 200;
      const x = (canvas.width - iconSize) / 2;
      ctx.drawImage(img, x, 55, iconSize, iconSize);
      ctx.restore();

      // 4. Dynamic Text Gradient
      const textX = canvas.width / 2;
      const textY = 320;

      ctx.save();
      const textGradient = ctx.createLinearGradient(textX - 120, textY, textX + 120, textY);
      textGradient.addColorStop(0, selectedTheme.primary);
      textGradient.addColorStop(0.5, '#FFFFFF');
      textGradient.addColorStop(1, selectedTheme.secondary);

      ctx.fillStyle = textGradient;
      ctx.textAlign = 'center';
      ctx.shadowColor = selectedTheme.primary + '88';
      ctx.shadowBlur = 12;

      // Dynamic Font Styling
      if (selectedFont.id === 'script') {
        ctx.font = `600 42px ${selectedFont.font}`;
        ctx.fillText(logoData.brandName, textX, textY);
      } else if (selectedFont.id === 'tech') {
        ctx.font = `800 32px ${selectedFont.font}`;
        ctx.fillText(logoData.brandName.toUpperCase(), textX, textY);
      } else {
        ctx.font = `700 34px ${selectedFont.font}`;
        const formatted = logoData.brandName.toUpperCase().split('').join(' ');
        ctx.fillText(formatted, textX, textY);
      }
      ctx.restore();

      // 5. Dynamic Divider Line
      ctx.beginPath();
      ctx.moveTo(textX - 70, 338);
      ctx.lineTo(textX + 70, 338);
      ctx.strokeStyle = selectedTheme.primary + '55';
      ctx.lineWidth = 1;
      ctx.stroke();

      // 6. Dynamic Slogan Subtitle
      if (logoData.slogan) {
        ctx.fillStyle = '#9CA3AF';
        ctx.font = '500 12px "Montserrat", sans-serif';
        ctx.textAlign = 'center';

        const formattedSlogan = logoData.slogan.toUpperCase();
        ctx.fillText(formattedSlogan, textX, 360);
      }
    };
  }, [logoData, selectedFont, selectedTheme]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const image = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `${brandName.toLowerCase() || 'logo'}-dynamic-logo.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition text-sm mb-8 bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Controls Form */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl text-indigo-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Dynamic AI Logo Studio</h1>
                <p className="text-slate-400 text-xs">Customize fonts, colors, and 3D styles</p>
              </div>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Brand Name</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. Nauraya"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Slogan / Tagline (Optional)</label>
                <input
                  type="text"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  placeholder="e.g. Grace • Radiance"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* Typography Selection */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-indigo-400" /> Typography Style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FONT_STYLES.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSelectedFont(f)}
                      className={`text-left px-3 py-2 rounded-xl text-xs border transition ${selectedFont.id === f.id
                          ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300 font-semibold'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                        }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Theme Selection */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-indigo-400" /> Color Theme
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {COLOR_THEMES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTheme(t)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs border transition ${selectedTheme.id === t.id
                          ? 'border-indigo-500 bg-indigo-600/20 text-white font-semibold'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                        }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: t.primary }} />
                      <span className="truncate">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">3D Visual Style Description</label>
                <textarea
                  rows={2}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Lotus monogram crest, elegant gold emblem..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Rendering Custom Logo...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" /> Generate Custom Logo
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Dynamic Preview Box */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center min-h-[400px]">
            {loading ? (
              <div className="space-y-4 text-center">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto" />
                <p className="text-sm text-slate-400">Rendering <span className="text-white font-semibold">{selectedTheme.name}</span> theme for <span className="text-white font-semibold">{brandName || 'your brand'}</span>...</p>
              </div>
            ) : logoData ? (
              <div className="flex flex-col items-center gap-5 w-full">
                <canvas
                  ref={canvasRef}
                  width={450}
                  height={450}
                  className="w-full max-w-[340px] aspect-square rounded-2xl border border-slate-700 shadow-2xl bg-slate-950"
                />
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition shadow-lg cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download HD PNG Logo
                </button>
              </div>
            ) : (
              <div className="space-y-2 text-center text-slate-500">
                <Sparkles className="w-10 h-10 mx-auto opacity-30 text-indigo-400" />
                <p className="text-sm font-medium text-slate-300">Dynamic 3D Logo Studio</p>
                <p className="text-xs text-slate-600">Pick font & theme to generate custom branded logos</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}