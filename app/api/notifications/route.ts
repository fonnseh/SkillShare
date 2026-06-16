import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/utils";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);
    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 30,
    });
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    return apiSuccess({ notifications, unreadCount });
  } catch {
    return apiError("Failed to fetch notifications", 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);
    const { id, markAllRead } = await req.json();
    if (markAllRead) {
      await prisma.notification.updateMany({ where: { userId: session.user.id, isRead: false }, data: { isRead: true } });
    } else if (id) {
      await prisma.notification.update({ where: { id }, data: { isRead: true } });
    }
    return apiSuccess({ message: "Updated" });
  } catch {
    return apiError("Failed to update notification", 500);
  }
}
