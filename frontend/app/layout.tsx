import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import { DashboardProvider } from "@/context/DashboardContext";
import { ThemeProvider } from "@/context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IndusBrain AI",
  description: "AI-powered Industrial Document Intelligence Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            <DashboardProvider>
              {children}

              <Toaster
                position="top-right"
                richColors
                closeButton
                duration={3000}
                expand
                visibleToasts={5}
              />
            </DashboardProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}