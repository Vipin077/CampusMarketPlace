import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";
import UserService from "../services/UserService";
import AuthService from "../services/AuthService";

import {
  Mail,
  GraduationCap,
  Calendar,
  Star,
  ClipboardCheck,
  Briefcase,
  MessageCircle,
  Pencil,
  Camera,
  Save,
  X,
} from "lucide-react";

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit profile states
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    department: "",
    year: "",
  });

  const [profilePicture, setProfilePicture] =
    useState(null);

  const [preview, setPreview] =
    useState(null);

  const currentUser = AuthService.getUser();

  // =========================================================
  // LOAD USER
  // =========================================================

  useEffect(() => {
    loadUser();
  }, [id]);

  async function loadUser() {
    try {
      setLoading(true);

      const data =
        await UserService.getUser(id);

      setUser(data);

      setFormData({
        fullName: data.fullName || "",
        bio: data.bio || "",
        department:
          data.department || "",
        year: data.year || "",
      });

      setPreview(
        data.profilePicture || null
      );
    } catch (err) {
      console.error(
        "Failed to load user:",
        err
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // MESSAGE USER
  // =========================================================

  function handleMessage() {
    if (!user?.email) {
      return;
    }

    navigate(
      `/messages?email=${encodeURIComponent(
        user.email
      )}`
    );
  }

  // =========================================================
  // START EDITING
  // =========================================================

  function handleEdit() {
    setFormData({
      fullName: user.fullName || "",
      bio: user.bio || "",
      department:
        user.department || "",
      year: user.year || "",
    });

    setProfilePicture(null);

    setPreview(
      user.profilePicture || null
    );

    setEditing(true);
  }

  // =========================================================
  // CANCEL EDITING
  // =========================================================

  function handleCancel() {
    setFormData({
      fullName: user.fullName || "",
      bio: user.bio || "",
      department:
        user.department || "",
      year: user.year || "",
    });

    setProfilePicture(null);

    setPreview(
      user.profilePicture || null
    );

    setEditing(false);
  }

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  function handleInputChange(event) {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // =========================================================
  // PROFILE PICTURE CHANGE
  // =========================================================

  function handlePictureChange(event) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    // Only allow images
    if (!file.type.startsWith("image/")) {
      alert(
        "Please select an image file."
      );

      return;
    }

    // 5 MB maximum
    if (file.size > 5 * 1024 * 1024) {
      alert(
        "Profile picture must be smaller than 5 MB."
      );

      return;
    }

    setProfilePicture(file);

    const imagePreview =
      URL.createObjectURL(file);

    setPreview(imagePreview);
  }

  // =========================================================
  // SAVE PROFILE
  // =========================================================

  async function handleSave() {
    if (!formData.fullName.trim()) {
      alert(
        "Full name cannot be empty."
      );

      return;
    }

    try {
      setSaving(true);

      const updatedUser =
        await UserService.updateProfile(
          {
            fullName:
              formData.fullName.trim(),

            bio:
              formData.bio.trim(),

            department:
              formData.department.trim(),

            year:
              formData.year.trim(),
          },
          profilePicture
        );

      setUser(updatedUser);

      setFormData({
        fullName:
          updatedUser.fullName || "",

        bio:
          updatedUser.bio || "",

        department:
          updatedUser.department || "",

        year:
          updatedUser.year || "",
      });

      setPreview(
        updatedUser.profilePicture ||
          null
      );

      setProfilePicture(null);

      setEditing(false);

      alert(
        "Profile updated successfully."
      );
    } catch (error) {
      console.error(
        "Failed to update profile:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8">
          Loading...
        </div>
      </DashboardLayout>
    );
  }

  // =========================================================
  // USER NOT FOUND
  // =========================================================

  if (!user) {
    return (
      <DashboardLayout>
        <div className="p-8">
          User not found.
        </div>
      </DashboardLayout>
    );
  }

  // =========================================================
  // OWN PROFILE CHECK
  // =========================================================

  const isOwnProfile =
    currentUser?.email === user.email;

  // =========================================================
  // UI
  // =========================================================

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-6">

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <div className="flex flex-col md:flex-row gap-8">

            {/* =================================================
                PROFILE IMAGE
            ================================================= */}

            <div className="shrink-0">

              <div className="relative w-36 h-36">

                <img
                  src={
                    preview ||
                    user.profilePicture ||
                    "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(
                        user.fullName
                      )
                  }
                  alt={user.fullName}
                  className="w-36 h-36 rounded-full border-4 border-blue-500 object-cover"
                />

                {/* CHANGE PROFILE PICTURE */}

                {editing && (

                  <label
                    htmlFor="profilePicture"
                    className="absolute bottom-1 right-1 w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg transition"
                    title="Change profile picture"
                  >

                    <Camera size={19} />

                    <input
                      id="profilePicture"
                      type="file"
                      accept="image/*"
                      onChange={
                        handlePictureChange
                      }
                      className="hidden"
                    />

                  </label>

                )}

              </div>

              {editing && (
                <p className="text-xs text-gray-400 text-center mt-3">
                  Max 5 MB
                </p>
              )}

            </div>

            {/* =================================================
                PROFILE INFORMATION
            ================================================= */}

            <div className="flex-1">

              {/* =================================================
                  HEADER
              ================================================= */}

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">

                <div className="flex-1">

                  {editing ? (

                    <input
                      type="text"
                      name="fullName"
                      value={
                        formData.fullName
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="Full name"
                      className="w-full max-w-md text-3xl font-bold text-slate-800 border border-slate-300 rounded-xl px-4 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />

                  ) : (

                    <h1 className="text-4xl font-bold text-slate-800">
                      {user.fullName}
                    </h1>

                  )}

                  {/* BIO */}

                  {editing ? (

                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={
                        handleInputChange
                      }
                      rows={3}
                      maxLength={250}
                      placeholder="Tell others something about yourself..."
                      className="w-full max-w-xl mt-4 resize-none border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />

                  ) : (

                    <p className="text-gray-500 mt-2">
                      {user.bio ||
                        "No bio added yet."}
                    </p>

                  )}

                </div>

                {/* =================================================
                    ACTION BUTTONS
                ================================================= */}

                <div className="shrink-0">

                  {isOwnProfile ? (

                    editing ? (

                      <div className="flex gap-2">

                        <button
                          type="button"
                          onClick={
                            handleCancel
                          }
                          disabled={saving}
                          className="flex items-center gap-2 border border-slate-300 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl font-medium transition disabled:opacity-50"
                        >

                          <X size={18} />

                          Cancel

                        </button>

                        <button
                          type="button"
                          onClick={
                            handleSave
                          }
                          disabled={saving}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition shadow-sm disabled:bg-blue-400"
                        >

                          <Save size={18} />

                          {saving
                            ? "Saving..."
                            : "Save"}

                        </button>

                      </div>

                    ) : (

                      <button
                        type="button"
                        onClick={handleEdit}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-sm"
                      >

                        <Pencil size={18} />

                        Edit Profile

                      </button>

                    )

                  ) : (

                    <button
                      type="button"
                      onClick={
                        handleMessage
                      }
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-sm"
                    >

                      <MessageCircle
                        size={19}
                      />

                      Message

                    </button>

                  )}

                </div>

              </div>

              {/* =================================================
                  PROFILE DETAILS
              ================================================= */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">

                {/* EMAIL */}

                <div className="flex items-center gap-3 text-slate-700">

                  <Mail
                    size={21}
                    className="text-blue-600 shrink-0"
                  />

                  <span className="break-all">
                    {user.email}
                  </span>

                </div>

                {/* DEPARTMENT */}

                <div className="flex items-center gap-3 text-slate-700">

                  <GraduationCap
                    size={21}
                    className="text-blue-600 shrink-0"
                  />

                  {editing ? (

                    <input
                      type="text"
                      name="department"
                      value={
                        formData.department
                      }
                      onChange={
                        handleInputChange
                      }
                      placeholder="Department"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />

                  ) : (

                    <span>
                      {user.department ||
                        "Not specified"}
                    </span>

                  )}

                </div>

                {/* YEAR */}

                <div className="flex items-center gap-3 text-slate-700">

                  <Calendar
                    size={21}
                    className="text-blue-600 shrink-0"
                  />

                  {editing ? (

                    <select
                      name="year"
                      value={formData.year}
                      onChange={
                        handleInputChange
                      }
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >

                      <option value="">
                        Select year
                      </option>

                      <option value="1st Year">
                        1st Year
                      </option>

                      <option value="2nd Year">
                        2nd Year
                      </option>

                      <option value="3rd Year">
                        3rd Year
                      </option>

                      <option value="4th Year">
                        4th Year
                      </option>

                      <option value="5th Year">
                        5th Year
                      </option>

                    </select>

                  ) : (

                    <span>
                      {user.year ||
                        "Not specified"}
                    </span>

                  )}

                </div>

                {/* RATING */}

                <div className="flex items-center gap-3 text-slate-700">

                  <Star
                    size={21}
                    className="text-yellow-500 shrink-0"
                  />

                  <span>
                    {user.rating ?? 0}
                  </span>

                </div>

                {/* COMPLETED TASKS */}

                <div className="flex items-center gap-3 text-slate-700">

                  <ClipboardCheck
                    size={21}
                    className="text-green-600 shrink-0"
                  />

                  <span>
                    {user.completedTasks ??
                      0}{" "}
                    Completed Tasks
                  </span>

                </div>

                {/* ACTIVE TASKS */}

                <div className="flex items-center gap-3 text-slate-700">

                  <Briefcase
                    size={21}
                    className="text-indigo-600 shrink-0"
                  />

                  <span>
                    {user.activeTasks ??
                      0}{" "}
                    Active Tasks
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}