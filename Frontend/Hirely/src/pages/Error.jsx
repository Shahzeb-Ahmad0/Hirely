import { AlertTriangle, Home } from "lucide-react";
import {Link} from "react-router-dom";

export default function Error() {
  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>

        <h1 className="text-6xl font-semibold text-slate-900 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          404
        </h1>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Page not found OR Too many rquests from AI</h2>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}