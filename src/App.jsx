import { useEffect, useMemo, useRef, useState } from 'react';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const apiUrl = import.meta.env.VITE_GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Good evening, sir. JARVIS at your service. How may I assist you today?' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const hasApiKey = useMemo(() => Boolean(apiKey), []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.frequency.value = 650;
      gainNode.gain.value = 0.02;
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.05);
    } catch {
      // ignore audio errors
    }
  };

  const sendToGemini = async (message) => {
    if (!hasApiKey) {
      throw new Error('Missing Gemini API key. Set VITE_GEMINI_API_KEY in your .env file.');
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${message} (Please respond as if you are JARVIS from Iron Man, addressing the user as 'sir' or 'Mr. Stark')`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Gemini API returned an error.');
    }

    return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'My apologies, sir. I seem to be experiencing technical difficulties. Shall we try again?';
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setError(null);
    setIsLoading(true);

    try {
      const reply = await sendToGemini(trimmed);
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
      playNotificationSound();
    } catch (err) {
      setError(err.message);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'My apologies, sir. I seem to be experiencing technical difficulties. Shall we try again?',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-content">
          <i className="fas fa-circle-radiation pulse"></i>
          <h1>JARVIS AI INTERFACE</h1>
          <div className="status">System Online</div>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <strong>{message.role === 'user' ? 'Tony Stark: ' : 'JARVIS: '}</strong>
            {message.text}
          </div>
        ))}

        {isLoading && (
          <div className="message bot-message loading" id="loading-message">
            JARVIS is processing
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          id="user-input"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Command input, sir..."
          autoFocus
          disabled={isLoading}
        />
        <button id="send-button" type="button" onClick={handleSend} disabled={isLoading}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="footer">
        <p>&copy; 2026 Gaurav Kumar. All Rights Reserved</p>
        <div className="social-links">
          <a href="https://github.com/orewagaurav" target="_blank" rel="noreferrer">
            <i className="fab fa-github"></i>
          </a>
          <a href="https://www.linkedin.com/in/orewagaurav" target="_blank" rel="noreferrer">
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="https://www.instagram.com/orewa_gaurav_" target="_blank" rel="noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
