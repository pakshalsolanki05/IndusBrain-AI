import Sidebar from "./Sidebar";
import Header from "./Header";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>

      <div
        className="
          flex h-screen
          bg-slate-100
          transition-colors duration-300

          dark:bg-slate-950
        "
      >

        <Sidebar />

        <div className="flex flex-1 flex-col">

          <Header />

          <main
            className="
              flex-1
              overflow-auto
              p-8

              transition-colors duration-300

              dark:bg-slate-900
            "
          >
            {children}
          </main>

        </div>

      </div>

    </ProtectedRoute>
  );
}