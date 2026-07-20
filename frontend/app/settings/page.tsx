import AppLayout from "@/components/layout/AppLayout";

import ProfileSettings from "@/components/settings/ProfileSettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";

export default function SettingsPage() {
    return (
        <AppLayout>

            <div className="space-y-8">

                <h1 className="text-4xl font-bold">
                    Settings
                </h1>

                <ProfileSettings />

                <AppearanceSettings />

                <SecuritySettings />

            </div>

        </AppLayout>
    );
}