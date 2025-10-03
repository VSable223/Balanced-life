import Task from "../models/Task.js";

// Get energy level based on time of day
function getCurrentEnergyLevel() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "high";   // Morning: Best for deep work
  if (hour >= 12 && hour < 18) return "medium"; // Afternoon: Routine tasks
  return "low";                                // Evening: Light tasks
}

// AI Smart Sorting Logic
export async function prioritizeTasks(userId) {
  const tasks = await Task.find({ userId, completed: false }); // ✅ fixed field name

  if (!tasks.length) return [];

  const now = new Date();
  const currentEnergy = getCurrentEnergyLevel();
  const priorityScore = { high: 3, medium: 2, low: 1 };

  const sortedTasks = tasks.sort((a, b) => {
    const timeA = a.deadline ? new Date(a.deadline) - now : Infinity;
    const timeB = b.deadline ? new Date(b.deadline) - now : Infinity;

    const prioA = priorityScore[a.priority] || 0;
    const prioB = priorityScore[b.priority] || 0;

    const energyMatchA = a.energyRequired && a.energyRequired === currentEnergy ? 1 : 0;
    const energyMatchB = b.energyRequired && b.energyRequired === currentEnergy ? 1 : 0;

    return (
      prioB - prioA ||    // 1. Sort by priority
      timeA - timeB ||    // 2. Then by deadline urgency
      energyMatchB - energyMatchA // 3. Then by energy match
    );
  });

  return sortedTasks;
}
