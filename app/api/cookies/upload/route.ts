import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const websiteName = formData.get("websiteName") as string | null;

    if (!file || !websiteName) {
      return NextResponse.json(
        { error: "File and websiteName are required" },
        { status: 400 }
      );
    }

    if (!file.name.endsWith(".json")) {
      return NextResponse.json(
        { error: "Only .json files are supported" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeWebsiteName = websiteName.replace(/[^a-z0-9]/gi, "_").toLowerCase();

    // Upload to Cloudinary using upload_stream
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw", // Needed for non-image/video files like JSON
          folder: "website_cookies",
          public_id: `${safeWebsiteName}_${Date.now()}`,
          format: "json",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      url: (result as any).secure_url,
    });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return NextResponse.json(
      { error: "Failed to upload file to Cloudinary" },
      { status: 500 }
    );
  }
}
