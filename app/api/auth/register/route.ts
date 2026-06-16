import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError } from "@/lib/utils";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["JOB_SEEKER", "EMPLOYER"]).default("JOB_SEEKER"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) return apiError("Email already registered", 409);

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        profile: { create: { profileStrength: 20 } },
      },
      select: { id: true, email: true, name: true, role: true },
    });

    return apiSuccess({ user }, 201);
  } catch (err: any) {
    if (err.name === "ZodError") return apiError("Invalid input", 422);
    console.error("[REGISTER]", err);
    return apiError("Registration failed", 500);
  }
}
