import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="p-3 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl mb-6">
        <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
      </div>
      <h1 className="text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
        LogoForge AI
      </h1>
      <p className="text-slate-400 max-w-lg mb-8 text-lg">
        Create production-ready vector logos & complete brand kits powered by Next.js & OpenAI.
      </p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium border border-slate-700 transition"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center gap-2 transition shadow-lg shadow-indigo-600/20"
        >
          Get Started <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </main>
  );
}