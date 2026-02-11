import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SkillsMatrix from "@/components/SkillsMatrix";
import ParticleBackground from "@/components/ParticleBackground";

const Skills = () => (
  <div className="min-h-screen bg-background">
    <ParticleBackground />
    <Header />
    <main className="pt-28 pb-10 container mx-auto px-4 relative z-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl md:text-5xl font-display font-black mb-2 text-center">
          <span className="gradient-text">Skills</span>
        </h1>
        <p className="text-center text-muted-foreground mb-12 max-w-md mx-auto">
          A full-spectrum toolkit for modern actuarial & data work.
        </p>
      </motion.div>
      <div className="max-w-5xl mx-auto">
        <SkillsMatrix />
      </div>
    </main>
    <Footer />
  </div>
);

export default Skills;
