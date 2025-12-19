import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const filteredSuggestions = DEFAULT_SUGGESTIONS.filter(
    (item) =>
      item.toLowerCase().includes(input.toLowerCase()) &&
      !tasks.includes(item)
  );

  function addTask(task) {
    if (!task.trim()) return;
    if (tasks.includes(task)) return;

    setTasks((prev) => [...prev, task]);
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
    setTasks((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-100">
      <div className="max-w-3xl mx-auto p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-600">
            Create Your Routine
          </h1>

          <button
            onClick={() => navigate(-1)}
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            ← Back
          </button>
        </div>

        {/* INPUT CARD */}
        <div className="bg-white p-5 rounded-xl shadow-md mb-6 relative">
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
            placeholder="Type or choose a suggestion..."
            className="w-full px-3 py-2 border rounded-lg outline-none
                       focus:ring-2 focus:ring-blue-500"
          />

          {/* SUGGESTIONS */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white border rounded-lg shadow-md z-10 max-h-48 overflow-y-auto">
              {filteredSuggestions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => addTask(item)}
                  className="w-full text-left px-4 py-2 text-sm
                             hover:bg-slate-100 transition"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CREATED TASKS */}
        <div className="bg-white p-5 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4">
            Your Routine ({tasks.length})
          </h2>

          {tasks.length === 0 ? (
            <p className="text-sm text-slate-500">
              No tasks added yet. Start typing above 👆
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {tasks.map((task, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center
                             px-3 py-2 border rounded-lg bg-slate-50"
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

        {/* FOOTER ACTION (next step later) */}
        <div className="mt-6 flex justify-end">
         <button
  disabled={tasks.length === 0}
  onClick={() => {
    const formattedTasks = tasks.map((title, index) => ({
      id: index + 1,
      title,
      description: "Custom routine",
      done: false,
    }));

    localStorage.setItem(
      "customRoutine",
      JSON.stringify(formattedTasks)
    );

    navigate("/routine");
  }}
  className={`px-5 py-2 rounded-lg font-semibold text-sm
    ${
      tasks.length === 0
        ? "bg-slate-300 text-slate-500 cursor-not-allowed"
        : "bg-blue-600 text-white hover:bg-blue-700"
    }`}
>
  Save & Set as Default
</button>

        </div>
      </div>
    </div>
  );
}
