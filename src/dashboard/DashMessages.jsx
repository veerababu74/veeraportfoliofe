import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { contactAPI } from '../services/api';
import { FiMail, FiTrash2, FiEye, FiInbox } from 'react-icons/fi';
import Pagination from './Pagination';
import './DashMessages.css';

const ITEMS_PER_PAGE = 6;

function DashMessages() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try { const r = await contactAPI.getAll(); setMessages(r.data); } catch {}
    setLoading(false);
  };

  const handleRead = async (msg) => {
    setSelected(msg);
    if (!msg.is_read) {
      try { await contactAPI.markRead(msg.id); load(); } catch {}
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return;
    try {
      await contactAPI.delete(id);
      toast.success('Deleted');
      if (selected?.id === id) setSelected(null);
      load();
    } catch { toast.error('Failed'); }
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="dash-page-title">Messages</h1>
          <p style={{ color: 'var(--text-secondary)' }}>{messages.length} messages · {unreadCount} unread</p>
        </div>
      </div>

      <div className="messages-container">
        <div className="messages-list">
          {loading && <p style={{ padding: 24, color: 'var(--text-secondary)' }}>Loading...</p>}
          {!loading && messages.length === 0 && (
            <div className="messages-empty"><FiInbox size={48} /><p>No messages yet</p></div>
          )}
          {(() => {
            const totalPages = Math.ceil(messages.length / ITEMS_PER_PAGE);
            const paginated = messages.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
            return (
              <>
                {paginated.map(msg => (
                  <motion.div
                    key={msg.id}
                    className={`message-item ${!msg.is_read ? 'unread' : ''} ${selected?.id === msg.id ? 'active' : ''}`}
                    onClick={() => handleRead(msg)}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  >
                    <div className="message-item-header">
                      <span className="message-sender">{msg.name}</span>
                      {!msg.is_read && <span className="unread-dot" />}
                    </div>
                    <p className="message-subject">{msg.subject || 'No subject'}</p>
                    <p className="message-preview">{msg.message?.substring(0, 80)}...</p>
                    <div className="message-item-footer">
                      <span className="message-email">{msg.email}</span>
                      <button className="btn-delete" onClick={e => { e.stopPropagation(); handleDelete(msg.id); }}><FiTrash2 size={14} /></button>
                    </div>
                  </motion.div>
                ))}
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </>
            );
          })()}
        </div>

        <AnimatePresence>
          {selected && (
            <motion.div className="message-detail glass-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <div className="message-detail-header">
                <div>
                  <h3>{selected.name}</h3>
                  <a href={`mailto:${selected.email}`}>{selected.email}</a>
                </div>
                <button className="btn-delete" onClick={() => handleDelete(selected.id)}><FiTrash2 /></button>
              </div>
              {selected.subject && <h4 className="message-detail-subject">{selected.subject}</h4>}
              <div className="message-detail-body">{selected.message}</div>
              <div className="message-detail-meta">
                <FiMail size={14} />
                <span>Received: {new Date(selected.created_at).toLocaleString()}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default DashMessages;
