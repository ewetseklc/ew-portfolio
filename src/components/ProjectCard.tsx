import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string | null;
  imageUrl?: string | null;
  caseStudy?: string | null;
  index: number;
}

const ProjectCard = ({ title, description, techStack, githubUrl, caseStudy, index }: ProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX((y - centerY) / 15);
    setRotateY((centerX - x) / 15);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`,
        transition: "transform 0.1s ease",
      }}
      className="glass rounded-2xl p-6 hover:neon-glow transition-shadow duration-500 group"
    >
      <h3 className="font-display font-bold text-lg mb-2 group-hover:gradient-text transition-all">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {techStack.map((tech) => (
          <Badge key={tech} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
            {tech}
          </Badge>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 text-xs"
          >
            <Github size={14} /> Code
          </a>
        )}
        {caseStudy && (
          <button className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1 text-xs">
            <ExternalLink size={14} /> Case Study
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectCard;
