import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();

    // 1. Authenticate User
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { logoId, imageUrl } = await request.json();

    if (!logoId) {
      return NextResponse.json({ error: 'Logo ID is required' }, { status: 400 });
    }

    // 2. Extract Storage File Path from Public URL if applicable
    if (imageUrl && imageUrl.includes('/storage/v1/object/public/logos/')) {
      const filePath = imageUrl.split('/storage/v1/object/public/logos/')[1];
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from('logos')
          .remove([filePath]);

        if (storageError) {
          console.warn('Storage deletion error:', storageError);
        }
      }
    }

    // 3. Delete Record from Database
    const { error: dbError } = await supabase
      .from('generated_logos')
      .delete()
      .eq('id', logoId)
      .eq('user_id', user.id); // Security: only delete user's own logo

    if (dbError) {
      console.error('Database deletion error:', dbError);
      return NextResponse.json({ error: 'Failed to delete logo record' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Logo deleted successfully' });
  } catch (error) {
    console.error('Delete API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}