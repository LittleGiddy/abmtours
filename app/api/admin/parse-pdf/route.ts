import { NextRequest, NextResponse } from 'next/server';
import { extractText, getDocumentProxy } from 'unpdf';

export async function POST(req: NextRequest) {
  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    return NextResponse.json({ error: 'Missing GROQ_API_KEY' }, { status: 500 });
  }

  try {
    const formData = await req.formData();
    const pdfFile = formData.get('file') as File;
    if (!pdfFile) return NextResponse.json({ error: 'No PDF file' }, { status: 400 });
    if (pdfFile.type !== 'application/pdf') return NextResponse.json({ error: 'File must be PDF' }, { status: 400 });

    // Extract text from PDF
    const buffer = await pdfFile.arrayBuffer();
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: true });
    if (!text.trim()) return NextResponse.json({ error: 'No text extracted' }, { status: 400 });

    const Groq = (await import('groq-sdk')).default;
    const groq = new Groq({ apiKey: groqApiKey });

    const systemPrompt = `You are an expert safari itinerary parser.
Convert the following PDF text into a JSON object matching the structure below.
Do NOT markdown, explanations. Output ONLY valid JSON.

Required structure:
{
  "title": "string",
  "category": "Northern Circuit" | "Southern Circuit" | "Beach Vacation",
  "shortDescription": "string",
  "overview": "string",
  "highlights": ["string"],
  "arrivalText": "string",
  "quickInfo": ["string"],
  "options": [
    {
      "optionTitle": "string",
      "description": "string",
      "activities": "string",
      "itineraryDays": [
        {
          "day": number,
          "title": "string",
          "blocks": [
            { "time": "Morning/Afternoon/Evening", "description": "string", "activities": ["string"] }
          ],
          "meals": ["string"],
          "overnight": "string"
        }
      ],
      "priceType": "fixed" | "tiered" | "contact",
      "priceAmount": number,   // only if fixed
      "priceTiers": [{ "minPax": number, "maxPax": number, "pricePerPerson": number }] // only if tiered
    }
  ],
  "includedList": ["string"],
  "excludedList": ["string"]
}

Image fields (heroImage, cardImage, mapImage) will be added later – leave them out.`;

    const completion = await groq.chat.completions.create({
      model: 'openai/gpt-oss-20b', // supports json_object mode, free tier
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text.slice(0, 14000) }
      ],
      temperature: 0.2,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    });

    const rawContent = completion.choices[0]?.message?.content;
    if (!rawContent) throw new Error('Empty response');
    const structured = JSON.parse(rawContent);

    // Add placeholder image fields (admin will upload via UI)
    structured.heroImage = '';
    structured.cardImage = '';
    structured.mapImage = '';

    if (!structured.slug && structured.title) {
      structured.slug = structured.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    return NextResponse.json({ success: true, data: structured });
  } catch (error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}