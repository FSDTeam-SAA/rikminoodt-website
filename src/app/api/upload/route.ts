import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "dlpdumtua";
const API_KEY = process.env.CLOUDINARY_API_KEY || "883319152857646";
const API_SECRET = process.env.CLOUDINARY_API_SECRET || "321XZDG7vEbm1b7bQJoBU8zAMKg";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = `data:${file.type || "image/png"};base64,${buffer.toString("base64")}`;

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "storybook/pages";

    // Generate SHA-1 signature required by Cloudinary REST API
    const toSign = `folder=${folder}&timestamp=${timestamp}${API_SECRET}`;
    const signature = crypto.createHash("sha1").update(toSign).digest("hex");

    const uploadParams = new URLSearchParams({
      file: base64Data,
      api_key: API_KEY,
      timestamp: String(timestamp),
      folder,
      signature,
    });

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: uploadParams.toString(),
    });

    const result = await response.json();

    if (!response.ok || !result?.secure_url) {
      console.error("Cloudinary upload error:", result);
      return NextResponse.json(
        { error: result?.error?.message || "Failed to upload image to Cloudinary." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.secure_url,
    });
  } catch (err: unknown) {
    const error = err as { message?: string };
    console.error("Upload route error:", error);
    return NextResponse.json(
      { error: error?.message || "Server error while uploading image." },
      { status: 500 }
    );
  }
}
