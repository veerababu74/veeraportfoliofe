import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { chatbotAPI } from '../services/api';
import {
  FiUploadCloud, FiTrash2, FiAlertTriangle, FiCheckCircle,
  FiSettings, FiDatabase, FiSave, FiRefreshCw, FiEye, FiEyeOff,
  FiChevronLeft, FiChevronRight, FiCpu, FiLayers, FiPlus, FiX
} from 'react-icons/fi';
import './DashChatbot.css';

const PROVIDERS = [
  { id: 'groq', name: 'Groq', icon: '⚡', color: '#f55036', desc: 'Llama, Mixtral (ultra fast)' },
  { id: 'google', name: 'Google AI', icon: '🔵', color: '#4285f4', desc: 'Gemini 1.5 Flash / Pro' },
];

const DEFAULT_GROQ_MODELS = [
  'llama-3.1-8b-instant',
  'llama-3.3-70b-versatile',
  'mixtral-8x7b-32768',
  'gemma2-9b-it',
];

const DEFAULT_GOOGLE_MODELS = [
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-2.0-flash',
];

function DashChatbot() {
  const [activeTab, setActiveTab] = useState('llm');

  // ─── LLM Settings State ───
  const [llmForm, setLlmForm] = useState({
    active_provider: 'groq',
    groq_api_key: '', groq_model: 'llama-3.1-8b-instant',
    google_api_key: '', google_model: 'gemini-1.5-flash',
    temperature: 0.7, max_tokens: 1000,
    pinecone_api_key: '', pinecone_index_name: 'portfolio-chatbot',
    embedding_google_api_key: '',
    groq_models: DEFAULT_GROQ_MODELS,
    google_models: DEFAULT_GOOGLE_MODELS,
    system_prompt: '',
  });
  const [llmLoading, setLlmLoading] = useState(true);
  const [llmSaving, setLlmSaving] = useState(false);
  const [showKeys, setShowKeys] = useState({});
  const [newGroqModel, setNewGroqModel] = useState('');
  const [newGoogleModel, setNewGoogleModel] = useState('');

  // ─── Upload State ───
  const [textData, setTextData] = useState('');
  const [chunkSize, setChunkSize] = useState(500);
  const [chunkOverlap, setChunkOverlap] = useState(50);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  // ─── Chunks State ───
  const [chunks, setChunks] = useState([]);
  const [totalChunks, setTotalChunks] = useState(0);
  const [chunksPage, setChunksPage] = useState(0);
  const [chunksLoading, setChunksLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingChunkId, setDeletingChunkId] = useState(null);
  const [expandedChunk, setExpandedChunk] = useState(null);

  const CHUNKS_PER_PAGE = 20;

  // ─── Load LLM Settings ───
  useEffect(() => { loadLLMSettings(); }, []);

  const loadLLMSettings = async () => {
    try {
      const res = await chatbotAPI.getLLMSettings();
      if (res.data) {
        const data = { ...res.data };
        // Ensure model lists exist with defaults
        if (!data.groq_models || !data.groq_models.length) data.groq_models = DEFAULT_GROQ_MODELS;
        if (!data.google_models || !data.google_models.length) data.google_models = DEFAULT_GOOGLE_MODELS;
        setLlmForm(prev => ({ ...prev, ...data }));
      }
    } catch { /* settings not yet saved, use defaults */ }
    setLlmLoading(false);
  };

  // ─── Load Chunks on tab switch ───
  useEffect(() => {
    if (activeTab === 'chunks') loadChunks();
  }, [activeTab, chunksPage]);

  const loadChunks = async () => {
    setChunksLoading(true);
    try {
      const res = await chatbotAPI.getChunks(chunksPage * CHUNKS_PER_PAGE, CHUNKS_PER_PAGE);
      setChunks(res.data.chunks || []);
      setTotalChunks(res.data.total || 0);
    } catch { toast.error('Failed to load chunks'); }
    setChunksLoading(false);
  };

  // ─── Helpers ───
  const u = (field, value) => setLlmForm(prev => ({ ...prev, [field]: value }));
  const toggleKey = (field) => setShowKeys(prev => ({ ...prev, [field]: !prev[field] }));
  const totalPages = Math.ceil(totalChunks / CHUNKS_PER_PAGE);

  // ─── Save LLM Settings ───
  const handleSaveLLM = async () => {
    setLlmSaving(true);
    try {
      await chatbotAPI.updateLLMSettings(llmForm);
      toast.success('LLM settings saved!');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to save settings');
    }
    setLlmSaving(false);
  };

  // ─── Upload Handler ───
  const handleUpload = async () => {
    if (!textData.trim()) { toast.error('Enter some text data'); return; }
    setUploading(true);
    setUploadResult(null);
    try {
      const r = await chatbotAPI.uploadVectors({
        texts: [textData],
        metadata: [{ source: 'dashboard', category: 'portfolio_info' }],
        chunk_size: chunkSize,
        chunk_overlap: chunkOverlap,
      });
      setUploadResult({ success: true, count: r.data.count });
      toast.success(`Uploaded ${r.data.count} chunks`);
      setTextData('');
    } catch (err) {
      setUploadResult({ success: false, error: err.response?.data?.detail || 'Upload failed' });
      toast.error('Upload failed');
    }
    setUploading(false);
  };

  // ─── Delete Handlers ───
  const handleDeleteChunk = async (chunkId) => {
    if (!confirm('Delete this chunk from knowledge base?')) return;
    setDeletingChunkId(chunkId);
    try {
      await chatbotAPI.deleteChunk(chunkId);
      toast.success('Chunk deleted');
      loadChunks();
    } catch { toast.error('Failed to delete chunk'); }
    setDeletingChunkId(null);
  };

  const handleDeleteAll = async () => {
    if (!confirm('Delete ALL vectors and chunks? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await chatbotAPI.deleteVectors();
      toast.success('All vectors deleted');
      setChunks([]); setTotalChunks(0); setUploadResult(null);
    } catch { toast.error('Failed to delete'); }
    setDeleting(false);
  };

  // ─── Model Management Helpers ───
  const addModel = (provider) => {
    const isGroq = provider === 'groq';
    const value = (isGroq ? newGroqModel : newGoogleModel).trim();
    if (!value) return;
    const listKey = isGroq ? 'groq_models' : 'google_models';
    const current = llmForm[listKey] || [];
    if (current.includes(value)) {
      toast.error('Model already exists');
      return;
    }
    setLlmForm(prev => ({ ...prev, [listKey]: [...current, value] }));
    isGroq ? setNewGroqModel('') : setNewGoogleModel('');
    toast.success(`Added ${value}`);
  };

  const removeModel = (provider, model) => {
    const listKey = provider === 'groq' ? 'groq_models' : 'google_models';
    const modelKey = provider === 'groq' ? 'groq_model' : 'google_model';
    const current = llmForm[listKey] || [];
    if (current.length <= 1) { toast.error('Must have at least one model'); return; }
    const updated = current.filter(m => m !== model);
    const patch = { [listKey]: updated };
    // If the deleted model was selected, switch to first remaining
    if (llmForm[modelKey] === model) patch[modelKey] = updated[0];
    setLlmForm(prev => ({ ...prev, ...patch }));
  };

  // ─── Render: Secret Field ───
  const SecretField = ({ label, field, placeholder }) => (
    <div className="form-group">
      <label>{label}</label>
      <div className="secret-field">
        <input
          className="form-input"
          type={showKeys[field] ? 'text' : 'password'}
          value={llmForm[field] || ''}
          onChange={e => u(field, e.target.value)}
          placeholder={placeholder}
        />
        <button type="button" className="secret-toggle" onClick={() => toggleKey(field)}>
          {showKeys[field] ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
    </div>
  );

  // ─── Render: Model Selector with Add/Delete ───
  const ModelSelector = ({ provider, modelKey, models, newValue, setNewValue }) => (
    <div className="form-group">
      <label>Model</label>
      <select className="form-input" value={llmForm[modelKey]} onChange={e => u(modelKey, e.target.value)}>
        {(models || []).map(m => <option key={m} value={m}>{m}</option>)}
      </select>
      <div className="model-list">
        {(models || []).map(m => (
          <span key={m} className={`model-tag ${llmForm[modelKey] === m ? 'active' : ''}`}>
            {m}
            <button className="model-tag-delete" onClick={() => removeModel(provider, m)} title="Remove model">
              <FiX size={12} />
            </button>
          </span>
        ))}
      </div>
      <div className="model-add-row">
        <input
          className="form-input"
          value={newValue}
          onChange={e => setNewValue(e.target.value)}
          placeholder="Enter new model name..."
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addModel(provider))}
        />
        <button className="btn btn-sm btn-primary" onClick={() => addModel(provider)} type="button">
          <FiPlus /> Add
        </button>
      </div>
    </div>
  );

  // ─── Render: Provider Config Fields ───
  const renderProviderFields = () => {
    const p = llmForm.active_provider;
    if (p === 'groq') return (
      <>
        <SecretField label="Groq API Key" field="groq_api_key" placeholder="gsk_..." />
        <ModelSelector
          provider="groq"
          modelKey="groq_model"
          models={llmForm.groq_models}
          newValue={newGroqModel}
          setNewValue={setNewGroqModel}
        />
      </>
    );
    if (p === 'google') return (
      <>
        <SecretField label="Google AI API Key" field="google_api_key" placeholder="AIza..." />
        <ModelSelector
          provider="google"
          modelKey="google_model"
          models={llmForm.google_models}
          newValue={newGoogleModel}
          setNewValue={setNewGoogleModel}
        />
      </>
    );
    return null;
  };

  if (llmLoading) return <p style={{ color: 'var(--text-secondary)' }}>Loading settings...</p>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="dash-page-title" style={{ marginBottom: 8 }}>Chatbot & AI Settings</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
        Configure the AI model, upload knowledge data, and manage stored chunks.
      </p>

      {/* ─── Tabs ─── */}
      <div className="chatbot-tabs">
        <button className={`chatbot-tab ${activeTab === 'llm' ? 'active' : ''}`} onClick={() => setActiveTab('llm')}>
          <FiSettings /> LLM Settings
        </button>
        <button className={`chatbot-tab ${activeTab === 'upload' ? 'active' : ''}`} onClick={() => setActiveTab('upload')}>
          <FiUploadCloud /> Knowledge Base
        </button>
        <button className={`chatbot-tab ${activeTab === 'chunks' ? 'active' : ''}`} onClick={() => setActiveTab('chunks')}>
          <FiLayers /> Chunks ({totalChunks})
        </button>
      </div>

      {/* ════════════════════════════════════════════ */}
      {/* TAB 1: LLM SETTINGS */}
      {/* ════════════════════════════════════════════ */}
      {activeTab === 'llm' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="llm">
          {/* Provider Selection */}
          <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
            <h3 className="card-title"><FiCpu /> Active LLM Provider</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 16, fontSize: 14 }}>
              Select your primary LLM. If it fails, the system automatically falls back to the other provider.
            </p>
            <div className="provider-grid">
              {PROVIDERS.map(p => (
                <button
                  key={p.id}
                  className={`provider-card ${llmForm.active_provider === p.id ? 'active' : ''}`}
                  onClick={() => u('active_provider', p.id)}
                  style={{ '--provider-color': p.color }}
                >
                  <span className="provider-icon">{p.icon}</span>
                  <span className="provider-name">{p.name}</span>
                  <span className="provider-desc">{p.desc}</span>
                  {llmForm.active_provider === p.id && <span className="provider-active-badge">Active</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Provider Configuration */}
          <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
            <h3 className="card-title">
              {PROVIDERS.find(p => p.id === llmForm.active_provider)?.icon}{' '}
              {PROVIDERS.find(p => p.id === llmForm.active_provider)?.name} Configuration
            </h3>
            {renderProviderFields()}
          </div>

          {/* System Prompt */}
          <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
            <h3 className="card-title">💬 System Prompt</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 12, fontSize: 14 }}>
              Customize how the chatbot behaves and responds. Leave empty to use the default prompt.
            </p>
            <textarea
              className="form-input system-prompt-textarea"
              placeholder="Leave empty for default prompt. Example:&#10;You are Veera's Portfolio Assistant — a friendly AI that answers questions about Veerababu Pilli...&#10;&#10;RULES:&#10;1. ONLY answer questions related to Veera.&#10;2. If the user asks something not about Veera, politely redirect them.&#10;3. If context is missing, suggest contacting Veera at his email."
              value={llmForm.system_prompt || ''}
              onChange={e => u('system_prompt', e.target.value)}
              rows={6}
            />
            {llmForm.system_prompt && (
              <button
                className="btn btn-sm"
                style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}
                onClick={() => u('system_prompt', '')}
              >
                Reset to Default
              </button>
            )}
          </div>

          {/* Common Settings */}
          <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
            <h3 className="card-title">⚙️ Generation Settings</h3>
            <div className="dash-form-grid-2">
              <div className="form-group">
                <label>Temperature: {llmForm.temperature}</label>
                <input
                  type="range" min="0" max="1" step="0.1"
                  value={llmForm.temperature}
                  onChange={e => u('temperature', parseFloat(e.target.value))}
                  className="range-input"
                />
                <div className="range-labels"><span>Precise</span><span>Creative</span></div>
              </div>
              <div className="form-group">
                <label>Max Tokens</label>
                <input className="form-input" type="number" value={llmForm.max_tokens} onChange={e => u('max_tokens', parseInt(e.target.value) || 1000)} min={100} max={4000} />
              </div>
            </div>
          </div>

          {/* Infrastructure Settings */}
          <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
            <h3 className="card-title"><FiDatabase /> Vector Store & Embeddings</h3>
            <div className="dash-form-grid-2">
              <SecretField label="Pinecone API Key" field="pinecone_api_key" placeholder="pcsk_..." />
              <div className="form-group">
                <label>Pinecone Index Name</label>
                <input className="form-input" value={llmForm.pinecone_index_name} onChange={e => u('pinecone_index_name', e.target.value)} placeholder="portfolio-chatbot" />
              </div>
            </div>
            <SecretField label="Google API Key (for Embeddings)" field="embedding_google_api_key" placeholder="AIza... (used for generating vector embeddings)" />
            <p className="field-hint" style={{ marginTop: -8 }}>
              Embeddings are generated using Google Gemini for Pinecone. This key is separate from the Google LLM key.
            </p>
          </div>

          {/* Save */}
          <button className="btn btn-primary" onClick={handleSaveLLM} disabled={llmSaving} style={{ marginBottom: 20 }}>
            {llmSaving ? 'Saving...' : <><FiSave /> Save All Settings</>}
          </button>
        </motion.div>
      )}

      {/* ════════════════════════════════════════════ */}
      {/* TAB 2: KNOWLEDGE BASE UPLOAD */}
      {/* ════════════════════════════════════════════ */}
      {activeTab === 'upload' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="upload">
          <div className="chatbot-upload-grid">
            <div className="glass-card chatbot-upload-card">
              <h3><FiUploadCloud /> Upload Knowledge Data</h3>
              <p className="chatbot-help-text">
                Enter information about yourself — bio, skills, experience, projects, etc.
                The text will be automatically split into smart chunks using LangChain's
                <strong> RecursiveCharacterTextSplitter</strong>.
              </p>
              <textarea
                className="form-input chatbot-textarea"
                placeholder={`Paste your resume, bio, project descriptions, skills, or any text about yourself here...\n\nThe system will automatically split this into optimal chunks for the AI chatbot.\n\nExample:\nMy name is Veera. I am a Python & GenAI Developer with 4+ years of experience at TCS.\n\nI specialize in Azure OpenAI, LangChain, FastAPI, RAG pipelines, and agentic AI systems.\n\nMy key projects include a CPG Marketing Suite, RAG-powered Marketing Assistant, and an Agentic AI Workflow Builder.`}
                value={textData}
                onChange={e => setTextData(e.target.value)}
              />

              {/* Chunking Config */}
              <div className="chunk-config">
                <div className="form-group">
                  <label>Chunk Size</label>
                  <input className="form-input" type="number" value={chunkSize} onChange={e => setChunkSize(parseInt(e.target.value) || 500)} min={100} max={2000} />
                </div>
                <div className="form-group">
                  <label>Chunk Overlap</label>
                  <input className="form-input" type="number" value={chunkOverlap} onChange={e => setChunkOverlap(parseInt(e.target.value) || 50)} min={0} max={200} />
                </div>
                <div className="chunk-info-text">
                  <span>~{textData ? Math.max(1, Math.ceil(textData.length / Math.max(chunkSize - chunkOverlap, 1))) : 0} estimated chunks</span>
                  <span>{textData.length} characters</span>
                </div>
              </div>

              <div className="chatbot-upload-info">
                <span></span>
                <button className="btn btn-primary" onClick={handleUpload} disabled={uploading}>
                  {uploading ? 'Uploading & Embedding...' : <><FiUploadCloud /> Upload to Pinecone</>}
                </button>
              </div>
              {uploadResult && (
                <div className={`chatbot-result ${uploadResult.success ? 'success' : 'error'}`}>
                  {uploadResult.success
                    ? <><FiCheckCircle /> Successfully uploaded {uploadResult.count} chunks to Pinecone</>
                    : <><FiAlertTriangle /> {uploadResult.error}</>
                  }
                </div>
              )}
            </div>

            <div className="glass-card chatbot-danger-card">
              <h3><FiAlertTriangle /> Danger Zone</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
                Delete all vectors from Pinecone and chunk records from MongoDB.
                The chatbot will use fallback resume data until new data is uploaded.
              </p>
              <button className="btn btn-danger" onClick={handleDeleteAll} disabled={deleting}>
                {deleting ? 'Deleting...' : <><FiTrash2 /> Delete All Vectors</>}
              </button>
            </div>

            <div className="glass-card chatbot-tips-card">
              <h3>Tips for Better Responses</h3>
              <ul>
                <li>Write in first person or third person with specific details</li>
                <li>Include: tech stacks, project names, achievements, numbers</li>
                <li>Cover: education, skills, experience, projects, certifications</li>
                <li>LangChain auto-splits text — no need for manual paragraph separation</li>
                <li>Smaller chunk sizes (300-500) give more precise retrieval</li>
                <li>Even without Pinecone data, the chatbot uses your resume as fallback</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* ════════════════════════════════════════════ */}
      {/* TAB 3: CHUNKS MANAGER */}
      {/* ════════════════════════════════════════════ */}
      {activeTab === 'chunks' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="chunks">
          <div className="glass-card" style={{ padding: 24 }}>
            <div className="chunks-header">
              <h3><FiLayers /> Stored Chunks ({totalChunks})</h3>
              <button className="btn btn-ghost" onClick={loadChunks} disabled={chunksLoading}>
                <FiRefreshCw className={chunksLoading ? 'spin' : ''} /> Refresh
              </button>
            </div>

            {chunksLoading ? (
              <p style={{ color: 'var(--text-secondary)', padding: '20px 0' }}>Loading chunks...</p>
            ) : chunks.length === 0 ? (
              <div className="chunks-empty">
                <FiDatabase size={40} />
                <p>No chunks uploaded yet</p>
                <span>Go to "Knowledge Base" tab to upload text data</span>
              </div>
            ) : (
              <>
                <div className="chunks-list">
                  {chunks.map((chunk, idx) => (
                    <div key={chunk.chunk_id || idx} className="chunk-item">
                      <div className="chunk-item-header">
                        <div className="chunk-meta">
                          <span className="chunk-badge">{chunk.source || 'dashboard'}</span>
                          <span className="chunk-date">{chunk.created_at ? new Date(chunk.created_at).toLocaleDateString() : ''}</span>
                          <span className="chunk-id-label" title={chunk.chunk_id}>{chunk.chunk_id?.slice(0, 20)}...</span>
                        </div>
                        <div className="chunk-actions">
                          <button
                            className="chunk-btn expand"
                            onClick={() => setExpandedChunk(expandedChunk === chunk.chunk_id ? null : chunk.chunk_id)}
                            title="Expand/Collapse"
                          >
                            {expandedChunk === chunk.chunk_id ? <FiEyeOff /> : <FiEye />}
                          </button>
                          <button
                            className="chunk-btn delete"
                            onClick={() => handleDeleteChunk(chunk.chunk_id)}
                            disabled={deletingChunkId === chunk.chunk_id}
                            title="Delete this chunk"
                          >
                            {deletingChunkId === chunk.chunk_id ? '...' : <FiTrash2 />}
                          </button>
                        </div>
                      </div>
                      <div className={`chunk-text ${expandedChunk === chunk.chunk_id ? 'expanded' : ''}`}>
                        {chunk.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="chunks-pagination">
                    <button
                      className="btn btn-ghost"
                      onClick={() => setChunksPage(p => Math.max(0, p - 1))}
                      disabled={chunksPage === 0}
                    >
                      <FiChevronLeft /> Prev
                    </button>
                    <span className="pagination-info">
                      Page {chunksPage + 1} of {totalPages}
                    </span>
                    <button
                      className="btn btn-ghost"
                      onClick={() => setChunksPage(p => Math.min(totalPages - 1, p + 1))}
                      disabled={chunksPage >= totalPages - 1}
                    >
                      Next <FiChevronRight />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default DashChatbot;
