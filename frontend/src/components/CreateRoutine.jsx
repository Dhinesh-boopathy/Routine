import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/authFetch";

const MAX_TASKS = 15;

const DEFAULT_SUGGESTIONS = [
  "Wake up early",
  "Study / Learn 30 minutes",
  "Avoid unnecessary spending",
  "Exercise or walk",
  "Yoga / Meditation",
  "Go for walking",
  "Read a book",
  "Save money",
  "Plan tomorrow",
  "Reflect for 5 minutes",
];

export default function CreateRoutine() {
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [saving, setSaving] = useState(false);

  const filteredSuggestions = DEFAULT_SUGGESTIONS.filter(
    (item) =>
      item.toLowerCase().includes(input.toLowerCase()) &&
      !tasks.includes(item)
  );

  function addTask(task) {
    if (!task.trim()) return;
    if (tasks.includes(task)) return;
    if (tasks.length >= MAX_TASKS) return;

    setTasks(prev => [...prev, task]);
    setInput("");
    setShowSuggestions(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTask(input);
    }
  }

  function removeTask(index) {
    setTasks(prev => prev.filter((_, i) => i !== index));
  }

  async function saveTemplate({ setAsDefault }) {
    if (tasks.length === 0) return;

    try {
      setSaving(true);

      await authFetch("/routine/custom", {
        method: "POST",
        body: JSON.stringify({
          tasks: tasks.map(task => ({
            title: task,
            description: "",
          })),
          setAsDefault,
        }),
      });

      navigate(setAsDefault ? "/routine" : "/saved-templates");
    } catch (err) {
      if (err.message?.includes("Template limit")) {
        alert("You already have 3 templates. Delete one to add another.");
        navigate("/saved-templates");
        return;
      }

      alert("Something went wrong. Please try again.");
    }
  }

  return (
    <div
      className="min-h-[calc(100vh-64px)]
                 bg-slate-100 dark:bg-slate-900
                 text-slate-800 dark:text-slate-100"
    >
      <div className="max-w-3xl mx-auto p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Create Your Routine
          </h1>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/saved-templates")}
              className="text-sm font-medium
                         text-blue-600 dark:text-blue-400
                         hover:underline"
            >
              Saved Templates
            </button>

            <button
              onClick={() => navigate(-1)}
              className="text-sm text-slate-600 dark:text-slate-400
                         hover:text-slate-900 dark:hover:text-slate-200"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* INPUT CARD */}
        <div
          className="bg-white dark:bg-slate-800
                     p-5 rounded-xl shadow-md mb-6 relative"
        >
          <label className="block text-sm font-semibold mb-2">
            Add a routine task
          </label>

          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder={
              tasks.length >= MAX_TASKS
                ? "Task limit reached"
                : "Type or choose a suggestion..."
            }
            disabled={tasks.length >= MAX_TASKS}
            className="w-full px-3 py-2 border rounded-lg outline-none
                       bg-white dark:bg-slate-900
                       border-slate-300 dark:border-slate-700
                       focus:ring-2 focus:ring-blue-500
                       disabled:bg-slate-100 dark:disabled:bg-slate-800
                       disabled:cursor-not-allowed"
          />

          {/* LIMIT WARNING */}
          {tasks.length >= MAX_TASKS && (
            <p className="mt-2 text-xs text-red-500">
              You’ve reached the maximum of {MAX_TASKS} tasks for this template.
            </p>
          )}

          {/* SUGGESTIONS */}
          {showSuggestions &&
            filteredSuggestions.length > 0 &&
            tasks.length < MAX_TASKS && (
              <div
                className="absolute left-0 right-0 mt-2
                           bg-white dark:bg-slate-800
                           border border-slate-200 dark:border-slate-700
                           rounded-lg shadow-md z-10
                           max-h-48 overflow-y-auto"
              >
                {filteredSuggestions.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => addTask(item)}
                    className="w-full text-left px-4 py-2 text-sm
                               hover:bg-slate-100 dark:hover:bg-slate-700
                               transition"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
        </div>

        {/* CREATED TASKS */}
        <div
          className="bg-white dark:bg-slate-800
                     p-5 rounded-xl shadow-md"
        >
          <h2 className="text-lg font-semibold mb-4">
            Your Routine ({tasks.length} / {MAX_TASKS})
          </h2>

          {tasks.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No tasks added yet. Start typing above 👆
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {tasks.map((task, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center
                             px-3 py-2 border rounded-lg
                             bg-slate-50 dark:bg-slate-900
                             border-slate-200 dark:border-slate-700"
                >
                  <span className="text-sm font-medium">
                    {index + 1}. {task}
                  </span>

                  <button
                    onClick={() => removeTask(index)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-lg text-sm
                       border border-slate-300 dark:border-slate-700
                       text-slate-600 dark:text-slate-400
                       hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            disabled={tasks.length === 0 || saving}
            onClick={() => saveTemplate({ setAsDefault: false })}
            className={`px-5 py-2 rounded-lg font-semibold text-sm ${
              tasks.length === 0 || saving
                ? "bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed"
                : "bg-slate-600 text-white hover:bg-slate-700"
            }`}
          >
            Save Template
          </button>

          <button
            disabled={tasks.length === 0 || saving}
            onClick={() => saveTemplate({ setAsDefault: true })}
            className={`px-5 py-2 rounded-lg font-semibold text-sm ${
              tasks.length === 0 || saving
                ? "bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {saving ? "Saving..." : "Save & Set as Default"}
          </button>
        </div>
      </div>
    </div>
  );
}
