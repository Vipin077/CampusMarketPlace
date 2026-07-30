import { Bell, Search } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">

      <div className="relative w-96">

        <Search
          size={18}
          className="absolute left-4 top-4 text-slate-400"
        />

        <input
          placeholder="Search tasks..."
          className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none focus:border-blue-500"
        />

      </div>

      <div className="flex items-center gap-6">

        <button className="relative">

          <Bell size={24} className="text-slate-600" />

          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500"></span>

        </button>

        <div className="flex items-center gap-3">

          <div className="h-11 w-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            V
          </div>

          <div>
            <h3 className="font-semibold text-slate-800">
              Vipin Bagri
            </h3>

            <p className="text-sm text-slate-500">
              Student
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}