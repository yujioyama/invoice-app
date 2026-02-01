import Link from "next/link";

export default function Dashboard() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-lg w-full flex flex-col items-center">
        <h1 className="text-4xl font-extrabold mb-6 text-blue-700 tracking-wide drop-shadow-sm">
          Dashboard
        </h1>
        <p className="mb-10 text-gray-500 text-center">
          Welcome! Choose what you want to manage.
        </p>
        <div className="flex flex-col gap-6 w-full">
          <Link href="/clients" className="w-full">
            <div className="flex items-center gap-4 px-8 py-5 bg-blue-500 hover:bg-blue-600 transition rounded-xl shadow-md cursor-pointer group">
              <span className="text-white text-2xl">👥</span>
              <span className="text-white text-lg font-semibold tracking-wide group-hover:underline">
                Client List
              </span>
            </div>
          </Link>
          <Link href="/invoices" className="w-full">
            <div className="flex items-center gap-4 px-8 py-5 bg-green-500 hover:bg-green-600 transition rounded-xl shadow-md cursor-pointer group">
              <span className="text-white text-2xl">🧾</span>
              <span className="text-white text-lg font-semibold tracking-wide group-hover:underline">
                Invoice List
              </span>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
