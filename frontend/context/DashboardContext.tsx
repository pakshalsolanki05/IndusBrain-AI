"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";

interface DashboardContextType {
  refreshKey: number;
  refreshDashboard: () => void;
}

const DashboardContext =
  createContext<DashboardContextType | null>(null);

export function DashboardProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [refreshKey, setRefreshKey] = useState(0);

  function refreshDashboard() {
    setRefreshKey((prev) => prev + 1);
  }

  return (
    <DashboardContext.Provider
      value={{
        refreshKey,
        refreshDashboard,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {

  const context =
    useContext(DashboardContext);

  if (!context) {
    throw new Error(
      "useDashboard must be used inside DashboardProvider"
    );
  }

  return context;
}