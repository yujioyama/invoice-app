import Link from "next/link";

export default function Dashboard() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="space-y-4">
        <Link href="/clients">
          <button className="px-6 py-2 bg-blue-600 text-white rounded shadow">
            Client List
          </button>
        </Link>
        <Link href="/invoices">
          <button className="px-6 py-2 bg-green-600 text-white rounded shadow">
            Invoice List
          </button>
        </Link>
      </div>
    </main>
  );
}
