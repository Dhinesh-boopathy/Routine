import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/authFetch";

const MAX_TASKS = 15;

export default function SavedTemplates() {
  const navigate = useNavigate();

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTasks, setEditedTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    try {
      const data = await authFetch("/routine/templates");
      setTemplates(data);
    } catch (err) {
      console.error("Fetch templates failed", err);
    } finally {
      setLoading(false);
    }
  }

  // ---------------- CARD ACTIONS ----------------

  async function handleActivate(templateId) {
    try {
      await authFetch(`/routine/activate/${templateId}`, {
        method: "POST",
      });
      navigate("/routine");
    } catch (err) {
      alert("Failed to activate template");
    }
  }

  async function handleDelete(templateId) {
    const ok = window.confirm("Delete this template?");
    if (!ok) return;

    try {
      await authFetch(`/routine/template/${templateId}`, {
        method: "DELETE",
      });

      setTemplates((prev) =>
        prev.filter((t) => t._id !== templateId)
      );

      if (selectedTemplate?._id === templateId) {
        closeModal();
      }
    } catch (err) {
      alert("Failed to delete template");
    }
  }

  // ---------------- MODAL ----------------

  function openTemplate(template) {
    setSelectedTemplate(template);
    setEditedTasks(template.tasks.map((t) => t.title));
    setIsEditMode(false);
  }

  function closeModal() {
    setSelectedTemplate(null);
    setIsEditMode(false);
    setEditedTasks([]);
    setNewTask("");
  }

  function addTask() {
    if (!newTask.trim()) return;
    if (editedTasks.length >= MAX_TASKS) return;

    setEditedTasks((prev) => [...prev, newTask]);
    setNewTask("");
  }

  function removeTask(index) {
    setEditedTasks((prev) =>
      prev.filter((_, i) => i !== index)
    );
  }

  async function saveTemplate({ setAsDefault }) {
    if (!selectedTemplate) return;

    try {
      setSaving(true);

      await authFetch(`/routine/template/${selectedTemplate._id}`, {
        method: "PUT",
        body: JSON.stringify({
          tasks: editedTasks.map((t) => ({
            title: t,
            description: "",
          })),
          setAsDefault,
        }),
      });

      await fetchTemplates();
      closeModal();

      if (setAsDefault) {
        navigate("/routine");
      }
    } catch (err) {
      alert("Failed to save template");
    } finally {
      setSaving(false);
    }
  }

  // ---------------- RENDER ----------------

  if (loading) {
    return (
      <p className="p-6 text-center text-slate-500">
        Loading...
      </p>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-100 p-6">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-2xl font-bold text-blue-600 mb-6">
          Saved Templates
        </h1>

      {templates.length === 0 ? (
  <div className="bg-white rounded-xl shadow-md p-6 text-center">
    <p className="text-slate-600 mb-3">
      You don’t have any saved templates yet.
    </p>

    <button
      onClick={() => navigate("/create-routine")}
      className="px-4 py-2 text-sm font-semibold
                 bg-blue-600 text-white rounded-lg
                 hover:bg-blue-700"
    >
      Create Your First Template
    </button>
  </div>
) : (
  templates.map((template) => (
    <div
      key={template._id}
      onClick={() => openTemplate(template)}
      className="bg-white p-5 rounded-xl shadow-md mb-4
                 flex items-center justify-between
                 cursor-pointer hover:shadow-lg transition"
    >
      {/* LEFT */}
      <div>
        <h3 className="text-lg font-semibold">
          {template.title}
        </h3>
        <p className="text-sm text-slate-500">
          {template.tasks.length} tasks
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleActivate(template._id);
          }}
          className="px-4 py-2 text-sm font-semibold
                     bg-blue-600 text-white rounded-lg
                     hover:bg-blue-700"
        >
          Set as Default
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(template._id);
          }}
          className="px-4 py-2 text-sm font-semibold
                     bg-red-100 text-red-600 rounded-lg
                     hover:bg-red-200"
        >
          Delete
        </button>
      </div>
    </div>
  ))
)}

      </div>

      {/* ================= MODAL ================= */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl p-6">

            <h2 className="text-xl font-bold mb-4">
              Template Tasks ({editedTasks.length}/{MAX_TASKS})
            </h2>

            <ul className="space-y-2 mb-4 max-h-64 overflow-y-auto">
              {editedTasks.map((task, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center
                             border px-3 py-2 rounded-lg"
                >
                  <span className="text-sm">{task}</span>

                  {isEditMode && (
                    <button
                      onClick={() => removeTask(index)}
                      className="text-xs text-red-500"
                    >
                      Delete
                    </button>
                  )}
                </li>
              ))}
            </ul>

            {isEditMode && (
              <>
                <input
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  disabled={editedTasks.length >= MAX_TASKS}
                  placeholder={
                    editedTasks.length >= MAX_TASKS
                      ? "Task limit reached"
                      : "Add new task"
                  }
                  className="w-full border px-3 py-2 rounded-lg mb-2
                             disabled:bg-slate-100"
                />

                {editedTasks.length >= MAX_TASKS && (
                  <p className="text-xs text-red-500 mb-2">
                    Max 15 tasks allowed. Delete one to add more.
                  </p>
                )}

                <button
                  onClick={addTask}
                  disabled={editedTasks.length >= MAX_TASKS}
                  className="text-sm text-blue-600 mb-4"
                >
                  + Add Task
                </button>
              </>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm border rounded-lg"
              >
                Cancel
              </button>

              {!isEditMode ? (
                <>
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="px-4 py-2 text-sm bg-slate-600 text-white rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      saveTemplate({ setAsDefault: true })
                    }
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg"
                  >
                    Set as Default
                  </button>
                </>
              ) : (
                <>
                  <button
                    disabled={saving}
                    onClick={() =>
                      saveTemplate({ setAsDefault: false })
                    }
                    className="px-4 py-2 text-sm bg-slate-600 text-white rounded-lg"
                  >
                    Save
                  </button>

                  <button
                    disabled={saving}
                    onClick={() =>
                      saveTemplate({ setAsDefault: true })
                    }
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg"
                  >
                    Save & Set as Default
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
