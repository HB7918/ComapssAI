import React, { useState } from 'react';
import './mockups.css';

const ChatLanding = ({ onStartProject }) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);

  const suggestions = [
    { icon: '🔍', title: 'Analyze user research', desc: 'Upload interviews, surveys, or usability test data' },
    { icon: '🗺️', title: 'Create a journey map', desc: 'Generate user journey from research insights' },
    { icon: '🎨', title: 'Get design recommendations', desc: 'AI-powered component suggestions from your design system' },
    { icon: '📊', title: 'Run heuristic evaluation', desc: 'Automated usability analysis of your designs' }
  ];

  const recentProjects = [
    { name: 'E-commerce Checkout Redesign', phase: 'Design & Iterate', progress: 65 },
    { name: 'Mobile App Onboarding', phase: 'Research', progress: 40 },
    { name: 'Dashboard Analytics', phase: 'Handoff', progress: 90 }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    // Add user message
    setMessages([...messages, { role: 'user', content: inputValue }]);
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'll help you get started! Let me create a new UX project for you. What type of research data do you have available? You can upload interview transcripts, survey results, analytics data, or usability test recordings."
      }]);
    }, 1000);
    
    setInputValue('');
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.title);
  };

  return (
    <div className="chat-landing">
      {/* Sidebar */}
      <aside className="chat-sidebar">
        <div className="sidebar-header">
          <h1 className="brand-logo">
            <span className="logo-icon">🧭</span>
            <span className="logo-text">Compass AI</span>
          </h1>
          <button className="new-chat-btn">
            <span>+</span> New Project
          </button>
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-section-title">Recent Projects</h3>
          <div className="recent-list">
            {recentProjects.map((project, i) => (
              <div key={i} className="recent-item">
                <div className="recent-info">
                  <span className="recent-name">{project.name}</span>
                  <span className="recent-phase">{project.phase}</span>
                </div>
                <div className="recent-progress">
                  <div className="progress-mini">
                    <div className="progress-mini-fill" style={{ width: `${project.progress}%` }}></div>
                  </div>
                  <span className="progress-text">{project.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-section-title">Quick Actions</h3>
          <div className="quick-actions">
            <button className="quick-action-btn">📁 Import Research</button>
            <button className="quick-action-btn">🔗 Connect Figma</button>
            <button className="quick-action-btn">👥 Invite Team</button>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">JD</div>
            <div className="user-info">
              <span className="user-name">Jane Designer</span>
              <span className="user-plan">Pro Plan</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="chat-main">
        {messages.length === 0 ? (
          /* Empty State - Welcome Screen */
          <div className="chat-welcome">
            <div className="welcome-header">
              <div className="welcome-icon">🧭</div>
              <h1>Welcome to Compass AI</h1>
              <p className="welcome-subtitle">Your AI-powered design companion. From research to handoff, I'll guide you through every step.</p>
            </div>

            <div className="suggestions-grid">
              {suggestions.map((suggestion, i) => (
                <button 
                  key={i} 
                  className="suggestion-card"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className="suggestion-icon">{suggestion.icon}</span>
                  <div className="suggestion-content">
                    <span className="suggestion-title">{suggestion.title}</span>
                    <span className="suggestion-desc">{suggestion.desc}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="capabilities-section">
              <h3>What I can help you with</h3>
              <div className="capabilities-list">
                <div className="capability-item">
                  <span className="capability-phase">Phase 1</span>
                  <span className="capability-name">Discover + Define</span>
                  <span className="capability-desc">Synthesize research, identify themes, create journey maps</span>
                </div>
                <div className="capability-item">
                  <span className="capability-phase">Phase 2</span>
                  <span className="capability-name">Design + Iterate</span>
                  <span className="capability-desc">Component recommendations, design validation, heuristic evaluation</span>
                </div>
                <div className="capability-item">
                  <span className="capability-phase">Phase 3</span>
                  <span className="capability-name">Test + Validate</span>
                  <span className="capability-desc">Usability testing analysis, accessibility audits</span>
                </div>
                <div className="capability-item">
                  <span className="capability-phase">Phase 4</span>
                  <span className="capability-name">Deliver</span>
                  <span className="capability-desc">Concept to code, design tokens, automated documentation</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message message--${msg.role}`}>
                <div className="message-avatar">
                  {msg.role === 'user' ? 'JD' : '🧭'}
                </div>
                <div className="message-content">
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="chat-input-container">
          <form className="chat-input-form" onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <button type="button" className="attach-btn" title="Upload files">
                <span>📎</span>
              </button>
              <input
                type="text"
                className="chat-input"
                placeholder="Describe your UX challenge or upload research data..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button type="submit" className="send-btn" disabled={!inputValue.trim()}>
                <span>↑</span>
              </button>
            </div>
            <p className="input-hint">
              Compass AI maintains context across your entire project. Your research insights inform design decisions.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ChatLanding;
