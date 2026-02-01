import Link from "next/link";

export default function Dashboard() {
  return (
    <main className="page">
      <div className="container">
        <div className="card">
          <div className="card-header">
            <h1 className="title">Dashboard</h1>
            <p className="subtitle">Choose what you want to manage.</p>
          </div>

          <div className="card-body">
            <div className="grid gap-4 sm:grid-cols-2">
              <Link href="/clients" className="card block p-5 hover:bg-slate-50 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Clients</div>
                    <div className="mt-1 text-sm text-slate-600">View and manage clients</div>
                  </div>
                  <div className="text-2xl">👥</div>
                </div>
              </Link>

              <Link href="/invoices" className="card block p-5 hover:bg-slate-50 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Invoices</div>
                    <div className="mt-1 text-sm text-slate-600">Create and track invoices</div>
                  </div>
                  <div className="text-2xl">🧾</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
