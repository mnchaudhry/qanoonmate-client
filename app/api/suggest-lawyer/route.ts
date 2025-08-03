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

    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GEMINI_API_KEY!
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Ensuring the history format is correct
    // I want the history to be everything except the first message
    const history =
      body.history && Array.isArray(body.history)
        ? body.history.slice(1).map((msg: any) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        }))
        : [];

    // Initialize chat with history
    const chat = model.startChat({
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
      },
      history: history, // Added history here
    });

    const result = await chat.sendMessage(
      "Decide whether the query has a high, medium or low severity" +
      "\n" +
      body.message.trim()
    );
    console.log("body message", body.message.trim());
    // Extract response text
    const text = result.response.text();

    // Log the generated response for debugging
    console.log("Generated response:", text);
    // Log the request body for debugging
    console.log("Request body:", body);

    return NextResponse.json({ response: text });
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
