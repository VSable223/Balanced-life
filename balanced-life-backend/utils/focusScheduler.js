import Task from "../models/Task.js";

// Get current energy level
function getCurrentEnergyLevel() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "high"; // Morning: Deep focus
  if (hour >= 12 && hour < 18) return "medium"; // Afternoon: Routine tasks
  return "low"; // Evening: Light tasks
}

// AI-Based Focus Time Suggestion
export async function suggestFocusTime(userId) {
  const tasks = await Task.find({ completed: false });

  return tasks.map((task) => {
    let focusTime;

    if (task.priority === "high") {
      focusTime = 50; // Deep work sessions (50 min + 10 min break)
    } else if (task.priority === "medium") {
      focusTime = 25; // Standard Pomodoro (25 min + 5 min break)
    } else {
      focusTime = 15; // Light work (15 min + 5 min break)
    }

    if (task.energyRequired === getCurrentEnergyLevel()) {
      focusTime += 5; // Add extra focus time if energy levels match
    }

    return { ...task.toObject(), suggestedFocusTime: focusTime };
  });
}
