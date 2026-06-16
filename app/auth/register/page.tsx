"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Zap, Github, Chrome, Loader2, Mail, Lock, User, Briefcase, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    role: z.enum(["JOB_SEEKER", "EMPLOYER"]),
    terms: z.boolean().refine((v) => v === true, "You must accept the terms"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "JOB_SEEKER" },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password, role: data.role }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Registration failed");
      toast.success("Account created! Please log in.");
      router.push("/auth/login");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0f2346 0%, #0d1b2e 100%)" }}>
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-center">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-2xl">SkillBridge</span>
          </Link>
          <h2 className="text-3xl font-bold text-white mb-4">Create Your Account</h2>
          <p className="text-slate-400 mb-10 max-w-xs">Join SkillBridge today and unlock your career potential</p>

          {/* Benefits list */}
          <div className="space-y-4 text-left w-full max-w-xs">
            {[
              "AI-powered job matching",
              "Skill portfolio showcase",
              "Resume analysis & scoring",
              "Direct employer connection",
              "Interview preparation tools",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-slate-300 text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md my-8"
        >
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl">SkillBridge</span>
            </Link>
          </div>

          <div className="card-dark p-8">
            <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
            <p className="text-slate-400 text-sm mb-6">Join SkillBridge today</p>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard/job-seeker" })}
                className="btn-secondary flex items-center justify-center gap-2 text-sm py-2.5"
              >
                <Chrome className="w-4 h-4 text-red-400" />
                Google
              </button>
              <button
                onClick={() => signIn("github", { callbackUrl: "/dashboard/job-seeker" })}
                className="btn-secondary flex items-center justify-center gap-2 text-sm py-2.5"
              >
                <Github className="w-4 h-4" />
                GitHub
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-[#30363d]" />
              <span className="text-slate-500 text-xs">or sign up with email</span>
              <div className="flex-1 h-px bg-[#30363d]" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Role Select */}
              <div>
                <label className="block text-sm text-slate-300 mb-2 font-medium">I am a</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "JOB_SEEKER", label: "Job Seeker", icon: User },
                    { value: "EMPLOYER", label: "Employer", icon: Briefcase },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setValue("role", value as "JOB_SEEKER" | "EMPLOYER")}
                      className={`flex items-center justify-center gap-2 py-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                        selectedRole === value
                          ? "bg-blue-600/20 border-blue-500 text-blue-400"
                          : "bg-[#21262d] border-[#30363d] text-slate-400 hover:border-[#484f58]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
                {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role.message}</p>}
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm text-slate-300 mb-1.5 font-medium">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    {...register("name")}
                    type="text"
                    placeholder="John Doe"
                    className="input-dark pl-10"
                  />
                </div>
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-slate-300 mb-1.5 font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="john@example.com"
                    className="input-dark pl-10"
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-slate-300 mb-1.5 font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    className="input-dark pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm text-slate-300 mb-1.5 font-medium">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    {...register("confirmPassword")}
                    type="password"
                    placeholder="Re-enter password"
                    className="input-dark pl-10"
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2">
                <input
                  {...register("terms")}
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 rounded border-[#30363d] bg-[#21262d] text-blue-600 mt-0.5"
                />
                <label htmlFor="terms" className="text-sm text-slate-400">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-400 hover:underline">Terms & Conditions</Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</Link>
                </label>
              </div>
              {errors.terms && <p className="text-red-400 text-xs">{errors.terms.message}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            <p className="text-center text-slate-400 text-sm mt-6">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-medium">
                Log in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
