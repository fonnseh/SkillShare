import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, getPaginationParams } from "@/lib/utils";
import { z } from "zod";

const applySchema = z.object({
  jobId: z.string(),
  coverLetter: z.string().optional(),
  resumeId: z.string().optional(),
});

// GET /api/applications
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = getPaginationParams(Object.fromEntries(searchParams.entries()));

    const role = (session.user as any).role;
    let where: any = {};

    if (role === "JOB_SEEKER") {
      where.userId = session.user.id;
    } else if (role === "EMPLOYER") {
      const company = await prisma.company.findUnique({ where: { userId: session.user.id } });
      if (!company) return apiError("Company not found", 404);
      where.job = { companyId: company.id };
    }

    const status = searchParams.get("status");
    if (status) where.status = status;

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: {
          job: {
            include: {
              company: { select: { id: true, name: true, logoUrl: true } },
              skills: { include: { skill: { select: { name: true } } } },
            },
          },
          user: {
            select: {
              id: true, name: true, email: true, image: true,
              profile: { select: { headline: true, location: true, avatarUrl: true } },
            },
          },
          resume: { select: { id: true, name: true, url: true, atsScore: true } },
        },
        orderBy: { appliedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.application.count({ where }),
    ]);

    return apiSuccess({ applications, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    console.error("[APPLICATIONS_GET]", err);
    return apiError("Failed to fetch applications", 500);
  }
}

// POST /api/applications
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);
    if ((session.user as any).role !== "JOB_SEEKER") return apiError("Job seekers only", 403);

    const body = await req.json();
    const data = applySchema.parse(body);

    const existing = await prisma.application.findUnique({
      where: { userId_jobId: { userId: session.user.id, jobId: data.jobId } },
    });
    if (existing) return apiError("Already applied to this job", 409);

    const job = await prisma.job.findUnique({ where: { id: data.jobId } });
    if (!job || job.status !== "ACTIVE") return apiError("Job not available", 404);

    const application = await prisma.application.create({
      data: {
        userId: session.user.id,
        jobId: data.jobId,
        coverLetter: data.coverLetter,
        resumeId: data.resumeId,
        status: "PENDING",
      },
      include: { job: { include: { company: true } } },
    });

    await prisma.job.update({
      where: { id: data.jobId },
      data: { applicationCount: { increment: 1 } },
    });

    return apiSuccess({ application }, 201);
  } catch (err: any) {
    if (err.name === "ZodError") return apiError("Invalid input", 422);
    console.error("[APPLICATIONS_POST]", err);
    return apiError("Failed to submit application", 500);
  }
}
