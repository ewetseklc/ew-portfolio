import { motion } from "framer-motion";
import { CheckCircle2, Clock, Circle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string; glow: string; bg: string; pulse?: boolean }> = {
  Passed: { icon: CheckCircle2, color: "text-green-400", glow: "shadow-[0_0_12px_hsl(142,70%,45%/0.4)]", bg: "bg-green-400" },
  Sitting: { icon: Clock, color: "text-yellow-400", glow: "shadow-[0_0_12px_hsl(48,96%,53%/0.4)]", bg: "bg-yellow-400", pulse: true },
  Future: { icon: Circle, color: "text-muted-foreground", glow: "", bg: "bg-muted-foreground" },
};

const ASATracker = () => {
  const { data: exams } = useQuery({
    queryKey: ["exams"],
    queryFn: async () => {
      const { data, error } = await supabase.from("exams").select("*").order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const passed = exams?.filter((e) => e.status === "Passed").length ?? 0;
  const total = exams?.length ?? 3;

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

      {/* Exam list */}
      <div className="flex flex-col sm:flex-row gap-3">
        {exams?.map((exam, i) => {
          const config = statusConfig[exam.status as keyof typeof statusConfig];
          const Icon = config.icon;
          return (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
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
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ASATracker;
