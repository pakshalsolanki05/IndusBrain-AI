"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function ProfileSettings() {
    const { user } = useAuth();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFullName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    async function saveProfile() {
        try {
            setLoading(true);

            const response = await api.put("/auth/profile", {
                full_name: fullName,
                email: email,
            });

            alert(response.data.message);

        } catch (error: any) {

            alert(
                error.response?.data?.detail ??
                "Unable to update profile."
            );

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="rounded-2xl bg-white dark:bg-zinc-900 p-8 shadow">

            <h2 className="text-2xl font-semibold mb-6">
                Profile
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>

                    <label className="text-sm text-gray-500">
                        Full Name
                    </label>

                    <input
                        value={fullName}
                        onChange={(e) =>
                            setFullName(e.target.value)
                        }
                        className="mt-2 w-full rounded-lg border p-3"
                    />

                </div>

                <div>

                    <label className="text-sm text-gray-500">
                        Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        className="mt-2 w-full rounded-lg border p-3"
                    />

                </div>

            </div>

            <div className="mt-8 flex justify-end">

                <button
                    onClick={saveProfile}
                    disabled={loading}
                    className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading
                        ? "Saving..."
                        : "Save Changes"}
                </button>

            </div>

        </div>
    );
}