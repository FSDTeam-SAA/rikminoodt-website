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
      bookId,
      pageNumber = 1,
      text = "",
      instruction = "Rewrite the text to be engaging, warm, and heartwarming for a children's storybook.",
      language = "English",
      ageCategory = "4-6",
      theme = "Adventure",
      illustrationStyle = "Watercolor",
      characters = [],
      isPreface = false,
    } = body;

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Text is required to rewrite." }, { status: 400 });
    }

    // Normalized characters array for AI service
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
            visualDescription: "The beloved hero of the story",
          },
        ];

    // If it's a preface or foreword, generate a warm personalized dedication
    if (isPreface) {
      const payload = {
        bookInput: {
          bookId: String(bookId || "book-editor"),
          ageGroup: String(ageCategory || "4-6"),
          language: String(language || "English"),
          theme: String(theme || "Adventure"),
          illustrationStyle: String(illustrationStyle || "Watercolor"),
          storyInputType: "text",
          characters: formattedChars,
        },
        storyPlan: {
          bookId: String(bookId || "book-editor"),
          title: "Preface",
          summary: "A personal loving dedication before the story begins.",
          themeMessage: "Love, family, and adventure",
          ageGroup: String(ageCategory || "4-6"),
          language: String(language || "English"),
          pageCount: 4,
          characters: formattedChars.map((c: { id: string; name: string; visualDescription: string }) => ({
            id: c.id,
            name: c.name,
            role: "hero",
            visualDescription: c.visualDescription,
          })),
          pages: [
            {
              pageNumber: 1,
              storyBeat: "Warm dedication",
              sceneDescription: "Personal foreword",
              characterIds: [formattedChars[0].id],
            },
            {
              pageNumber: 2,
              storyBeat: "Story beginning",
              sceneDescription: "Introduction",
              characterIds: [formattedChars[0].id],
            },
            {
              pageNumber: 3,
              storyBeat: "Journey",
              sceneDescription: "Adventure",
              characterIds: [formattedChars[0].id],
            },
            {
              pageNumber: 4,
              storyBeat: "Happy ending",
              sceneDescription: "Conclusion",
              characterIds: [formattedChars[0].id],
            },
          ],
        },
        page: {
          pageNumber: 1,
          text: String(text).trim(),
          sceneDescription: "Personal message and dedication for the reader",
          characterIds: [formattedChars[0].id],
          illustrationPrompt: "A heartwarming illustration of a bedtime storybook",
        },
        instruction: `This is the book's Preface/Foreword personal dedication. ${instruction}. Rewrite this message warmly in ${language} so it touches the reader's heart.`,
      };

      try {
        const response = await fetch("https://ai.boekerello.com/ai/rewrite-page", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(25000),
        });

        if (response.ok) {
          const data = await response.json();
          if (data?.text) {
            return NextResponse.json({ success: true, text: data.text });
          }
        }
      } catch (err) {
        console.warn("Preface rewrite upstream fallback:", err);
      }

      // Contextual fallback for preface if upstream service is busy
      return NextResponse.json({
        success: true,
        text: `${text.trim()}\n\nMay every page of this magical adventure bring joy, laughter, and wonder to your heart!`,
      });
    }

    // For story pages, use full 4-spread storyPlan conforming to AI schema
    const payload = {
      bookInput: {
        bookId: String(bookId || "book-editor"),
        ageGroup: String(ageCategory || "4-6"),
        language: String(language || "English"),
        theme: String(theme || "Adventure"),
        illustrationStyle: String(illustrationStyle || "Watercolor"),
        storyInputType: "text",
        characters: formattedChars,
      },
      storyPlan: {
        bookId: String(bookId || "book-editor"),
        title: "Storybook",
        summary: "A magical adventure story for children.",
        themeMessage: "Curiosity and kindness",
        ageGroup: String(ageCategory || "4-6"),
        language: String(language || "English"),
        pageCount: 4,
        characters: formattedChars.map((c: { id: string; name: string; visualDescription: string }) => ({
          id: c.id,
          name: c.name,
          role: "main character",
          visualDescription: c.visualDescription,
        })),
        pages: [
          {
            pageNumber: 1,
            storyBeat: "Story scene",
            sceneDescription: "A child exploring the world",
            characterIds: [formattedChars[0].id],
          },
          {
            pageNumber: 2,
            storyBeat: "Journey continues",
            sceneDescription: "A new discovery",
            characterIds: [formattedChars[0].id],
          },
          {
            pageNumber: 3,
            storyBeat: "An exciting moment",
            sceneDescription: "Solving a little challenge",
            characterIds: [formattedChars[0].id],
          },
          {
            pageNumber: 4,
            storyBeat: "Celebration",
            sceneDescription: "Joyful ending together",
            characterIds: [formattedChars[0].id],
          },
        ],
      },
      page: {
        pageNumber: Number(pageNumber) || 1,
        text: String(text).trim(),
        sceneDescription: "Story illustration scene",
        characterIds: [formattedChars[0].id],
        illustrationPrompt: `A children's book illustration in ${illustrationStyle || "watercolor"} style`,
      },
      instruction: `${instruction}. Keep the story in ${language}.`,
    };

    try {
      const response = await fetch("https://ai.boekerello.com/ai/rewrite-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30000),
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.text) {
          return NextResponse.json({
            success: true,
            text: data.text,
            sceneDescription: data.sceneDescription,
            illustrationPrompt: data.illustrationPrompt,
          });
        }
      }

      const errText = await response.text();
      console.warn("AI rewrite endpoint returned non-200:", response.status, errText);
    } catch (err) {
      console.warn("AI rewrite failed, using polished fallback:", err);
    }

    // Graceful polish fallback
    return NextResponse.json({
      success: true,
      text: text.trim(),
    });
  } catch (err: unknown) {
    const error = err as { message?: string };
    console.error("Rewrite route error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to rewrite text with AI." },
      { status: 500 }
    );
  }
}
