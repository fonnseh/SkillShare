import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, generateSlug, getPaginationParams } from "@/lib/utils";
import { z } from "zod";

const createJobSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(50),
  requirements: z.string().optional(),
  responsibilities: z.string().optional(),
  benefits: z.string().optional(),
  type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE", "REMOTE"]),
  level: z.enum(["ENTRY", "JUNIOR", "MID", "SENIOR", "LEAD", "EXECUTIVE"]),
  location: z.string().optional(),
  isRemote: z.boolean().default(false),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  salaryCurrency: z.string().default("USD"),
  salaryPeriod: z.string().default("yearly"),
  skills: z.array(z.string()).optional(),
  deadline: z.string().optional(),
});

// GET /api/jobs
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());
    const { page, limit, skip } = getPaginationParams(params);

    const where: any = { status: "ACTIVE" };

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: "insensitive" } },
        { description: { contains: params.search, mode: "insensitive" } },
        { company: { name: { contains: params.search, mode: "insensitive" } } },
      ];
    }
    if (params.location) where.location = { contains: params.location, mode: "insensitive" };
    if (params.type) where.type = params.type;
    if (params.level) where.level = params.level;
    if (params.isRemote === "true") where.isRemote = true;
    if (params.companyId) where.companyId = params.companyId;

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          company: { select: { id: true, name: true, logoUrl: true, isVerified: true, location: true } },
          skills: { include: { skill: true } },
          _count: { select: { applications: true, savedBy: true } },
        },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.job.count({ where }),
    ]);

    return apiSuccess({ jobs, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    console.error("[JOBS_GET]", err);
    return apiError("Failed to fetch jobs", 500);
  }
}

// POST /api/jobs
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);
    if ((session.user as any).role !== "EMPLOYER") return apiError("Employers only", 403);

    const company = await prisma.company.findUnique({ where: { userId: session.user.id } });
    if (!company) return apiError("Company profile required", 404);

    const body = await req.json();
    const data = createJobSchema.parse(body);

    const job = await prisma.job.create({
      data: {
        companyId: company.id,
        title: data.title,
        slug: generateSlug(data.title),
        description: data.description,
        requirements: data.requirements,
        responsibilities: data.responsibilities,
        benefits: data.benefits,
        type: data.type as any,
        level: data.level as any,
        location: data.location,
        isRemote: data.isRemote,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        salaryCurrency: data.salaryCurrency,
        salaryPeriod: data.salaryPeriod,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
        skills: data.skills?.length
          ? {
              create: await Promise.all(
                data.skills.map(async (skillName) => {
                  const skill = await prisma.skill.upsert({
                    where: { name: skillName },
                    update: {},
                    create: { name: skillName },
                  });
                  return { skillId: skill.id, isRequired: true };
                })
              ),
            }
          : undefined,
      },
      include: { company: true, skills: { include: { skill: true } } },
    });

    return apiSuccess({ job }, 201);
  } catch (err: any) {
    if (err.name === "ZodError") return apiError("Invalid input", 422);
    console.error("[JOBS_POST]", err);
    return apiError("Failed to create job", 500);
  }
}
