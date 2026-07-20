"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PublicRoute from "@/components/auth/PublicRoute";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await api.post("/auth/register", {
        full_name: fullName,
        email,
        password,
      });

      alert("Registration successful!");

      router.push("/login");
    } catch (err: any) {
      setError(
        err.response?.data?.detail ??
          "Registration failed."
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
              Create Account
            </h1>

            <p className="mt-2 text-gray-500 dark:text-slate-400">
              Join IndusBrain AI
            </p>
          </div>

          <form
            onSubmit={handleRegister}
            className="space-y-5"
          >

            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              className="w-full rounded-xl border p-3 dark:bg-slate-800 dark:border-slate-700"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full rounded-xl border p-3 dark:bg-slate-800 dark:border-slate-700"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full rounded-xl border p-3 dark:bg-slate-800 dark:border-slate-700"
            />

            {error && (
              <p className="text-red-500 text-sm">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
            >
              {loading
                ? "Creating..."
                : "Create Account"}
            </button>

          </form>

          <p className="mt-8 text-center text-sm text-gray-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-600"
            >
              Login
            </Link>
          </p>

        </div>

      </div>
    </PublicRoute>
  );
}