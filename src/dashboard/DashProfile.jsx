import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { profileAPI, uploadAPI } from '../services/api';
import { FiUpload } from 'react-icons/fi';

function DashProfile() {
  const [form, setForm] = useState({
    full_name: '', tagline: '', bio: '', email: '', phone: '', location: '',
    profile_image_url: '', resume_download_url: '', resume_view_url: '',
    github_url: '', linkedin_url: '', twitter_url: '', website_url: '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await profileAPI.get();
      setForm((prev) => ({ ...prev, ...res.data }));
    } catch {}
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadAPI.upload(file);
      setForm((prev) => ({ ...prev, profile_image_url: res.data.url }));
      toast.success('Image uploaded!');
    } catch {
      toast.error('Upload failed');
    }
    setUploading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await profileAPI.update(form);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update');
    }
    setSaving(false);
  };

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="dash-page-title">Profile / Hero Section</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
        This info appears in the hero section and throughout your portfolio.
      </p>

      <form className="dash-form" onSubmit={handleSave}>
        {/* Profile Image */}
        <div className="form-group">
          <label>Profile Image</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {form.profile_image_url && (
              <img src={form.profile_image_url} alt="Profile" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} />
            )}
            <label className="btn btn-ghost" style={{ cursor: 'pointer' }}>
              <FiUpload /> {uploading ? 'Uploading...' : 'Upload Image'}
              <input type="file" accept="image/*" onChange={handleUploadImage} style={{ display: 'none' }} />
            </label>
          </div>
          <input className="form-input" style={{ marginTop: 8 }} placeholder="Or paste image URL" value={form.profile_image_url} onChange={(e) => update('profile_image_url', e.target.value)} />
        </div>

        <div className="dash-form-grid">
          <div className="form-group">
            <label>Full Name</label>
            <input className="form-input" placeholder="Your full name" value={form.full_name} onChange={(e) => update('full_name', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Tagline (separate with |)</label>
            <input className="form-input" placeholder="Developer | Designer | Creator" value={form.tagline} onChange={(e) => update('tagline', e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea className="form-input" placeholder="Short bio about yourself" value={form.bio} onChange={(e) => update('bio', e.target.value)} />
        </div>

        <div className="dash-form-grid">
          <div className="form-group">
            <label>Email</label>
            <input className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={(e) => update('email', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input className="form-input" placeholder="+91 9876543210" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input className="form-input" placeholder="City, Country" value={form.location} onChange={(e) => update('location', e.target.value)} />
          </div>
        </div>

        <h3 style={{ color: 'var(--primary-light)', margin: '24px 0 16px', fontSize: '1.1rem' }}>Resume Links</h3>
        <div className="dash-form-grid">
          <div className="form-group">
            <label>Resume Download URL (Cloudinary)</label>
            <input className="form-input" placeholder="https://res.cloudinary.com/..." value={form.resume_download_url} onChange={(e) => update('resume_download_url', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Resume View URL</label>
            <input className="form-input" placeholder="https://..." value={form.resume_view_url} onChange={(e) => update('resume_view_url', e.target.value)} />
          </div>
        </div>

        <h3 style={{ color: 'var(--primary-light)', margin: '24px 0 16px', fontSize: '1.1rem' }}>Social Links</h3>
        <div className="dash-form-grid">
          <div className="form-group">
            <label>GitHub</label>
            <input className="form-input" placeholder="https://github.com/..." value={form.github_url} onChange={(e) => update('github_url', e.target.value)} />
          </div>
          <div className="form-group">
            <label>LinkedIn</label>
            <input className="form-input" placeholder="https://linkedin.com/in/..." value={form.linkedin_url} onChange={(e) => update('linkedin_url', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Twitter</label>
            <input className="form-input" placeholder="https://twitter.com/..." value={form.twitter_url} onChange={(e) => update('twitter_url', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Website</label>
            <input className="form-input" placeholder="https://..." value={form.website_url} onChange={(e) => update('website_url', e.target.value)} />
          </div>
        </div>

        <div className="dash-form-actions">
          <motion.button type="submit" className="btn btn-primary" disabled={saving} whileTap={{ scale: 0.98 }}>
            {saving ? 'Saving...' : 'Save Profile'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

export default DashProfile;
