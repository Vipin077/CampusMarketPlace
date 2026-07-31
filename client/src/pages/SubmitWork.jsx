import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import TaskService from "../services/TaskService";
import { Upload, Send } from "lucide-react";

export default function SubmitWork() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [completionMessage, setCompletionMessage] = useState("");
  const [proof, setProof] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await TaskService.submitWork(
        id,
        completionMessage,
        proof
      );

      alert("Work submitted successfully!");

      navigate("/my-accepted-tasks");
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Failed to submit work."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-6">
          Submit Work
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label className="block font-semibold mb-2">
              Completion Message
            </label>

            <textarea
              rows={6}
              value={completionMessage}
              onChange={(e) =>
                setCompletionMessage(e.target.value)
              }
              placeholder="Describe the work you completed..."
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Upload Proof (Optional)
            </label>

            <input
              type="file"
              onChange={(e) =>
                setProof(e.target.files[0])
              }
              className="w-full border rounded-lg p-3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            <Send size={18} />

            {loading
              ? "Submitting..."
              : "Submit Work"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}