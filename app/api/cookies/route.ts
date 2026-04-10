import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!)
//AWS S3 BUCKET SET UP
const region = "eu-north-1";
const bucketName = "daily-digest-cookies";
const accessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY;
const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_KEY;

const s3 = new S3Client({
  region:region,
  credentials: {
    accessKeyId:accessKeyId!,
    secretAccessKey:secretAccessKey!
  },
});

async function generateUploadURL(cookieName:string) {
  const cleanName = cookieName.toLowerCase().replace(/\s+/g, "-");
  console.log(cleanName);
  const imageName = `${cleanName}-${crypto.randomBytes(15).toString("hex")}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: imageName,
  });

  const uploadURL = await getSignedUrl(s3, command, { expiresIn: 60 });
  return uploadURL;
}

export async function POST(request: NextRequest) {
  try {
    const {cookieName} = await request.json();
    const uploadURL = await generateUploadURL(cookieName);
    return NextResponse.json({ uploadURL });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
}

export async function PUT(request:NextRequest) {
  try {
    const {cookiePath, name} = await request.json();
    const [items] = await Promise.all([
     sql`UPDATE sources SET cookies_url = ${cookiePath} WHERE name = ${name}`
    ]) 

    return NextResponse.json({  });
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { name } = await request.json();
    await sql`UPDATE sources SET cookies_url = NULL WHERE name = ${name}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error clearing cookies:", error);
    return NextResponse.json({ error: "Failed to clear cookies" }, { status: 500 });
  }
}