import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { contentAPI } from '../services/api';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import Pagination from './Pagination';

const ITEMS_PER_PAGE = 5;

const defaultForm = { title: '', issuer: '', date: '', credential_url: '', image_url: '', order: 0 };

function DashCertifications() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ ...defaultForm });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { load(); }, []);
  const load = async () => { try { const r = await contentAPI.getCertifications(); setItems(r.data); } catch {} };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.issuer) { toast.error('Title and issuer required'); return; }
    setSaving(true);
    try {
      if (editId) { await contentAPI.updateCertification(editId, form); toast.success('Updated'); }
      else { await contentAPI.createCertification(form); toast.success('Added'); }
      load(); resetForm();
    } catch { toast.error('Failed'); }
    setSaving(false);
  };

  const handleEdit = (item) => {
    setForm({ title: item.title, issuer: item.issuer, date: item.date || '', credential_url: item.credential_url || '', image_url: item.image_url || '', order: item.order || 0 });
    setEditId(item.id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    try { await contentAPI.deleteCertification(id); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };

  const resetForm = () => { setForm({ ...defaultForm }); setEditId(null); setShowForm(false); };
  const u = (f, v) => setForm(p => ({ ...p, [f]: v }));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div><h1 className="dash-page-title">Certifications</h1><p style={{ color: 'var(--text-secondary)' }}>{items.length} certifications</p></div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}><FiPlus /> Add</button>
      </div>

      {showForm && (
        <motion.form className="glass-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} style={{ marginBottom: 24, padding: 24 }}>
          <div className="dash-form-grid">
            <div className="form-group"><label>Title</label><input className="form-input" value={form.title} onChange={e => u('title', e.target.value)} /></div>
            <div className="form-group"><label>Issuer</label><input className="form-input" value={form.issuer} onChange={e => u('issuer', e.target.value)} /></div>
            <div className="form-group"><label>Date</label><input className="form-input" placeholder="Dec 2024" value={form.date} onChange={e => u('date', e.target.value)} /></div>
            <div className="form-group"><label>Credential URL</label><input className="form-input" value={form.credential_url} onChange={e => u('credential_url', e.target.value)} /></div>
          </div>
          <div className="form-group"><label>Badge Image URL</label><input className="form-input" value={form.image_url} onChange={e => u('image_url', e.target.value)} /></div>
          <div className="form-group"><label>Order</label><input className="form-input" type="number" value={form.order} onChange={e => u('order', parseInt(e.target.value) || 0)} style={{ width: 100 }} /></div>
          <div className="dash-form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editId ? 'Update' : 'Add'}</button>
            <button type="button" className="btn btn-ghost" onClick={resetForm}>Cancel</button>
          </div>
        </motion.form>
      )}

      {(() => {
        const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
        const paginated = items.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
        return (
          <>
            <div className="dash-items-list">
              {paginated.map(item => (
                <div key={item.id} className="dash-item-card">
                  <div className="dash-item-info" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {item.image_url && <img src={item.image_url} alt="" style={{ width: 40, height: 40, objectFit: 'contain' }} />}
                    <div><h4>{item.title}</h4><p>{item.issuer} · {item.date}</p></div>
                  </div>
                  <div className="dash-item-actions">
                    <button className="btn-edit" onClick={() => handleEdit(item)}><FiEdit2 /></button>
                    <button className="btn-delete" onClick={() => handleDelete(item.id)}><FiTrash2 /></button>
                  </div>
                </div>
              ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            {totalPages > 1 && <p className="pagination-info">Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, items.length)} of {items.length}</p>}
          </>
        );
      })()}
    </motion.div>
  );
}

export default DashCertifications;
