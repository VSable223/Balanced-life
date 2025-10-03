"use client";
import Link from "next/link";
import {
  FaRunning,
  FaMusic,
  FaBed,
  FaTint,
  FaHeart,
  FaSpa,
} from "react-icons/fa";

const quotes = [
  "Small daily improvements are the key to success.",
  "Believe in yourself and all that you are.",
  "Success is the sum of small efforts repeated daily.",
];
const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

const selfCareActivities = [
  {
    icon: <FaTint className="text-blue-400 text-4xl drop-shadow-lg" />,
    title: "Stay Hydrated",
    description: "Drink at least 8 glasses of water daily.",
  },
  {
    icon: <FaRunning className="text-green-400 text-4xl drop-shadow-lg" />,
    title: "Exercise",
    description: "Move your body for at least 30 minutes.",
  },
  {
    icon: <FaMusic className="text-purple-400 text-4xl drop-shadow-lg" />,
    title: "Listen to Music",
    description: "Relax with your favorite tunes.",
  },
  {
    icon: <FaBed className="text-yellow-400 text-4xl drop-shadow-lg" />,
    title: "Take a Nap",
    description: "Recharge with a short power nap.",
  },
  {
    icon: <FaHeart className="text-red-400 text-4xl drop-shadow-lg" />,
    title: "Practice Gratitude",
    description: "Reflect on things you're thankful for.",
  },
  {
    icon: <FaSpa className="text-pink-400 text-4xl drop-shadow-lg" />,
    title: "Meditation",
    description: "Calm your mind with deep breathing.",
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-purple-700 text-white px-6">
      
      {/* Logo + Hero Section */}
      <header className="mt-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-wider text-yellow-300 drop-shadow-lg">
          BalancedLife
        </h1>
        <h2 className="text-5xl font-bold mt-4 leading-tight">
          Welcome to Your <span className="text-pink-200">Balanced Life</span>
        </h2>
        <p className="text-lg max-w-2xl mx-auto mt-4 text-gray-100">
          Manage your tasks, track your well-being, and gain AI-powered
          insights for a healthier, balanced lifestyle.
        </p>

        <div className="mt-8 flex gap-6 justify-center">
          <Link
            href="/signup"
            className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-full shadow-lg hover:bg-gray-100 hover:scale-105 transition-transform duration-300"
          >
            🚀 Get Started
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-purple-600 hover:scale-105 transition-transform duration-300"
          >
            🔑 Login
          </Link>
        </div>
      </header>

      {/* Quote Section */}
      <section className="text-center mt-10">
        <p className="text-lg italic text-pink-100 bg-white/10 px-6 py-3 rounded-lg shadow-md">
          "{randomQuote}"
        </p>
      </section>

      {/* Self-Care Activities */}
      <section className="p-6 mt-12 w-full max-w-6xl">
        <h3 className="text-3xl font-semibold text-center mb-8">
          🌸 Recommended Self-Care Activities
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {selfCareActivities.map((activity, idx) => (
            <div
              key={idx}
              className="p-6 bg-white/10 backdrop-blur-md rounded-2xl flex flex-col items-center shadow-lg hover:scale-105 transition-transform duration-300"
            >
              {activity.icon}
              <h4 className="mt-3 text-xl font-bold">{activity.title}</h4>
              <p className="text-gray-200 text-sm mt-2 text-center">
                {activity.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Success Stories */}
      <section className="bg-white text-black rounded-2xl shadow-lg p-8 mt-16 w-full max-w-5xl">
        <h2 className="text-3xl font-semibold text-center mb-8">
          🌟 Success Stories
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 border-l-4 border-purple-600 bg-gray-50 rounded-lg shadow-sm">
            <p className="text-gray-700">
              "Balanced Life has transformed the way I manage my daily tasks. I
              feel more in control of my schedule than ever!"
            </p>
            <span className="block mt-3 font-semibold text-purple-700">
              - Sarah M.
            </span>
          </div>
          <div className="p-6 border-l-4 border-pink-600 bg-gray-50 rounded-lg shadow-sm">
            <p className="text-gray-700">
              "The AI insights and productivity tracking have helped me achieve
              my goals faster! Highly recommend."
            </p>
            <span className="block mt-3 font-semibold text-pink-700">
              - Emily R.
            </span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="text-center mt-16 mb-12 w-full max-w-5xl">
        <h2 className="text-3xl font-semibold mb-8">✨ Key Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white text-purple-700 font-semibold rounded-2xl shadow-lg hover:scale-105 transition">
            ✅ AI Task Scheduling
          </div>
          <div className="p-6 bg-white text-purple-700 font-semibold rounded-2xl shadow-lg hover:scale-105 transition">
            ✅ Well-being Tracking
          </div>
          <div className="p-6 bg-white text-purple-700 font-semibold rounded-2xl shadow-lg hover:scale-105 transition">
            ✅ Integrated Reminders
          </div>
        </div>
      </section>
    </main>
  );
}
