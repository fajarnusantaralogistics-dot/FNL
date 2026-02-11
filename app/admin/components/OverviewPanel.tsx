'use client';

export default function OverviewPanel({ overview, recentClients }: { overview: { clients: number; images: number }; recentClients: Array<any> }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Overview</h3>
        <div className="text-sm text-gray-600">Clients: <span className="font-medium">{overview.clients}</span></div>
        <div className="text-sm text-gray-600">Images: <span className="font-medium">{overview.images}</span></div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Recent Clients</h3>
        <div className="grid gap-2">
          {recentClients.slice(0,5).map((c: any) => (
            <div key={c.id} className="flex items-center gap-3">
              <img src={c.logoUrl} className="w-12 h-8 object-contain" alt={c.name} />
              <div>{c.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
