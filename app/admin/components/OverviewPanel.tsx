"use client";

export default function OverviewPanel({
  overview,
  recentClients,
}: {
  overview: { clients: number; images: number };
  recentClients: Array<any>;
}) {
  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Clients Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <p className="text-sm text-slate-500 mb-2">Total Clients</p>
          <h3 className="text-3xl font-bold">{overview.clients}</h3>
        </div>

        {/* Images Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <p className="text-sm text-slate-500 mb-2">Total Images</p>
          <h3 className="text-3xl font-bold">{overview.images}</h3>
        </div>
      </div>

      {/* Recent Clients */}
      <div className="border border-slate-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Clients</h3>

        <div className="divide-y divide-slate-200">
          {recentClients.slice(0, 5).map((c: any) => (
            <div key={c.id} className="flex items-center gap-4 py-3">
              <div className="w-14 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-lg">
                <img
                  src={c.logoUrl}
                  className="max-h-8 object-contain"
                  alt={c.name}
                />
              </div>

              <div className="font-medium text-slate-700">{c.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
