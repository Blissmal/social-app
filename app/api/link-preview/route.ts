import { NextRequest, NextResponse } from "next/server";
import { getLinkPreview } from "link-preview-js";

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  if (!url) {
    return NextResponse.json({ error: "No URL provided" }, { status: 400 });
  }

  try {
    const data = await getLinkPreview(url);
  
    const hasPreview =
      "title" in data &&
      (data.title || data.description || (data.images && data.images.length > 0));
  
    const image = "images" in data && Array.isArray(data.images) ? data.images[0] : null;
    const isValidImage = typeof image === "string" && image.startsWith("http");
  
    const safeTitle =
      "title" in data && typeof data.title === "string" ? data.title : url;
    const safeDescription =
      "description" in data && typeof data.description === "string"
        ? data.description
        : "No description available.";
  
    const preview = {
      url: data.url || url,
      title: hasPreview ? safeTitle : url,
      description: hasPreview ? safeDescription : "No preview available.",
      image: hasPreview && isValidImage ? image : null,
      type: hasPreview ? "preview" : "fallback",
    };
  
    return NextResponse.json(preview);
  } catch (error) {
    console.error("Link preview fetch error:", error);
  
    return NextResponse.json({
      url,
      title: url,
      description: "No preview available.",
      image: null,
      type: "fallback",
    });
  }
  
}
