import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Cpu } from "lucide-react";

const actuarialEvents = [
  { year: "2021", title: "Started BSc Actuarial Science", desc: "Maryville University, St. Louis, MO" },
  { year: "2024", title: "Passed Exam FM", desc: "Financial Mathematics — SOA" },
  { year: "2025", title: "Passed Exam P", desc: "Probability — SOA" },
  { year: "2025", title: "BS Actuarial Science Completed", desc: "Maryville University" },
  { year: "2026", title: "Sitting Exam SRM", desc: "Statistics for Risk Modeling — May 2026" },
];

const automationEvents = [
  { year: "2024", title: "Claims Triage Engine", desc: "n8n + OpenAI + PostgreSQL + Docker pipeline for FNOL automation" },
  { year: "2024", title: "R Shiny Dashboard", desc: "Real-time portfolio reserve exposure monitoring" },
  { year: "2025", title: "Lapse MVP (Python)", desc: "Actuarial experience study with credibility-blended lapse rates" },
  { year: "2025", title: "Forest Cover ML Model", desc: "PySpark MLlib — 92% accuracy on 580K+ records" },
  { year: "2025", title: "Donor Analytics", desc: "Salesforce data analysis — 150% digital response rate boost" },
];

const Timeline = () => {
  const [mode, setMode] = useState<"actuarial" | "automation">("actuarial");
  const events = mode === "actuarial" ? actuarialEvents : automationEvents;
  const Icon = mode === "actuarial" ? GraduationCap : Cpu;

  return (
    <div>
      {/* Toggle */}
      <div className="flex items-center justify-center mb-10">
        <div className="glass rounded-full p-1 flex">
          <button
            onClick={() => setMode("actuarial")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              mode === "actuarial" ? "gradient-bg text-primary-foreground neon-glow" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <GraduationCap size={14} className="inline mr-2" />
            Actuarial
          </button>
          <button
            onClick={() => setMode("automation")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              mode === "automation" ? "gradient-bg text-primary-foreground neon-glow-blue" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Cpu size={14} className="inline mr-2" />
            Automation
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border" />
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {events.map((event, i) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex items-start gap-4 md:gap-0 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className={`md:w-1/2 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                  <div className="glass rounded-xl p-4 hover:neon-glow transition-shadow duration-300">
                    <span className="text-xs font-semibold text-primary">{event.year}</span>
                    <h4 className="font-display font-bold text-sm mt-1">{event.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{event.desc}</p>
                  </div>
                </div>

                {/* Center dot */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full gradient-bg neon-glow mt-5" />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Timeline;
