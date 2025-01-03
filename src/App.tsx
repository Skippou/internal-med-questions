import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QuestionList from './components/QuestionList';
import QuestionView from './components/QuestionView';

export default function App() {
  const isGitHubPages = location.hostname.includes('github.io');
  const basePath = isGitHubPages ? '/internal-med-questions' : '';

  return (
    <Router basename={basePath}>
      <Routes>
        <Route path="/" element={<QuestionList />} />
        <Route path="/questions/*" element={<QuestionView />} />
      </Routes>
    </Router>
  );
}
