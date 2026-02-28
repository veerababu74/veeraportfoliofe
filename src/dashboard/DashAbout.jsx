import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { profileAPI, uploadAPI } from '../services/api';
import { FiPlus, FiX, FiUpload } from 'react-icons/fi';

function DashAbout() {
  const [form, setForm] = useState({ title: 'About Me', description: '', image_url: '', highlights: [] });
  const [newHighlight, setNewHighlight] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadAbout();
  }, []);

  const loadAbout = async () => {
    try {
      const res = await profileAPI.getAbout();
      if (res.data) setForm((prev) => ({ ...prev, ...res.data }));
    } catch {}
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadAPI.upload(file);
      setForm((prev) => ({ ...prev, image_url: res.data.url }));
      toast.success('About image uploaded!');
    } catch {
      toast.error('Upload failed');
    }
    setUploading(false);
  };

  const addHighlight = () => {
    if (!newHighlight.trim()) return;
    setForm((prev) => ({ ...prev, highlights: [...prev.highlights, newHighlight.trim()] }));
    setNewHighlight('');
  };

  const removeHighlight = (index) => {
    setForm((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await profileAPI.updateAbout(form);
      toast.success('About section updated!');
    } catch {
      toast.error('Failed to update');
    }
    setSaving(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="dash-page-title">About Section</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
        Manage your About Me section content. This uses a separate image from the Hero section.
      </p>

      <form className="dash-form" onSubmit={handleSave}>
        <div className="form-group">
          <label>Section Title</label>
          <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea className="form-input" style={{ minHeight: 200 }} placeholder="Tell your story..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>

        {/* About Image Upload */}
        <div className="form-group">
          <label>About Section Image</label>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: 10 }}>
            This is displayed in the About section (different from Hero profile image).
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            {form.image_url && (
              <img
                src={form.image_url}
                alt="About"
                style={{
                  width: 100,
                  height: 120,
                  borderRadius: 12,
                  objectFit: 'cover',
                  border: '2px solid var(--primary)',
                }}
              />
            )}
            <label className="btn btn-ghost" style={{ cursor: 'pointer' }}>
              <FiUpload /> {uploading ? 'Uploading...' : 'Upload Image'}
              <input type="file" accept="image/*" onChange={handleUploadImage} style={{ display: 'none' }} />
            </label>
          </div>
          <input
            className="form-input"
            placeholder="Or paste image URL"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Highlights</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <input
              className="form-input"
              placeholder="Add a highlight..."
              value={newHighlight}
              onChange={(e) => setNewHighlight(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
            />
            <button type="button" className="btn btn-ghost" onClick={addHighlight}><FiPlus /></button>
          </div>
          {form.highlights.map((h, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, padding: '8px 12px', background: 'var(--bg-card)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <span style={{ flex: 1, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{h}</span>
              <button type="button" onClick={() => removeHighlight(i)} style={{ background: 'none', color: 'var(--secondary)', fontSize: '1rem' }}><FiX /></button>
            </div>
          ))}
        </div>

        <div className="dash-form-actions">
          <motion.button type="submit" className="btn btn-primary" disabled={saving} whileTap={{ scale: 0.98 }}>
            {saving ? 'Saving...' : 'Save About'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

export default DashAbout;
