"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const router = useRouter();
  const [section, setSection] = useState<
    "overview" | "clients" | "gallery" | "testimonials" | "profile"
  >("overview");

  // read search params from window on client to avoid useSearchParams SSR requirement
  useEffect(() => {
    function read() {
      try {
        const params = new URLSearchParams(window.location.search);
        const s = (params.get("section") as any) || "overview";
        setSection(s);
      } catch (e) {
        setSection("overview");
      }
    }
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);

  const navigate = (s: string) => {
    // simple navigation, set section query param
    router.push(`/admin?section=${encodeURIComponent(s)}`);
    setSection(s as any);
    try {
      // inform other listeners (in case pushState doesn't trigger popstate)
      // dispatch asynchronously to avoid triggering updates inside insertion effects
      queueMicrotask(() => window.dispatchEvent(new Event("locationchange")));
    } catch (e) {
      setTimeout(() => window.dispatchEvent(new Event("locationchange")));
    }
  };

  return (
    <aside className="w-full lg:w-64">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 sticky top-8">
        {/* Title */}
        <div className="mb-6">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <p className="text-xs text-slate-500">Management System</p>
        </div>

        <nav className="flex flex-col gap-1">
          {[
            { key: "overview", label: "Overview" },
            { key: "clients", label: "Clients" },
            { key: "gallery", label: "Gallery" },
            { key: "testimonials", label: "Testimonials" },
            { key: "profile", label: "Profile" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => navigate(item.key)}
              className={`text-left px-4 py-2.5 rounded-lg transition-all duration-200 ${
                section === item.key
                  ? "bg-black text-white shadow-sm"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* Divider */}
          <div className="my-4 border-t border-slate-200" />

          <button
            onClick={() => router.push("/")}
            className="text-left px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 transition"
          >
            Back to main page
          </button>

          <button
            onClick={() => router.push("/logout")}
            className="text-left px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition"
          >
            Logout
          </button>
        </nav>
      </div>
    </aside>
  );
}
