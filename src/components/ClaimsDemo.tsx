import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Loader2, AlertTriangle, DollarSign, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const DEMO_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/claims-triage`;

interface TriageResult {
  severity_score: number;
  reserve_amount: number;
  reasoning: string;
  risk_category: string;
}

const ClaimsDemo = () => {
  const [claimText, setClaimText] = useState("");
  const [result, setResult] = useState<TriageResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!claimText.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const resp = await fetch(DEMO_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ claim_text: claimText }),
      });

      if (resp.status === 429) {
        setError("Rate limit exceeded. Please try again in a moment.");
        return;
      }
      if (resp.status === 402) {
        setError("Service temporarily unavailable. Please try again later.");
        return;
      }
      if (!resp.ok) throw new Error("Failed to analyze claim");

      const data = await resp.json();
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const severityColor = (score: number) => {
    if (score <= 3) return "text-green-400";
    if (score <= 6) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="glass rounded-2xl p-6 md:p-8 neon-glow-blue">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
          <Brain size={20} className="text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg">AI Claims Triage Simulator</h3>
          <p className="text-xs text-muted-foreground">Powered by actuarial logic & AI</p>
        </div>
      </div>

      <Textarea
        value={claimText}
        onChange={(e) => setClaimText(e.target.value)}
        placeholder="Describe a claim scenario... e.g. 'Policyholder reports water damage to basement after heavy rainfall. Flooring, drywall, and electrical panel affected. No prior claims history.'"
        className="bg-muted/50 border-border min-h-[100px] text-sm mb-4 focus:ring-secondary focus:border-secondary"
      />

      <Button
        onClick={handleSubmit}
        disabled={loading || !claimText.trim()}
        className="w-full gradient-bg text-primary-foreground font-semibold neon-glow hover:opacity-90 transition-opacity"
      >
        {loading ? (
          <Loader2 className="animate-spin mr-2" size={16} />
        ) : (
          <BarChart3 className="mr-2" size={16} />
        )}
        {loading ? "Analyzing Claim..." : "Run Actuarial Triage"}
      </Button>

      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-destructive text-sm mt-3 flex items-center gap-2">
          <AlertTriangle size={14} /> {error}
        </motion.p>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 glass rounded-xl p-5 neon-glow"
          >
            <h4 className="font-display font-bold text-sm mb-4 gradient-text">AI Triage Result</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="glass rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Severity Score</p>
                <p className={`text-3xl font-display font-bold ${severityColor(result.severity_score)}`}>
                  {result.severity_score}<span className="text-sm text-muted-foreground">/10</span>
                </p>
              </div>
              <div className="glass rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Suggested Reserve</p>
                <p className="text-2xl font-display font-bold text-secondary flex items-center justify-center">
                  <DollarSign size={18} />
                  {result.reserve_amount.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="glass rounded-lg p-3 mb-3">
              <p className="text-xs text-muted-foreground mb-1">Risk Category</p>
              <p className="text-sm font-semibold">{result.risk_category}</p>
            </div>
            <div className="glass rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Reasoning</p>
              <p className="text-sm text-foreground/80 leading-relaxed">{result.reasoning}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClaimsDemo;
