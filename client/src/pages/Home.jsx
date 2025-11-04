import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-green-600 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Sign2Speak</h1>
          <p className="text-green-100 mt-1">Breaking Communication Barriers</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            Empowering Communication for Everyone
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Record your sign language videos and receive instant responses with
            accurate subtitles. We're making communication accessible for the
            deaf and mute community.
          </p>
          <Link
            to="/record"
            className="inline-block bg-green-500 hover:bg-green-600 text-white px-10 py-4 text-xl font-semibold rounded-lg shadow-lg transform transition hover:scale-105 no-underline"
          >
            Start Recording Now →
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
            How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-lg bg-green-50 hover:shadow-lg transition">
              <div className="bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">
                Record Your Video
              </h4>
              <p className="text-gray-600">
                Use your camera to record sign language gestures or any visual
                communication.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-lg bg-green-50 hover:shadow-lg transition">
              <div className="bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">
                AI Processing
              </h4>
              <p className="text-gray-600">
                Our advanced AI analyzes your video and converts it into
                meaningful text.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 rounded-lg bg-green-50 hover:shadow-lg transition">
              <div className="bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">
                Get Subtitled Response
              </h4>
              <p className="text-gray-600">
                Receive your video back with accurate subtitles showing what was
                communicated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-green-50 py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose Sign2Speak?
          </h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start space-x-4">
              <div className="bg-green-500 text-white rounded-full p-3 shrink-0">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  Instant Results
                </h4>
                <p className="text-gray-600">
                  Get your subtitled video within seconds of recording.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-500 text-white rounded-full p-3 shrink-0">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  High Accuracy
                </h4>
                <p className="text-gray-600">
                  Advanced AI ensures precise subtitle generation.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-500 text-white rounded-full p-3 shrink-0">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  Easy to Use
                </h4>
                <p className="text-gray-600">
                  Simple interface designed for everyone.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-500 text-white rounded-full p-3 shrink-0">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  Free to Use
                </h4>
                <p className="text-gray-600">
                  No subscriptions, no hidden fees. Completely free.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto bg-green-600 text-white rounded-2xl shadow-2xl p-12">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Break Communication Barriers?
          </h3>
          <p className="text-lg text-green-100 mb-8">
            Start recording your first video and experience the power of
            accessible communication.
          </p>
          <Link
            to="/record"
            className="inline-block bg-white text-green-600 hover:bg-green-50 px-10 py-4 text-xl font-semibold rounded-lg shadow-lg transform transition hover:scale-105 no-underline"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 Sign2Speak. Making communication accessible for everyone.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
