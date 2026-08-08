'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function loginWithEmail(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect('/dashboard');
}

export async function signupWithEmail(formData: FormData) {
  const supabase = await createClient();

  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password || !fullName) {
    return { error: 'All fields are required.' };
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL || 'https://logoforge-ai-abed2.vercel.app';

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect('/dashboard');
}

export async function signInWithGoogle() {
  const supabase = await createClient();

  // Primary URL set to live Vercel deployment
  const origin = process.env.NEXT_PUBLIC_APP_URL || 'https://logoforge-ai-abed2.vercel.app';

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data?.url) {
    redirect(data.url);
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}