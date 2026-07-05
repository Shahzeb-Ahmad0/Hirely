import { useState } from "react";
import { Eye, EyeOff, ArrowRight, ScanLine, CheckCircle2 }from "lucide-react";
import axios from "axios";
import { AlertContainer } from "./Alert.jsx";
import { useNavigate } from "react-router-dom";
import {Link} from "react-router-dom"
import { useAuth } from "../context/AuthProvider.jsx";

const KEYWORDS = [
  { text: "React", matched: true },
  { text: "Stakeholder Mgmt", matched: true },
  { text: "Python", matched: false },
  { text: "Agile", matched: true },
  { text: "SQL", matched: true },
  { text: "Kubernetes", matched: false },
];

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const {checkAuth} = useAuth();

  const [alerts, setAlerts] = useState([]);


  const showAlert = (message, type = "info") => {
    setAlerts((prev) => [...prev, { id: Date.now() + Math.random(), message, type }]);
  };


  function onChangeFunc(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Form submitted:", formData);
    sendDataBackend(formData);
    setFormData({
      username: "",
      email: "",
      password: "",
    });
  }

  async function sendDataBackend(data) {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/signup`, data, {
        withCredentials: true,
      });
      if(response.data.success) {
          showAlert(response.data.message, "success");
          await checkAuth();
          navigate('/');
        }
        else {
          showAlert(response.data.message || "Invalid email or password.", "error");
        }
    } catch (e) {
      showAlert(e.response?.data?.message || "Something went wrong. Please try again.", "error");
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-stretch font-sans">
      {/* Left panel — brand / signature moment */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-indigo-500 flex items-center justify-center">
              <ScanLine className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold text-lg tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Hirely
            </span>
          </div>

          <div className="max-w-md">
            <h1
              className="text-4xl text-white leading-tight mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Built to get past
              <br />
              the bot, first.
            </h1>
            <p className="text-slate-400 text-base leading-relaxed">
              Hirely rewrites and scores your resume against real ATS parsing logic, so a recruiter actually sees it.
            </p>
          </div>

          {/* Signature: animated ATS scan over a mock resume with keyword chips */}
          <div className="relative bg-slate-800/60 border border-slate-700 rounded-lg p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400 text-xs uppercase tracking-widest" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                Parsing resume.pdf
              </span>
              <span className="text-emerald-400 text-xs" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                Score 87%
              </span>
            </div>

            {/* mock resume lines */}
            <div className="space-y-2 mb-4">
              <div className="h-2 bg-slate-700 rounded-full w-3/4" />
              <div className="h-2 bg-slate-700 rounded-full w-full" />
              <div className="h-2 bg-slate-700 rounded-full w-5/6" />
            </div>

            {/* keyword chips */}
            <div className="flex flex-wrap gap-2">
              {KEYWORDS.map((k) => (
                <span
                  key={k.text}
                  className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                    k.matched
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                      : "border-slate-600 bg-slate-800 text-slate-500"
                  }`}
                  style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  {k.matched && <CheckCircle2 className="w-3 h-3" />}
                  {k.text}
                </span>
              ))}
            </div>

            {/* scan line */}
            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent animate-scan" />
          </div>

          <style>{`
            @keyframes scan {
              0% { transform: translateY(0); opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { transform: translateY(160px); opacity: 0; }
            }
            .animate-scan {
              animation: scan 3.5s ease-in-out infinite;
            }
          `}</style>
        </div>
      </div>

      {/* Right panel — signup form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
      <AlertContainer alerts={alerts} setAlerts={setAlerts} />
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center">
              <ScanLine className="w-4 h-4 text-white" />
            </div>
            <span className="text-slate-900 font-semibold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Hirely
            </span>
          </div>

          <h2 className="text-3xl text-slate-900 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" ,fontWeight:"bolder"}}>
            Create your account
          </h2>
          <p className="text-slate-500 text-sm mb-8">
            Free to start. No credit card required.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1.5">
                Username
              </label>
              <input
                name="username"
                id="username"
                type="text"
                value={formData.username}
                onChange={onChangeFunc}
                placeholder="Jordan Rivera"
                minLength={3}
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Email address
              </label>
              <input
                name="email"
                id="email"
                type="email"
                value={formData.email}
                onChange={onChangeFunc}
                placeholder="you@example.com"
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={onChangeFunc}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input
                id="terms"
                type="checkbox"
                required
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="terms" className="text-sm text-slate-500">
                I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2 group"
            >
              Create account
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}