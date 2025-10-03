"use client";
import Navbar from "../components/Navbar";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-700 to-pink-500 text-white">
      <Navbar />
      <div className="container mx-auto px-6 py-12">
        {/* Mission & Vision */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Mission & Vision</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Our mission is to empower women to manage their daily lives efficiently using AI-powered insights and productivity tools.
            We envision a future where balance and well-being are seamlessly integrated into everyday tasks.
          </p>
        </section>

        {/* Success Stories */}
        <section className="bg-white text-black rounded-lg shadow-lg p-6 mb-12">
          <h2 className="text-3xl font-semibold text-center mb-6">Success Stories</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 border-l-4 border-purple-600">
              <p>"Balanced Life has transformed the way I manage my daily tasks. I feel more in control of my schedule than ever!"</p>
              <span className="block mt-2 font-semibold">- Sarah M.</span>
            </div>
            <div className="p-4 border-l-4 border-pink-600">
              <p>"The AI insights and productivity tracking have helped me achieve my goals faster! Highly recommend."</p>
              <span className="block mt-2 font-semibold">- Emily R.</span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-6">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-white text-black rounded-lg shadow-md">✅ AI Task Scheduling</div>
            <div className="p-6 bg-white text-black rounded-lg shadow-md">✅ Well-being Tracking</div>
            <div className="p-6 bg-white text-black rounded-lg shadow-md">✅ Integrated Reminders</div>
          </div>
        </section>

        {/* Address & Contact Info */}
        <section className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-4">Contact Us</h2>
          <p>Email: <a href="mailto:support@balancedlife.com" className="underline">support@balancedlife.com</a></p>
          <p>Phone: <a href="tel:+1234567890" className="underline">+1 234 567 890</a></p>
          <p>Address: 123 Wellness Street, Productivity City</p>
        </section>

        {/* Social Media Icons */}
        <section className="flex justify-center gap-6 text-lg">
          <a href="#" className="hover:text-gray-300">🔗 Facebook</a>
          <a href="#" className="hover:text-gray-300">🔗 Twitter</a>
          <a href="#" className="hover:text-gray-300">🔗 Instagram</a>
          <a href="#" className="hover:text-gray-300">🔗 LinkedIn</a>
        </section>
      </div>
    </div>
  );
}
