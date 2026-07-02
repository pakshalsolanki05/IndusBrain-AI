"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  FolderOpen,
  Upload,
  Bot,
  Network,
  ShieldCheck,
  Wrench,
  BarChart3,
  Settings,
} from "lucide-react";

const menu = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/" },
  { title: "Documents", icon: FolderOpen, href: "/documents" },
  { title: "Upload", icon: Upload, href: "/upload" },
  { title: "AI Copilot", icon: Bot, href: "/copilot" },
  { title: "Knowledge Graph", icon: Network, href: "#" },
  { title: "Maintenance", icon: Wrench, href: "#" },
  { title: "Compliance", icon: ShieldCheck, href: "#" },
  { title: "Analytics", icon: BarChart3, href: "#" },
  { title: "Settings", icon: Settings, href: "#" },
];

export default function Sidebar() {
  return (
    <aside className="w-72 bg-slate-900 text-white flex flex-col">
      <div className="border-b border-slate-700 p-6">
        <h1 className="text-3xl font-bold">IndusBrain AI</h1>
        <p className="text-sm text-slate-400 mt-1">
          Industrial Intelligence
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="flex items-center gap-3 rounded-lg p-3 hover:bg-slate-800 transition"
            >
              <Icon size={20} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}