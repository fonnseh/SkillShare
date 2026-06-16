import {
  PrismaClient,
  UserRole,
  JobType,
  JobStatus,
  ExperienceLevel,
  ApplicationStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create Admin
  const adminPassword = await bcrypt.hash("Admin@123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@skillbridge.com" },
    update: {},
    create: {
      email: "admin@skillbridge.com",
      name: "Admin User",
      password: adminPassword,
      role: UserRole.ADMIN,
      emailVerified: new Date(),
      profile: {
        create: {
          headline: "Platform Administrator",
          location: "San Francisco, CA",
          profileStrength: 100,
        },
      },
    },
  });

  // Create Employer Users
  const employerPassword = await bcrypt.hash("Employer@123", 12);

  const employer1 = await prisma.user.upsert({
    where: { email: "hr@techsolutions.com" },
    update: {},
    create: {
      email: "hr@techsolutions.com",
      name: "Sarah Johnson",
      password: employerPassword,
      role: UserRole.EMPLOYER,
      emailVerified: new Date(),
      profile: {
        create: {
          headline: "HR Manager at Tech Solutions Ltd",
          location: "Buea, Cameroon",
          profileStrength: 85,
        },
      },
      company: {
        create: {
          name: "Tech Solutions Ltd",
          slug: "tech-solutions-ltd",
          description: "Leading technology solutions provider in West Africa",
          industry: "Technology",
          size: "201-500",
          website: "https://techsolutions.com",
          location: "Buea, Cameroon",
          founded: 2015,
          isVerified: true,
        },
      },
    },
  });

  const employer2 = await prisma.user.upsert({
    where: { email: "recruit@codecraft.io" },
    update: {},
    create: {
      email: "recruit@codecraft.io",
      name: "Michael Chen",
      password: employerPassword,
      role: UserRole.EMPLOYER,
      emailVerified: new Date(),
      profile: {
        create: {
          headline: "Tech Recruiter at CodeCraft Inc.",
          location: "Remote",
          profileStrength: 80,
        },
      },
      company: {
        create: {
          name: "CodeCraft Inc.",
          slug: "codecraft-inc",
          description: "Building tomorrow's digital solutions today",
          industry: "Software Development",
          size: "51-200",
          website: "https://codecraft.io",
          location: "Remote",
          founded: 2019,
          isVerified: true,
        },
      },
    },
  });

  // Create Job Seeker Users
  const seekerPassword = await bcrypt.hash("Seeker@123", 12);

  const jobSeeker1 = await prisma.user.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: {
      email: "john@example.com",
      name: "John Doe",
      password: seekerPassword,
      role: UserRole.JOB_SEEKER,
      emailVerified: new Date(),
      profile: {
        create: {
          headline: "Full Stack Developer | React & Node.js",
          bio: "Passionate developer with 3+ years of experience building scalable web applications.",
          location: "Buea, Cameroon",
          phone: "+234 801 234 5678",
          profileStrength: 88,
        },
      },
    },
  });

  const jobSeeker2 = await prisma.user.upsert({
    where: { email: "jane@example.com" },
    update: {},
    create: {
      email: "jane@example.com",
      name: "Jane Smith",
      password: seekerPassword,
      role: UserRole.JOB_SEEKER,
      emailVerified: new Date(),
      profile: {
        create: {
          headline: "UI/UX Designer | Figma & Adobe XD",
          bio: "Creative designer focused on building intuitive user experiences.",
          location: "Abuja, Nigeria",
          profileStrength: 75,
        },
      },
    },
  });

  // Create Skills
  const skillNames = [
    "React",
    "Node.js",
    "TypeScript",
    "JavaScript",
    "Python",
    "Django",
    "PostgreSQL",
    "MongoDB",
    "Docker",
    "Kubernetes",
    "AWS",
    "Git",
    "Next.js",
    "Vue.js",
    "Angular",
    "Express.js",
    "GraphQL",
    "REST API",
    "Figma",
    "Adobe XD",
    "CSS",
    "HTML",
    "Tailwind CSS",
    "SASS",
    "Machine Learning",
    "Data Science",
    "TensorFlow",
    "PyTorch",
    "Java",
    "Spring Boot",
    "PHP",
    "Laravel",
    "Ruby on Rails",
    "React Native",
    "Flutter",
    "Swift",
    "Kotlin",
    "C++",
    "C#",
    "Problem Solving",
    "Communication",
    "Teamwork",
    "Leadership",
    "Project Management",
    "Agile",
    "Scrum",
  ];

  const skills = await Promise.all(
    skillNames.map((name) =>
      prisma.skill.upsert({
        where: { name },
        update: {},
        create: {
          name,
          category: getCategoryForSkill(name),
        },
      }),
    ),
  );

  // Add skills to job seeker profiles
  const john = await prisma.profile.findUnique({
    where: { userId: jobSeeker1.id },
  });
  if (john) {
    const skillsToAdd = ["React", "Node.js", "TypeScript", "MongoDB", "Git"];
    for (const skillName of skillsToAdd) {
      const skill = skills.find((s) => s.name === skillName);
      if (skill) {
        await prisma.profileSkill.upsert({
          where: {
            profileId_skillId: { profileId: john.id, skillId: skill.id },
          },
          update: {},
          create: {
            profileId: john.id,
            skillId: skill.id,
            level: "Advanced",
            yearsExp: 3,
          },
        });
      }
    }
  }

  // Get companies
  const company1 = await prisma.company.findUnique({
    where: { slug: "tech-solutions-ltd" },
  });
  const company2 = await prisma.company.findUnique({
    where: { slug: "codecraft-inc" },
  });

  // Create Jobs
  if (company1) {
    const job1 = await prisma.job.create({
      data: {
        companyId: company1.id,
        title: "Full Stack Developer",
        slug: `full-stack-developer-${Date.now()}`,
        description: `We are looking for a skilled Full Stack Developer with experience in building scalable web applications.

Join our dynamic team and work on exciting projects that impact millions of users across Africa.`,
        requirements: `• 2+ years experience in React and Node.js
• Proficiency in MongoDB and PostgreSQL
• Experience with REST APIs and GraphQL
• Knowledge of Git and version control
• Strong problem-solving skills`,
        responsibilities: `• Design and develop full stack features
• Collaborate with product and design teams
• Write clean, maintainable code
• Participate in code reviews
• Mentor junior developers`,
        benefits: `• Competitive salary
• Health insurance
• Remote work options
• Learning & development budget
• 25 days annual leave`,
        type: JobType.FULL_TIME,
        status: JobStatus.ACTIVE,
        level: ExperienceLevel.MID,
        location: "Buea, Cameroon",
        isRemote: false,
        salaryMin: 800000,
        salaryMax: 1200000,
        salaryCurrency: "NGN",
        salaryPeriod: "monthly",
        isFeatured: true,
        viewCount: 245,
        applicationCount: 18,
      },
    });

    // Add skills to job
    const jobSkillNames = ["React", "Node.js", "MongoDB", "TypeScript"];
    for (const skillName of jobSkillNames) {
      const skill = skills.find((s) => s.name === skillName);
      if (skill) {
        await prisma.jobSkill.create({
          data: { jobId: job1.id, skillId: skill.id, isRequired: true },
        });
      }
    }

    // Create applications
    if (john) {
      await prisma.application.create({
        data: {
          userId: jobSeeker1.id,
          jobId: job1.id,
          status: ApplicationStatus.UNDER_REVIEW,
          coverLetter:
            "I am excited to apply for this Full Stack Developer position...",
          matchScore: 92,
        },
      });
    }
  }

  if (company2) {
    const job2 = await prisma.job.create({
      data: {
        companyId: company2.id,
        title: "Backend Developer",
        slug: `backend-developer-${Date.now()}`,
        description:
          "We need an experienced Backend Developer to build our microservices architecture.",
        requirements: `• 3+ years Python/Django experience
• PostgreSQL and Redis proficiency
• Docker and Kubernetes experience
• AWS or GCP knowledge`,
        type: JobType.FULL_TIME,
        status: JobStatus.ACTIVE,
        level: ExperienceLevel.SENIOR,
        location: "Remote",
        isRemote: true,
        salaryMin: 5000,
        salaryMax: 8000,
        salaryCurrency: "USD",
        salaryPeriod: "monthly",
        viewCount: 189,
        applicationCount: 24,
      },
    });

    const job3 = await prisma.job.create({
      data: {
        companyId: company2.id,
        title: "Frontend Developer",
        slug: `frontend-developer-${Date.now()}`,
        description:
          "Join our team as a Frontend Developer and help build beautiful, responsive UIs.",
        requirements: `• 2+ years React/Next.js experience
• TypeScript proficiency
• CSS/Tailwind CSS expertise
• Performance optimization skills`,
        type: JobType.FULL_TIME,
        status: JobStatus.ACTIVE,
        level: ExperienceLevel.MID,
        location: "Buea, Cameroon",
        isRemote: false,
        salaryMin: 600000,
        salaryMax: 900000,
        salaryCurrency: "NGN",
        salaryPeriod: "monthly",
        viewCount: 312,
        applicationCount: 31,
      },
    });
  }

  // Create analytics data
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    await prisma.analytics.upsert({
      where: {
        date_metric_dimension: {
          date,
          metric: "applications",
          dimension: "total",
        },
      },
      update: {},
      create: {
        date,
        metric: "applications",
        value: Math.floor(Math.random() * 500) + 200,
        dimension: "total",
      },
    });
    await prisma.analytics.upsert({
      where: {
        date_metric_dimension: { date, metric: "users", dimension: "total" },
      },
      update: {},
      create: {
        date,
        metric: "users",
        value: Math.floor(Math.random() * 1000) + 3000,
        dimension: "total",
      },
    });
    await prisma.analytics.upsert({
      where: {
        date_metric_dimension: { date, metric: "jobs", dimension: "total" },
      },
      update: {},
      create: {
        date,
        metric: "jobs",
        value: Math.floor(Math.random() * 200) + 800,
        dimension: "total",
      },
    });
  }

  console.log("✅ Database seeded successfully!");
  console.log("\n📋 Test Credentials:");
  console.log("Admin: admin@skillbridge.com / Admin@123");
  console.log("Employer: hr@techsolutions.com / Employer@123");
  console.log("Job Seeker: john@example.com / Seeker@123");
}

