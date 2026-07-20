"use client";

import {
  Bell,
  Search,
  UserCircle,
  LogOut,
} from "lucide-react";

import ThemeToggle from "./ThemeToggle";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const router = useRouter();

  const {
    user,
    logout,
  } = useAuth();

  async function handleLogout() {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <header
      className="
        flex items-center justify-between
        border-b
        bg-white
        px-8 py-4
        transition-colors duration-300

        dark:bg-slate-900
        dark:border-slate-700
      "
    >

      {/* Search */}

      <div className="relative w-96">

        <Search
          size={18}
          className="
            absolute
            left-3
            top-3

            text-gray-400
            dark:text-gray-500
          "
        />

        <input
          placeholder="Search documents..."
          className="
            w-full
            rounded-lg
            border

            border-gray-300

            bg-white

            py-2
            pl-10
            pr-4

            outline-none

            transition-all

            focus:ring-2
            focus:ring-blue-500

            dark:bg-slate-800
            dark:border-slate-600
            dark:text-white
            dark:placeholder:text-slate-400
          "
        />

      </div>

      {/* Right Section */}

      <div className="flex items-center gap-6">

        <ThemeToggle />

        <Bell
          size={20}
          className="
            cursor-pointer
            text-gray-700
            transition
            hover:text-blue-600

            dark:text-gray-300
          "
        />

        {/* User */}

        <div className="flex items-center gap-3">

          <UserCircle
            size={38}
            className="
              text-gray-700
              dark:text-gray-200
            "
          />

          <div className="hidden md:block">

            <p
              className="
                font-semibold
                text-slate-800

                dark:text-white
              "
            >
              {user?.full_name ?? user?.name}
            </p>

            <p
              className="
                text-sm
                text-gray-500

                dark:text-slate-400
              "
            >
              {user?.email}
            </p>

          </div>

        </div>

        {/* Logout */}

        <button
          onClick={handleLogout}
          className="
            flex
            items-center
            gap-2

            rounded-lg

            bg-red-600

            px-4
            py-2

            text-white

            transition

            hover:bg-red-700
          "
        >

          <LogOut size={18} />

          Logout

        </button>

      </div>

    </header>
  );
}