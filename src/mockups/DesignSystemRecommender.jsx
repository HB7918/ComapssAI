import React from 'react';
import SharedLayout from './SharedLayout';
import './mockups.css';

const DesignSystemRecommender = ({ onNavigate }) => {
  const researchContext = [
    { text: 'Users need quick access to account settings', theme: 'Theme 2', relevance: 'High' },
    { text: 'Navigation confusion in multi-step flows', theme: 'Theme 1', relevance: 'High' }
  ];

  const recommendations = [
    {
      name: 'Navigation Header', component: 'AWS/Navigation/TopNav-Primary', confidence: 95,
      rationale: 'Matches user mental model from research', accessibility: 'WCAG 2.1 AA Compliant',
      usage: 'Used in 47 team projects', alternatives: []
    },
    {
      name: 'User Profile Card', component: 'AWS/Cards/Profile-Card-Compact', confidence: 88,
      rationale: "Addresses 'quick access' need from Theme 2", accessibility: 'WCAG 2.1 AA Compliant',
      usage: 'Used in 32 team projects',
      alternatives: [{ component: 'AWS/Cards/Profile-Card-Expanded', confidence: 72, note: 'More information density' }]
    },
    {
      name: 'Settings Panel', component: 'AWS/Forms/Settings-Panel-Tabbed', confidence: 91,
      rationale: 'Reduces navigation confusion (Theme 1)', accessibility: 'WCAG 2.1 AA Compliant',
      usage: 'Used in 28 team projects', alternatives: []
    }
  ];

  const qualityChecks = [
    { label: 'Component library usage', status: 'pass', value: '100%' },
    { label: 'Layer naming conventions', status: 'warning', value: '85% - 3 layers need renaming' },
    { label: 'Color contrast (WCAG AA)', status: 'pass', value: '100%' },
    { label: 'Spacing consistency', status: 'pass', value: '95%' },
    { label: 'Missing interaction states', status: 'fail', value: '60% - Hover states missing' }
  ];

  const aiInsights = [
    { icon: '⚠️', text: 'Ensure color contrast ratio ≥ 4.5:1', type: 'warning' },
    { icon: '✓', text: 'All components support keyboard navigation', type: 'success' },
    { icon: '💡', text: 'Similar layout used in Project Beta', type: 'info' },
    { icon: '📊', text: '89% task completion rate', type: 'metric' }
  ];

  return (
    <SharedLayout currentPhase={2} currentScreen="design" progress={35} milestone="Problem-Solution Fit" onNavigate={onNavigate}>
      <div className="design-content">
        {/* Research Context Panel */}
        <aside className="context-panel">
          <h3 className="sidebar-title">Research Context</h3>
          <p className="context-subtitle">Links design decisions to research insights</p>
          <div className="context-list">
            {researchContext.map((item, i) => (
              <div key={i} className="context-item">
                <p className="context-text">"{item.text}"</p>
                <div className="context-meta">
                  <span className="theme-ref">{item.theme}</span>
                  <span className={`relevance relevance--${item.relevance.toLowerCase()}`}>{item.relevance} relevance</span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Canvas */}
        <main className="main-content canvas-area">
          <div className="canvas-header">
            <div className="canvas-info">
              <span className="canvas-title">User Profile Dashboard</span>
              <span className="canvas-frame">Desktop - 1440px</span>
            </div>
            <div className="ai-overlay-status">
              <span className="ai-active-indicator"></span>
              AI Overlay: Active - Suggesting components
            </div>
          </div>
          
          <div className="canvas-viewport">
            <div className="artboard">
              <div className="artboard-nav"><div className="nav-placeholder"><span className="component-highlight">TopNav-Primary</span></div></div>
              <div className="artboard-content">
                <div className="profile-section"><div className="component-highlight">Profile-Card-Compact</div></div>
                <div className="settings-section"><div className="component-highlight">Settings-Panel-Tabbed</div></div>
              </div>
            </div>
          </div>

          <div className="quality-validator">
            <h3 className="validator-title">Design Quality Validator (Live Checks)</h3>
            <div className="checks-grid">
              {qualityChecks.map((check, i) => (
                <div key={i} className={`check-item check--${check.status}`}>
                  <span className="check-icon">{check.status === 'pass' ? '✓' : check.status === 'warning' ? '⚠️' : '✗'}</span>
                  <span className="check-label">{check.label}:</span>
                  <span className="check-value">{check.value}</span>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Right Panel */}
        <aside className="sidebar-right recommendations-panel">
          <h3 className="sidebar-title">AI Component Recommendations</h3>
          <div className="recommendations-list">
            {recommendations.map((rec, i) => (
              <div key={i} className="recommendation-card">
                <div className="rec-header">
                  <h4 className="rec-name">{rec.name}</h4>
                  <span className="confidence-badge">{rec.confidence}%</span>
                </div>
                <div className="rec-component"><code>{rec.component}</code></div>
                <div className="rec-details">
                  <p className="rec-rationale"><span className="detail-label">Rationale:</span> {rec.rationale}</p>
                  <p className="rec-accessibility"><span className="detail-label">Accessibility:</span> {rec.accessibility}</p>
                </div>
                {rec.alternatives.length > 0 && (
                  <div className="rec-alternatives">
                    <span className="alt-label">Alternative:</span>
                    {rec.alternatives.map((alt, j) => (
                      <div key={j} className="alt-item"><code>{alt.component}</code><span className="alt-confidence">({alt.confidence}%)</span></div>
                    ))}
                  </div>
                )}
                <div className="rec-actions">
                  <button className="btn btn--primary btn--sm">Insert</button>
                  <button className="btn btn--secondary btn--sm">Details</button>
                </div>
              </div>
            ))}
          </div>
          <div className="ai-insights-panel">
            <h3 className="panel-title">AI Insights</h3>
            <div className="insights-list">
              {aiInsights.map((insight, i) => (
                <div key={i} className={`insight-item insight--${insight.type}`}>
                  <span className="insight-icon">{insight.icon}</span>
                  <span className="insight-text">{insight.text}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </SharedLayout>
  );
};

export default DesignSystemRecommender;
