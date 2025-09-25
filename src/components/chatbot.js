import React, { useState } from 'react';
import '../styles/style.css';

const AIChatbot = () => {
  const [chatLog, setChatLog] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setChatLog((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      const botMessage = { sender: 'bot', text: data.reply };
      setChatLog((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { sender: 'bot', text: 'Error: Failed to get response.' };
      setChatLog((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => setInput(e.target.value);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <section className="section">
      <h2>AI chatbot</h2>
      <p className="muted">
        Ask compliance, infrastructure, or legal questions.
      </p>

      <div className="chatbox" style={{ minHeight: '200px', border: '1px solid #ccc', padding: '10px', overflowY: 'auto' }}>
        {chatLog.map(({ sender, text }, idx) => (
          <div key={idx} className={sender === 'user' ? 'chat-message user' : 'chat-message bot'}>
            {text}
          </div>
        ))}
        {loading && <div className="chat-message bot">Loading...</div>}
      </div>

      <div className="chatinput">
        <input
          placeholder="e.g., What documents to start export logistics?"
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <button className="btn btn-primary" onClick={handleSend} disabled={loading}>
          Send
        </button>
      </div>
    </section>
  );
};

export default AIChatbot;
