import { motion } from "framer-motion";
import { ArrowRight, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ASATracker from "@/components/ASATracker";
import ClaimsDemo from "@/components/ClaimsDemo";
import ParticleBackground from "@/components/ParticleBackground";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ParticleBackground />
      <Header />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8"
            >
              <Activity size={14} className="text-green-400 animate-glow-pulse" />
              <span className="text-xs font-medium text-muted-foreground">Currently passage-tracking ASA</span>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-glow-pulse" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-display font-black mb-6 leading-tight">
              The{" "}
              <span className="gradient-text">Modern</span>
              <br />
              Actuary
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
              Bridging rigorous actuarial science with cutting-edge AI automation.
              SOA exams. Scalable pipelines. Real results.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/portfolio"
                className="px-8 py-3 rounded-xl gradient-bg text-primary-foreground font-display font-bold text-sm neon-glow hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                View Portfolio <ArrowRight size={16} />
              </Link>
              <a
                href="#claims-demo"
                className="px-8 py-3 rounded-xl glass text-foreground font-display font-bold text-sm hover:bg-muted transition-colors"
              >
                Try AI Demo
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ASA Tracker */}
      <section className="container mx-auto px-4 -mt-20 relative z-10 mb-20">
        <ASATracker />
      </section>

      {/* Claims Demo */}
      <section id="claims-demo" className="container mx-auto px-4 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-3xl font-display font-bold text-center mb-2">
            <span className="gradient-text">Live Demo</span>
          </h2>
          <p className="text-center text-muted-foreground text-sm mb-8">
            Experience actuarial AI triage in real-time
          </p>
          <ClaimsDemo />
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
