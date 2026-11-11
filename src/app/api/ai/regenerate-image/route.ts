import { NextRequest, NextResponse } from "next/server";

interface CharacterPayload {
  id?: string;
  _id?: string;
  name?: string;
  visualDescription?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      bookId = "book-editor",
      pageNumber = 1,
      text = "",
      instruction = "Improve and enhance the illustration according to the story scene.",
      illustrationStyle = "Watercolor",
      characters = [],
    } = body;

    const formattedChars = Array.isArray(characters) && characters.length > 0
      ? characters.map((c: CharacterPayload, index: number) => ({
          id: String(c.id || c._id || `char-${index + 1}`),
          name: String(c.name || `Character ${index + 1}`),
          visualDescription: String(c.visualDescription || `${c.name || "A character"} in the story`),
        }))
      : [
          {
            id: "char-1",
            name: "Main Character",
            visualDescription: "The hero of the story",
          },
        ];

    const payload = {
      bookId: String(bookId),
      page: {
        pageNumber: Number(pageNumber) || 1,
        text: String(text || "A magical story moment.").trim(),
        sceneDescription: String(instruction || "A magical story scene").trim(),
        characterIds: [formattedChars[0].id],
        illustrationPrompt: `${instruction}. Illustration in ${illustrationStyle} style.`,
      },
      characters: formattedChars,
      illustrationStyle: String(illustrationStyle || "Watercolor"),
      instruction: String(instruction).trim(),
    };

    const response = await fetch("https://ai.boekerello.com/ai/regenerate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(90000), // 90s timeout for image gen
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn("AI regenerate image returned:", response.status, errText);
      return NextResponse.json(
        {
          success: false,
          error: "AI image service is currently busy generating other illustrations. Please try again or upload a custom image.",
        },
        { status: 502 }
      );
    }

    const data = await response.json();
    if (data?.imageUrl) {
      return NextResponse.json({
        success: true,
        imageUrl: data.imageUrl,
        promptUsed: data.promptUsed,
      });
    }

    return NextResponse.json(
      { success: false, error: "No image was returned by the AI service." },
      { status: 500 }
    );
  } catch (err: unknown) {
    const error = err as { name?: string; message?: string };
    console.error("Regenerate image route error:", error);
    const isTimeout = error?.name === "TimeoutError" || error?.message?.includes("timeout");
    return NextResponse.json(
      {
        success: false,
        error: isTimeout
          ? "The AI image generation took longer than usual. Please try again with a simpler instruction or upload your own photo."
          : (error?.message || "Failed to regenerate image."),
      },
      { status: 500 }
    );
  }
}
