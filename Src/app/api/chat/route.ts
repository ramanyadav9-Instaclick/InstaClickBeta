import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('CRITICAL: GEMINI_API_KEY is missing in .env.local');
      return NextResponse.json(
        { success: false, error: 'Gemini API Key missing in environment' },
        { status: 500 }
      );
    }

    // 🌟 System Context for InstaClick
    const systemPrompt = `You are the official AI Assistant for 'instaclick'.
- You help customers with Photography, Videography, Drone, and Events booking queries.
- Booking Rule: <= ₹2,000 is 100% token, > ₹2,000 requires 20% advance token.
- Cancellation: Free within 12 hours before dispatch.
- Keep answers short, polite, helpful, and in the language requested.`;

    const contents = [
      {
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }],
      },
    ];

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents }),
    });

    const data = await res.json();

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      const reply = data.candidates[0].content.parts[0].text;
      return NextResponse.json({ success: true, reply });
    } else {
      console.error('Gemini API Error details:', JSON.stringify(data));
      return NextResponse.json(
        { success: false, error: 'Failed to parse Gemini response' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Chat Server Exception:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}