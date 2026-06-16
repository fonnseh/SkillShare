import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/utils";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: {
        skills: { include: { skill: true } },
        experiences: { orderBy: { startDate: "desc" } },
        educations: { orderBy: { startDate: "desc" } },
        certifications: true,
        projects: true,
      },
    });
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, image: true, role: true },
    });
    return apiSuccess({ profile, user });
  } catch {
    return apiError("Failed to fetch profile", 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);
    const body = await req.json();
    const { name, ...profileData } = body;
    if (name) await prisma.user.update({ where: { id: session.user.id }, data: { name } });
    const profile = await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: profileData,
      create: { userId: session.user.id, ...profileData },
    });
    return apiSuccess({ profile });
  } catch {
    return apiError("Failed to update profile", 500);
  }
}
