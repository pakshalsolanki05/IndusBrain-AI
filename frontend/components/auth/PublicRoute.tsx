"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function PublicRoute({
  children,
}: {
  children: React.ReactNode;
}) {

  const {
    user,
    loading,
  } = useAuth();

  const router = useRouter();

  useEffect(() => {

    if (!loading && user) {

      router.replace("/");

    }

  }, [loading, user, router]);

  if (loading) {

    return (

      <div className="flex min-h-screen items-center justify-center">

        <p className="text-lg font-semibold">
          Checking session...
        </p>

      </div>

    );

  }

  if (user) {

    return null;

  }

  return <>{children}</>;

}