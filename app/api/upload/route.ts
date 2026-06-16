import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/utils";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string || "image";

    if (!file) return apiError("No file provided", 400);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const folder = type === "resume" ? "skillbridge/resumes" : "skillbridge/avatars";
    const resourceType = type === "resume" ? "raw" : "image";

    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: resourceType,
      public_id: `${session.user.id}_${Date.now()}`,
    });

    return apiSuccess({ url: result.secure_url, publicId: result.public_id });
  } catch (err) {
    console.error("[UPLOAD]", err);
    return apiError("Upload failed", 500);
  }
}
