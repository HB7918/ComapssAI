import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { 
  InsightSynthesizer, 
  DesignSystemRecommender, 
  HeuristicEvaluationEngine,
  JourneyMapGenerator,
  DeveloperHandoff,
  ChatLanding,
  ChatIntake,
  SSOLanding
} from './mockups';
import './App.css';

function MockupViewer() {
  const navigate = useNavigate();

  const handleNavigate = (screen) => {
    const routes = {
      'insight': '/insight',
      'journey': '/journey',
      'design': '/design',
      'heuristic': '/heuristic',
      'handoff': '/handoff'
    };
    if (routes[screen]) navigate(routes[screen]);
  };

  return (
    <Routes>
      <Route path="/" element={<SSOLanding />} />
      <Route path="/intake" element={<ChatIntake />} />
      <Route path="/chat" element={<ChatLanding onStartProject={() => navigate('/insight')} />} />
      <Route path="/insight" element={<InsightSynthesizer onNavigate={handleNavigate} />} />
      <Route path="/journey" element={<JourneyMapGenerator onNavigate={handleNavigate} />} />
      <Route path="/design" element={<DesignSystemRecommender onNavigate={handleNavigate} />} />
      <Route path="/heuristic" element={<HeuristicEvaluationEngine onNavigate={handleNavigate} />} />
      <Route path="/handoff" element={<DeveloperHandoff onNavigate={handleNavigate} />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <MockupViewer />
      </div>
    </BrowserRouter>
  );
}

export default App;
