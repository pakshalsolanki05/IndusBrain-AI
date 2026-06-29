"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Bot,
  Wrench,
  ShieldCheck,
  Network,
  BarChart3,
  Settings,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/" },
  { name: "Documents", icon: FileText, href: "/documents" },
  { name: "AI Copilot", icon: Bot, href: "/copilot" },
  { name: "Maintenance", icon: Wrench, href: "/maintenance" },
  { name: "Compliance", icon: ShieldCheck, href: "/compliance" },
  { name: "Knowledge Graph", icon: Network, href: "/knowledge-graph" },
  { name: "Analytics", icon: BarChart3, href: "/analytics" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-8">IndusBrain AI</h1>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-slate-800 transition"
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}