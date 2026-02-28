import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiExternalLink, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import AnimatedSection from './AnimatedSection';
import './Projects.css';

const PROJECTS_PER_PAGE = 4;

function Projects({ projects }) {
  const categories = ['All', ...new Set(projects.map((p) => p.category).filter(Boolean))];
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  const totalPages = Math.ceil(filtered.length / PROJECTS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * PROJECTS_PER_PAGE, currentPage * PROJECTS_PER_PAGE);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  return (
    <section id="projects" className="section">
      <div className="container">
        <AnimatedSection>
          <h2 className="section-title">Projects</h2>
          <p className="section-subtitle">Things I've built</p>
        </AnimatedSection>

        {categories.length > 1 && (
          <AnimatedSection delay={0.2}>
            <div className="project-filters">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </AnimatedSection>
        )}

        <motion.div className="projects-grid" layout>
          <AnimatePresence mode="popLayout">
            {paginated.map((project, i) => (
              <motion.div
                key={project.id || project.title}
                className="project-card glass-card"
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ y: -8 }}
              >
                {project.image_url && (
                  <div className="project-image-wrapper">
                    <img src={project.image_url} alt={project.title} className="project-image" />
                    <div className="project-overlay">
                      {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="overlay-btn">
                          <FiGithub />
                        </a>
                      )}
                      {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="overlay-btn">
                          <FiExternalLink />
                        </a>
                      )}
                    </div>
                  </div>
                )}
                <div className="project-info">
                  {project.category && <span className="tag">{project.category}</span>}
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-desc">{project.description}</p>
                  {project.technologies?.length > 0 && (
                    <div className="project-tech">
                      {project.technologies.map((t) => (
                        <span key={t} className="tech-tag">{t}</span>
                      ))}
                    </div>
                  )}
                  <div className="project-links">
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                        <FiGithub /> Code
                      </a>
                    )}
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                        <FiExternalLink /> Live
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {totalPages > 1 && (
          <AnimatedSection delay={0.3}>
            <div className="projects-pagination">
              <button
                className="projects-page-btn"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <FiChevronLeft />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`projects-page-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="projects-page-btn"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <FiChevronRight />
              </button>
            </div>
          </AnimatedSection>
        )}

        {projects.length === 0 && (
          <AnimatedSection>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              Projects will appear here once added.
            </p>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}

export default Projects;
