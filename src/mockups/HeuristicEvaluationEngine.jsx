import React from 'react';
import SharedLayout from './SharedLayout';
import './mockups.css';

const HeuristicEvaluationEngine = ({ onNavigate }) => {
  const heuristics = [
    { id: 1, name: 'Visibility of System Status', score: 85, confidence: 97, severity: 'minor',
      issue: "Loading states missing on 'Save Settings' button", recommendation: 'Add spinner or progress indicator',
      suggestedComponent: 'AWS/Buttons/Button-Loading-State' },
    { id: 2, name: 'Match Between System and Real World', score: 92, confidence: 94, severity: null, issue: null },
    { id: 3, name: 'User Control and Freedom', score: 65, confidence: 96, severity: 'major',
      issue: "No 'Cancel' or 'Undo' option in multi-step form", location: 'Profile Edit Flow - Frames 5-7',
      recommendation: 'Add cancel/undo functionality', researchLink: 'Theme 1: Navigation Confusion - 15 users' },
    { id: 4, name: 'Consistency and Standards', score: 88, confidence: 98, severity: 'minor',
      issue: 'Button placement inconsistent across screens', recommendation: 'Standardize button positions' }
  ];

  const accessibilityAudit = {
    overall: 87,
    checks: [
      { code: '1.4.3', name: 'Contrast (Minimum)', status: 'pass' },
      { code: '2.1.1', name: 'Keyboard', status: 'fail', note: 'Dropdown not keyboard accessible' },
      { code: '4.1.2', name: 'Name, Role, Value', status: 'warning', note: '3 buttons missing ARIA labels' }
    ]
  };

  const actionItems = [
    { priority: 'high', title: 'Add user control in multi-step form', time: '2 hours', impact: 'Major usability issue', research: 'Theme 1 - 15 users' },
    { priority: 'high', title: 'Fix keyboard accessibility in dropdown', time: '1 hour', impact: 'WCAG AA blocker' },
    { priority: 'medium', title: 'Standardize button placement', time: '30 min', impact: 'Consistency issue' },
    { priority: 'low', title: 'Add loading states to buttons', time: '1 hour', impact: 'Minor UX improvement' }
  ];

  const exportOptions = [
    { icon: '📄', label: 'Export Full Report (PDF)' }, { icon: '📊', label: 'Export to Jira (6 tickets)' },
    { icon: '📧', label: 'Email to Team' }, { icon: '💾', label: 'Save to Project Repository' }
  ];

  return (
    <SharedLayout currentPhase={2} currentScreen="heuristic" progress={75} milestone="Validate Solutions" onNavigate={onNavigate}>
      <div className="heuristic-content">
        <main className="main-content evaluation-dashboard">
          <section className="score-overview">
            <div className="overall-score-card">
              <div className="score-circle"><span className="score-value">78</span><span className="score-max">/100</span></div>
              <div className="score-details">
                <h2>Overall Heuristic Score</h2>
                <div className="score-meta">
                  <span className="meta-item"><span className="meta-label">Confidence:</span> 95%</span>
                  <span className="meta-item"><span className="meta-label">Evaluation time:</span> 2.3 seconds</span>
                  <span className="meta-item"><span className="meta-label">Screens analyzed:</span> 8</span>
                </div>
              </div>
            </div>
          </section>

          <section className="heuristic-breakdown">
            <h2 className="section-title">Heuristic Breakdown</h2>
            <div className="heuristics-list">
              {heuristics.map((h) => (
                <div key={h.id} className={`heuristic-card ${h.severity ? `heuristic--${h.severity}` : 'heuristic--pass'}`}>
                  <div className="heuristic-header">
                    <div className="heuristic-info"><span className="heuristic-number">{h.id}.</span><h3 className="heuristic-name">{h.name}</h3></div>
                    <div className="heuristic-scores"><span className="score-badge">{h.score}/100</span><span className="confidence-text">{h.confidence}% confidence</span></div>
                  </div>
                  {h.issue ? (
                    <div className="heuristic-body">
                      <div className="severity-indicator"><span className={`severity-badge severity--${h.severity}`}>{h.severity === 'major' ? '⚠️ Major' : '⚡ Minor'}</span></div>
                      <div className="issue-details">
                        <p className="issue-text"><span className="detail-label">Issue:</span> {h.issue}</p>
                        {h.location && <p className="issue-location"><span className="detail-label">Location:</span> {h.location}</p>}
                        <p className="issue-recommendation"><span className="detail-label">Recommendation:</span> {h.recommendation}</p>
                        {h.suggestedComponent && <p className="suggested-component"><span className="detail-label">Component:</span> <code>{h.suggestedComponent}</code></p>}
                        {h.researchLink && <p className="research-link"><span className="detail-label">Research:</span> {h.researchLink}</p>}
                      </div>
                    </div>
                  ) : (
                    <div className="heuristic-body heuristic-pass"><span className="pass-icon">✓</span><span className="pass-text">No issues found</span></div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="accessibility-audit">
            <h2 className="section-title">WCAG AA Accessibility Audit</h2>
            <div className="audit-content">
              <div className="audit-score"><span className="audit-percentage">{accessibilityAudit.overall}%</span><span className="audit-label">Overall Compliance</span></div>
              <div className="audit-checks">
                {accessibilityAudit.checks.map((check, i) => (
                  <div key={i} className={`audit-check audit-check--${check.status}`}>
                    <span className="check-status-icon">{check.status === 'pass' ? '✓' : check.status === 'fail' ? '✗' : '⚠️'}</span>
                    <span className="check-code">{check.code}</span>
                    <span className="check-name">{check.name}:</span>
                    <span className="check-result">{check.status === 'pass' ? 'Pass' : check.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <aside className="sidebar-right action-items-panel">
          <h3 className="sidebar-title">Prioritized Action Items</h3>
          <div className="action-items-list">
            {actionItems.map((item, i) => (
              <div key={i} className={`action-item action-item--${item.priority}`}>
                <div className="action-header">
                  <span className={`priority-badge priority--${item.priority}`}>{item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}</span>
                  <span className="action-number">{i + 1}</span>
                </div>
                <h4 className="action-title">{item.title}</h4>
                <div className="action-meta"><span className="time-estimate">⏱️ {item.time}</span><span className="impact-note">{item.impact}</span></div>
                {item.research && <p className="research-ref">📊 {item.research}</p>}
              </div>
            ))}
          </div>
          <div className="export-section">
            <h3 className="panel-title">Export Options</h3>
            <div className="export-buttons">{exportOptions.map((opt, i) => <button key={i} className="export-btn"><span className="export-icon">{opt.icon}</span><span className="export-label">{opt.label}</span></button>)}</div>
          </div>
        </aside>
      </div>
    </SharedLayout>
  );
};

export default HeuristicEvaluationEngine;
