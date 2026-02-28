import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { profileAPI, uploadAPI } from '../services/api';
import { FiUploadCloud } from 'react-icons/fi';

function DashSettings() {
  const [form, setForm] = useState({
    site_title: '', meta_description: '', favicon_url: '',
    primary_color: '#6C63FF', secondary_color: '#FF6584',
    footer_text: '', google_analytics_id: '',
    chatbot_name: 'Portfolio Assistant', chatbot_avatar_url: '',
    chatbot_intro_message: "Hi! 👋 I'm the portfolio assistant. Ask me anything about the portfolio owner!",
    chatbot_system_prompt: 'You are a helpful portfolio assistant. You answer questions about the portfolio owner based ONLY on the provided context. If the context doesn\'t contain relevant information, politely say you don\'t have that information. Be concise, friendly, and professional. Keep answers focused and relevant.',
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef(null);

  useEffect(() => { load(); }, []);
  const load = async () => {
    try { const r = await profileAPI.getSettings(); if (r.data) setForm(prev => ({ ...prev, ...r.data })); } catch {}
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try { await profileAPI.updateSettings(form); toast.success('Settings saved'); } catch { toast.error('Failed'); }
    setSaving(false);
  };

  const u = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const res = await uploadAPI.upload(file);
      u('chatbot_avatar_url', res.data.url);
      toast.success('Avatar uploaded');
    } catch {
      toast.error('Upload failed');
    }
    setUploadingAvatar(false);
    if (avatarInputRef.current) avatarInputRef.current.value = '';
  };

  if (loading) return <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="dash-page-title" style={{ marginBottom: 24 }}>Site Settings</h1>
      <form className="glass-card" onSubmit={handleSubmit} style={{ padding: 24, maxWidth: 700 }}>
        <div className="form-group">
          <label>Site Title</label>
          <input className="form-input" value={form.site_title} onChange={e => u('site_title', e.target.value)} placeholder="My Portfolio" />
        </div>
        <div className="form-group">
          <label>Meta Description</label>
          <textarea className="form-input" value={form.meta_description} onChange={e => u('meta_description', e.target.value)} placeholder="SEO description for your portfolio" />
        </div>
        <div className="form-group">
          <label>Favicon URL</label>
          <input className="form-input" value={form.favicon_url} onChange={e => u('favicon_url', e.target.value)} placeholder="https://..." />
        </div>
        <div className="dash-form-grid">
          <div className="form-group">
            <label>Primary Color</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="color" value={form.primary_color} onChange={e => u('primary_color', e.target.value)} style={{ width: 40, height: 36, border: 'none', background: 'none', cursor: 'pointer' }} />
              <input className="form-input" value={form.primary_color} onChange={e => u('primary_color', e.target.value)} style={{ width: 120 }} />
            </div>
          </div>
          <div className="form-group">
            <label>Secondary Color</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="color" value={form.secondary_color} onChange={e => u('secondary_color', e.target.value)} style={{ width: 40, height: 36, border: 'none', background: 'none', cursor: 'pointer' }} />
              <input className="form-input" value={form.secondary_color} onChange={e => u('secondary_color', e.target.value)} style={{ width: 120 }} />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label>Footer Text</label>
          <input className="form-input" value={form.footer_text} onChange={e => u('footer_text', e.target.value)} placeholder="© 2024 Your Name" />
        </div>
        <div className="form-group">
          <label>Google Analytics ID</label>
          <input className="form-input" value={form.google_analytics_id} onChange={e => u('google_analytics_id', e.target.value)} placeholder="G-XXXXXXXXXX" />
        </div>
        <div className="dash-form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</button>
        </div>
      </form>

      {/* Chatbot Widget Settings */}
      <h2 className="dash-page-title" style={{ marginTop: 40, marginBottom: 24 }}>Chatbot Widget</h2>
      <form className="glass-card" onSubmit={handleSubmit} style={{ padding: 24, maxWidth: 700 }}>
        <div className="form-group">
          <label>Widget Name</label>
          <input className="form-input" value={form.chatbot_name} onChange={e => u('chatbot_name', e.target.value)} placeholder="Portfolio Assistant" />
        </div>

        <div className="form-group">
          <label>Widget Avatar</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {form.chatbot_avatar_url ? (
              <img
                src={form.chatbot_avatar_url}
                alt="Chatbot avatar"
                style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }}
              />
            ) : (
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--bg-card)', border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                🤖
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploadingAvatar}
                style={{ width: 'fit-content' }}
              >
                <FiUploadCloud style={{ marginRight: 6 }} />
                {uploadingAvatar ? 'Uploading...' : 'Upload Image'}
              </button>
              <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
              <input className="form-input" value={form.chatbot_avatar_url} onChange={e => u('chatbot_avatar_url', e.target.value)} placeholder="Or paste image URL" style={{ fontSize: '0.85rem' }} />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Intro Message</label>
          <textarea
            className="form-input"
            value={form.chatbot_intro_message}
            onChange={e => u('chatbot_intro_message', e.target.value)}
            placeholder="Hi! I'm the portfolio assistant..."
            rows={3}
          />
        </div>

        <div className="form-group">
          <label>System Prompt <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(AI behavior instructions — tells the chatbot how to respond)</span></label>
          <textarea
            className="form-input"
            value={form.chatbot_system_prompt}
            onChange={e => u('chatbot_system_prompt', e.target.value)}
            placeholder="You are a helpful portfolio assistant..."
            rows={5}
            style={{ fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 1.6 }}
          />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6 }}>
            Tip: Include your name, role, tone of voice. E.g. &quot;You are Veera&apos;s AI assistant. Answer in a friendly, professional tone...&quot;
          </p>
        </div>

        <div className="dash-form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Widget Settings'}</button>
        </div>
      </form>
    </motion.div>
  );
}

export default DashSettings;
