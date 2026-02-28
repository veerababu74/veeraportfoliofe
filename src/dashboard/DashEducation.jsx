import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { contentAPI } from '../services/api';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import Pagination from './Pagination';

const ITEMS_PER_PAGE = 5;

const defaultForm = { institution: '', degree: '', field_of_study: '', start_date: '', end_date: '', grade: '', description: '', logo_url: '', order: 0 };

function DashEducation() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ ...defaultForm });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { load(); }, []);
  const load = async () => { try { const r = await contentAPI.getEducation(); setItems(r.data); } catch {} };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.institution || !form.degree) { toast.error('Institution and degree required'); return; }
    setSaving(true);
    try {
      if (editId) { await contentAPI.updateEducation(editId, form); toast.success('Updated'); }
      else { await contentAPI.createEducation(form); toast.success('Added'); }
      load(); resetForm();
    } catch { toast.error('Failed'); }
    setSaving(false);
  };

  const handleEdit = (item) => {
    setForm({ institution: item.institution, degree: item.degree, field_of_study: item.field_of_study || '', start_date: item.start_date || '', end_date: item.end_date || '', grade: item.grade || '', description: item.description || '', logo_url: item.logo_url || '', order: item.order || 0 });
    setEditId(item.id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    try { await contentAPI.deleteEducation(id); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };

  const resetForm = () => { setForm({ ...defaultForm }); setEditId(null); setShowForm(false); };
  const u = (f, v) => setForm(p => ({ ...p, [f]: v }));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div><h1 className="dash-page-title">Education</h1><p style={{ color: 'var(--text-secondary)' }}>{items.length} entries</p></div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}><FiPlus /> Add</button>
      </div>

      {showForm && (
        <motion.form className="glass-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} style={{ marginBottom: 24, padding: 24 }}>
          <div className="dash-form-grid">
            <div className="form-group"><label>Institution</label><input className="form-input" value={form.institution} onChange={e => u('institution', e.target.value)} /></div>
            <div className="form-group"><label>Degree</label><input className="form-input" value={form.degree} onChange={e => u('degree', e.target.value)} /></div>
            <div className="form-group"><label>Field of Study</label><input className="form-input" value={form.field_of_study} onChange={e => u('field_of_study', e.target.value)} /></div>
            <div className="form-group"><label>Grade</label><input className="form-input" value={form.grade} onChange={e => u('grade', e.target.value)} /></div>
            <div className="form-group"><label>Start Date</label><input className="form-input" value={form.start_date} onChange={e => u('start_date', e.target.value)} /></div>
            <div className="form-group"><label>End Date</label><input className="form-input" value={form.end_date} onChange={e => u('end_date', e.target.value)} /></div>
          </div>
          <div className="form-group"><label>Description</label><textarea className="form-input" value={form.description} onChange={e => u('description', e.target.value)} /></div>
          <div className="form-group"><label>Logo URL</label><input className="form-input" value={form.logo_url} onChange={e => u('logo_url', e.target.value)} /></div>
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
                  <div className="dash-item-info"><h4>{item.degree}</h4><p>{item.institution} · {item.start_date} — {item.end_date}</p></div>
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

export default DashEducation;
