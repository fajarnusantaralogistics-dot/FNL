'use client';

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
    <div className="bg-white p-6 rounded-xl shadow space-y-6">
      {/* Header */}
      <h3 className="text-lg font-semibold">Upload Gambar</h3>

      {/* Form Upload */}
      <form
        onSubmit={upload}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end"
      >
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">File</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Kategori</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-[42px] bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 disabled:opacity-50"
        >
          {loading ? 'Mengunggah...' : 'Upload'}
        </button>
      </form>

      {/* Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cloudItems.map((it) => (
          <div
            key={it.public_id}
            className="border rounded-lg overflow-hidden flex flex-col"
          >
            <div className="aspect-video bg-gray-100">
              <img
                src={it.url}
                alt={it.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-3 flex-1 flex flex-col justify-between">
              <div className="text-sm break-words mb-3">
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
    </div>
  );
}
