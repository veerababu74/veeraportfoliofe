import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { contentAPI } from '../services/api';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import Pagination from './Pagination';

const ITEMS_PER_PAGE = 8;

const defaultForm = { name: '', category: '', icon_url: '', proficiency: 80, order: 0 };

function DashSkills() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ ...defaultForm });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await contentAPI.getSkills();
      setItems(res.data);
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category) { toast.error('Name and category required'); return; }
    setSaving(true);
    try {
      if (editId) {
        await contentAPI.updateSkill(editId, form);
        toast.success('Skill updated');
      } else {
        await contentAPI.createSkill(form);
        toast.success('Skill added');
      }
      load();
      resetForm();
    } catch { toast.error('Failed'); }
    setSaving(false);
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, category: item.category, icon_url: item.icon_url || '', proficiency: item.proficiency || 80, order: item.order || 0 });
    setEditId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this skill?')) return;
    try { await contentAPI.deleteSkill(id); toast.success('Deleted'); load(); }
    catch { toast.error('Failed'); }
  };

  const resetForm = () => { setForm({ ...defaultForm }); setEditId(null); setShowForm(false); };
  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="dash-page-title">Skills</h1>
          <p style={{ color: 'var(--text-secondary)' }}>{items.length} skills</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
          <FiPlus /> Add Skill
        </button>
      </div>

      {showForm && (
        <motion.form className="glass-card" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} style={{ marginBottom: 24, padding: 24 }}>
          <div className="dash-form-grid">
            <div className="form-group">
              <label>Skill Name</label>
              <input className="form-input" placeholder="React.js" value={form.name} onChange={(e) => update('name', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input className="form-input" placeholder="Frontend / Backend / DevOps" value={form.category} onChange={(e) => update('category', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Icon URL</label>
              <input className="form-input" placeholder="https://..." value={form.icon_url} onChange={(e) => update('icon_url', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Proficiency ({form.proficiency}%)</label>
              <input type="range" min="0" max="100" value={form.proficiency} onChange={(e) => update('proficiency', parseInt(e.target.value))} style={{ width: '100%' }} />
            </div>
            <div className="form-group">
              <label>Order</label>
              <input className="form-input" type="number" value={form.order} onChange={(e) => update('order', parseInt(e.target.value) || 0)} />
            </div>
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
              {paginated.map((item) => (
                <div key={item.id} className="dash-item-card">
                  <div className="dash-item-info" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {item.icon_url && <img src={item.icon_url} alt="" style={{ width: 32, height: 32, objectFit: 'contain' }} />}
                    <div>
                      <h4>{item.name}</h4>
                      <p>{item.category} · {item.proficiency}%</p>
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

export default DashSkills;
