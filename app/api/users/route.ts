import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, getPaginationParams } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") return apiError("Admin only", 403);

    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());
    const { page, limit, skip } = getPaginationParams(params);

    const where: any = {};
    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { email: { contains: params.search, mode: "insensitive" } },
      ];
    }
    if (params.role) where.role = params.role;
    if (params.status === "active") where.isActive = true;
    if (params.status === "suspended") where.isSuspended = true;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true, name: true, email: true, role: true,
          isActive: true, isSuspended: true, lastLogin: true, createdAt: true,
          profile: { select: { location: true } },
          company: { select: { name: true } },
          _count: { select: { applications: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return apiSuccess({ users, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    console.error("[USERS_GET]", err);
    return apiError("Failed to fetch users", 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") return apiError("Admin only", 403);

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");
    if (!userId) return apiError("User ID required", 400);

    const body = await req.json();
    const { action } = body;

    const updateData: any = {};
    if (action === "suspend") { updateData.isSuspended = true; updateData.isActive = false; }
    if (action === "activate") { updateData.isSuspended = false; updateData.isActive = true; }
    if (action === "delete") {
      await prisma.user.delete({ where: { id: userId } });
      return apiSuccess({ message: "User deleted" });
    }

    const user = await prisma.user.update({ where: { id: userId }, data: updateData });
    return apiSuccess({ user });
  } catch (err) {
    console.error("[USERS_PATCH]", err);
    return apiError("Failed to update user", 500);
  }
}
