"use client";
import PublicRoute from "@/components/auth/PublicRoute";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    alert("Login button clicked");

    console.log("Login button clicked");

    setLoading(true);
    setError("");

    try {
        console.log("Sending request...");

        const response = await api.post("/auth/login", {
            email,
            password,
        });

        console.log(response);

        login(response.data.user);

        router.push("/");
    }   catch (err: any) {
        console.error(err);

        setError(
            err.response?.data?.detail ??
            err.message ??
            "Login failed."
        );
    }

    setLoading(false);
}
  return (
    <PublicRoute>
      <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-950 px-6">

        <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 shadow-2xl p-8">

          <div className="mb-8 text-center">

            <h1 className="text-4xl font-bold">
              IndusBrain AI
            </h1>

            <p className="mt-2 text-gray-500 dark:text-slate-400">
              Sign in to your workspace
            </p>

          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            <div>

              <label className="mb-2 block text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className="w-full rounded-xl border p-3 dark:bg-slate-800 dark:border-slate-700"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className="w-full rounded-xl border p-3 dark:bg-slate-800 dark:border-slate-700"
              />

            </div>

            {error && (

              <p className="text-red-500 text-sm">
                {error}
              </p>

            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 text-white hover:bg-blue-700"
            >

              {loading
                ? "Signing In..."
                : "Sign In"}

            </button>

          </form>

          <p className="mt-8 text-center text-sm">

            Don't have an account?{" "}

            <Link
              href="/register"
              className="text-blue-600 font-semibold"
            >
              Register
            </Link>

          </p>

        </div>

      </div>
    </PublicRoute>            
  );
}