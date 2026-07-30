import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";
import DashboardService from "../services/DashboardService";

import {
  ClipboardList,
  CircleDollarSign,
  CheckCircle,
  Clock3,
  Plus,
  Search,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await DashboardService.getDashboard();
      setDashboard(data);
    } catch (error) {
      console.error("Failed to load dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <p className="text-lg text-slate-500">Loading Dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  const stats = [
    {
      title: "My Tasks",
      value: dashboard.myTasks,
      icon: ClipboardList,
      color: "bg-blue-100 text-blue-600",
      path: "/my-tasks",
    },
    {
      title: "Open Tasks",
      value: dashboard.openTasks,
      icon: Clock3,
      color: "bg-yellow-100 text-yellow-600",
      path: "/explore",
    },
    {
      title: "Completed",
      value: dashboard.completedTasks,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
      path: "/my-tasks",
    },
    {
      title: "Total Earnings",
      value: "Coming Soon",
      icon: CircleDollarSign,
      color: "bg-purple-100 text-purple-600",
      path: null,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Welcome Back 👋
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your campus marketplace efficiently.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                onClick={() => item.path && navigate(item.path)}
                className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg ${
                  item.path
                    ? "cursor-pointer hover:scale-105"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      {item.title}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold">
                      {item.value}
                    </h2>
                  </div>

                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-xl ${item.color}`}
                  >
                    <Icon size={28} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Recent Tasks
              </h2>

              <button
                onClick={() => navigate("/my-tasks")}
                className="text-blue-600 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {dashboard.recentTasks.length === 0 ? (
                <p className="text-slate-500">
                  No tasks yet.
                </p>
              ) : (
                dashboard.recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 p-4 hover:bg-slate-50"
                  >
                    <div>
                      <h3 className="font-semibold">
                        {task.title}
                      </h3>

                      <p className="text-sm text-slate-500">
                        Budget: ₹{task.budget}
                      </p>
                    </div>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                      {task.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">
              Quick Actions
            </h2>

            <div className="mt-6 space-y-4">
              <button
                onClick={() => navigate("/create-task")}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-white hover:bg-blue-700"
              >
                <Plus size={20} />
                Create Task
              </button>

              <button
                onClick={() => navigate("/explore")}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 py-3 hover:bg-slate-100"
              >
                <Search size={20} />
                Explore Tasks
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}