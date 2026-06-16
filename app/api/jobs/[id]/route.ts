import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/utils";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: {
        company: true,
        skills: { include: { skill: true } },
        _count: { select: { applications: true, savedBy: true } },
      },
    });
    if (!job) return apiError("Job not found", 404);
    await prisma.job.update({ where: { id: params.id }, data: { viewCount: { increment: 1 } } });
    return apiSuccess({ job });
  } catch {
    return apiError("Failed to fetch job", 500);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);
    const body = await req.json();
    const job = await prisma.job.update({ where: { id: params.id }, data: body });
    return apiSuccess({ job });
  } catch {
    return apiError("Failed to update job", 500);
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);
    await prisma.job.delete({ where: { id: params.id } });
    return apiSuccess({ message: "Job deleted" });
  } catch {
    return apiError("Failed to delete job", 500);
  }
}
