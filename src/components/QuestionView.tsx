import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { marked } from 'marked';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/localStorage';
import { parseMetadata } from '../utils/metadataParser';

export default function QuestionView() {
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isGitHubPages = window.location.hostname.includes('github.io');
    const basePath = isGitHubPages ? '/internal-med-questions' : '';
    
    // Fix path handling
    const filepath = location.pathname
      .replace(/^\/questions\//, '')  // Remove initial /questions/
      .replace(/^questions\//, '')    // Remove duplicate questions/ if present
      .replace('/internal-med-questions/', '')
      .replace('.html', '.md');

    console.log('Fetching from:', `${basePath}/questions/${filepath}`);
    
    fetch(`${basePath}/questions/${filepath}`)
      .then(res => res.text())
      .then(text => {
        const { metadata, content } = parseMetadata(text);
        const formattedContent = marked.parse(content);
        
        const metadataHtml = `<div class="metadata-header"><p>id: ${metadata.id}
specialty: ${metadata.specialty}
topic: ${metadata.topic}
difficulty: ${metadata.difficulty}
tags: [${metadata.tags?.join(', ') || ''}]${metadata.created ? `
created: ${metadata.created}` : ''}${metadata.lastUpdated ? `
lastUpdated: ${metadata.lastUpdated}` : ''}</p></div>`;

        setContent(metadataHtml + formattedContent);
        
        const questionPath = filepath;
        const viewedQuestions = getFromLocalStorage<string[]>('viewedQuestions', []);
        if (!viewedQuestions.includes(questionPath)) {
          saveToLocalStorage('viewedQuestions', [...viewedQuestions, questionPath]);
        }
      })
      .catch(error => {
        console.error('Error loading question:', error);
        setContent(`<p>Error loading question: ${error.message}</p>`);
      });
  }, [location]);

  const handleBack = () => {
    const lastState = sessionStorage.getItem('lastFilterState');
    const isGitHubPages = window.location.hostname.includes('github.io');
    const basePath = isGitHubPages ? '/internal-med-questions' : '';
    
    if (lastState && lastState.startsWith('?')) {
      // If lastState is just search params, navigate to root with those params
      navigate(`${basePath}/${lastState}`);
    } else if (lastState) {
      // If lastState includes a path and search params
      navigate(`${basePath}${lastState}`);
    } else {
      // Fallback to root
      navigate(`${basePath}/`);
    }
  };

  return (
    <div className="question-view">
      <button onClick={handleBack} className="back-to-list">← Back to Questions</button>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
