"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function SecuritySettings() {
    const router = useRouter();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);

    async function changePassword() {
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert("Please fill all fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.put("/auth/change-password", {
                current_password: currentPassword,
                new_password: newPassword,
            });

            alert(response.data.message);

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (error: any) {
            alert(
                error.response?.data?.detail ??
                "Unable to change password."
            );
        } finally {
            setLoading(false);
        }
    }

    async function logout() {
        try {
            await api.post("/auth/logout");

            router.push("/login");
            router.refresh();

        } catch {
            alert("Unable to logout.");
        }
    }

    async function deleteAccount() {
        const confirmed = window.confirm(
            "This action cannot be undone.\n\nDelete your account?"
        );

        if (!confirmed) return;

        try {
            setDeleting(true);

            await api.delete("/auth/delete-account");

            router.push("/register");
            router.refresh();

        } catch {
            alert("Unable to delete account.");
        } finally {
            setDeleting(false);
        }
    }

    return (
        <div className="rounded-2xl bg-white dark:bg-zinc-900 p-8 shadow">

            <h2 className="text-2xl font-semibold">
                Security
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-2 mb-8">
                Manage your password and account security.
            </p>

            <div className="space-y-4">

                <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-lg border p-3"
                />

                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-lg border p-3"
                />

                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-lg border p-3"
                />

                <button
                    onClick={changePassword}
                    disabled={loading}
                    className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Updating..." : "Update Password"}
                </button>

            </div>

            <hr className="my-8" />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>
                    <h3 className="font-semibold">
                        Logout
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Sign out from this device.
                    </p>
                </div>

                <button
                    onClick={logout}
                    className="rounded-lg border px-6 py-3 hover:bg-gray-100 dark:hover:bg-zinc-800"
                >
                    Logout
                </button>

            </div>

            <hr className="my-8" />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>

                    <h3 className="font-semibold text-red-600">
                        Danger Zone
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Permanently delete your account and all associated data.
                    </p>

                </div>

                <button
                    onClick={deleteAccount}
                    disabled={deleting}
                    className="rounded-lg bg-red-600 px-6 py-3 text-white hover:bg-red-700 disabled:opacity-50"
                >
                    {deleting ? "Deleting..." : "Delete Account"}
                </button>

            </div>

        </div>
    );
}
