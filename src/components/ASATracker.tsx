import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Clock, Circle, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string; glow: string; bg: string; pulse?: boolean }> = {
  Passed: { icon: CheckCircle2, color: "text-green-400", glow: "shadow-[0_0_12px_hsl(142,70%,45%/0.4)]", bg: "bg-green-400" },
  Sitting: { icon: Clock, color: "text-yellow-400", glow: "shadow-[0_0_12px_hsl(48,96%,53%/0.4)]", bg: "bg-yellow-400", pulse: true },
  Future: { icon: Circle, color: "text-muted-foreground", glow: "", bg: "bg-muted-foreground" },
};

const PAGE_SIZE = 3;

const ASATracker = () => {
  const [page, setPage] = useState(0);

  const { data: exams } = useQuery({
    queryKey: ["exams"],
    queryFn: async () => {
      const { data, error } = await supabase.from("exams").select("*").order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const passed = exams?.filter((e) => e.status === "Passed").length ?? 0;
  const total = exams?.length ?? 6;
  const totalPages = Math.ceil((exams?.length ?? 0) / PAGE_SIZE);
  const visibleExams = exams?.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE) ?? [];

  return (
    <div className="glass rounded-2xl p-6 neon-glow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-lg">ASA Path Progress</h3>
        <span className="text-xs font-medium text-muted-foreground">{passed}/{total} Passed</span>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-muted mb-6 overflow-hidden">
        <motion.div
          className="h-full rounded-full gradient-bg"
          initial={{ width: 0 }}
          animate={{ width: `${(passed / total) * 100}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>

      {/* Exam carousel */}
      <div className="relative">
        <div className="overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="flex flex-col sm:flex-row gap-3"
            >
              {visibleExams.map((exam, i) => {
                const config = statusConfig[exam.status as keyof typeof statusConfig];
                const Icon = config.icon;
                return (
                  <div
                    key={exam.id}
                    className={`flex-1 glass rounded-xl p-4 ${config.glow}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon size={16} className={`${config.color} ${config.pulse ? "animate-glow-pulse" : ""}`} />
                      <span className="font-display font-bold text-sm">{exam.name}</span>
                      {exam.status === "Sitting" && (
                        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400 font-semibold uppercase tracking-wider">
                          Live
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{exam.full_name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{exam.date}</p>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-lg glass text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === page ? "gradient-bg w-4" : "bg-muted-foreground/40"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="p-1.5 rounded-lg glass text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ASATracker;
