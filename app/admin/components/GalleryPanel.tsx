"use client";

export default function GalleryPanel(props: {
  cloudItems: any[];
  onFileChange: (f: File | null) => void;
  fileInput: File | null;
  category: string;
  setCategory: (s: string) => void;
  upload: (e: React.FormEvent) => Promise<void>;
  remove: (public_id: string) => Promise<void>;
  loading: boolean;
  CATEGORIES: { value: string; label: string }[];
}) {
  const {
    cloudItems,
    onFileChange,
    category,
    setCategory,
    upload,
    remove,
    loading,
    CATEGORIES,
  } = props;

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <div className="border border-slate-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-6">Upload Gambar</h3>

        <form
          onSubmit={upload}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
        >
          {/* File */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-600">File</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
              className="text-sm"
            />
          </div>

          {/* Kategori */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-600">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-slate-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="h-[42px] bg-black text-white rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Mengunggah..." : "Upload"}
          </button>
        </form>
      </div>

      {/* Gallery Grid */}
      <div className="border border-slate-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-6">Gallery</h3>

        {cloudItems.length === 0 ? (
          <div className="text-center text-slate-500 py-12">
            Belum ada gambar di kategori ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cloudItems.map((it) => (
              <div
                key={it.public_id}
                className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition"
              >
                <div className="aspect-video bg-slate-100">
                  <img
                    src={it.url}
                    alt={it.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 flex flex-col justify-between">
                  <div className="text-sm text-slate-700 break-words mb-4">
                    {it.name}
                  </div>

                  <button
                    onClick={() => remove(it.public_id)}
                    className="text-sm text-red-600 hover:underline self-start"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
