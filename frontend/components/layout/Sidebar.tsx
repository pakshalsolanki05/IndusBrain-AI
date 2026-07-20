"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  BrainCircuit,
  BookOpen,
  Network,
  Bot,
  Search,
  Lightbulb,
  Settings,
} from "lucide-react";

const menu = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "AI Workspace",
    icon: BrainCircuit,
    href: "/ai-workspace",
  },
  {
    title: "Knowledge Base",
    icon: BookOpen,
    href: "/documents",
  },
  {
    title: "Knowledge Graph",
    icon: Network,
    href: "/knowledge-graph",
  },
  {
    title: "AI Copilot",
    icon: Bot,
    href: "/copilot",
  },
  {
    title: "Universal Search",
    icon: Search,
    href: "/search",
  },
  {
    title: "Insights",
    icon: Lightbulb,
    href: "/insights",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-800 bg-slate-950">

      {/* Logo */}

      <div className="border-b border-slate-800 px-6 py-7">

        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          IndusBrain AI
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Enterprise Knowledge Intelligence
        </p>

      </div>

      {/* Navigation */}

      <nav className="flex-1 space-y-2 p-4">

        {menu.map((item) => {

          const Icon = item.icon;

          const active = pathname === item.href;

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`
                flex items-center gap-3 rounded-xl px-4 py-3
                transition-all duration-200

                ${
                  active
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }
              `}
            >
              <Icon size={20} />

              <span className="font-medium">
                {item.title}
              </span>
            </Link>
          );
        })}

      </nav>

      {/* Footer */}

      <div className="border-t border-slate-800 p-5">

        <div className="rounded-xl bg-slate-900 p-4">

          <p className="text-xs uppercase tracking-widest text-slate-500">
            VERSION
          </p>

          <h3 className="mt-2 text-lg font-semibold text-white">
            IndusBrain AI v1.0
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Enterprise Knowledge Platform
          </p>

        </div>

      </div>

    </aside>
  );
}