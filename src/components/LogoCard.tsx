'use client';

import React, { useState } from 'react';
import { Download, Trash2, Loader2 } from 'lucide-react';

interface LogoItem {
  id: string;
  brand_name: string;
  slogan: string;
  image_url: string;
  created_at: string;
}

export default function LogoCard({ logo, onDeleteSuccess }: { logo: LogoItem; onDeleteSuccess: (id: string) => void }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${logo.brand_name}" logo?`);
    if (!confirmDelete) return;

    setDeleting(true);

    try {
      const res = await fetch('/api/delete-logo', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logoId: logo.id,
          imageUrl: logo.image_url,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onDeleteSuccess(logo.id);
      } else {
        alert(data.error || 'Failed to delete logo');
      }
    } catch (error) {
      console.error(error);
      alert('Error deleting logo. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-4 transition group flex flex-col justify-between space-y-4 backdrop-blur-xl shadow-lg">
      <div className="space-y-3">
        {/* Image Display */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80 group-hover:border-indigo-500/20 transition">
          <img
            src={logo.image_url}
            alt={logo.brand_name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        </div>

        {/* Brand Details */}
        <div>
          <h3 className="text-lg font-bold text-white capitalize">{logo.brand_name}</h3>
          {logo.slogan && (
            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{logo.slogan}</p>
          )}
        </div>
      </div>

      {/* Card Actions */}
      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
        <span>{new Date(logo.created_at).toLocaleDateString()}</span>

        <div className="flex items-center gap-2">
          {/* Delete Button */}
          <button
            onClick={handleDelete}
            disabled={deleting}
            title="Delete Logo"
            className="p-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-lg transition disabled:opacity-50 cursor-pointer"
          >
            {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          </button>

          {/* Download Button */}
          <a
            href={logo.image_url}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="inline-flex items-center gap-1.5 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white px-3 py-1.5 rounded-lg transition font-medium cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Download
          </a>
        </div>
      </div>
    </div>
  );
}