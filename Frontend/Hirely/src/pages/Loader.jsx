import { BrainCircuit } from "lucide-react";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">

      <div className="relative">

        <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/30"></div>

        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xl">

          <BrainCircuit className="h-10 w-10 animate-pulse text-white" />

        </div>

      </div>

      <p className="mt-6 text-lg font-semibold text-slate-700">
        AI is analyzing your details...
      </p>

      <p className="mt-2 text-sm text-slate-500">
        Matching skills with the job description
      </p>

    </div>
  );
}