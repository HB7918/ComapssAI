import React, { useState } from 'react';
import SharedLayout from './SharedLayout';
import './mockups.css';

const JourneyMapGenerator = ({ onNavigate }) => {
  const [activeView, setActiveView] = useState('full');

  const journeyStages = [
    {
      id: 1, name: 'Awareness', emoji: '🤔', goal: 'Discover the multi-step workflow feature',
      emotionScore: 6, emotionLabel: 'Curious',
      touchpoints: ['Homepage banner', 'Email notification', 'In-app tooltip'],
      evidence: { quote: "I wasn't sure what this workflow would do", participant: 'P03' },
      painPoints: [], opportunities: [], isCritical: false
    },
    {
      id: 2, name: 'Onboarding', emoji: '😊', goal: 'Understand how to use the workflow',
      emotionScore: 7, emotionLabel: 'Optimistic',
      touchpoints: ['Tutorial screens', 'Help documentation'],
      painPoints: [{ text: 'Tutorial too long (8 screens)', severity: 'medium' }],
      opportunities: [{ text: 'Reduce to 3-4 key screens, add skip option' }],
      isCritical: false
    },
    {
      id: 3, name: 'Step 1-2 Completion', emoji: '😃', goal: 'Complete initial workflow steps',
      emotionScore: 8, emotionLabel: 'Confident',
      touchpoints: ['Workflow interface', 'Progress indicator'],
      thought: "This is going well, I'm making progress",
      painPoints: [], opportunities: [], isCritical: false
    },
    {
      id: 4, name: 'Step 3-4 Navigation Crisis', emoji: '😤', goal: 'Navigate between steps 3 and 4',
      emotionScore: 3, emotionLabel: 'Frustrated',
      touchpoints: ['Navigation controls', 'Progress bar'],
      painPoints: [
        { text: "No visible 'Back' button", severity: 'critical' },
        { text: 'Unclear if data will be lost', severity: 'critical' },
        { text: 'No breadcrumb navigation', severity: 'high' },
        { text: 'Progress indicator not clickable', severity: 'high' }
      ],
      evidence: { quotes: ['P01', 'P05', 'P14'], count: 3 },
      themeLink: '15 of 18 participants affected',
      opportunities: [
        { text: "Add prominent 'Back' button" },
        { text: 'Make progress indicator clickable' },
        { text: 'Add breadcrumb navigation' },
        { text: "Show 'Your progress is saved' message" }
      ],
      isCritical: true
    },
    {
      id: 5, name: 'Recovery Attempt', emoji: '😰', goal: 'Find a way back or complete workflow',
      emotionScore: 2, emotionLabel: 'Anxious', isEmotionalLow: true,
      touchpoints: ['Browser controls', 'Help button'],
      thought: "Should I just start over? This is taking too long",
      painPoints: [
        { text: 'Browser back button may lose data', severity: 'high' },
        { text: "No 'Save and exit' option", severity: 'high' }
      ],
      opportunities: [], isCritical: false
    },
    {
      id: 6, name: 'Completion', emoji: '😮‍💨', goal: 'Submit completed workflow',
      emotionScore: 5, emotionLabel: 'Relieved but exhausted',
      touchpoints: ['Submit button', 'Confirmation screen'],
      thought: "Finally done, but that was harder than it should have been",
      painPoints: [], opportunities: [], isCritical: false
    }
  ];

  const viewOptions = [
    { id: 'full', label: 'Full View' }, { id: 'emotion', label: 'Emotion Graph' },
    { id: 'pain', label: 'Pain Points Only' }, { id: 'opportunities', label: 'Opportunities Only' },
    { id: 'evidence', label: 'Research Evidence' }, { id: 'simple', label: 'Simplified View' }
  ];

  const exportOptions = [
    { icon: '📊', label: 'Export to FigJam (editable)' }, { icon: '📄', label: 'Export to PDF' },
    { icon: '🖼️', label: 'Export as PNG' }, { icon: '📋', label: 'Copy FigJam code' },
    { icon: '💾', label: 'Save to project repository' }
  ];

  const getEmotionColor = (score) => {
    if (score >= 7) return '#1d8102';
    if (score >= 5) return '#ff9900';
    if (score >= 3) return '#d13212';
    return '#8b0000';
  };

  return (
    <SharedLayout currentPhase={1} currentScreen="journey" progress={75} milestone="Understanding the Problem" onNavigate={onNavigate}>
      <div className="journey-content">
        <main className="main-content journey-canvas">
          <div className="canvas-status-bar">
            <div className="ai-generation-status">
              <span className="status-icon">✨</span>
              <span>Generated in 3.2 seconds with 92% confidence</span>
            </div>
            <div className="source-theme">
              <span className="source-label">Source:</span>
              <span className="theme-tag">Theme 1 - Navigation Confusion in Multi-Step Flows</span>
            </div>
          </div>

          <div className="journey-map-container">
            <div className="journey-map">
              <div className="emotion-graph">
                <svg className="emotion-line" viewBox="0 0 1200 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="emotionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ff9900" />
                      <stop offset="16%" stopColor="#1d8102" />
                      <stop offset="33%" stopColor="#1d8102" />
                      <stop offset="50%" stopColor="#d13212" />
                      <stop offset="66%" stopColor="#8b0000" />
                      <stop offset="100%" stopColor="#ff9900" />
                    </linearGradient>
                  </defs>
                  <path d="M 0,40 L 200,30 L 400,20 L 600,70 L 800,80 L 1000,50 L 1200,50" fill="none" stroke="url(#emotionGradient)" strokeWidth="3" />
                </svg>
              </div>

              <div className="stages-container">
                {journeyStages.map((stage) => (
                  <div key={stage.id} className={`journey-stage ${stage.isCritical ? 'stage--critical' : ''} ${stage.isEmotionalLow ? 'stage--emotional-low' : ''}`}>
                    <div className="stage-header">
                      <span className="stage-number">Stage {stage.id}</span>
                      {stage.isCritical && <span className="critical-badge">CRITICAL</span>}
                      {stage.isEmotionalLow && <span className="low-badge">LOW POINT</span>}
                    </div>
                    <div className="stage-title">
                      <span className="stage-emoji">{stage.emoji}</span>
                      <h3>{stage.name}</h3>
                    </div>
                    <div className="emotion-indicator">
                      <div className="emotion-score" style={{ backgroundColor: getEmotionColor(stage.emotionScore) }}>{stage.emotionScore}/10</div>
                      <span className="emotion-label">{stage.emotionLabel}</span>
                    </div>
                    <div className="stage-goal"><span className="label">Goal:</span><p>{stage.goal}</p></div>
                    {stage.thought && <div className="stage-thought"><span className="thought-icon">💭</span><p>"{stage.thought}"</p></div>}
                    {stage.painPoints?.length > 0 && (
                      <div className="stage-pain-points">
                        <span className="label">Pain Points:</span>
                        <ul>{stage.painPoints.map((pp, i) => <li key={i} className={`pain-point pain--${pp.severity}`}><span className="severity-dot"></span>{pp.text}</li>)}</ul>
                      </div>
                    )}
                    {stage.opportunities?.length > 0 && (
                      <div className="stage-opportunities">
                        <span className="label">Opportunities:</span>
                        <ul>{stage.opportunities.map((opp, i) => <li key={i} className="opportunity-item"><span className="opp-icon">💡</span>{opp.text}</li>)}</ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="view-toolbar">
            <span className="toolbar-label">View Options:</span>
            <div className="view-buttons">
              {viewOptions.map((view) => (
                <button key={view.id} className={`view-option-btn ${activeView === view.id ? 'active' : ''}`} onClick={() => setActiveView(view.id)}>{view.label}</button>
              ))}
            </div>
          </div>
        </main>

        <aside className="sidebar-right journey-assistant">
          <h3 className="sidebar-title">AI Journey Map Assistant</h3>
          <div className="generation-settings">
            <h4 className="panel-subtitle">Generation Settings</h4>
            <div className="settings-list">
              <div className="setting-item"><span className="setting-label">Selected theme:</span><span className="setting-value">Theme 1 - Navigation Confusion</span></div>
              <div className="setting-item"><span className="setting-label">Journey type:</span><span className="setting-value">Current State (As-Is)</span></div>
              <div className="setting-item"><span className="setting-label">Persona:</span><span className="setting-value">Task-focused professional</span></div>
              <div className="setting-item"><span className="setting-label">Time frame:</span><span className="setting-value">15-30 min session</span></div>
            </div>
          </div>
          <div className="key-insights">
            <h4 className="panel-subtitle">Key Insights</h4>
            <div className="insights-grid">
              <div className="insight-card insight--critical"><span className="insight-label">Critical moment</span><span className="insight-value">Stage 4</span></div>
              <div className="insight-card insight--pain"><span className="insight-label">Highest pain</span><span className="insight-value">No 'Back' button</span></div>
              <div className="insight-card insight--emotion"><span className="insight-label">Emotional low</span><span className="insight-value">Stage 5 (2/10)</span></div>
              <div className="insight-card insight--opportunities"><span className="insight-label">Opportunities</span><span className="insight-value">11 identified</span></div>
            </div>
          </div>
          <div className="export-section">
            <h4 className="panel-subtitle">Export Options</h4>
            <div className="export-buttons">{exportOptions.map((opt, i) => <button key={i} className="export-btn"><span className="export-icon">{opt.icon}</span><span className="export-label">{opt.label}</span></button>)}</div>
          </div>
          <div className="next-steps-section">
            <h4 className="panel-subtitle">Next Steps</h4>
            <div className="steps-list">
              <button className="step-btn">🗺️ Generate future-state map</button>
              <button className="step-btn">✏️ Create wireframes</button>
              <button className="step-btn">💡 Move to Ideation</button>
            </div>
          </div>
        </aside>
      </div>
    </SharedLayout>
  );
};

export default JourneyMapGenerator;
