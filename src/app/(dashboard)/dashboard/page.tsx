import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Plus, Image as ImageIcon, Sparkles, Calendar } from 'lucide-react';
import LogoGallery from './LogoGallery';

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect('/login');
  }

  const { data: logos } = await supabase
    .from('generated_logos')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const logoCount = logos?.length || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Welcome back, <span className="text-indigo-400">{user.email?.split('@')[0]}</span> 👋
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage your brand identity and generated 3D logos.
            </p>
          </div>

          <Link
            href="/generate"
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-3 rounded-2xl shadow-lg shadow-indigo-600/30 transition text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create New Logo
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-medium">Total Logos</p>
                <p className="text-2xl font-bold text-white">{logoCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-medium">Studio Engine</p>
                <p className="text-2xl font-bold text-white">3D Dynamic</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-medium">Plan Status</p>
                <p className="text-2xl font-bold text-white">Pro / Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Gallery */}
        <LogoGallery initialLogos={logos || []} />

      </div>
    </div>
  );
}