import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a helpful assistant for DriveHub, a premium car dealership.
You help customers with:
- Finding the right vehicle based on their needs and budget
- Information about financing and monthly payment estimates
- Booking test drives
- Details about specific cars (fuel types, body types, features)
- General questions about the dealership

Be friendly, concise, and helpful. If you don't know something specific about inventory,
encourage the user to browse the /vehicles page or contact the dealership directly.
Keep responses short — 2-3 sentences max unless more detail is truly needed.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    const data = await response.json();
    const reply =
      data.content?.[0]?.text || 'Sorry, I could not generate a response.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { reply: 'Sorry, something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
