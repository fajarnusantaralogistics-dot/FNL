"use client";

export default function AdminToast({
  message,
}: {
  message: { type: "success" | "error"; text: string } | null;
}) {
  if (!message) return null;

  return (
    <div className="fixed top-6 right-6 z-50 animate-fadeIn">
      <div
        className={`px-5 py-3 rounded-xl shadow-lg border text-sm font-medium ${
          message.type === "success"
            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
            : "bg-red-50 border-red-200 text-red-700"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}
