import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import UserService from "../services/UserService";
import {
  Mail,
  GraduationCap,
  Calendar,
  Star,
  ClipboardCheck,
  Briefcase,
} from "lucide-react";

export default function Profile() {
  const { id } = useParams();

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, [id]);

  async function loadUser() {
    try {
      const data = await UserService.getUser(id);
      setUser(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8">Loading...</div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="p-8">User not found.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <div className="flex gap-8">

            <img
              src={
                user.profilePicture ||
                "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(user.fullName)
              }
              alt=""
              className="w-36 h-36 rounded-full border-4 border-blue-500"
            />

            <div className="flex-1">

              <h1 className="text-4xl font-bold">
                {user.fullName}
              </h1>

              <p className="text-gray-500 mt-2">
                {user.bio || "No bio added yet."}
              </p>

              <div className="grid grid-cols-2 gap-5 mt-8">

                <div className="flex items-center gap-3">
                  <Mail />
                  {user.email}
                </div>

                <div className="flex items-center gap-3">
                  <GraduationCap />
                  {user.department || "Not specified"}
                </div>

                <div className="flex items-center gap-3">
                  <Calendar />
                  {user.year || "Not specified"}
                </div>

                <div className="flex items-center gap-3">
                  <Star />
                  {user.rating}
                </div>

                <div className="flex items-center gap-3">
                  <ClipboardCheck />
                  {user.completedTasks} Completed Tasks
                </div>

                <div className="flex items-center gap-3">
                  <Briefcase />
                  {user.activeTasks} Active Tasks
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}