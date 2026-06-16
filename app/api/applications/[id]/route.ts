import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/utils";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);
    const body = await req.json();
    const { status, notes } = body;
    const application = await prisma.application.update({
      where: { id: params.id },
      data: { status, notes },
      include: { job: { include: { company: true } }, user: true },
    });
    return apiSuccess({ application });
  } catch {
    return apiError("Failed to update application", 500);
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);
    await prisma.application.update({ where: { id: params.id }, data: { status: "WITHDRAWN" } });
    return apiSuccess({ message: "Application withdrawn" });
  } catch {
    return apiError("Failed to withdraw application", 500);
  }
}
