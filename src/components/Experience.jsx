import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import AnimatedSection from './AnimatedSection';
import './Experience.css';

function Experience({ experience }) {
  const [expandedIds, setExpandedIds] = useState(new Set());

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section id="experience" className="section">
      <div className="container">
        <AnimatedSection>
          <h2 className="section-title">Experience</h2>
          <p className="section-subtitle">My professional journey</p>
        </AnimatedSection>

        <div className="timeline">
          {experience.map((exp, i) => {
            const id = exp.id || i;
            const isExpanded = expandedIds.has(id);
            const hasDetails = exp.description || (exp.technologies?.length > 0);

            return (
              <AnimatedSection
                key={id}
                className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}
                delay={i * 0.15}
              >
                <motion.div
                  className={`timeline-card glass-card ${isExpanded ? 'expanded' : ''}`}
                  whileHover={{ scale: 1.02 }}
                  layout
                >
                  <div className="timeline-header">
                    {exp.company_logo_url && (
                      <img src={exp.company_logo_url} alt={exp.company} className="timeline-logo" />
                    )}
                    <div style={{ flex: 1 }}>
                      <h3 className="timeline-role">{exp.role}</h3>
                      <p className="timeline-company">{exp.company}</p>
                    </div>
                    {hasDetails && (
                      <button
                        className={`timeline-expand-btn ${isExpanded ? 'active' : ''}`}
                        onClick={() => toggleExpand(id)}
                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                      </button>
                    )}
                  </div>
                  <p className="timeline-date">
                    {exp.start_date} — {exp.is_current ? 'Present' : exp.end_date}
                  </p>

                  {/* Collapsed preview */}
                  {!isExpanded && exp.description && (
                    <p className="timeline-desc-preview">
                      {exp.description.length > 120
                        ? exp.description.substring(0, 120) + '...'
                        : exp.description}
                    </p>
                  )}

                  {/* Expanded content */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        className="timeline-expandable"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                      >
                        {exp.description && (
                          <p className="timeline-desc">{exp.description}</p>
                        )}
                        {exp.technologies?.length > 0 && (
                          <div className="timeline-tags">
                            {exp.technologies.map((t) => (
                              <span key={t} className="tag">{t}</span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Expand/Collapse text button */}
                  {hasDetails && (
                    <button
                      className="timeline-read-more"
                      onClick={() => toggleExpand(id)}
                    >
                      {isExpanded ? 'Show Less' : 'Read More'}
                    </button>
                  )}
                </motion.div>
                <div className="timeline-dot" />
              </AnimatedSection>
            );
          })}
          {experience.length > 0 && <div className="timeline-line" />}
        </div>

        {experience.length === 0 && (
          <AnimatedSection>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              Experience entries will appear here.
            </p>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}

export default Experience;
