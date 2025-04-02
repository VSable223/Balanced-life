import dbConnect from "../../utils/dbConnect";
import { generateWeeklyReport } from "../../utils/balanceAnalyzer";
// not in use
export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    try {
      const report = await generateWeeklyReport(userId);
      res.status(200).json(report);
    } catch (error) {
      console.error("Weekly Report Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate report" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
} 