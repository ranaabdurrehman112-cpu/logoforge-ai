import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // 1. Check Authenticated User
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized user' }, { status: 401 });
    }

    const { brandName, slogan, prompt, themeColor, fontStyle } = await request.json();

    if (!brandName || !prompt) {
      return NextResponse.json(
        { error: 'Brand name and prompt are required' },
        { status: 400 }
      );
    }

    // 2. Pollinations AI Prompt
    const iconPrompt = encodeURIComponent(
      `Sleek 3D logo icon emblem, ${prompt}, ${themeColor || 'gold and dark'} theme palette, octane render, clean isolated dark background, high resolution 8k`
    );

    const seed = Math.floor(Math.random() * 1000000);
    const externalUrl = `https://image.pollinations.ai/prompt/${iconPrompt}?width=600&height=600&seed=${seed}&nologo=true`;

    // 3. Fetch Image Stream Buffer
    const imageRes = await fetch(externalUrl);
    const arrayBuffer = await imageRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64}`;

    // 4. Upload Image to Supabase Storage Bucket
    const fileName = `${user.id}/${Date.now()}-${brandName.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    
    const { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(fileName, buffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    let permanentImageUrl = dataUrl;

    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);
      
      if (publicUrlData?.publicUrl) {
        permanentImageUrl = publicUrlData.publicUrl;
      }
    } else {
      console.warn('Supabase storage upload failed, falling back to base64:', uploadError);
    }

    // 5. Insert Record into Supabase `generated_logos` Table
    const { data: logoRecord, error: dbError } = await supabase
      .from('generated_logos')
      .insert({
        user_id: user.id,
        brand_name: brandName,
        slogan: slogan || '',
        prompt: prompt,
        image_url: permanentImageUrl,
        theme_color: themeColor || 'default',
        font_style: fontStyle || 'default'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database Save Error:', dbError);
    }

    return NextResponse.json({ 
      id: logoRecord?.id || null,
      iconUrl: dataUrl,
      brandName,
      slogan: slogan || '',
      permanentImageUrl
    });
  } catch (error) {
    console.error('Logo Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate and save logo' },
      { status: 500 }
    );
  }
}