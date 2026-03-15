import { NextRequest, NextResponse } from 'next/server';
import { chatWithGemini, chatWithGeminiStream, chatWithGeminiVision, parsePrescription } from '@/lib/gemini';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Vercel hobby plan max is 10s for functions, or 60s for pro. We can set it to 60. Actually, Pro is 300. 60 is safe.

export async function POST(req: NextRequest) {
  try {
    const { message, history, image, mimeType, mode } = await req.json();

    // Prescription OCR mode
    if (mode === 'prescription' && image) {
      const prescription = await parsePrescription(image, mimeType || 'image/jpeg');
      return NextResponse.json({ prescription });
    }

    // Vision mode (selfie face analysis or image-based chat)
    if (image) {
      const response = await chatWithGeminiVision(
        message || 'Проанализируй это изображение.',
        image,
        mimeType || 'image/jpeg',
        history || []
      );
      return NextResponse.json({ response });
    }

    // Standard text chat - With Streaming
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const stream = await chatWithGeminiStream(message, history || []);
    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            // New SDK structure for stream parts
            const parts = chunk.candidates?.[0]?.content?.parts;
            if (parts) {
              for (const part of parts) {
                if (part.functionCall) {
                  console.log('Gemini Function Call:', part.functionCall);
                  const toolSignal = `\n__TOOL_CALL__:${JSON.stringify(part.functionCall)}\n`;
                  controller.enqueue(encoder.encode(toolSignal));
                }
                if (part.text) {
                  controller.enqueue(encoder.encode(part.text));
                }
              }
            } else if (chunk.text) {
              // Fallback for older patterns or simpler chunks
              controller.enqueue(encoder.encode(chunk.text));
            }
          }
        } catch (err) {
          console.error('Streaming error:', err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Gemini API route error details:', {
      message: error?.message,
      stack: error?.stack,
      cause: error?.cause,
    });
    return NextResponse.json(
      { error: error?.message || 'Failed to get AI response' },
      { status: 500 }
    );
  }
}
