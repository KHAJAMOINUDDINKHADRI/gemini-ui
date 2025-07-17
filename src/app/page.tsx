"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const auth = typeof window !== "undefined" && localStorage.getItem("auth");
    if (auth) {
      router.replace("/dashboard");
    } else {
      router.replace("/auth");
    }
  }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      <span className="ml-4 text-lg">Redirecting...</span>
    </div>
  );
}
