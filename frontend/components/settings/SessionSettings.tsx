"use client";

import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function SessionSettings() {

    const router = useRouter();

    const { logout } = useAuth();

    async function handleLogout() {

        try {

            await api.post("/auth/logout");

        } catch {}

        logout();

        router.push("/login");

    }

    return (

        <div className="rounded-2xl bg-white p-8 shadow">

            <h2 className="text-2xl font-semibold mb-6">
                Session
            </h2>

            <button
                onClick={handleLogout}
                className="rounded-lg bg-red-600 px-6 py-3 text-white hover:bg-red-700"
            >
                Logout
            </button>

        </div>

    );

}