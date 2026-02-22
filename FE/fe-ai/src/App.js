import { useState, useRef, useEffect } from 'react';
import './App.css';

const DUMMY_MESSAGES = [
  {
    id: 1,
    from: 'bot',
    text: 'Halo saya bowo, saya siap mendengar keluhan dari program saya!',
    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
  },
];

const CallAPI = async (conversation) => {
  const response = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ conversation })
  });

  const data = await response.json();
  return data.result;
};

export default function App() {
  const [messages, setMessages] = useState(DUMMY_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversation, setConversation] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg = {
      id: Date.now(),
      from: 'user',
      text: inputValue.trim(),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedConversation = [
      ...conversation,
      { role: 'user', text: inputValue.trim() }
    ];

    setMessages((prev) => [...prev, userMsg]);
    setConversation(updatedConversation);
    setInputValue('');
    setIsTyping(true);

    try {
      const botReply = await CallAPI(updatedConversation);

      setConversation((prev) => [
        ...prev,
        { role: 'model', text: botReply }
      ]);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: 'bot',
          text: botReply,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: 'bot',
          text: 'Terjadi kesalahan, coba lagi.',
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="shell">
      <div className="card">

        <header className="header">
          <div className="header-logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="8" width="18" height="12" rx="3" />
              <path d="M8 8V6a4 4 0 0 1 8 0v2" />
              <circle cx="9" cy="14" r="1.2" fill="white" stroke="none" />
              <circle cx="15" cy="14" r="1.2" fill="white" stroke="none" />
              <path d="M9 17.5c.8.7 2.4 1 3 1s2.2-.3 3-1" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="header-info">
            <h1 className="header-title">Lapor MBG</h1>
            <p className="header-sub">Makan Bergizi Gratis – Pusat Laporan</p>
            <div className="badge">
              <span className="dot" />
              Online
            </div>
          </div>
          <button className="icon-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="5" r="1.2" fill="currentColor" />
              <circle cx="12" cy="12" r="1.2" fill="currentColor" />
              <circle cx="12" cy="19" r="1.2" fill="currentColor" />
            </svg>
          </button>
        </header>

        <div className="messages">
          <div className="divider"><span>Hari ini</span></div>

          {messages.map((msg) => (
            <div key={msg.id} className={`row row--${msg.from}`}>
              {msg.from === 'bot' && (
                <div className="avatar">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="8" width="18" height="12" rx="3" />
                    <path d="M8 8V6a4 4 0 0 1 8 0v2" />
                    <circle cx="9" cy="14" r="1.2" fill="white" stroke="none" />
                    <circle cx="15" cy="14" r="1.2" fill="white" stroke="none" />
                    <path d="M9 17.5c.8.7 2.4 1 3 1s2.2-.3 3-1" strokeWidth="1.5" />
                  </svg>
                </div>
              )}
              <div className="col">
                <div className={`bubble bubble--${msg.from}`}>{msg.text}</div>
                <span className="time">{msg.time}</span>
              </div>
              {msg.from === 'user' && null}
            </div>
          ))}

          {isTyping && (
            <div className="row row--bot">
              <div className="avatar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="8" width="18" height="12" rx="3" />
                  <path d="M8 8V6a4 4 0 0 1 8 0v2" />
                  <circle cx="9" cy="14" r="1.2" fill="white" stroke="none" />
                  <circle cx="15" cy="14" r="1.2" fill="white" stroke="none" />
                  <path d="M9 17.5c.8.7 2.4 1 3 1s2.2-.3 3-1" strokeWidth="1.5" />
                </svg>
              </div>
              <div className="typing">
                <span /><span /><span />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="input-area">
          <div className="toolbar">
            <button className="tool-btn" title="Lampirkan foto">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21,15 16,10 5,21" />
              </svg>
            </button>
            <button className="tool-btn" title="Rekam suara">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>
            <button className="tool-btn" title="Lokasi saya">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </button>
          </div>

          <div className="input-row">
            <textarea
              className="input"
              placeholder="Ketik pesan atau keluhan Anda..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button className="send-btn" onClick={handleSend} disabled={!inputValue.trim()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}