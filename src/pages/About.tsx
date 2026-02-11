import { motion } from "framer-motion";
import { MapPin, GraduationCap, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Timeline from "@/components/Timeline";
import ParticleBackground from "@/components/ParticleBackground";

const About = () => (
  <div className="min-h-screen bg-background">
    <ParticleBackground />
    <Header />
    <main className="pt-28 pb-10 container mx-auto px-4 relative z-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-display font-black mb-2 text-center">
          <span className="gradient-text">About</span>
        </h1>

        <div className="glass rounded-2xl p-8 mt-8">
          <h2 className="font-display font-bold text-xl mb-4">Ewetse Chisenga</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Actuarial scientist and automation engineer passionate about bridging traditional financial modeling
            with modern AI-driven solutions. Currently on the ASA track with the Society of Actuaries, while
            building scalable data pipelines and intelligent automation systems.
          </p>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={14} className="text-primary" /> St. Louis, MO
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GraduationCap size={14} className="text-secondary" /> BSc Actuarial Science — Maryville University
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail size={14} className="text-accent" /> ewetsekchisenga@gmail.com
            </div>
          </div>
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-display font-bold text-center mb-2">
          <span className="gradient-text">Journey</span>
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-10">
          Toggle between actuarial milestones and automation builds
        </p>
        <Timeline />
      </div>
    </main>
    <Footer />
  </div>
);

export default About;
