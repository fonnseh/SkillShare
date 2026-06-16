import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: {
    default: "SkillBridge - Bridge Your Skills to Limitless Opportunities",
    template: "%s | SkillBridge",
  },
  description:
    "SkillBridge connects talented individuals with top employers based on skills, not just degrees. Find your dream job, post opportunities, and grow your career.",
  keywords: ["jobs", "careers", "skills", "recruitment", "internships", "Nigeria", "Africa"],
  authors: [{ name: "SkillBridge" }],
  creator: "SkillBridge",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "SkillBridge",
    description: "Bridge Your Skills to Limitless Opportunities",
    siteName: "SkillBridge",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillBridge",
    description: "Bridge Your Skills to Limitless Opportunities",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#0d1117] text-white antialiased">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            richColors
            theme="dark"
            toastOptions={{
              style: {
                background: "#161b22",
                border: "1px solid #30363d",
                color: "#e6edf3",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
