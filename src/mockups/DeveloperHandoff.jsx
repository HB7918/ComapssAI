import React, { useState } from 'react';
import SharedLayout from './SharedLayout';
import './mockups.css';

const DeveloperHandoff = ({ onNavigate }) => {
  const [expandedSection, setExpandedSection] = useState('hygiene');

  const hygieneChecks = [
    { label: 'Correct library usage', status: 'pass', value: '100% (AWS Design System v3.2)' },
    { label: 'Layer naming', status: 'warning', value: '92% (3 layers auto-renamed)', autoFixes: [
      { from: 'button 1', to: 'Button_Primary_Submit' },
      { from: 'text field', to: 'Input_Text_Email' },
      { from: 'card', to: 'Card_Profile_Compact' }
    ]},
    { label: 'Original component names', status: 'pass', value: '100%' },
    { label: 'Page names', status: 'pass', value: '100%' },
    { label: 'Ghost layers removed', status: 'pass', value: '100% (7 removed)' },
    { label: 'AA accessibility', status: 'warning', value: '95% (2 issues)', issues: ['Dropdown keyboard nav', '3 buttons need ARIA'] },
    { label: 'Ready for Code Generation', status: 'pass', value: '' }
  ];

  const designSpecs = {
    screens: 8, components: 47, interactions: 23,
    breakpoints: ['Desktop 1440px', 'Tablet 768px', 'Mobile 375px'],
    sections: [
      { name: 'Layout & Grid', detail: '12-column, 24px gutters' },
      { name: 'Typography', detail: 'AWS scale, 6 variants' },
      { name: 'Color Palette', detail: '8 primary + 12 semantic' },
      { name: 'Spacing System', detail: '8px base, 12 tokens' },
      { name: 'Component States', detail: 'Default, Hover, Focus, Active, Disabled, Error' },
      { name: 'Animations', detail: '15 micro-interactions' }
    ]
  };

  const tokenFormats = ['JSON', 'CSS Custom Properties', 'SCSS', 'TypeScript', 'Swift', 'Kotlin'];
  const tokenCategories = [
    { name: 'Colors', count: 42, example: 'color.primary.500: #0073bb' },
    { name: 'Typography', count: 18 }, { name: 'Spacing', count: 12 },
    { name: 'Border Radius', count: 6 }, { name: 'Shadows', count: 5 }
  ];

  const codeScaffolds = [
    { name: 'ProfileDashboard', files: 4, lines: 347, includes: ['.tsx', '.module.css', '.test.tsx', '.stories.tsx'],
      features: ['ARIA labels', 'keyboard nav', 'focus management'] },
    { name: 'SettingsPanel', files: 3, lines: 289, includes: ['.tsx', '.module.css', '.test.tsx'],
      note: 'Requires developer review' }
  ];

  return (
    <SharedLayout currentPhase={4} currentScreen="handoff" progress={90} milestone="Concept to Code" onNavigate={onNavigate}>
      <div className="handoff-content-wrapper">
        <main className="main-content handoff-content">
          {/* Design Hygiene */}
          <section className="handoff-section">
            <div className="section-header" onClick={() => setExpandedSection(expandedSection === 'hygiene' ? '' : 'hygiene')}>
              <h2>1. Design Hygiene Validation</h2>
              <div className="section-summary">
                <span className="summary-score">97%</span>
                <span className="summary-stat">Auto-fixes: 10</span>
                <span className="summary-stat warning">Review: 2</span>
              </div>
            </div>
            <div className={`section-content ${expandedSection === 'hygiene' ? 'expanded' : ''}`}>
              <div className="hygiene-checks">
                {hygieneChecks.map((check, i) => (
                  <div key={i} className={`hygiene-check check--${check.status}`}>
                    <span className="check-icon">{check.status === 'pass' ? '✓' : '⚠️'}</span>
                    <span className="check-label">{check.label}:</span>
                    <span className="check-value">{check.value}</span>
                    {check.autoFixes && (
                      <div className="auto-fixes">
                        {check.autoFixes.map((fix, j) => (
                          <div key={j} className="fix-item"><code className="fix-from">{fix.from}</code><span className="fix-arrow">→</span><code className="fix-to">{fix.to}</code></div>
                        ))}
                      </div>
                    )}
                    {check.issues && <ul className="issue-list">{check.issues.map((issue, j) => <li key={j}>{issue}</li>)}</ul>}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Design Specs */}
          <section className="handoff-section">
            <div className="section-header" onClick={() => setExpandedSection(expandedSection === 'specs' ? '' : 'specs')}>
              <h2>2. Design Specifications</h2>
              <div className="section-summary">
                <span className="summary-stat">{designSpecs.screens} screens</span>
                <span className="summary-stat">{designSpecs.components} components</span>
              </div>
            </div>
            <div className={`section-content ${expandedSection === 'specs' ? 'expanded' : ''}`}>
              <div className="specs-grid">
                <div className="specs-breakpoints">
                  <h4>Breakpoints</h4>
                  <div className="breakpoint-tags">{designSpecs.breakpoints.map((bp, i) => <span key={i} className="breakpoint-tag">{bp}</span>)}</div>
                </div>
                <div className="specs-sections">
                  <h4>Spec Sections</h4>
                  <div className="spec-items">{designSpecs.sections.map((s, i) => <div key={i} className="spec-item"><span className="spec-name">{s.name}:</span><span className="spec-detail">{s.detail}</span></div>)}</div>
                </div>
              </div>
            </div>
          </section>

          {/* Design Tokens */}
          <section className="handoff-section">
            <div className="section-header" onClick={() => setExpandedSection(expandedSection === 'tokens' ? '' : 'tokens')}>
              <h2>3. Design Tokens</h2>
              <div className="section-summary"><span className="summary-stat">83 tokens</span><span className="summary-stat">6 formats</span></div>
            </div>
            <div className={`section-content ${expandedSection === 'tokens' ? 'expanded' : ''}`}>
              <div className="tokens-grid">
                <div className="token-formats"><h4>Formats</h4><div className="format-list">{tokenFormats.map((f, i) => <button key={i} className="format-btn">{f}</button>)}</div></div>
                <div className="token-categories"><h4>Categories</h4><div className="category-list">{tokenCategories.map((c, i) => <div key={i} className="category-item"><span className="cat-name">{c.name}:</span><span className="cat-count">{c.count}</span>{c.example && <code className="cat-example">{c.example}</code>}</div>)}</div></div>
              </div>
            </div>
          </section>

          {/* Code Scaffolds */}
          <section className="handoff-section">
            <div className="section-header" onClick={() => setExpandedSection(expandedSection === 'scaffolds' ? '' : 'scaffolds')}>
              <h2>4. Code Scaffolds (React + TypeScript)</h2>
              <div className="section-summary"><span className="summary-stat">12 components</span></div>
            </div>
            <div className={`section-content ${expandedSection === 'scaffolds' ? 'expanded' : ''}`}>
              <div className="scaffolds-list">
                {codeScaffolds.map((s, i) => (
                  <div key={i} className="scaffold-card">
                    <div className="scaffold-header"><h4>{s.name}</h4><span className="scaffold-stats">{s.files} files ({s.lines} lines)</span></div>
                    <div className="scaffold-files"><span className="label">Files:</span>{s.includes.map((f, j) => <code key={j} className="file-ext">{f}</code>)}</div>
                    {s.features && <div className="scaffold-features"><span className="label">A11y:</span><span className="features-text">{s.features.join(', ')}</span></div>}
                    {s.note && <p className="scaffold-note">⚠️ {s.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Pre-Launch Validation */}
          <section className="prelaunch-validation">
            <h3>Pre-Launch Validation</h3>
            <div className="validation-header"><span className="readiness-score">96% Ready</span><span className="readiness-status">Minor accessibility review needed</span></div>
            <div className="validation-checks">
              <div className="val-check val--pass"><span>✓</span> Design Hygiene: 97%</div>
              <div className="val-check val--warning"><span>⚠️</span> Accessibility: 95%</div>
              <div className="val-check val--pass"><span>✓</span> Design System: 100%</div>
              <div className="val-check val--pass"><span>✓</span> Responsive: 100%</div>
              <div className="val-check val--pass"><span>✓</span> Documentation: 100%</div>
              <div className="val-check val--pass"><span>✓</span> Code Quality: 98%</div>
            </div>
            <p className="validation-recommendation"><strong>Recommendation:</strong> Proceed with handoff. Address accessibility in Sprint 1.</p>
          </section>
        </main>

        {/* Right Panel */}
        <aside className="sidebar-right handoff-actions">
          <h3 className="sidebar-title">Code Generation Actions</h3>
          <div className="package-summary">
            <h4 className="panel-subtitle">Package Summary</h4>
            <div className="summary-checklist">
              <div className="summary-item">✓ 8 design specs</div>
              <div className="summary-item">✓ 83 design tokens</div>
              <div className="summary-item">✓ 12 React components</div>
              <div className="summary-item">✓ 47 component docs</div>
              <div className="summary-item">✓ 23 interactions</div>
              <div className="summary-item">✓ 6 user flows</div>
              <div className="summary-item">✓ Research context</div>
              <div className="summary-item">✓ Decision log</div>
            </div>
            <div className="package-meta">
              <span className="meta-item">⏱️ Dev time saved: 18-24 hrs</span>
              <span className="meta-item">📦 Size: 4.2 MB</span>
            </div>
          </div>

          <div className="automated-workflows">
            <h4 className="panel-subtitle">Automated Workflows</h4>
            <div className="workflow-list">
              <div className="workflow-item"><span className="workflow-icon">📊</span><div className="workflow-info"><span className="workflow-name">Jira</span><span className="workflow-desc">Create 12 tickets</span></div></div>
              <div className="workflow-item"><span className="workflow-icon">💬</span><div className="workflow-info"><span className="workflow-name">Slack</span><span className="workflow-desc">Notify #engineering</span></div></div>
              <div className="workflow-item"><span className="workflow-icon">🐙</span><div className="workflow-info"><span className="workflow-name">GitHub</span><span className="workflow-desc">Create feature branch</span></div></div>
              <div className="workflow-item"><span className="workflow-icon">📚</span><div className="workflow-info"><span className="workflow-name">Confluence</span><span className="workflow-desc">Publish docs</span></div></div>
            </div>
          </div>

          <div className="primary-actions">
            <h4 className="panel-subtitle">Actions</h4>
            <button className="action-btn action-btn--primary"><span>🚀</span> Execute All Workflows<span className="recommended-badge">Recommended</span></button>
            <button className="action-btn"><span>📦</span> Download Package</button>
            <button className="action-btn"><span>📧</span> Send to Engineering</button>
            <button className="action-btn"><span>🔗</span> Copy Package Link</button>
          </div>
        </aside>
      </div>
    </SharedLayout>
  );
};

export default DeveloperHandoff;
