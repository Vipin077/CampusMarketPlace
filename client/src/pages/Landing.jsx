import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between px-10 py-6 bg-white shadow-sm">
        <h1 className="text-3xl font-bold">
          Campus<span className="text-blue-600">Market</span>
        </h1>

        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-5 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-8 py-24 flex flex-col items-center text-center">
        <h1 className="text-6xl font-extrabold leading-tight">
          Find Campus Tasks.
          <br />
          <span className="text-blue-600">Earn While You Learn.</span>
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-2xl">
          A marketplace where students can post tasks, complete work,
          collaborate with classmates, and earn money within the campus.
        </p>

        <div className="flex gap-5 mt-10">
          <Link
            to="/signup"
            className="flex items-center gap-2 bg-blue-600 text-white px-7 py-4 rounded-xl hover:bg-blue-700"
          >
            Get Started
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/login"
            className="px-7 py-4 rounded-xl border hover:bg-gray-100"
          >
            Login
          </Link>
        </div>
      </section>
    </div>
  );
}