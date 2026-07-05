import { use, useState } from "react";
import {
  Sparkles,
  Code2,
  User,
  Map,
  ChevronUp,
  ChevronDown,
  Lightbulb,
  MessageSquare,
  Info,
  Settings,
} from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2, Download } from "lucide-react";
import { ArrowLeft } from "lucide-react";


const severityStyles = {
  high: "bg-red-50 text-red-600",
  medium: "bg-amber-50 text-amber-600",
  low: "bg-emerald-50 text-emerald-600",
};

function SidebarItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-blue-50 text-blue-700"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <span
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
          active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
        }`}
      >
        <Icon className="w-4 h-4" />
      </span>
      {label}
    </button>
  );
}

function QuestionAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="w-full flex items-start gap-4 p-5 text-left"
            >
              <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                {index + 1}
              </span>
              <p className="flex-1 text-sm md:text-[15px] text-slate-800 leading-relaxed font-medium">
                {item.question}
              </p>
              <span className="text-slate-400 flex-shrink-0 mt-1">
                {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </span>
            </button>

            {isOpen && (
              <div className="px-5 pb-5 flex flex-col gap-3">
                <div className="bg-blue-50/70 rounded-xl p-4 flex gap-3">
                  <Lightbulb className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-blue-700 mb-1">Intention</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{item.intention}</p>
                  </div>
                </div>
                <div className="bg-emerald-50/70 rounded-xl p-4 flex gap-3">
                  <MessageSquare className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-emerald-700 mb-1">Answer</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{item.answer}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function RoadmapView({ plan }) {
  return (
    <div className="flex flex-col gap-4">
      {plan.map((day) => (
        <div
          key={day.day}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-8 rounded-lg bg-blue-600 text-white text-sm font-semibold flex items-center justify-center flex-shrink-0">
              {day.day}
            </span>
            <h3 className="text-sm md:text-[15px] font-semibold text-slate-900">{day.focus}</h3>
          </div>
          <ul className="flex flex-col gap-1.5 pl-11">
            {day.tasks.map((task, i) => (
              <li key={i} className="text-sm text-slate-600 leading-relaxed list-disc">
                {task}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ScoreDonut({ score }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-32 h-32 flex-shrink-0">
        <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
          <circle cx="70" cy="70" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="12" />
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="#2563eb"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-semibold text-slate-900">{score}%</span>
        </div>
      </div>
      <p className="text-sm text-slate-500 leading-relaxed">
        Keep improving! You're on the right track.
      </p>
    </div>
  );
}

// Main Page

export default function InterviewReportPage() {
  const [activeTab, setActiveTab] = useState("technical");
  const [reportData,setReportData] = useState({
    jobDescription: "",
    resume: "",
    selfDescription: "",
    matchScore: 0,
    technicalQuestions: [],
    behavioralQuestions: [],
    skillGaps: [],
    preparationPlan: [],
    user: null,
    title: "",
  });
  const [isGeneratingPdf,setIsGeneratingPdf] = useState(false);

  const tabs = [
    { key: "technical", label: "Technical Questions", icon: Code2 },
    { key: "behavioral", label: "Behavioral Questions", icon: User },
    { key: "roadmap", label: "Preparation Roadmap", icon: Map },
  ];

  const navigate = useNavigate();

  let { id } = useParams();


  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/interview/${id}`,{
          withCredentials: true,
        });

        const data =  response.data.reportData;

        setReportData((currData)=> {
          return {...data};
        })
      }
      catch(e) {
        console.log(e.response?.data?.message);
        navigate('/error');
      }
    }
    fetchReportData();
  },[]);
  

  async function downloadResume() {
      try {
        setIsGeneratingPdf(true);

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/resume/pdf`,
          {
            resume: reportData.resume,
            selfDescription: reportData.selfDescription,
            jobDescription: reportData.jobDescription,
          },
          {
            responseType: "blob",
            withCredentials: true,
          }
        );

        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: "application/pdf" })
        );

        const link = document.createElement("a");
        link.href = url;
        link.download = "Resume.pdf";
        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.log(err);
      } finally {
        setIsGeneratingPdf(false);
      }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr_320px] gap-6">
        {/* Sidebar */}
        <aside className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 lg:h-fit lg:sticky lg:top-6">
          <div className="flex items-center gap-3 px-2 pb-4 mb-2 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-900">
                Interview <span className="text-blue-600">Prep AI</span>
              </h1>
              <p className="text-xs text-slate-400">Your AI Interview Coach</p>
            </div>
          </div>

          <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
            {tabs.map((tab) => (
              <SidebarItem
                key={tab.key}
                icon={tab.icon}
                label={tab.label}
                active={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
              />
            ))}
          </nav>

           <button
            onClick={downloadResume}
            disabled={isGeneratingPdf}
            className={`ml-3 mt-6 inline-flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300
              ${
                isGeneratingPdf
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:-translate-y-0.5 hover:shadow-lg"
              } text-white`}
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Resume...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download Resume
              </>
            )}
          </button>


          
            <Link to='/' className="ml-3 mt-6 inline-flex  rounded-xl items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm md:text-base font-sm px-3 py-2 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-purple-200 hover:-translate-y-0.5 transition-all duration-300">
            <ArrowLeft className="w-4 h-4" />
            Home</Link>
        
        </aside>

        {/* Main content */}
        <main>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
                {tabs.find((t) => t.key === activeTab)?.label}
              </h2>
              <div className="w-10 h-1 bg-blue-600 rounded-full mt-2" />
            </div>
          </div>

          {activeTab === "technical" && <QuestionAccordion items={reportData.technicalQuestions} />}
          {activeTab === "behavioral" && <QuestionAccordion items={reportData.behavioralQuestions} />}
          {activeTab === "roadmap" && <RoadmapView plan={reportData.preparationPlan} />}
        </main>

        {/* Right panel */}
        <aside className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-1.5 mb-4">
              <h3 className="text-sm font-semibold text-slate-900">Overall Match Score</h3>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <ScoreDonut score={reportData.matchScore} />
            <div className="mt-5">
              <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-red-400 via-amber-400 to-blue-500" />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900">Skill Gaps</h3>
              <Settings className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex flex-col gap-2.5">
              {reportData.skillGaps.map((gap, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-2 border border-slate-100 rounded-xl px-3.5 py-2.5"
                >
                  <span className="text-sm text-slate-700">{gap.skill}</span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${severityStyles[gap.severity]}`}
                  >
                    {gap.severity.charAt(0).toUpperCase() + gap.severity.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
} 