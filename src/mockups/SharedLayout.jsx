import React from 'react';

const SharedLayout = ({ children, currentPhase, currentScreen, progress, milestone, onNavigate }) => {
  const navItems = [
    { icon: '🎯', label: 'Project Brief', status: 'complete', phase: 1, screen: 'brief', clickable: false },
    { icon: '📋', label: 'Research Planning', status: 'complete', phase: 1, screen: 'planning', clickable: false },
    { icon: '🎤', label: 'Research Execution', status: 'complete', phase: 1, screen: 'execution', clickable: false },
    { icon: '💡', label: 'Insight Synthesizer', status: currentScreen === 'insight' ? 'active' : (currentPhase > 1 ? 'complete' : 'pending'), phase: 1, screen: 'insight', clickable: true },
    { icon: '🗺️', label: 'Journey Mapping', status: currentScreen === 'journey' ? 'active' : (currentPhase > 1 ? 'complete' : 'pending'), phase: 1, screen: 'journey', clickable: true },
    { icon: '✏️', label: 'Ideation', status: currentPhase >= 2 ? 'complete' : 'locked', phase: 2, screen: 'ideation', clickable: false },
    { icon: '🎨', label: 'Design & Iterate', status: currentScreen === 'design' ? 'active' : (currentPhase > 2 ? 'complete' : currentPhase === 2 ? 'pending' : 'locked'), phase: 2, screen: 'design', clickable: true },
    { icon: '🔍', label: 'Heuristic Evaluation', status: currentScreen === 'heuristic' ? 'active' : (currentPhase > 2 ? 'complete' : currentPhase === 2 ? 'pending' : 'locked'), phase: 2, screen: 'heuristic', clickable: true },
    { icon: '🧪', label: 'Usability Testing', status: currentPhase >= 3 ? 'complete' : 'locked', phase: 3, screen: 'testing', clickable: false },
    { icon: '🚀', label: 'Concept to Code', status: currentScreen === 'handoff' ? 'active' : (currentPhase === 4 ? 'pending' : 'locked'), phase: 4, screen: 'handoff', clickable: true }
  ];

  const phases = [
    { id: 1, name: 'Discover + Define', color: '#0073bb' },
    { id: 2, name: 'Design + Iterate', color: '#9c27b0' },
    { id: 3, name: 'Test + Validate', color: '#ff5722' },
    { id: 4, name: 'Deliver', color: '#2e7d32' }
  ];

  const currentPhaseInfo = phases.find(p => p.id === currentPhase);

  return (
    <div className="mockup-container shared-layout">
      {/* Header */}
      <header className="mockup-header">
        <div className="header-left">
          <h1 className="app-title">Compass AI</h1>
          <div className="phase-indicator">
            <span 
              className="phase-badge" 
              style={{ backgroundColor: currentPhaseInfo?.color }}
            >
              Phase {currentPhase}: {currentPhaseInfo?.name}
            </span>
            <span className="milestone">Milestone: {milestone}</span>
          </div>
        </div>
        <div className="header-right">
          <div className="progress-container">
            <span className="progress-label">Progress: {progress}%</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
      </header>

      <div className="mockup-body with-workflow-nav">
        {/* Left Sidebar - Workflow Navigation */}
        <aside className="sidebar-left workflow-sidebar">
          <h3 className="sidebar-title">Workflow</h3>
          <nav className="workflow-nav">
            {phases.map((phase) => (
              <div key={phase.id} className="phase-group">
                <div 
                  className={`phase-header ${currentPhase === phase.id ? 'phase-header--active' : ''}`}
                  style={{ borderLeftColor: phase.color }}
                >
                  <span className="phase-name">Phase {phase.id}</span>
                  <span className="phase-label">{phase.name}</span>
                </div>
                <div className="phase-items">
                  {navItems.filter(item => item.phase === phase.id).map((item, index) => (
                    <div 
                      key={index} 
                      className={`nav-item nav-item--${item.status} ${item.clickable ? 'nav-item--clickable' : ''}`}
                      onClick={() => item.clickable && onNavigate && onNavigate(item.screen)}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      <span className="nav-label">{item.label}</span>
                      <span className="nav-status">
                        {item.status === 'complete' && '✓'}
                        {item.status === 'active' && '●'}
                        {item.status === 'pending' && '○'}
                        {item.status === 'locked' && '🔒'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="main-area">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SharedLayout;
