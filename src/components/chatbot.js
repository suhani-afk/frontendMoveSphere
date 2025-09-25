// import React, { useState } from 'react';
// import '../styles/style.css';

// const AIChatbot = () => {
//   const [chatLog, setChatLog] = useState([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userMessage = { sender: 'user', text: input };
//     setChatLog((prev) => [...prev, userMessage]);
//     setInput('');
//     setLoading(true);

//     try {
//       const response = await fetch('http://localhost:5000/api/chat', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ message: input }),
//       });
//       const data = await response.json();
//       const botMessage = { sender: 'bot', text: data.reply };
//       setChatLog((prev) => [...prev, botMessage]);
//     } catch (error) {
//       const errorMessage = { sender: 'bot', text: 'Error: Failed to get response.' };
//       setChatLog((prev) => [...prev, errorMessage]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => setInput(e.target.value);

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSend();
//     }
//   };

//   return (
//     <section className="section">
//       <h2>AI chatbot</h2>
//       <p className="muted">
//         Ask compliance, infrastructure, or legal questions.
//       </p>

//       <div className="chatbox" style={{ minHeight: '200px', border: '1px solid #ccc', padding: '10px', overflowY: 'auto' }}>
//         {chatLog.map(({ sender, text }, idx) => (
//           <div key={idx} className={sender === 'user' ? 'chat-message user' : 'chat-message bot'}>
//             {text}
//           </div>
//         ))}
//         {loading && <div className="chat-message bot">Loading...</div>}
//       </div>

//       <div className="chatinput">
//         <input
//           placeholder="e.g., What documents to start export logistics?"
//           value={input}
//           onChange={handleInputChange}
//           onKeyPress={handleKeyPress}
//           disabled={loading}
//         />
//         <button className="btn btn-primary" onClick={handleSend} disabled={loading}>
//           Send
//         </button>
//       </div>
//     </section>
//   );
// };

// export default AIChatbot;
import React, { useState } from 'react';
import '../styles/style.css';

const AIChatbot = () => {
  const [open, setOpen] = useState(false);
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
        body: JSON.stringify({ message: userMessage.text }),
      });
      const data = await response.json();
      const botMessage = { sender: 'bot', text: data.reply || 'No reply' };
      setChatLog((prev) => [...prev, botMessage]);
    } catch (error) {
      setChatLog((prev) => [...prev, { sender: 'bot', text: 'Error: Failed to get response.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating launcher button */}
      <button
        className="chat-launcher"
        aria-label="Open chatbot"
        onClick={() => setOpen((v) => !v)}
      >
        💬
      </button>

      {/* Popup chat window */}
      {open && (
        <div className="chat-popup">
          <div className="chat-header">
            <span>AI Assistant</span>
            <button className="chat-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="chat-body" role="log" aria-live="polite">
            {chatLog.map(({ sender, text }, idx) => (
              <div key={idx} className={`chat-row ${sender}`}>
                <div className="bubble">{text}</div>
              </div>
            ))}
            {loading && <div className="chat-row bot"><div className="bubble">Loading…</div></div>}
          </div>

          <div className="chat-inputbar">
            <textarea
              rows={1}
              placeholder="Ask a question…"
              value={input}
              onChange={(e)=> setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button className="btn btn-primary" onClick={handleSend} disabled={loading}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
