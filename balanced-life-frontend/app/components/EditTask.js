import { useState, useEffect } from "react";
import axios from "axios";
import ApiCalendar from "react-google-calendar-api";
// not in use
const config = {
  clientId: "127620214931-9tu3nbgh1e81jm9hhqi0pfb2b8hrk1dg.apps.googleusercontent.com",
  
  scope: "https://www.googleapis.com/auth/calendar.events",
  discoveryDocs: [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ],
};

export default function EditTask({ task, onUpdated }) {
  const [formData, setFormData] = useState({ ...task });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    ApiCalendar.onLoad(() => {
      ApiCalendar.initClient(config);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "duration" ? parseInt(value) || "" : value,
    }));
  };

  const formatDateTimeLocal = (date) => {
    const d = new Date(date);
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/update`,
        { taskId: task._id, updatedTask: formData }
      );
      onUpdated();

      // Create or update Google Calendar event
      const event = {
        summary: formData.title,
        start: {
          dateTime: new Date(formData.deadline).toISOString(),
        },
        end: {
          dateTime: new Date(
            new Date(formData.deadline).getTime() +
            formData.duration * 60000
          ).toISOString(),
        },
      };

      if (ApiCalendar.sign) {
        const response = await ApiCalendar.createEvent(event);
        console.log("Google Calendar event created:", response);
        alert("Task updated and Google Calendar event created!");
      } else {
        ApiCalendar.handleAuthClick();
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert(error.response?.data?.message || "Error updating task!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-2">Edit Task</h2>

      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
        placeholder="Task Title"
        required
      />

      <input
        type="datetime-local"
        name="deadline"
        value={formData.deadline ? formatDateTimeLocal(formData.deadline) : ""}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
        required
      />

      <input
        type="number"
        name="duration"
        value={formData.duration || ""}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
        placeholder="Duration (min)"
        required
      />

      <button
        type="submit"
        className={`px-4 py-2 rounded ${loading ? "bg-gray-400" : "bg-blue-500"} text-white`}
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Task"}
      </button>
    </form>
  );
}