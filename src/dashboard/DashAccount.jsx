import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FiShield } from 'react-icons/fi';

function DashAccount() {
  const { admin } = useAuth();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="dash-page-title" style={{ marginBottom: 8 }}>Account Settings</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Your admin account information</p>

      <div style={{ display: 'grid', gap: 24, maxWidth: 600 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: 'var(--text-primary)' }}>
            <FiShield /> Current Account
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Logged in as: <strong style={{ color: 'var(--primary)' }}>{admin?.username || 'Admin'}</strong>
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 12 }}>
            Credentials are configured in the server environment. To change them, update the .env file and restart the server.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default DashAccount;
