import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { contentAPI } from '../services/api';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import Pagination from './Pagination';

const ITEMS_PER_PAGE = 5;

const defaultForm = {
  title: '', description: '', long_description: '', image_url: '',
  technologies: [], github_url: '', live_url: '', category: '', featured: false, order: 0,
};

function DashProjects() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ ...defaultForm });
  const [techInput, setTechInput] = useState('');
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { load(); }, []);
  const load = async () => { try { const r = await contentAPI.getProjects(); setItems(r.data); } catch {} };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) { toast.error('Title required'); return; }
    setSaving(true);
    try {
      if (editId) { await contentAPI.updateProject(editId, form); toast.success('Updated'); }
      else { await contentAPI.createProject(form); toast.success('Added'); }
      load(); resetForm();
    } catch { toast.error('Failed'); }
    setSaving(false);
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title, description: item.description || '', long_description: item.long_description || '',
      image_url: item.image_url || '', technologies: item.technologies || [],
      github_url: item.github_url || '', live_url: item.live_url || '',
      category: item.category || '', featured: item.featured || false, order: item.order || 0,
    });
    setEditId(item.id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    try { await contentAPI.deleteProject(id); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };

  const addTech = () => { if (techInput.trim()) { setForm(p => ({ ...p, technologies: [...p.technologies, techInput.trim()] })); setTechInput(''); } };
  const removeTech = (i) => setForm(p => ({ ...p, technologies: p.technologies.filter((_, idx) => idx !== i) }));
  const resetForm = () => { setForm({ ...defaultForm }); setEditId(null); setShowForm(false); setTechInput(''); };
  const u = (f, v) => setForm(p => ({ ...p, [f]: v }));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div><h1 className="dash-page-title">Projects</h1><p style={{ color: 'var(--text-secondary)' }}>{items.length} projects</p></div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}><FiPlus /> Add</button>
      </div>

      {showForm && (
        <motion.form className="glass-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} style={{ marginBottom: 24, padding: 24 }}>
          <div className="dash-form-grid">
            <div className="form-group"><label>Title</label><input className="form-input" value={form.title} onChange={e => u('title', e.target.value)} /></div>
            <div className="form-group"><label>Category</label><input className="form-input" placeholder="Web / ML / Mobile" value={form.category} onChange={e => u('category', e.target.value)} /></div>
          </div>
          <div className="form-group"><label>Short Description</label><textarea className="form-input" style={{ minHeight: 80 }} value={form.description} onChange={e => u('description', e.target.value)} /></div>
          <div className="form-group"><label>Long Description</label><textarea className="form-input" value={form.long_description} onChange={e => u('long_description', e.target.value)} /></div>
          <div className="form-group"><label>Image URL</label><input className="form-input" value={form.image_url} onChange={e => u('image_url', e.target.value)} /></div>
          <div className="dash-form-grid">
            <div className="form-group"><label>GitHub URL</label><input className="form-input" value={form.github_url} onChange={e => u('github_url', e.target.value)} /></div>
            <div className="form-group"><label>Live URL</label><input className="form-input" value={form.live_url} onChange={e => u('live_url', e.target.value)} /></div>
          </div>
          <div className="form-group">
            <label>Technologies</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input className="form-input" placeholder="Add tech..." value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())} />
              <button type="button" className="btn btn-ghost" onClick={addTech}><FiPlus /></button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {form.technologies.map((t, i) => (<span key={i} className="tag" style={{ cursor: 'pointer' }} onClick={() => removeTech(i)}>{t} ×</span>))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)' }}>
              <input type="checkbox" checked={form.featured} onChange={e => u('featured', e.target.checked)} /> Featured
            </label>
            <div className="form-group" style={{ marginBottom: 0 }}><label>Order</label><input className="form-input" type="number" value={form.order} onChange={e => u('order', parseInt(e.target.value) || 0)} style={{ width: 80 }} /></div>
          </div>
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
                    {item.image_url && <img src={item.image_url} alt="" style={{ width: 48, height: 36, objectFit: 'cover', borderRadius: 6 }} />}
                    <div>
                      <h4>{item.title} {item.featured && <span className="tag" style={{ fontSize: '0.7rem', marginLeft: 8 }}>Featured</span>}</h4>
                      <p>{item.category} · {item.technologies?.slice(0, 3).join(', ')}</p>
                    </div>
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

export default DashProjects;
