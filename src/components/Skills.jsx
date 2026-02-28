import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection';
import './Skills.css';

const categoryColors = {
  'AI & Machine Learning': '#8b5cf6',
  'Programming Languages': '#06b6d4',
  'Cloud & Databases': '#f59e0b',
  'Tools & Frameworks': '#10b981',
};

const defaultColors = ['#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#ec4899', '#3b82f6'];

function Skills({ skills }) {
  const categories = [...new Set(skills.map((s) => s.category))];
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const getColor = (cat, idx) => categoryColors[cat] || defaultColors[idx % defaultColors.length];

  return (
    <section id="skills" className="section" ref={sectionRef}>
      <div className="container">
        <AnimatedSection>
          <h2 className="section-title">Skills & Technologies</h2>
          <p className="section-subtitle">Technologies I work with</p>
        </AnimatedSection>

        <div className="skills-categories-grid">
          {categories.map((cat, ci) => {
            const color = getColor(cat, ci);
            const catSkills = skills.filter((s) => s.category === cat);

            return (
              <motion.div
                key={cat}
                className="skill-category-card glass-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: ci * 0.1 }}
              >
                <div className="skill-category-header">
                  <span className="skill-category-dot" style={{ background: color }} />
                  <h3 className="skill-category-title">{cat}</h3>
                  <span className="skill-category-count">{catSkills.length} skills</span>
                </div>

                <div className="skill-items-list">
                  {catSkills.map((skill, i) => (
                    <div key={skill.name} className="skill-item" style={{ animationDelay: `${i * 0.08}s` }}>
                      <div className="skill-item-header">
                        <div className="skill-item-info">
                          {skill.icon_url && (
                            <img src={skill.icon_url} alt={skill.name} className="skill-icon" />
                          )}
                          <span className="skill-name">{skill.name}</span>
                        </div>
                        <span className="skill-percent" style={{ color }}>{skill.proficiency}%</span>
                      </div>
                      <div className="skill-bar">
                        <div
                          className={`skill-bar-fill ${visible ? 'animate' : ''}`}
                          style={{
                            '--fill-width': `${skill.proficiency}%`,
                            '--fill-color': color,
                            animationDelay: `${0.3 + i * 0.1}s`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {skills.length === 0 && (
          <AnimatedSection>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              Skills will appear here once added from the dashboard.
            </p>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}

export default Skills;
