import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { analyzeResume, calculateJobMatch, analyzeSkillGap, careerChatCompletion } from "@/lib/openai";
import { apiSuccess, apiError } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return apiError("Unauthorized", 401);

    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const body = await req.json();

    switch (action) {
      case "analyze-resume": {
        if (!body.resumeText) return apiError("Resume text required", 400);
        const result = await analyzeResume(body.resumeText);
        if (body.resumeId) {
          await prisma.resume.update({
            where: { id: body.resumeId },
            data: { atsScore: result.atsScore, analysis: result },
          });
        }
        return apiSuccess(result);
      }

      case "job-match": {
        const { candidateSkills, jobRequirements, candidateExperience, jobId } = body;
        if (!candidateSkills || !jobRequirements) return apiError("Missing required fields", 400);
        const result = await calculateJobMatch(candidateSkills, jobRequirements, candidateExperience || "");
        if (jobId) {
          await prisma.aIRecommendation.create({
            data: {
              userId: session.user.id,
              jobId,
              type: "job_match",
              score: result.overallScore,
              title: `Job Match Score`,
              description: result.recommendation,
              data: result,
            },
          });
        }
        return apiSuccess(result);
      }

      case "skill-gap": {
        const { currentSkills, targetRole } = body;
        if (!currentSkills || !targetRole) return apiError("Missing required fields", 400);
        const result = await analyzeSkillGap(currentSkills, targetRole);
        await prisma.aIRecommendation.create({
          data: {
            userId: session.user.id,
            type: "skill_gap",
            title: `Skill Gap Analysis for ${targetRole}`,
            description: `${result.missingSkills?.length || 0} skills to develop`,
            data: result,
          },
        });
        return apiSuccess(result);
      }

      case "career-chat": {
        const { messages } = body;
        if (!messages?.length) return apiError("Messages required", 400);
        const reply = await careerChatCompletion(messages);
        return apiSuccess({ reply });
      }

      case "recommendations": {
        const profile = await prisma.profile.findUnique({
          where: { userId: session.user.id },
          include: { skills: { include: { skill: true } } },
        });
        const userSkills = profile?.skills.map((s) => s.skill.name) || [];
        const jobs = await prisma.job.findMany({
          where: { status: "ACTIVE" },
          include: {
            company: { select: { name: true, logoUrl: true } },
            skills: { include: { skill: true } },
          },
          take: 20,
          orderBy: { createdAt: "desc" },
        });

        const scored = jobs.map((job) => {
          const jobSkills = job.skills.map((s) => s.skill.name);
          const matched = userSkills.filter((s) => jobSkills.includes(s));
          const score = jobSkills.length > 0 ? Math.round((matched.length / jobSkills.length) * 100) : 50;
          return { ...job, matchScore: Math.min(99, score + Math.floor(Math.random() * 15)) };
        });

        scored.sort((a, b) => b.matchScore - a.matchScore);
        return apiSuccess({ recommendations: scored.slice(0, 10) });
      }

      default:
        return apiError("Invalid action", 400);
    }
  } catch (err) {
    console.error("[AI_API]", err);
    return apiError("AI service error", 500);
  }
}
