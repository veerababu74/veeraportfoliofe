import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiMail, FiUser, FiMessageSquare, FiMapPin, FiGithub, FiLinkedin, FiTwitter, FiGlobe } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { contactAPI } from '../services/api';
import AnimatedSection from './AnimatedSection';
import './Contact.css';

function Contact({ profile }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in required fields');
      return;
    }
    setSending(true);
    try {
      await contactAPI.send(form);
      toast.success('Message sent successfully!');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send message. Try again later.');
    }
    setSending(false);
  };

  const socialLinks = [
    { url: profile?.github_url, icon: <FiGithub />, label: 'GitHub', color: '#6e5494' },
    { url: profile?.linkedin_url, icon: <FiLinkedin />, label: 'LinkedIn', color: '#0077b5' },
    { url: profile?.twitter_url, icon: <FiTwitter />, label: 'Twitter', color: '#1da1f2' },
    { url: profile?.website_url, icon: <FiGlobe />, label: 'Website', color: '#10b981' },
  ].filter((s) => s.url);

  return (
    <section id="contact" className="section">
      <div className="container">
        <AnimatedSection>
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">Have a question or want to work together?</p>
        </AnimatedSection>

        <div className="contact-grid">
          {/* Left: Info + Socials */}
          <AnimatedSection className="contact-info" delay={0.2}>
            <h3 className="contact-info-title">Let's Connect</h3>
            <p className="contact-info-text">
              Feel free to reach out. I'm always open to discussing new projects, creative ideas, or opportunities.
            </p>

            <div className="contact-details">
              {profile?.email && (
                <div className="contact-detail-card glass-card">
                  <span className="contact-detail-icon"><FiMail /></span>
                  <div>
                    <span className="contact-detail-label">Email</span>
                    <a href={`mailto:${profile.email}`} className="contact-detail-value">{profile.email}</a>
                  </div>
                </div>
              )}
              {profile?.location && (
                <div className="contact-detail-card glass-card">
                  <span className="contact-detail-icon"><FiMapPin /></span>
                  <div>
                    <span className="contact-detail-label">Location</span>
                    <span className="contact-detail-value">{profile.location}</span>
                  </div>
                </div>
              )}
            </div>

            {socialLinks.length > 0 && (
              <div className="contact-socials">
                <span className="contact-socials-label">Find me on</span>
                <div className="contact-social-links">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-social-btn"
                      style={{ '--social-color': social.color }}
                      title={social.label}
                    >
                      {social.icon}
                      <span>{social.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </AnimatedSection>

          {/* Right: Form */}
          <AnimatedSection delay={0.4}>
            <form className="contact-form glass-card" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label><FiUser style={{ marginRight: 6 }} /> Name *</label>
                  <input
                    className="form-input"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label><FiMail style={{ marginRight: 6 }} /> Email *</label>
                  <input
                    className="form-input"
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input
                  className="form-input"
                  placeholder="What's this about?"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label><FiMessageSquare style={{ marginRight: 6 }} /> Message *</label>
                <textarea
                  className="form-input"
                  placeholder="Your message..."
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>
              <motion.button
                type="submit"
                className="btn btn-primary contact-submit-btn"
                disabled={sending}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {sending ? 'Sending...' : <><FiSend /> Send Message</>}
              </motion.button>
            </form>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

export default Contact;
