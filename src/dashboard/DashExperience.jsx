import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { contentAPI } from '../services/api';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import Pagination from './Pagination';

const ITEMS_PER_PAGE = 5;

const defaultForm = {
  company: '', role: '', description: '', start_date: '', end_date: '',
  is_current: false, technologies: [], company_logo_url: '', order: 0,
};

function DashExperience() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ ...defaultForm });
  const [techInput, setTechInput] = useState('');
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { load(); }, []);
  const load = async () => { try { const r = await contentAPI.getExperience(); setItems(r.data); } catch {} };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company || !form.role) { toast.error('Company and role required'); return; }
    setSaving(true);
    try {
      if (editId) { await contentAPI.updateExperience(editId, form); toast.success('Updated'); }
      else { await contentAPI.createExperience(form); toast.success('Added'); }
      load(); resetForm();
    } catch { toast.error('Failed'); }
    setSaving(false);
  };

  const handleEdit = (item) => {
    setForm({
      company: item.company, role: item.role, description: item.description || '',
      start_date: item.start_date || '', end_date: item.end_date || '',
      is_current: item.is_current || false, technologies: item.technologies || [],
      company_logo_url: item.company_logo_url || '', order: item.order || 0,
    });
    setEditId(item.id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    try { await contentAPI.deleteExperience(id); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };

  const addTech = () => { if (techInput.trim()) { setForm(p => ({ ...p, technologies: [...p.technologies, techInput.trim()] })); setTechInput(''); } };
  const removeTech = (i) => setForm(p => ({ ...p, technologies: p.technologies.filter((_, idx) => idx !== i) }));
  const resetForm = () => { setForm({ ...defaultForm }); setEditId(null); setShowForm(false); setTechInput(''); };
  const u = (f, v) => setForm(p => ({ ...p, [f]: v }));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div><h1 className="dash-page-title">Experience</h1><p style={{ color: 'var(--text-secondary)' }}>{items.length} entries</p></div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}><FiPlus /> Add</button>
      </div>

      {showForm && (
        <motion.form className="glass-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} style={{ marginBottom: 24, padding: 24 }}>
          <div className="dash-form-grid">
            <div className="form-group"><label>Company</label><input className="form-input" value={form.company} onChange={e => u('company', e.target.value)} /></div>
            <div className="form-group"><label>Role</label><input className="form-input" value={form.role} onChange={e => u('role', e.target.value)} /></div>
            <div className="form-group"><label>Start Date</label><input className="form-input" placeholder="Jan 2023" value={form.start_date} onChange={e => u('start_date', e.target.value)} /></div>
            <div className="form-group"><label>End Date</label><input className="form-input" placeholder="Present" value={form.end_date} onChange={e => u('end_date', e.target.value)} disabled={form.is_current} /></div>
          </div>
          <div className="form-group" style={{ marginTop: 8 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={form.is_current} onChange={e => u('is_current', e.target.checked)} /> Currently working here
            </label>
          </div>
          <div className="form-group"><label>Description</label><textarea className="form-input" value={form.description} onChange={e => u('description', e.target.value)} /></div>
          <div className="form-group"><label>Company Logo URL</label><input className="form-input" value={form.company_logo_url} onChange={e => u('company_logo_url', e.target.value)} /></div>
          <div className="form-group">
            <label>Technologies</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input className="form-input" placeholder="Add tech..." value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())} />
              <button type="button" className="btn btn-ghost" onClick={addTech}><FiPlus /></button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {form.technologies.map((t, i) => (
                <span key={i} className="tag" style={{ cursor: 'pointer' }} onClick={() => removeTech(i)}>{t} ×</span>
              ))}
            </div>
          </div>
          <div className="form-group"><label>Order</label><input className="form-input" type="number" value={form.order} onChange={e => u('order', parseInt(e.target.value) || 0)} /></div>
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
                  <div className="dash-item-info">
                    <h4>{item.role} @ {item.company}</h4>
                    <p>{item.start_date} — {item.is_current ? 'Present' : item.end_date}</p>
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

export default DashExperience;
