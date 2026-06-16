import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/utils";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);
    const messages = await prisma.message.findMany({
      where: { OR: [{ senderId: session.user.id }, { receiverId: session.user.id }] },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        receiver: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return apiSuccess({ messages });
  } catch {
    return apiError("Failed to fetch messages", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);
    const { receiverId, content } = await req.json();
    if (!receiverId || !content) return apiError("Missing fields", 400);
    const message = await prisma.message.create({
      data: { senderId: session.user.id, receiverId, content },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        receiver: { select: { id: true, name: true, image: true } },
      },
    });
    return apiSuccess({ message }, 201);
  } catch {
    return apiError("Failed to send message", 500);
  }
}
