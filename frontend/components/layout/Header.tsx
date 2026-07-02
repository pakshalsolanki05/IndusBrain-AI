"use client";

import { Bell, Search, UserCircle } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b px-8 py-4 flex justify-between items-center">

      <div className="relative w-96">
        <Search
          className="absolute left-3 top-3 text-gray-400"
          size={18}
        />

        <input
          placeholder="Search documents..."
          className="border rounded-lg pl-10 pr-4 py-2 w-full"
        />
      </div>

      <div className="flex gap-6 items-center">
        <Bell className="cursor-pointer" />

        <UserCircle size={36} />
      </div>

    </header>
  );
}