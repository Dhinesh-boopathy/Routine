export default function Contact() {
  return (
    <div
      className="min-h-[calc(100vh-64px)]
                 bg-slate-100 dark:bg-slate-900
                 flex items-center px-4"
    >
      <div className="w-full max-w-md mx-auto">
        <div
          className="bg-white dark:bg-slate-800
                     rounded-2xl shadow-lg p-8
                     text-slate-800 dark:text-slate-100"
        >
          {/* Header */}
          <h1 className="text-2xl font-bold mb-2 text-center">
            Contact Us
          </h1>

          <p
            className="text-slate-500 dark:text-slate-400
                       text-sm text-center mb-6"
          >
            Have feedback, suggestions, or questions?
            We’d love to hear from you.
          </p>

          {/* Info */}
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-lg">📧</span>
              <p>
                <span className="font-medium">Email</span>
                <br />
                <a
                  href="mailto:thehabitry@gmail.com"
                  className="text-blue-600 dark:text-blue-400
                             font-semibold hover:underline"
                >
                  thehabitry@gmail.com
                </a>
              </p>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-lg">💬</span>
              <p>
                <span className="font-medium">Feedback</span>
                <br />
                <span className="text-slate-700 dark:text-slate-300">
                  Share your thoughts to help us improve and grow.
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer line */}
        <p
          className="mt-6 text-xs text-center
                     text-slate-400 dark:text-slate-500"
        >
          We usually reply within 24–48 hours.
        </p>
      </div>
    </div>
  );
}
