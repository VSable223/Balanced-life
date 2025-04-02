import { useState, useEffect } from "react";
// not in use
export default function PomodoroTimer({ focusTime }) {
  const [timeLeft, setTimeLeft] = useState(focusTime * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setTimeLeft(focusTime * 60); // Reset timer when focusTime changes
  }, [focusTime]);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsRunning(false); // Stop when reaching zero
            alert("Time's up! Take a break.");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-center">
      <h2 className="text-xl font-bold">Focus Timer</h2>
      <p className="text-3xl font-semibold">
        {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
      </p>
      <div className="mt-4 space-x-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-4 py-2 rounded text-white ${isRunning ? "bg-red-500" : "bg-blue-500"}`}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={() => { setIsRunning(false); setTimeLeft(focusTime * 60); }}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
}