function getCategoryForSkill(name: string): string {
  const categories: Record<string, string> = {
    React: "Frontend",
    "Next.js": "Frontend",
    "Vue.js": "Frontend",
    Angular: "Frontend",
    JavaScript: "Frontend",
    TypeScript: "Frontend",
    CSS: "Frontend",
    HTML: "Frontend",
    "Tailwind CSS": "Frontend",
    "Node.js": "Backend",
    "Express.js": "Backend",
    Django: "Backend",
    "Spring Boot": "Backend",
    Laravel: "Backend",
    Python: "Backend",
    Java: "Backend",
    PHP: "Backend",
    PostgreSQL: "Database",
    MongoDB: "Database",
    MySQL: "Database",
    Redis: "Database",
    Docker: "DevOps",
    Kubernetes: "DevOps",
    AWS: "DevOps",
    Git: "DevOps",
    Figma: "Design",
    "Adobe XD": "Design",
    "Machine Learning": "AI/ML",
    "Data Science": "AI/ML",
    TensorFlow: "AI/ML",
    PyTorch: "AI/ML",
    "React Native": "Mobile",
    Flutter: "Mobile",
    Swift: "Mobile",
    Kotlin: "Mobile",
    Communication: "Soft Skills",
    Teamwork: "Soft Skills",
    Leadership: "Soft Skills",
    "Problem Solving": "Soft Skills",
  };
  return categories[name] || "Other";
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
