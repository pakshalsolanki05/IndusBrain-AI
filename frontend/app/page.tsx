import Sidebar from "@/components/layout/Sidebar";

export default function Home() {
  return (
    <main className="flex">
      <Sidebar />

      <section className="flex-1 bg-slate-100 min-h-screen p-10">
        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>

        <p className="mt-3 text-slate-600">
          Welcome to IndusBrain AI
        </p>
      </section>
    </main>
  );
}