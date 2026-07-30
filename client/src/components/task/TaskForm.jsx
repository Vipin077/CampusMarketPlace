import { useEffect, useState } from "react";
import {
  IndianRupee,
  MapPin,
  FolderOpen,
  FileText,
  Upload,
} from "lucide-react";

export default function TaskForm({ initial, onSubmit }) {
  const [task, setTask] = useState({
    title: "",
    description: "",
    budget: "",
    category: "",
    location: "",
  });

  const [attachment, setAttachment] = useState(null);

  useEffect(() => {
    if (initial) {
      setTask({
        title: initial.title || "",
        description: initial.description || "",
        budget: initial.budget || "",
        category: initial.category || "",
        location: initial.location || "",
      });
    }
  }, [initial]);

  function handleChange(e) {
    const { name, value } = e.target;

    setTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleFileChange(e) {
    if (e.target.files.length > 0) {
      setAttachment(e.target.files[0]);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await onSubmit(task, attachment);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Title */}
      <div>
        <label className="mb-2 block font-semibold text-slate-700">
          Task Title
        </label>

        <input
          type="text"
          name="title"
          value={task.title}
          onChange={handleChange}
          placeholder="Enter task title"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block font-semibold text-slate-700">
          Description
        </label>

        <textarea
          rows="6"
          name="description"
          value={task.description}
          onChange={handleChange}
          placeholder="Describe your task..."
          className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          required
        />
      </div>

      {/* Budget + Category */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 flex items-center gap-2 font-semibold text-slate-700">
            <IndianRupee size={18} />
            Budget
          </label>

          <input
            type="number"
            name="budget"
            value={task.budget}
            onChange={handleChange}
            placeholder="500"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            required
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 font-semibold text-slate-700">
            <FolderOpen size={18} />
            Category
          </label>

          <select
            name="category"
            value={task.category}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            required
          >
            <option value="">Select Category</option>
            <option value="Notes">Notes</option>
            <option value="Assignment">Assignment</option>
            <option value="Delivery">Delivery</option>
            <option value="Coding">Coding</option>
            <option value="Design">Design</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="mb-2 flex items-center gap-2 font-semibold text-slate-700">
          <MapPin size={18} />
          Location
        </label>

        <input
          type="text"
          name="location"
          value={task.location}
          onChange={handleChange}
          placeholder="MANIT Bhopal, Hostel 10..."
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          required
        />
      </div>

      {/* Existing Attachment */}
      {initial?.attachmentUrl && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-blue-600" />
            <span className="font-semibold text-blue-700">
              Attachment already exists
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-600">
            Upload a new file only if you want to replace the current one.
          </p>
        </div>
      )}

      {/* Upload */}
      <div>
        <label className="mb-3 block font-semibold text-slate-700">
          Attachment (Optional)
        </label>

        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 p-8 transition hover:border-blue-500 hover:bg-blue-50">
          <Upload size={34} className="mb-3 text-blue-600" />

          <span className="font-medium text-slate-700">
            Click to upload a file
          </span>

          <span className="mt-1 text-sm text-slate-500">
            PDF, Images, ZIP, DOCX...
          </span>

          {attachment && (
            <span className="mt-4 rounded-full bg-green-100 px-4 py-1 text-sm font-medium text-green-700">
              {attachment.name}
            </span>
          )}

          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 pt-2">
        <button
          type="reset"
          className="rounded-xl border border-slate-300 px-6 py-3 font-medium hover:bg-slate-100"
        >
          Reset
        </button>

        <button
          type="submit"
          className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 font-semibold text-white shadow-lg transition hover:scale-105"
        >
          {initial ? "Update Task" : "Create Task"}
        </button>
      </div>
    </form>
  );
}