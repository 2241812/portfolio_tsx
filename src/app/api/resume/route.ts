import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.redirect(new URL('/resume.pdf', request.url));
  } catch (error) {
    console.error('Resume download error:', error);
    return NextResponse.json(
      { error: 'Failed to process resume download' },
      { status: 500 }
    );
  }
}
