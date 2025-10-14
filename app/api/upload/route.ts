import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Prepare ImageKit upload
    const imagekitFormData = new FormData();
    const blob = new Blob([buffer], { type: file.type });
    imagekitFormData.append("file", blob, file.name);
    imagekitFormData.append("fileName", file.name);
    if (folder) {
      imagekitFormData.append("folder", folder);
    }
    imagekitFormData.append("useUniqueFileName", "false");

    // Upload to ImageKit
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

    if (!publicKey || !privateKey) {
      return NextResponse.json(
        { error: "ImageKit credentials not configured" },
        { status: 500 }
      );
    }

    const auth = Buffer.from(`${privateKey}:`).toString("base64");

    const uploadResponse = await fetch(
      "https://upload.imagekit.io/api/v1/files/upload",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
        },
        body: imagekitFormData,
      }
    );

    if (!uploadResponse.ok) {
      const error = await uploadResponse.json().catch(() => ({}));
      console.error("ImageKit upload error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to upload to ImageKit" },
        { status: uploadResponse.status }
      );
    }

    const result = await uploadResponse.json();

    return NextResponse.json({
      success: true,
      url: result.url,
      fileId: result.fileId,
      name: result.name,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
