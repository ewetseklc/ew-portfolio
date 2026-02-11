import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import ParticleBackground from "@/components/ParticleBackground";

const Portfolio = () => {
  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("display_order");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <ParticleBackground />
      <Header />
      <main className="pt-28 pb-10 container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl font-display font-black mb-2 text-center">
            <span className="gradient-text">Portfolio</span>
          </h1>
          <p className="text-center text-muted-foreground mb-12 max-w-md mx-auto">
            Actuarial projects & automation pipelines — from concept to production.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {projects?.map((project, i) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              techStack={project.tech_stack}
              githubUrl={project.github_url}
              imageUrl={project.image_url}
              caseStudy={project.case_study}
              index={i}
            />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;
