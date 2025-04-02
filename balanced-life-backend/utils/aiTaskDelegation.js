import User from "../models/User.js";
import Task from "../models/Task.js"; // Make sure Task is imported

export async function suggestDelegation(task) {
  const users = await User.find(); // Get all users from DB

  if (users.length === 0) {
    throw new Error("No users found for task delegation.");
  }

  let bestCandidate = null;
  let minWorkload = Infinity;

  for (const user of users) {
    const workload = await calculateWorkload(user._id);

    if (workload < minWorkload) {
      minWorkload = workload;
      bestCandidate = user;
    }
  }

  if (!bestCandidate) {
    throw new Error("No suitable user found for task delegation.");
  }

  return { userId: bestCandidate._id, name: bestCandidate.name };
}

// Count unfinished tasks for a user
async function calculateWorkload(userId) {
  const tasks = await Task.find({ assignedTo: userId, completed: false });
  return tasks.length;
}
