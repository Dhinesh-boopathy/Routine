import { useState, useEffect } from "react";

export default function Savings() {
  // Load saved goal or empty
  const [goal, setGoal] = useState(() => {
    const saved = localStorage.getItem("goal");
    return saved ? JSON.parse(saved) : null;
  });

  const [goalName, setGoalName] = useState("");
  const [goalTarget, setGoalTarget] = useState("");

  function createGoal(e) {
    e.preventDefault();

    if (!goalName || !goalTarget) {
      return alert("Fill all fields!");
    }

    const newGoal = {
      name: goalName,
      target: parseInt(goalTarget),
      saved: 0,
    };

    setGoal(newGoal);

    setGoalName("");
    setGoalTarget("");
  }

  // Whenever goal changes -> save in localStorage
  useEffect(() => {
    if (goal) localStorage.setItem("goal", JSON.stringify(goal));
  }, [goal]);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Saving Goal</h2>

      {/* Goal Form */}
      <form
        onSubmit={createGoal}
        className="bg-white p-6 rounded-xl shadow-md mb-4"
      >
        <input
          type="text"
          placeholder="Goal name"
          value={goalName}
          onChange={(e) => setGoalName(e.target.value)}
          className="w-full mb-3 px-4 py-2 border rounded-lg"
        />

        <input
          type="number"
          placeholder="Target amount (₹)"
          value={goalTarget}
          onChange={(e) => setGoalTarget(e.target.value)}
          className="w-full mb-3 px-4 py-2 border rounded-lg"
        />

        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Create Goal
        </button>
      </form>

      {/* Goal Display */}
      {goal && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-2">{goal.name}</h3>
          <p className="text-gray-700">Target: ₹{goal.target}</p>
          <p className="font-semibold mt-2">Saved: ₹{goal.saved}</p>
        </div>
      )}
    </div>
  );
}
