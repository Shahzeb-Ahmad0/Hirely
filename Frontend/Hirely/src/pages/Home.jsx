import { useState, useRef } from "react";
import {
  Sparkles,
  ArrowRight,
  FileCheck2,
  UploadCloud,
  FileText,
  X,
  AlertCircle,
  Loader2,
  ScanLine,
  Gauge,
  Target,
} from "lucide-react";
import { AlertContainer } from "./Alert.jsx";
import {useAuth } from "../context/AuthProvider.jsx"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button.jsx";

const MAX_SIZE_MB = 3;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const FEATURES = [
  {
    icon: ScanLine,
    title: "Resume Parsing",
    description:
      "We extract every section of your resume — experience, skills, education — the same way an ATS does.",
  },
  {
    icon: Gauge,
    title: "ATS Score",
    description:
      "Get a clear match score showing how well your resume aligns with the job description before you apply.",
  },
  {
    icon: Sparkles,
    title: "AI Suggestions",
    description:
      "Receive specific, actionable rewrites and phrasing improvements tailored to the role you're targeting.",
  },
  {
    icon: Target,
    title: "Skill Gap Analysis",
    description:
      "See exactly which skills are missing or underrepresented, ranked by how much they matter for the role.",
  },
];



function Hero() {

  return (
    <section className="relative overflow-hidden bg-slate-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-24 w-96 h-96 bg-blue-300/40 rounded-full blur-3xl" />
        <div className="absolute -top-16 right-0 w-[28rem] h-[28rem] bg-purple-300/40 rounded-full blur-3xl" />
        <div className="absolute top-40 left-1/3 w-72 h-72 bg-indigo-200/40 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-8 pt-20 pb-24 md:pt-28 md:pb-32 text-center">
        <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 text-xs font-medium text-slate-600 shadow-sm mb-8">
          <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
          Trusted by job seekers preparing for their next role
        </div>

        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-semibold text-slate-900 leading-[1.1] tracking-tight mb-6"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Create your custome Interview plans
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            with AI
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base md:text-lg text-slate-600 leading-relaxed mb-10">
          Upload your resume, describe yourself, and paste the job description — our AI
          analyzes the match, scores it against real ATS parsing logic, and gives you
          clear, actionable feedback to get past the bot and in front of a human.
        </p>

        <a
          href="#analyze"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm md:text-base font-medium px-7 py-3.5 rounded-full shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-purple-200 hover:-translate-y-0.5 transition-all duration-300"
        >
          Analyze Your Skills
          <ArrowRight className="w-4 h-4" />
        </a>

      </div>
    </section>
  );
}

function TextAreaField({ label, value, onChange, placeholder, minHeight = 180, maxLength = 2000 }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <span className="text-xs text-slate-400 tabular-nums">
          {value.length} / {maxLength}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        placeholder={placeholder}
        style={{ minHeight: `${minHeight}px` }}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 focus:bg-white transition-all duration-300"
      />
    </div>
  );
}

