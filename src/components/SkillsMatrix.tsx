import { motion } from "framer-motion";
import { Calculator, Code2, Workflow, Database, BarChart3, Shield } from "lucide-react";

const categories = [
  {
    title: "Actuarial Methods",
    icon: Calculator,
    color: "text-neon-purple",
    skills: ["Experience Studies", "Lapse/Persistency", "Credibility Theory", "GLM/Logistic Regression", "Hypothesis Testing", "Confidence Intervals"],
  },
  {
    title: "Programming",
    icon: Code2,
    color: "text-neon-blue",
    skills: ["Python (pandas, scikit-learn)", "R / R Shiny", "SQL", "PySpark / MLlib", "VBA", "TypeScript"],
  },
  {
    title: "Automation & DevOps",
    icon: Workflow,
    color: "text-neon-pink",
    skills: ["n8n Orchestration", "REST APIs", "Docker", "Webhooks", "Google Workspace", "CI/CD"],
  },
  {
    title: "Data & Reporting",
    icon: Database,
    color: "text-neon-purple",
    skills: ["Excel / PivotTables", "Tableau", "R Shiny Dashboards", "Salesforce", "Feature Engineering", "EDA"],
  },
  {
    title: "Analytics",
    icon: BarChart3,
    color: "text-neon-blue",
    skills: ["Cross-Validation", "Classification Models", "Data Cleaning", "QA Documentation", "KPI Reporting", "Segmentation"],
  },
  {
    title: "Professional",
    icon: Shield,
    color: "text-neon-pink",
    skills: ["SOA Exam Prep", "Technical Writing", "Team Mentoring", "Peer Tutoring", "Leadership", "SOPs & Onboarding"],
  },
];

const SkillsMatrix = () => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {categories.map((cat, i) => {
      const Icon = cat.icon;
      return (
        <motion.div
          key={cat.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          className="glass rounded-2xl p-6 hover:neon-glow transition-shadow duration-500"
        >
          <div className="flex items-center gap-3 mb-4">
            <Icon size={20} className={cat.color} />
            <h3 className="font-display font-bold text-sm">{cat.title}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {cat.skills.map((skill) => (
              <span
                key={skill}
                className="text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground border border-border hover:border-primary/30 hover:text-foreground transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      );
    })}
  </div>
);

export default SkillsMatrix;
