import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { FiGithub, FiLinkedin, FiTwitter, FiDownload, FiEye } from 'react-icons/fi';
import './Hero.css';

function Hero({ profile }) {
  const taglines = profile?.tagline
    ? profile.tagline.split('|').flatMap((t) => [t.trim(), 2000])
    : ['Full Stack Developer', 2000, 'Creative Coder', 2000];

  return (
    <section id="home" className="hero-section">
      {/* Background effects */}
      <div className="hero-bg">
        <div className="hero-gradient-orb orb-1" />
        <div className="hero-gradient-orb orb-2" />
        <div className="hero-gradient-orb orb-3" />
        <div className="hero-grid" />
      </div>

      <div className="container hero-content">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.p
            className="hero-greeting"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <span className="greeting-wave">👋</span> Hello, I'm
          </motion.p>

          <motion.h1
            className="hero-name"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {profile?.full_name || 'Your Name'}
          </motion.h1>

          <div className="hero-tagline">
            <span className="tagline-prefix">I'm a </span>
            <TypeAnimation
              sequence={taglines}
              wrapper="span"
              speed={50}
              deletionSpeed={40}
              className="tagline-typed"
              repeat={Infinity}
            />
          </div>

          <motion.p
            className="hero-bio"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {profile?.bio || 'Passionate developer building amazing digital experiences.'}
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            {profile?.resume_download_url && (
              <a href={profile.resume_download_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <FiDownload /> Download Resume
              </a>
            )}
            {profile?.resume_view_url && (
              <a href={profile.resume_view_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                <FiEye /> View Resume
              </a>
            )}
          </motion.div>

          <motion.div
            className="hero-socials"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            {profile?.github_url && (
              <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="social-link">
                <FiGithub />
              </a>
            )}
            {profile?.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="social-link">
                <FiLinkedin />
              </a>
            )}
            {profile?.twitter_url && (
              <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="social-link">
                <FiTwitter />
              </a>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-image-wrapper"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {profile?.profile_image_url ? (
            <div className="hero-image-container animate-float">
              <img src={profile.profile_image_url} alt={profile.full_name} className="hero-image" />
              <div className="hero-image-ring" />
              <div className="hero-image-ring ring-2" />
            </div>
          ) : (
            <div className="hero-image-placeholder animate-float">
              <span className="placeholder-emoji">👨‍💻</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <div className="scroll-mouse">
          <div className="scroll-wheel" />
        </div>
        <span>Scroll Down</span>
      </motion.div>
    </section>
  );
}

export default Hero;
