import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiEye, FiDownload } from 'react-icons/fi';
import './Navbar.css';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
];

function Navbar({ profile }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Detect active section
      const sections = navLinks.map((l) => l.href.replace('#', ''));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 150) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="navbar-container">
        <motion.a
          href="#home"
          className="navbar-logo"
          whileHover={{ scale: 1.05 }}
          onClick={() => handleNavClick('#home')}
        >
          <span className="logo-bracket">&lt;</span>
          {profile?.full_name?.split(' ')[0] || 'Portfolio'}
          <span className="logo-bracket"> /&gt;</span>
        </motion.a>

        {/* Desktop Nav */}
        <div className="navbar-links">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link ${activeSection === link.href.replace('#', '') ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
            >
              {link.label}
              {activeSection === link.href.replace('#', '') && (
                <motion.div className="nav-indicator" layoutId="nav-indicator" />
              )}
            </a>
          ))}
        </div>

        {/* Resume Buttons */}
        <div className="navbar-resume-btns">
          {profile?.resume_view_url && (
            <a
              href={profile.resume_view_url}
              target="_blank"
              rel="noopener noreferrer"
              className="navbar-resume-btn resume-view-btn"
            >
              <FiEye /> View Resume
            </a>
          )}
          {profile?.resume_download_url && (
            <a
              href={profile.resume_download_url}
              target="_blank"
              rel="noopener noreferrer"
              className="navbar-resume-btn resume-download-btn"
            >
              <FiDownload /> Download
            </a>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="navbar-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                className={`mobile-link ${activeSection === link.href.replace('#', '') ? 'active' : ''}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
              >
                {link.label}
              </motion.a>
            ))}
            <div className="mobile-resume-btns">
              {profile?.resume_view_url && (
                <a
                  href={profile.resume_view_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn resume-view-btn"
                >
                  <FiEye /> View Resume
                </a>
              )}
              {profile?.resume_download_url && (
                <a
                  href={profile.resume_download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn resume-download-btn"
                >
                  <FiDownload /> Download Resume
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;
