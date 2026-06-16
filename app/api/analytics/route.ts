import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const role = (session.user as any).role;

    if (role === "JOB_SEEKER") {
      const [applications, savedJobs, profile] = await Promise.all([
        prisma.application.groupBy({
          by: ["status"],
          where: { userId: session.user.id },
          _count: { id: true },
        }),
        prisma.savedJob.count({ where: { userId: session.user.id } }),
        prisma.profile.findUnique({ where: { userId: session.user.id }, select: { profileStrength: true } }),
      ]);
      const appMap = Object.fromEntries(applications.map((a) => [a.status, a._count.id]));
      return apiSuccess({
        totalApplications: Object.values(appMap).reduce((a: any, b: any) => a + b, 0),
        interviews: appMap["INTERVIEW_SCHEDULED"] || 0,
        savedJobs,
        profileStrength: profile?.profileStrength || 0,
        applicationsByStatus: appMap,
      });
    }

    if (role === "EMPLOYER") {
      const company = await prisma.company.findUnique({ where: { userId: session.user.id } });
      if (!company) return apiError("Company not found", 404);

      const [activeJobs, totalApplicants, interviews, hired] = await Promise.all([
        prisma.job.count({ where: { companyId: company.id, status: "ACTIVE" } }),
        prisma.application.count({ where: { job: { companyId: company.id } } }),
        prisma.application.count({ where: { job: { companyId: company.id }, status: "INTERVIEW_SCHEDULED" } }),
        prisma.application.count({ where: { job: { companyId: company.id }, status: "HIRED" } }),
      ]);
      return apiSuccess({ activeJobs, totalApplicants, interviews, hired });
    }

    if (role === "ADMIN") {
      const [totalUsers, companies, jobsPosted, totalApplications] = await Promise.all([
        prisma.user.count(),
        prisma.company.count(),
        prisma.job.count(),
        prisma.application.count(),
      ]);

      const monthlyData = await prisma.analytics.findMany({
        orderBy: { date: "asc" },
        take: 84,
      });

      const recentUsers = await prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, role: true, createdAt: true, isActive: true, isSuspended: true },
      });

      return apiSuccess({ totalUsers, companies, jobsPosted, totalApplications, monthlyData, recentUsers });
    }

    return apiError("Unauthorized", 403);
  } catch (err) {
    console.error("[ANALYTICS_GET]", err);
    return apiError("Failed to fetch analytics", 500);
  }
}
