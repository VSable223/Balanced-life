export default function HomePage() {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-white text-white px-6">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Balanced Life</h1>
          <p className="text-lg max-w-2xl">
            Manage your tasks, track your well-being, and gain AI-powered insights for a balanced life.
          </p>
  
          <div className="mt-6 flex gap-4">
            <a
              href="/signup"
              className="px-6 py-3 bg-white text-purple-500 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition"
            >
              Get Started
            </a>
            <a
              href="/login"
              className="px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-purple-500 transition"
            >
              Login
            </a>
          </div>
        </div>
      </main>
    );
  }
  