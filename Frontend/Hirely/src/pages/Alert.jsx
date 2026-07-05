import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

const VARIANTS = {
  success: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-800",
    icon: CheckCircle2,
    iconColor: "text-emerald-500",
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
    icon: XCircle,
    iconColor: "text-red-500",
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-800",
    icon: AlertTriangle,
    iconColor: "text-amber-500",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-800",
    icon: Info,
    iconColor: "text-blue-500",
  },
};


export function Alert({ message, type = "info", onClose, autoClose = true, duration = 4000 }) {
  const variant = VARIANTS[type] || VARIANTS.info;
  const Icon = variant.icon;

  useEffect(() => {
    if (!autoClose) return;
    const timer = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(timer);
  }, [autoClose, duration, onClose]);

  return (
    <div
      className={`flex items-start gap-3 w-full max-w-sm rounded-xl border ${variant.border} ${variant.bg} p-4 shadow-lg animate-slide-in`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${variant.iconColor}`} />
      <p className={`flex-1 text-sm font-medium ${variant.text}`}>{message}</p>
      <button
        onClick={onClose}
        className={`flex-shrink-0 ${variant.text} opacity-60 hover:opacity-100 transition-opacity`}
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in {
          animation: slide-in 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}


export function AlertContainer({ alerts, setAlerts }) {
  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3">
      {alerts.map((a) => (
        <Alert key={a.id} message={a.message} type={a.type} onClose={() => removeAlert(a.id)} />
      ))}
    </div>
  );
}


export default function AlertDemo() {
  const [alerts, setAlerts] = useState([]);

  const showAlert = (message, type = "info") => {
    const id = Date.now() + Math.random();
    setAlerts((prev) => [...prev, { id, message, type }]);
  };

  const handleLoginDemo = () => {
    const success = Math.random() > 0.5;
    if (success) {
      showAlert("Login successful!", "success");
    } else {
      showAlert("Invalid email or password.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <AlertContainer alerts={alerts} setAlerts={setAlerts} />

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 max-w-sm w-full text-center">
        <h1 className="text-lg font-semibold text-slate-900 mb-2">Alert component demo</h1>
        <p className="text-sm text-slate-500 mb-6">
          Click the buttons below to trigger each alert variant.
        </p>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleLoginDemo}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 rounded-lg transition"
          >
            Simulate login
          </button>
          <button
            onClick={() => showAlert("Signup successful! Welcome aboard.", "success")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2.5 rounded-lg transition"
          >
            Show success
          </button>
          <button
            onClick={() => showAlert("Something went wrong. Please try again.", "error")}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2.5 rounded-lg transition"
          >
            Show error
          </button>
          <button
            onClick={() => showAlert("Your session will expire soon.", "warning")}
            className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium py-2.5 rounded-lg transition"
          >
            Show warning
          </button>
        </div>
      </div>
    </div>
  );
}