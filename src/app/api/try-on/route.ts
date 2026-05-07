import { NextRequest, NextResponse } from 'next/server';
import { virtualTryOn } from '@/lib/gemini';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { selfie, frameUrl, frameBase64 } = await req.json();

    if (!selfie) {
      return NextResponse.json({ error: 'Selfie is required' }, { status: 400 });
    }

    let finalFrameBase64 = frameBase64;

    // If only URL is provided, fetch it and convert to base64
    if (!finalFrameBase64 && frameUrl) {
      console.log('Fetching frame from URL:', frameUrl);
      try {
        const response = await fetch(frameUrl, {
          headers: { 'Accept': 'image/*' },
          cache: 'no-store'
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        if (arrayBuffer.byteLength === 0) {
          throw new Error('Fetched image is empty');
        }
        
        finalFrameBase64 = Buffer.from(arrayBuffer).toString('base64');
        console.log('Successfully converted frame to base64, length:', finalFrameBase64.length);
      } catch (e: any) {
        console.error('Failed to fetch frame image:', e);
        return NextResponse.json({ error: `Failed to fetch frame image: ${e.message}` }, { status: 400 });
      }
    }

    if (!finalFrameBase64) {
      return NextResponse.json({ error: 'Frame image is required' }, { status: 400 });
    }

    // Call the Gemini-powered try-on
    const result = await virtualTryOn(selfie, finalFrameBase64);

    return NextResponse.json({ 
      success: true,
      image: result.image,
      mimeType: result.mimeType 
    });

  } catch (error: any) {
    console.error('API /try-on error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process virtual try-on' },
      { status: 500 }
    );
  }
}
