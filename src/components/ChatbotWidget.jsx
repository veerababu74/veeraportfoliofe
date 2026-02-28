import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import { chatbotAPI, profileAPI } from '../services/api';
import './ChatbotWidget.css';

const QUICK_SUGGESTIONS = [
  '💼 Experience',
  '🛠️ Skills',
  '🚀 Projects',
  '🎓 Education',
  '📧 Contact',
];

// Simple markdown-like formatter: **bold**, bullet lists, email/phone links
function formatMessage(text) {
  if (!text) return text;
  const lines = text.split('\n');
  const elements = [];

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) {
      elements.push(<br key={`br-${i}`} />);
      return;
    }

    // Bullet points
    const isBullet = /^[-•*]\s+/.test(trimmed);
    const content = isBullet ? trimmed.replace(/^[-•*]\s+/, '') : trimmed;

    // Process inline formatting
    const parts = content.split(/(\*\*[^*]+\*\*|📧\s*\S+@\S+|📱\s*\+?\d[\d\s-]+)/g);
    const formatted = parts.map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j}>{part.slice(2, -2)}</strong>;
      }
      if (part.includes('@') && part.includes('📧')) {
        const email = part.replace('📧', '').trim();
        return <a key={j} href={`mailto:${email}`} className="chat-link">📧 {email}</a>;
      }
      if (part.includes('📱')) {
        const phone = part.replace('📱', '').trim();
        return <a key={j} href={`tel:${phone.replace(/\s/g, '')}`} className="chat-link">📱 {phone}</a>;
      }
      return part;
    });

    if (isBullet) {
      elements.push(
        <div key={i} className="chat-bullet">
          <span className="bullet-dot">•</span>
          <span>{formatted}</span>
        </div>
      );
    } else {
      elements.push(<p key={i} className="chat-para">{formatted}</p>);
    }
  });

  return <div className="formatted-msg">{elements}</div>;
}

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [widgetConfig, setWidgetConfig] = useState({
    chatbot_name: "Veera's Assistant",
    chatbot_avatar_url: '',
    chatbot_intro_message: "Hey there! 👋 I'm Veera's portfolio assistant. Ask me about his skills, experience, projects, or anything else!",
  });
  const messagesEndRef = useRef(null);

  // Fetch widget config from settings
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await profileAPI.getSettings();
        if (res.data) {
          const cfg = {
            chatbot_name: res.data.chatbot_name || "Veera's Assistant",
            chatbot_avatar_url: res.data.chatbot_avatar_url || '',
            chatbot_intro_message: res.data.chatbot_intro_message || "Hey there! 👋 I'm Veera's portfolio assistant. Ask me about his skills, experience, projects, or anything else!",
          };
          setWidgetConfig(cfg);
          setMessages([{ role: 'assistant', content: cfg.chatbot_intro_message }]);
        } else {
          setMessages([{ role: 'assistant', content: widgetConfig.chatbot_intro_message }]);
        }
      } catch {
        setMessages([{ role: 'assistant', content: widgetConfig.chatbot_intro_message }]);
      }
    };
    loadConfig();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text) => {
    const userMsg = (text || input).trim();
    if (!userMsg || loading) return;

    setInput('');
    setShowSuggestions(false);
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await chatbotAPI.chat(userMsg);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.data.response },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "Sorry, I'm having trouble right now. Please try again!" },
      ]);
    }
    setLoading(false);
  };

  const handleSuggestionClick = (suggestion) => {
    // Strip emoji prefix for cleaner query
    const query = suggestion.replace(/^[^\w]*/, '').trim();
    handleSend(`Tell me about Veera's ${query.toLowerCase()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Don't show on admin pages
  if (window.location.pathname.startsWith('/admin')) return null;

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={!isOpen ? { boxShadow: ['0 0 0 0px rgba(108,99,255,0.4)', '0 0 0 20px rgba(108,99,255,0)', '0 0 0 0px rgba(108,99,255,0.4)'] } : {}}
        transition={!isOpen ? { duration: 2, repeat: Infinity } : {}}
      >
        {isOpen ? <FiX size={24} /> : <FiMessageCircle size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="chatbot-header">
              <div className="chatbot-header-info">
                {widgetConfig.chatbot_avatar_url ? (
                  <img src={widgetConfig.chatbot_avatar_url} alt={widgetConfig.chatbot_name} className="chatbot-avatar chatbot-avatar-img" />
                ) : (
                  <div className="chatbot-avatar">🤖</div>
                )}
                <div>
                  <h4>{widgetConfig.chatbot_name}</h4>
                  <span className="chatbot-status">
                    <span className="status-dot" /> Online
                  </span>
                </div>
              </div>
              <button className="chatbot-close" onClick={() => setIsOpen(false)}>
                <FiX />
              </button>
            </div>

            {/* Messages */}
            <div className="chatbot-messages">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  className={`chat-message ${msg.role}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {msg.role === 'assistant' && (
                    widgetConfig.chatbot_avatar_url
                      ? <img src={widgetConfig.chatbot_avatar_url} alt="" className="msg-avatar msg-avatar-img" />
                      : <span className="msg-avatar">🤖</span>
                  )}
                  <div className="msg-bubble">
                    {msg.role === 'assistant' ? formatMessage(msg.content) : msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Quick Suggestion Chips */}
              {showSuggestions && messages.length <= 1 && !loading && (
                <motion.div
                  className="suggestion-chips"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {QUICK_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      className="suggestion-chip"
                      onClick={() => handleSuggestionClick(s)}
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
              {loading && (
                <div className="chat-message assistant">
                  {widgetConfig.chatbot_avatar_url
                    ? <img src={widgetConfig.chatbot_avatar_url} alt="" className="msg-avatar msg-avatar-img" />
                    : <span className="msg-avatar">🤖</span>
                  }
                  <div className="msg-bubble typing">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="chatbot-input">
              <input
                type="text"
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
              <button onClick={() => handleSend()} disabled={loading || !input.trim()}>
                <FiSend />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ChatbotWidget;
