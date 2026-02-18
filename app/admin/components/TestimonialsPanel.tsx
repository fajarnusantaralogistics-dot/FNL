"use client";

import React from "react";

export default function TestimonialsPanel(props: {
  testimonials: any[];
  name: string;
  setName: (s: string) => void;
  position: string;
  setPosition: (s: string) => void;
  company: string;
  setCompany: (s: string) => void;
  testimonial: string;
  setTestimonial: (s: string) => void;
  uploadTestimonial: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  removeTestimonial: (id: number) => Promise<void>;
  editId?: number | null;
  setEditId?: (id: number | null) => void;
}) {
  const {
    testimonials,
    name,
    setName,
    position,
    setPosition,
    company,
    setCompany,
    testimonial,
    setTestimonial,
    uploadTestimonial,
    loading,
    removeTestimonial,
    editId,
    setEditId = (() => {}) as any,
  } = props;

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <section className="border border-slate-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-6">
          {editId ? "Edit Testimonial" : "Tambah Testimonial"}
        </h3>

        <form
          onSubmit={uploadTestimonial}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama"
            className="border border-slate-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="Jabatan (opsional)"
            className="border border-slate-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Perusahaan (opsional)"
            className="border border-slate-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />

          <textarea
            value={testimonial}
            onChange={(e) => setTestimonial(e.target.value)}
            placeholder="Tulis testimonial di sini..."
            className="border border-slate-300 px-3 py-2 rounded-lg col-span-1 md:col-span-3 text-sm h-28 resize-none focus:outline-none focus:ring-2 focus:ring-black"
          />

          <div className="flex justify-end md:col-span-3 gap-3">
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setName("");
                  setPosition("");
                  setCompany("");
                  setTestimonial("");
                }}
                className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-100 transition"
              >
                Batal
              </button>
            )}

            <button
              type="submit"
              disabled={loading || !name || !testimonial}
              className="px-5 py-2 bg-black text-white rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : editId ? "Update" : "Tambah"}
            </button>
          </div>
        </form>
      </section>

      {/* List Section */}
      <section className="border border-slate-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-6">Daftar Testimonial</h3>

        {testimonials.length === 0 ? (
          <div className="text-slate-500 text-center py-10">
            Belum ada testimonial.
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {testimonials.map((t) => (
              <div key={t.id} className="flex gap-4 py-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-semibold">
                    {(t.name || "U")
                      .split(" ")
                      .map((s: string) => s[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="font-medium text-slate-800">{t.name}</div>
                    <div className="text-xs text-slate-500">
                      {t.position}
                      {t.position && t.company ? " • " : ""}
                      {t.company}
                    </div>
                  </div>

                  <blockquote className="mt-3 text-sm text-slate-700 italic">
                    “{t.testimonial}”
                  </blockquote>

                  <div className="mt-4 flex gap-5 text-sm">
                    <button
                      onClick={() => {
                        setName(t.name);
                        setPosition(t.position || "");
                        setCompany(t.company || "");
                        setTestimonial(t.testimonial);
                        setEditId(t.id);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="text-slate-600 hover:text-black transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => removeTestimonial(t.id)}
                      className="text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
