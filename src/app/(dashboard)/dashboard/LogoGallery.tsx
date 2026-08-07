'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Image as ImageIcon } from 'lucide-react';
import LogoCard from '@/components/LogoCard';

interface LogoItem {
  id: string;
  brand_name: string;
  slogan: string;
  image_url: string;
  created_at: string;
}

export default function LogoGallery({ initialLogos }: { initialLogos: LogoItem[] }) {
  const [logos, setLogos] = useState<LogoItem[]>(initialLogos);

  const handleDeleteSuccess = (deletedId: string) => {
    setLogos((prev) => prev.filter((item) => item.id !== deletedId));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Your Saved Logos</h2>
        <span className="text-xs text-slate-500">{logos.length} items found</span>
      </div>

      {logos.length === 0 ? (
        <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto text-slate-500">
            <ImageIcon className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-300">No logos generated yet</h3>
            <p className="text-slate-500 text-xs mt-1">Start by crafting your first 3D luxury brand logo.</p>
          </div>
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition"
          >
            <Plus className="w-4 h-4" /> Generate Logo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {logos.map((logo) => (
            <LogoCard key={logo.id} logo={logo} onDeleteSuccess={handleDeleteSuccess} />
          ))}
        </div>
      )}
    </div>
  );
}