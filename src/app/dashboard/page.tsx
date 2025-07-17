"use client";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      try {
        const parsed = JSON.parse(auth);
        // The original code had setName(parsed.phone || parsed.name || null);
        // Since name is removed, this line is effectively removed.
      } catch {}
    }
  }, []);
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-white dark:bg-black text-foreground">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Hello!</h1>
      <p className="text-lg text-gray-500 dark:text-gray-400">
        Select a chatroom or start a new chat to begin.
      </p>
    </div>
  );
}
