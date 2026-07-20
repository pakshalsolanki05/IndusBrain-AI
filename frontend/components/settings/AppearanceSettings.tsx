"use client";

import ThemeToggle from "@/components/layout/ThemeToggle";

export default function AppearanceSettings() {
    return (
        <div className="rounded-2xl bg-white dark:bg-zinc-900 p-8 shadow">

            <h2 className="text-2xl font-semibold">
                Appearance
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-2 mb-8">
                Customize the appearance of IndusBrain AI.
            </p>

            <div className="flex items-center justify-between rounded-xl border p-5">

                <div>

                    <h3 className="font-medium">
                        Theme
                    </h3>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Switch between Light and Dark mode.
                    </p>

                </div>

                <ThemeToggle />

            </div>

        </div>
    );
}