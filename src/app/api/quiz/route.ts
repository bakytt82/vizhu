import { NextRequest, NextResponse } from 'next/server';
import { getQuizRecommendations } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const answers = await req.json();
    const recommendation = await getQuizRecommendations(answers);
    return NextResponse.json({ recommendation });
  } catch (error) {
    console.error('Quiz API route error:', error);
    return NextResponse.json(
      { error: 'Failed to get quiz recommendations' },
      { status: 500 }
    );
  }
}