function ResumeUpload({ resumeFile, setResumeFile }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const validateAndSetFile = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Only PDF files are accepted.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError(`File must be ${MAX_SIZE_MB}MB or smaller.`);
      return;
    }
    setError("");
    setResumeFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    validateAndSetFile(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    validateAndSetFile(file);
  };

  const handleRemove = () => {
    setResumeFile(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <label className="text-sm font-medium text-slate-700 mb-2 block">Resume (PDF)</label>

      <input
        ref={inputRef}
        type="file"
        name="resume"
        accept="application/pdf"
        onChange={handleFileInput}
        className="hidden"
      />

      {!resumeFile ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300 ${
            isDragging
              ? "border-blue-500 bg-blue-50/70 scale-[1.01]"
              : "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/40"
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <UploadCloud className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-sm font-medium text-slate-700">
            Drag & Drop your Resume (PDF) or Click to Browse
          </p>
          <p className="text-xs text-slate-400">PDF only, up to {MAX_SIZE_MB}MB</p>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{resumeFile.name}</p>
              <p className="text-xs text-slate-400">
                {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="text-slate-400 hover:text-slate-700 transition-colors duration-300 flex-shrink-0"
            aria-label="Remove file"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 mt-2 text-xs text-red-500">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </div>
      )}
    </div>
  );
}

function AnalyzeCard() {
  const [resumeFile, setResumeFile] = useState(null);
  const [selfDescription, setSelfDescription] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();

  const isValid =
    !!resumeFile && selfDescription.trim().length > 0 && jobDescription.trim().length > 0;

  const handleAnalyze = async () => {
    if (!isValid || loading) return;
    
    navigate('/loader');


    try {
    const formData = new FormData();

    formData.append("resume", resumeFile);
    formData.append("selfDescription", selfDescription);
    formData.append("jobDescription", jobDescription);

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/interview`,
      formData,
      {
        withCredentials: true, // if using Passport sessions
      }
    );
      console.log(response.data);
      navigate(`/dashboard/${response.data.data._id}`);

    } catch (e) {
      console.error(e.response?.data?.message);
      navigate('/error');
    } finally {
      setLoading(false);
    }

    setTimeout(() => setLoading(false), 2000);

  };

  return (
    <section id="analyze" className="relative bg-slate-50 py-4 md:py-8">
      <div className="max-w-3xl mx-auto px-6 md:px-8 -mt-16 md:-mt-24">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-100 p-6 md:p-10">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
              Free analysis
            </span>
          </div>
          <h2
            className="text-2xl md:text-3xl font-semibold text-slate-900 mb-8"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Analyze your resume
          </h2>

          <div className="flex flex-col gap-6">
            <ResumeUpload resumeFile={resumeFile} setResumeFile={setResumeFile} />

            <TextAreaField
              label="Self Description"
              value={selfDescription}
              onChange={setSelfDescription}
              placeholder="Describe your skills, achievements, experience, strengths, interests, and career goals..."
              minHeight={180}
              maxLength={1500}
              minLength={10}
              required
            />

            <TextAreaField
              label="Job Description"
              value={jobDescription}
              onChange={setJobDescription}
              placeholder="Paste the complete job description here..."
              minHeight={220}
              maxLength={3000}
              minLength={10}
              required
            />

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!isValid || loading}
              className={`w-full flex items-center justify-center gap-2 rounded-full py-4 text-sm md:text-base font-semibold text-white transition-all duration-300 ${
                !isValid || loading
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-purple-200 hover:-translate-y-0.5"
              }`}
            >
              <Sparkles className="w-4 h-4" />
                "Analyze Resume"
            </button>

            {!isValid && (
              <p className="text-center text-xs text-slate-400 -mt-2">
                Upload a resume and fill in both fields to continue.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="bg-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2
            className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Everything you need to land the interview
          </h2>
          <p className="text-slate-600 text-base">
            One upload, four ways we help you understand exactly where you stand.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-5 shadow-md shadow-blue-200 group-hover:scale-105 transition-transform duration-300">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-slate-900 font-semibold text-base mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


export default function Home() {
  const {isLoggedIn,loading} = useAuth();
  const [usersData,setUsersData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate("/login");
    }
  }, [loading, isLoggedIn, navigate]);



  useEffect(()=> {
    async function getData() {
      try {
        let response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user`,{
          withCredentials:true,
        })

        setUsersData([...response.data.data]);
      }
      catch(e) {
        console.log(e);
      }
    }
    getData();
  },[])


  return (
    <div className="min-h-screen bg-slate-50">


      <Hero/>


        {/* {dataPart} */}

      <AnalyzeCard />

      {usersData.length>0 && 
        <h2
            className="text-2xl md:text-3xl font-semibold text-slate-900 mb-8 text-center"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            My Recent Plans
        </h2>
      }

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            
            {usersData.map((report) => (
            <div
              key={report._id}
              onClick={() => navigate(`/dashboard/${report._id}`)}
              className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Interview Report
                  </p>

                  <h3 className="mt-1 text-base font-semibold text-slate-900 truncate">
                    {report.title}
                  </h3>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white text-sm font-bold flex-shrink-0">
                  {report.matchScore}%
                </div>
              </div>

              {/* Divider */}
              <div className="my-4 border-t border-slate-100"></div>

              {/* Info */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Created</span>
                  <span className="font-medium text-slate-700">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Score</span>
                  <span className="font-semibold text-blue-600">
                    {report.matchScore}%
                  </span>
                </div>
              </div>

              {/* Button */}
              <button className="mt-4 w-full rounded-lg bg-slate-100 py-2 text-sm font-medium text-slate-700 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                View Report
              </button>
            </div>
          ))}
        </div>

      <Features />


    </div>
  );
}