// ── Enums ─────────────────────────────────────────────────────────────────────
export type UserRole = "JOB_SEEKER" | "EMPLOYER" | "ADMIN";
export type ApplicationStatus =
  | "PENDING" | "UNDER_REVIEW" | "SHORTLISTED"
  | "INTERVIEW_SCHEDULED" | "OFFER_EXTENDED" | "HIRED"
  | "REJECTED" | "WITHDRAWN";
export type JobType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "FREELANCE" | "REMOTE";
export type JobStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "CLOSED" | "EXPIRED";
export type ExperienceLevel = "ENTRY" | "JUNIOR" | "MID" | "SENIOR" | "LEAD" | "EXECUTIVE";

// ── User & Auth ───────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role: UserRole;
  isActive: boolean;
  isSuspended: boolean;
  lastLogin?: Date | null;
  createdAt: Date;
  profile?: Profile | null;
  company?: Company | null;
}

export interface Profile {
  id: string;
  userId: string;
  headline?: string | null;
  bio?: string | null;
  phone?: string | null;
  location?: string | null;
  country?: string | null;
  website?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  portfolioUrl?: string | null;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  isPublic: boolean;
  profileStrength: number;
  totalViews: number;
  skills?: ProfileSkill[];
  experiences?: Experience[];
  educations?: Education[];
  certifications?: Certification[];
  projects?: Project[];
}

export interface ProfileSkill {
  id: string;
  skillId: string;
  level?: string | null;
  yearsExp?: number | null;
  endorsed: number;
  skill: { id: string; name: string; category?: string | null };
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string | null;
  startDate: Date;
  endDate?: Date | null;
  isCurrent: boolean;
  description?: string | null;
  skills: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string | null;
  startDate: Date;
  endDate?: Date | null;
  isCurrent: boolean;
  gpa?: number | null;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate?: Date | null;
  expiryDate?: Date | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
}

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  url?: string | null;
  imageUrl?: string | null;
  technologies: string[];
}

// ── Company & Jobs ────────────────────────────────────────────────────────────
export interface Company {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  industry?: string | null;
  size?: string | null;
  website?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  location?: string | null;
  country?: string | null;
  founded?: number | null;
  isVerified: boolean;
  isActive: boolean;
  _count?: { jobs: number };
}

export interface Job {
  id: string;
  companyId: string;
  title: string;
  slug: string;
  description: string;
  requirements?: string | null;
  responsibilities?: string | null;
  benefits?: string | null;
  type: JobType;
  status: JobStatus;
  level: ExperienceLevel;
  location?: string | null;
  isRemote: boolean;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency: string;
  salaryPeriod: string;
  deadline?: Date | null;
  viewCount: number;
  applicationCount: number;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  company: Company;
  skills?: JobSkill[];
  _count?: { applications: number; savedBy: number };
  matchScore?: number;
  isSaved?: boolean;
  hasApplied?: boolean;
}

export interface JobSkill {
  id: string;
  skillId: string;
  isRequired: boolean;
  skill: { id: string; name: string; category?: string | null };
}

// ── Applications ──────────────────────────────────────────────────────────────
export interface Application {
  id: string;
  userId: string;
  jobId: string;
  resumeId?: string | null;
  status: ApplicationStatus;
  coverLetter?: string | null;
  matchScore?: number | null;
  notes?: string | null;
  appliedAt: Date;
  updatedAt: Date;
  job: Job;
  user?: User;
  resume?: Resume | null;
  interviews?: Interview[];
}

export interface Resume {
  id: string;
  name: string;
  url: string;
  fileSize?: number | null;
  isDefault: boolean;
  atsScore?: number | null;
  analysis?: any;
  createdAt: Date;
}

export interface Interview {
  id: string;
  scheduledAt: Date;
  duration?: number | null;
  type?: string | null;
  location?: string | null;
  meetingUrl?: string | null;
  notes?: string | null;
  feedback?: string | null;
  result?: string | null;
}

// ── Messages & Notifications ──────────────────────────────────────────────────
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  sender: { id: string; name?: string | null; image?: string | null };
  receiver: { id: string; name?: string | null; image?: string | null };
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
}

// ── AI Types ──────────────────────────────────────────────────────────────────
export interface ResumeAnalysis {
  atsScore: number;
  skills: string[];
  missingSkills: string[];
  strengths: string[];
  improvements: string[];
  summary: string;
}

export interface JobMatchResult {
  overallScore: number;
  skillMatch: number;
  experienceMatch: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendation: string;
}

export interface SkillGapResult {
  missingSkills: { skill: string; priority: "high" | "medium" | "low"; reason: string }[];
  suggestedCourses: { title: string; platform: string; url: string; duration: string }[];
  estimatedTimeToReady: string;
  careerPath: string[];
}

// ── API Response ──────────────────────────────────────────────────────────────
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ── Dashboard Stats ───────────────────────────────────────────────────────────
export interface JobSeekerStats {
  totalApplications: number;
  interviews: number;
  savedJobs: number;
  profileStrength: number;
}

export interface EmployerStats {
  activeJobs: number;
  totalApplicants: number;
  interviews: number;
  hired: number;
}

export interface AdminStats {
  totalUsers: number;
  companies: number;
  jobsPosted: number;
  totalApplications: number;
}

// ── Filters ───────────────────────────────────────────────────────────────────
export interface JobFilters {
  search?: string;
  location?: string;
  type?: JobType[];
  level?: ExperienceLevel[];
  salaryMin?: number;
  salaryMax?: number;
  isRemote?: boolean;
  skills?: string[];
  page?: number;
  limit?: number;
}
