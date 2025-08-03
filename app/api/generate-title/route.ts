import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY!) {
    return NextResponse.json(
      { error: "API key is not configured" },
      { status: 500 }
    );
  }

  try {
    const contentType = request.headers.get("content-type");
    if (contentType !== "application/json") {
      return NextResponse.json(
        { error: "Invalid content type. Expected application/json" },
        { status: 400 }
      );
    }

    const body = await request.json();
    if (!body.message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Initialize chat with history
    const chat = model.startChat({
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
      },
      history: [], // TO-DO add history
    });
    const context = body.messages.map((msg: any) => msg.content[0].text).join("\n");

    // Send the user message
    const result = await chat.sendMessage(
      "Generate a title for this chat which should not be longer than 7 words." +
      context +
      "\nBased on the provided history."
    );

    // Extract response text
    const text = result.response.text();

    return NextResponse.json({ title: text.trim() });
  } catch (error) {
    console.error("Gemini API Error:", (error as Error).message);

    return NextResponse.json(
      {
        error: "Request processing failed",
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
