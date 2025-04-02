import Task from "../models/Task.js";
import {emailService } from "./emailService.js";

export async function generateWeeklyReport(user) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const tasks = await Task.find({
    completed: true,
    completedAt: { $gte: oneWeekAgo },
  });

  const categoryTime = {
    work: 0,
    family: 0,
    personal: 0,
    health: 0,
    selfCare: 0,
  };

  tasks.forEach((task) => {
    categoryTime[task.category] += task.duration;
  });

  const totalMinutes = Object.values(categoryTime).reduce((a, b) => a + b, 0);
  const categoryPercentage = Object.keys(categoryTime).reduce((acc, key) => {
    acc[key] = ((categoryTime[key] / totalMinutes) * 100).toFixed(1) + "%";
    return acc;
  }, {});

  const insights = [];

  if (categoryTime.work > categoryTime.family + categoryTime.personal) {
    insights.push("You spent more time on work than personal and family activities. Consider setting boundaries.");
  }

  if (categoryTime.selfCare < 60) {
    insights.push("You dedicated less than an hour to self-care. Try scheduling time for yourself!");
  }

  const emailContent = `
    <h2>Weekly Work-Life Balance Report</h2>
    <p><strong>Work:</strong> ${categoryPercentage.work}</p>
    <p><strong>Family:</strong> ${categoryPercentage.family}</p>
    <p><strong>Personal:</strong> ${categoryPercentage.personal}</p>
    <p><strong>Health:</strong> ${categoryPercentage.health}</p>
    <p><strong>Self-Care:</strong> ${categoryPercentage.selfCare}</p>
    <h3>AI Insights:</h3>
    <ul>${insights.map((insight) => `<li>${insight}</li>`).join("")}</ul>
  `;

  await emailService(user.email, "Your Weekly Work-Life Balance Report", emailContent);


  return {
    categoryPercentage,
    insights,
  };
}
