import { motion } from 'framer-motion';
import { FiBookOpen, FiAward, FiExternalLink } from 'react-icons/fi';
import AnimatedSection from './AnimatedSection';
import './Education.css';

function Education({ education, certifications }) {
  return (
    <section id="education" className="section">
      <div className="container">
        <AnimatedSection>
          <h2 className="section-title">Education & Certifications</h2>
          <p className="section-subtitle">My academic journey and professional credentials</p>
        </AnimatedSection>

        <div className="edu-two-col">
          {/* Academic Background */}
          <div className="edu-column">
            <div className="edu-column-header">
              <span className="edu-column-icon edu-icon-academic"><FiBookOpen /></span>
              <h3 className="edu-column-title">Academic Background</h3>
            </div>

            {education.length > 0 ? (
              <div className="edu-timeline">
                {education.map((edu, i) => (
                  <AnimatedSection key={edu.id || i} delay={i * 0.15}>
                    <motion.div
                      className="edu-timeline-item glass-card"
                      whileHover={{ scale: 1.02, y: -3 }}
                    >
                      <div className="edu-timeline-dot" />
                      {edu.logo_url && (
                        <img src={edu.logo_url} alt={edu.institution} className="edu-logo" />
                      )}
                      <h4 className="edu-degree">{edu.degree}</h4>
                      <p className="edu-institution">{edu.institution}</p>
                      {edu.field_of_study && <p className="edu-field">{edu.field_of_study}</p>}
                      <p className="edu-date">{edu.start_date} - {edu.end_date}</p>
                      {edu.grade && <span className="edu-grade-badge">Grade: {edu.grade}</span>}
                      {edu.description && <p className="edu-desc">{edu.description}</p>}
                    </motion.div>
                  </AnimatedSection>
                ))}
              </div>
            ) : (
              <p className="edu-placeholder">Education details coming soon.</p>
            )}
          </div>

          {/* Certifications */}
          <div className="edu-column">
            <div className="edu-column-header">
              <span className="edu-column-icon edu-icon-cert"><FiAward /></span>
              <h3 className="edu-column-title">Professional Certifications</h3>
            </div>

            {certifications.length > 0 ? (
              <div className="cert-list">
                {certifications.map((cert, i) => (
                  <AnimatedSection key={cert.id || i} delay={i * 0.15}>
                    <motion.div
                      className="cert-item glass-card"
                      whileHover={{ scale: 1.02, y: -3 }}
                    >
                      <div className="cert-number">{String(i + 1).padStart(2, '0')}</div>
                      <div className="cert-content">
                        {cert.image_url && (
                          <img src={cert.image_url} alt={cert.title} className="cert-badge" />
                        )}
                        <h4 className="cert-title">{cert.title}</h4>
                        <p className="cert-issuer">{cert.issuer}</p>
                        {cert.date && <p className="cert-date">{cert.date}</p>}
                        {cert.credential_url && (
                          <a
                            href={cert.credential_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cert-link"
                          >
                            <FiExternalLink /> View Credential
                          </a>
                        )}
                      </div>
                    </motion.div>
                  </AnimatedSection>
                ))}
              </div>
            ) : (
              <p className="edu-placeholder">Certifications coming soon.</p>
            )}
          </div>
        </div>

        {education.length === 0 && certifications.length === 0 && (
          <AnimatedSection>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              Education and certifications will appear here.
            </p>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}

export default Education;
