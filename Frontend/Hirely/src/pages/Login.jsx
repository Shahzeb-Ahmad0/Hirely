import { useState } from "react";
import { Eye, EyeOff, ArrowRight, ScanLine } from "lucide-react";
import axios from "axios";
import { AlertContainer } from "./Alert.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider.jsx";
import { Link } from "react-router-dom";

const STAGES = [
  { label: "Parsing structure", done: true },
  { label: "Matching keywords", done: true },
  { label: "Scoring against role", done: false },
];

export default function Login() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [alerts, setAlerts] = useState([]);

    const {checkAuth} = useAuth(); 

    const navigate = useNavigate();

    const showAlert = (message, type = "info") => {
      setAlerts((prev) => [...prev, { id: Date.now() + Math.random(), message, type }]);
    };


    function onChangeData(e) {
        let { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    }
        

    const handleSubmit = (e) => {
        e.preventDefault();
        sendDataBackend(formData);
        setFormData({
            username: "",
            password: "",
        });
    };


    async function sendDataBackend(data) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, data, {
          withCredentials: true,
        });
        if(response.data.success) {
          showAlert("Login successful!", "success");
          await checkAuth();
          setTimeout(()=> {
            navigate('/');
          },2000);
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
              Welcome back.
              <br />
              Your next role is close.
            </h1>
            <p className="text-slate-400 text-base leading-relaxed">
              Pick up where you left off — your saved resumes and scores are right where you left them.
            </p>
          </div>

          {/* Signature: pipeline status readout, echoes the signup panel's scan motif */}
          <div className="relative bg-slate-800/60 border border-slate-700 rounded-lg p-6">
            <span className="text-slate-400 text-xs uppercase tracking-widest block mb-4" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              Last session
            </span>
            <div className="space-y-3">
              {STAGES.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      s.done ? "bg-emerald-400" : "bg-slate-600 animate-pulse"
                    }`}
                  />
                  <span
                    className={`text-sm ${s.done ? "text-slate-300" : "text-slate-500"}`}
                    style={{ fontFamily: "'IBM Plex Mono', monospace" }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
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

          <h2 className="text-2xl text-slate-900 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" ,fontWeight:"bolder"}}>
            Log in
          </h2>
          <p className="text-slate-500 text-sm mb-8">
            Welcome back — enter your details below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1.5">
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={onChangeData}
                placeholder="you@example.com"
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <a href="#" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={onChangeData}
                  placeholder="Enter your password"
                  required
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

            <div className="flex items-center gap-2 pt-1">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="remember" className="text-sm text-slate-500">
                Keep me logged in
              </label>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2 group"
            >
              Log in
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{" "}
            <Link to='/signup' className="text-indigo-600 hover:text-indigo-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}