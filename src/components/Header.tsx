import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, FileText } from "lucide-react";
const navItems = [{
  label: "Home",
  path: "/"
}, {
  label: "Portfolio",
  path: "/portfolio"
}, {
  label: "Skills",
  path: "/skills"
}, {
  label: "About",
  path: "/about"
}, {
  label: "Contact",
  path: "/contact"
}];
const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  return <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-primary-foreground font-display font-bold text-sm">
            EW
          </div>
          <span className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">Ewetse Chisenga</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => <Link key={item.path} to={item.path} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${location.pathname === item.path ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
              {item.label}
            </Link>)}
          <a href="/Ewetse_Resume_2026.pdf" target="_blank" rel="noopener noreferrer" className="ml-2 px-4 py-2 rounded-lg text-sm font-medium gradient-bg text-primary-foreground flex items-center gap-2 neon-glow hover:opacity-90 transition-opacity">
            <FileText size={14} />
            Resume
          </a>
        </nav>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && <motion.nav initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: "auto"
      }} exit={{
        opacity: 0,
        height: 0
      }} className="md:hidden glass-strong border-t border-border overflow-hidden">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navItems.map(item => <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)} className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.path ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"}`}>
                  {item.label}
                </Link>)}
              <a href="/Ewetse_Resume_2026.pdf" target="_blank" rel="noopener noreferrer" className="px-4 py-3 rounded-lg text-sm font-medium gradient-bg text-primary-foreground flex items-center gap-2 mt-2">
                <FileText size={14} />
                Resume
              </a>
            </div>
          </motion.nav>}
      </AnimatePresence>
    </header>;
};
export default Header;