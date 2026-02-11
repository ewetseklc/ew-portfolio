import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border py-8 mt-20">
    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} EW Analytics. All rights reserved.
      </p>
      <div className="flex items-center gap-4">
        <a href="https://github.com/ewetseklc" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
          <Github size={18} />
        </a>
        <a href="https://linkedin.com/in/ewetsechisenga" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-secondary transition-colors">
          <Linkedin size={18} />
        </a>
        <a href="mailto:ewetsekchisenga@gmail.com" className="text-muted-foreground hover:text-accent transition-colors">
          <Mail size={18} />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
