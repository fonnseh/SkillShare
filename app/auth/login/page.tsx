"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Zap, Github, Chrome, Loader2, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Welcome back!");
        router.push("/dashboard/job-seeker");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    await signIn(provider, { callbackUrl: "/dashboard/job-seeker" });
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0f2346 0%, #0d1b2e 100%)" }}>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-center">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-2xl">SkillBridge</span>
          </Link>
          <h2 className="text-3xl font-bold text-white mb-4">Welcome Back!</h2>
          <p className="text-slate-400 mb-10 max-w-xs">Log in to your account and continue building your future</p>
          {/* Illustration */}
          <div className="w-64 h-64 relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="card-dark p-6 rounded-2xl text-center w-48">
                <div className="text-3xl font-bold text-blue-400 mb-1">12</div>
                <div className="text-slate-400 text-xs mb-3">New matches today</div>
                <div className="flex justify-center gap-1">
                  {[85, 92, 78, 95].map((v) => (
                    <div key={v} className="w-6 bg-[#21262d] rounded overflow-hidden" style={{ height: 40 }}>
                      <div className="w-full bg-blue-500 rounded" style={{ height: `${v * 0.4}px`, marginTop: `${(40 - v * 0.4)}px` }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 flex gap-8 text-center">
            <div><div className="text-2xl font-bold text-blue-400">10K+</div><div className="text-slate-400 text-xs">Active Jobs</div></div>
            <div><div className="text-2xl font-bold text-cyan-400">98%</div><div className="text-slate-400 text-xs">Success Rate</div></div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl">SkillBridge</span>
            </Link>
          </div>

          <div className="card-dark p-8">
            <h1 className="text-2xl font-bold text-white mb-1">Welcome Back</h1>
            <p className="text-slate-400 text-sm mb-6">Log in to your account</p>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => handleSocialLogin("google")}
                className="btn-secondary flex items-center justify-center gap-2 text-sm py-2.5"
              >
                <Chrome className="w-4 h-4 text-red-400" />
                Google
              </button>
              <button
                onClick={() => handleSocialLogin("github")}
                className="btn-secondary flex items-center justify-center gap-2 text-sm py-2.5"
              >
                <Github className="w-4 h-4" />
                GitHub
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-[#30363d]" />
              <span className="text-slate-500 text-xs">or continue with email</span>
              <div className="flex-1 h-px bg-[#30363d]" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm text-slate-300 font-medium">Password</label>
                  <Link href="/auth/forgot-password" className="text-xs text-blue-400 hover:text-blue-300">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
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

              <div className="flex items-center gap-2">
                <input
                  {...register("remember")}
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-[#30363d] bg-[#21262d] text-blue-600"
                />
                <label htmlFor="remember" className="text-sm text-slate-400">
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <p className="text-center text-slate-400 text-sm mt-6">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
