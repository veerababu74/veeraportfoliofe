import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import { chatbotAPI, profileAPI } from '../services/api';
import './ChatbotWidget.css';

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [widgetConfig, setWidgetConfig] = useState({
    chatbot_name: 'Portfolio Assistant',
    chatbot_avatar_url: '',
    chatbot_intro_message: "Hi! 👋 I'm the portfolio assistant. Ask me anything about the portfolio owner!",
  });
  const messagesEndRef = useRef(null);

  // Fetch widget config from settings
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await profileAPI.getSettings();
        if (res.data) {
          const cfg = {
            chatbot_name: res.data.chatbot_name || 'Portfolio Assistant',
            chatbot_avatar_url: res.data.chatbot_avatar_url || '',
            chatbot_intro_message: res.data.chatbot_intro_message || "Hi! 👋 I'm the portfolio assistant. Ask me anything about the portfolio owner!",
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

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
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
                  <div className="msg-bubble">{msg.content}</div>
                </motion.div>
              ))}
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
              <button onClick={handleSend} disabled={loading || !input.trim()}>
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
