"use client";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";

export default function ClientsPanel(props: {
  clients: any[];
  clientCategory: string;
  setClientCategory: (s: string) => void;
  clientFormCategory?: string;
  setClientFormCategory?: (s: string) => void;
  onFileChange: (f: File | null) => void;
  clientFile: File | null;
  clientName: string;
  setClientName: (s: string) => void;
  clientWebsite: string;
  setClientWebsite: (s: string) => void;
  uploadClient: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  removeClient: (logoPublic: string) => Promise<void>;
}) {
  const {
    clients,
    clientCategory,
    setClientCategory,
    clientFormCategory = "corporate",
    setClientFormCategory = (() => {}) as any,
    onFileChange,
    clientFile,
    clientName,
    setClientName,
    clientWebsite,
    setClientWebsite,
    uploadClient,
    loading,
    removeClient,
  } = props;
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/* Tambah Client */}
      <div className="border border-slate-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-6">Tambah Client</h3>

        <form
          onSubmit={uploadClient}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 items-end"
        >
          {/* Logo */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-600">Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
              className="text-sm"
            />
          </div>

          {/* Nama */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-600">Nama Client</label>
            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Nama client"
              className="border border-slate-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Website */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-600">Website</label>
            <input
              value={clientWebsite}
              onChange={(e) => setClientWebsite(e.target.value)}
              placeholder="https://example.com"
              className="border border-slate-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Kategori */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-600">Kategori</label>
            <select
              value={clientFormCategory}
              onChange={(e) => setClientFormCategory?.(e.target.value)}
              className="border border-slate-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="corporate">Corporate</option>
              <option value="otomotif">Otomotif</option>
              <option value="property">Property</option>
            </select>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={!clientFile || loading}
            className="h-[42px] bg-black text-white rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Mengunggah..." : "Tambah"}
          </button>
        </form>
      </div>

      {/* Daftar Client */}
      <div className="border border-slate-200 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold">Clients</h3>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">Filter</span>
            <select
              value={clientCategory}
              onChange={(e) => setClientCategory(e.target.value)}
              className="border border-slate-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="all">Semua</option>
              <option value="corporate">Corporate</option>
              <option value="otomotif">Otomotif</option>
              <option value="property">Property</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-slate-200">
          {clients.map((c) => (
            <div
              key={c.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-32 h-16 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-lg">
                  <img
                    src={c.logoUrl}
                    alt={c.name}
                    className="max-h-12 object-contain"
                  />
                </div>

                <div className="space-y-1">
                  <div className="font-medium text-slate-800">{c.name}</div>

                  {c.website && (
                    <a
                      href={c.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-slate-600 hover:text-black transition"
                    >
                      {c.website}
                    </a>
                  )}

                  {c.category && (
                    <div className="text-xs text-slate-500 capitalize">
                      {c.category}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setDeleteTarget(c.logoPublic)}
                className="text-sm text-red-600 hover:underline"
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Yakin ingin menghapus client ini?"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) removeClient(deleteTarget);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
