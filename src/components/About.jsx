import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './About.css';

function About({ about, profile }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  const fadeLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  const fadeRight = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const highlightVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
    }),
  };

  const imageUrl = about?.image_url || profile?.profile_image_url;

  return (
    <section id="about" className="section" ref={ref}>
      <div className="container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* Section Header */}
          <motion.div className="about-header" variants={fadeUp}>
            <h2 className="section-title">{about?.title || 'About Me'}</h2>
            <p className="section-subtitle">Get to know me better</p>
          </motion.div>

          <div className="about-grid">
            {/* Image Column */}
            <motion.div className="about-image-col" variants={fadeLeft}>
              {imageUrl ? (
                <div className="about-image-wrapper">
                  <div className="about-image-glow" />
                  <img
                    src={imageUrl}
                    alt="About"
                    className="about-image"
                  />
                  <div className="about-image-decoration" />
                  <div className="about-image-dots" />
                </div>
              ) : (
                <div className="about-image-placeholder">
                  <span>🧑‍💻</span>
                </div>
              )}
            </motion.div>

            {/* Text Column */}
            <motion.div className="about-text-col" variants={fadeRight}>
              <motion.p className="about-description" variants={fadeUp}>
                {about?.description || 'Tell your story here...'}
              </motion.p>

              {about?.highlights && about.highlights.length > 0 && (
                <div className="about-highlights">
                  {about.highlights.map((h, i) => (
                    <motion.div
                      key={i}
                      className="highlight-item"
                      custom={i}
                      variants={highlightVariants}
                      whileHover={{ x: 8, transition: { duration: 0.2 } }}
                    >
                      <span className="highlight-icon">✦</span>
                      <span>{h}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              <motion.div className="about-info-grid" variants={containerVariants}>
                {profile?.email && (
                  <motion.div className="info-item" variants={scaleIn} whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}>
                    <span className="info-icon">📧</span>
                    <div>
                      <span className="info-label">Email</span>
                      <span className="info-value">{profile.email}</span>
                    </div>
                  </motion.div>
                )}
                {profile?.phone && (
                  <motion.div className="info-item" variants={scaleIn} whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}>
                    <span className="info-icon">📱</span>
                    <div>
                      <span className="info-label">Phone</span>
                      <span className="info-value">{profile.phone}</span>
                    </div>
                  </motion.div>
                )}
                {profile?.location && (
                  <motion.div className="info-item" variants={scaleIn} whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}>
                    <span className="info-icon">📍</span>
                    <div>
                      <span className="info-label">Location</span>
                      <span className="info-value">{profile.location}</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default About;
