import { FiGithub, FiLinkedin, FiTwitter, FiHeart } from 'react-icons/fi';
import './Footer.css';

function Footer({ profile, settings }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-bracket">&lt;</span>
            {profile?.full_name?.split(' ')[0] || 'Portfolio'}
            <span className="logo-bracket"> /&gt;</span>
          </div>

          <div className="footer-socials">
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
          </div>

          <p className="footer-text">
            {settings?.footer_text || (
              <>
                Made with <FiHeart style={{ color: 'var(--secondary)', verticalAlign: 'middle' }} /> by {profile?.full_name || 'Developer'}
              </>
            )}
          </p>

          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
