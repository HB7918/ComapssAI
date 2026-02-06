import React from 'react';
import SharedLayout from './SharedLayout';
import './mockups.css';

const InsightSynthesizer = ({ onNavigate }) => {
  const themes = [
    {
      id: 1,
      title: 'Navigation Confusion in Multi-Step Flows',
      confidence: 92,
      evidence: 23,
      sentiment: 'negative',
      quote: "I got lost between step 3 and 4, wasn't sure if I could go back",
      impact: '15 of 18 participants affected'
    },
    {
      id: 2,
      title: 'Desire for Real-Time Collaboration Features',
      confidence: 88,
      evidence: 18,
      sentiment: 'positive',
      quote: "I wish I could share this with my team while I'm working",
      impact: '12 of 18 participants'
    },
    {
      id: 3,
      title: 'Mobile Experience Gaps',
      confidence: 85,
      evidence: 14,
      sentiment: 'negative',
      quote: "The mobile version feels like an afterthought",
      impact: '14 of 18 participants'
    }
  ];

  const opportunities = [
    { text: 'Improve wayfinding in complex workflows', impact: 'High', effort: 'Medium' },
    { text: 'Add collaborative features', impact: 'High', effort: 'High' },
    { text: 'Redesign mobile experience', impact: 'Medium', effort: 'High' }
  ];

  return (
    <SharedLayout 
      currentPhase={1} 
      currentScreen="insight" 
      progress={60} 
      milestone="Understanding the Problem"
      onNavigate={onNavigate}
    >
      <div className="insight-content">
        {/* Main Content */}
        <main className="main-content">
          {/* Data Sources Section */}
          <section className="data-sources">
            <h2 className="section-title">Data Sources</h2>
            <div className="upload-area">
              <div className="file-grid">
                {['Interview_Transcripts.pdf', 'Survey_Results.csv', 'Usability_Notes.docx', 'Analytics_Export.json'].map((file, i) => (
                  <div key={i} className="file-card">
                    <span className="file-icon">📄</span>
                    <span className="file-name">{file}</span>
                    <span className="file-status">✓ Processed</span>
                  </div>
                ))}
              </div>
              <div className="data-stats">
                <span className="char-count">287,450 / 10,000,000 characters</span>
                <div className="ai-status">
                  <span className="pulse"></span>
                  Analyzing patterns across 47 data points...
                </div>
              </div>
            </div>
          </section>

          {/* AI-Generated Themes */}
          <section className="themes-section">
            <h2 className="section-title">AI-Generated Themes</h2>
            <div className="themes-grid">
              {themes.map((theme) => (
                <div key={theme.id} className="theme-card">
                  <div className="theme-header">
                    <h3 className="theme-title">Theme {theme.id}: {theme.title}</h3>
                    <span className={`sentiment-badge sentiment--${theme.sentiment}`}>
                      {theme.sentiment === 'positive' ? 'Positive Opportunity' : 'Negative'}
                    </span>
                  </div>
                  <div className="theme-metrics">
                    <div className="metric">
                      <span className="metric-label">Confidence</span>
                      <span className="metric-value">{theme.confidence}%</span>
                      <div className="metric-bar">
                        <div className="metric-fill" style={{ width: `${theme.confidence}%` }}></div>
                      </div>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Evidence</span>
                      <span className="metric-value">{theme.evidence} data points</span>
                    </div>
                  </div>
                  <blockquote className="theme-quote">"{theme.quote}"</blockquote>
                  <div className="theme-impact">
                    <span className="impact-icon">�</span>
                    <span className="impact-text">Impact: {theme.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Opportunity Matrix */}
          <section className="opportunity-matrix">
            <h2 className="section-title">Opportunity Matrix</h2>
            <div className="matrix-grid">
              {opportunities.map((opp, i) => (
                <div key={i} className="opportunity-item">
                  <span className="opp-text">{opp.text}</span>
                  <div className="opp-tags">
                    <span className={`tag tag--impact-${opp.impact.toLowerCase()}`}>{opp.impact} Impact</span>
                    <span className={`tag tag--effort-${opp.effort.toLowerCase()}`}>{opp.effort} Effort</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Right Panel - AI Assistant */}
        <aside className="sidebar-right">
          <div className="validation-checkpoint">
            <div className="checkpoint-header">
              <span className="human-icon">👤</span>
              <h3>Human Validation Checkpoint</h3>
            </div>
            <p className="checkpoint-text">Review AI-generated themes before proceeding</p>
            <div className="checkpoint-actions">
              <button className="btn btn--primary">Approve All</button>
              <button className="btn btn--secondary">Review Individual</button>
              <button className="btn btn--tertiary">Regenerate</button>
            </div>
          </div>

          <div className="ai-insights">
            <h3 className="panel-title">AI Insights</h3>
            <div className="insight-item">
              <span className="insight-icon">�</span>
              <p>Theme 1 appears in 78% of negative feedback</p>
            </div>
          </div>

          <div className="next-steps">
            <h3 className="panel-title">Next Steps</h3>
            <div className="steps-list">
              <button className="step-btn">🗺️ Generate Journey Map</button>
              <button className="step-btn">📄 Export Report</button>
              <button className="step-btn">➡️ Move to Ideation</button>
            </div>
          </div>
        </aside>
      </div>
    </SharedLayout>
  );
};

export default InsightSynthesizer;
