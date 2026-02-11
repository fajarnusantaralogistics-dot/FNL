'use client';

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
    clientFormCategory = 'corporate',
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

  return (
    <div className="space-y-6">
      {/* Tambah Client */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-5">Tambah Client</h3>

        <form
          onSubmit={uploadClient}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end"
        >
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
              className="text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Nama Client</label>
            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Nama client"
              className="border px-3 py-2 rounded-lg text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Website</label>
            <input
              value={clientWebsite}
              onChange={(e) => setClientWebsite(e.target.value)}
              placeholder="https://example.com"
              className="border px-3 py-2 rounded-lg text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Kategori</label>
            <select
              value={clientFormCategory}
              onChange={(e) => setClientFormCategory?.(e.target.value)}
              className="border px-3 py-2 rounded-lg text-sm"
            >
              <option value="corporate">Corporate</option>
              <option value="otomotif">Otomotif</option>
              <option value="property">Property</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!clientFile || loading}
            className="h-[42px] bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 disabled:opacity-50"
          >
            {loading ? 'Mengunggah...' : 'Tambah Client'}
          </button>
        </form>
      </div>

      {/* Daftar Client */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <h3 className="text-lg font-semibold">Clients</h3>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Filter:</span>
            <select
              value={clientCategory}
              onChange={(e) => setClientCategory(e.target.value)}
              className="border px-3 py-2 rounded-lg text-sm"
            >
              <option value="all">Semua</option>
              <option value="corporate">Corporate</option>
              <option value="otomotif">Otomotif</option>
              <option value="property">Property</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {clients.map((c) => (
            <div
              key={c.id}
              className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={c.logoUrl}
                  alt={c.name}
                  className="w-28 h-14 object-contain bg-gray-50 rounded"
                />

                <div className="space-y-1">
                  <div className="font-medium">{c.name}</div>

                  {c.website && (
                    <a
                      href={c.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-sky-600 hover:underline"
                    >
                      {c.website}
                    </a>
                  )}

                  {c.category && (
                    <div className="text-xs text-gray-500 capitalize">
                      {c.category}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => removeClient(c.logoPublic)}
                className="text-sm text-red-600 hover:underline self-start sm:self-center"
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
