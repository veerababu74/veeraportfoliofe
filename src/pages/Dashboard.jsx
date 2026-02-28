import { useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiUser, FiFileText, FiCode, FiBriefcase, FiBook, FiFolder,
  FiAward, FiMail, FiSettings, FiLogOut, FiMessageCircle, FiMenu, FiX,
  FiDatabase, FiHome
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

// Dashboard sections
import DashProfile from '../dashboard/DashProfile';
import DashAbout from '../dashboard/DashAbout';
import DashSkills from '../dashboard/DashSkills';
import DashExperience from '../dashboard/DashExperience';
import DashProjects from '../dashboard/DashProjects';
import DashEducation from '../dashboard/DashEducation';
import DashCertifications from '../dashboard/DashCertifications';
import DashMessages from '../dashboard/DashMessages';
import DashSettings from '../dashboard/DashSettings';
import DashChatbot from '../dashboard/DashChatbot';
import DashAccount from '../dashboard/DashAccount';

import './Dashboard.css';

const sidebarLinks = [
  { to: '/admin/dashboard', icon: <FiHome />, label: 'Overview', end: true },
  { to: '/admin/dashboard/profile', icon: <FiUser />, label: 'Profile' },
  { to: '/admin/dashboard/about', icon: <FiFileText />, label: 'About' },
  { to: '/admin/dashboard/skills', icon: <FiCode />, label: 'Skills' },
  { to: '/admin/dashboard/experience', icon: <FiBriefcase />, label: 'Experience' },
  { to: '/admin/dashboard/projects', icon: <FiFolder />, label: 'Projects' },
  { to: '/admin/dashboard/education', icon: <FiBook />, label: 'Education' },
  { to: '/admin/dashboard/certifications', icon: <FiAward />, label: 'Certifications' },
  { to: '/admin/dashboard/messages', icon: <FiMail />, label: 'Messages' },
  { to: '/admin/dashboard/chatbot', icon: <FiMessageCircle />, label: 'Chatbot / Vectors' },
  { to: '/admin/dashboard/settings', icon: <FiSettings />, label: 'Site Settings' },
  { to: '/admin/dashboard/account', icon: <FiDatabase />, label: 'Account' },
];

function Dashboard() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-logo">
            <span style={{ color: 'var(--primary)' }}>&lt;</span>Admin<span style={{ color: 'var(--primary)' }}>/&gt;</span>
          </span>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            <FiX />
          </button>
        </div>

        <nav className="sidebar-nav">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">
              {admin?.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <span>{admin?.username || 'Admin'}</span>
          </div>
          <button className="sidebar-link logout-btn" onClick={handleLogout}>
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <button className="topbar-menu" onClick={() => setSidebarOpen(true)}>
            <FiMenu />
          </button>
          <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ fontSize: '0.85rem' }}>
            View Portfolio ↗
          </a>
        </header>

        <div className="dashboard-content">
          <Routes>
            <Route index element={<DashOverview />} />
            <Route path="profile" element={<DashProfile />} />
            <Route path="about" element={<DashAbout />} />
            <Route path="skills" element={<DashSkills />} />
            <Route path="experience" element={<DashExperience />} />
            <Route path="projects" element={<DashProjects />} />
            <Route path="education" element={<DashEducation />} />
            <Route path="certifications" element={<DashCertifications />} />
            <Route path="messages" element={<DashMessages />} />
            <Route path="settings" element={<DashSettings />} />
            <Route path="chatbot" element={<DashChatbot />} />
            <Route path="account" element={<DashAccount />} />
          </Routes>
        </div>
      </main>

      {/* Overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}

function DashOverview() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="dash-page-title">Dashboard Overview</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
        Welcome to your portfolio admin dashboard. Use the sidebar to manage all sections of your portfolio.
      </p>
      <div className="overview-grid">
        {sidebarLinks.slice(1).map((link) => (
          <NavLink key={link.to} to={link.to} className="overview-card glass-card">
            <span className="overview-icon">{link.icon}</span>
            <span className="overview-label">{link.label}</span>
          </NavLink>
        ))}
      </div>
    </motion.div>
  );
}

export default Dashboard;
