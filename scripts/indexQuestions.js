import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function extractTitle(content) {
  return content
    .split('\n')
    .find(line => line.trim().startsWith('# '))
    ?.replace('# ', '')
    ?.trim() || 'Untitled Question';
}

function indexQuestions(questionsDir) {
  const questions = [];
  
  const walkSync = (dir) => {
    fs.readdirSync(dir).forEach(file => {
      const filepath = path.join(dir, file);
      if (fs.statSync(filepath).isDirectory()) {
        walkSync(filepath);
        return;
      }
      
      if (path.extname(file) !== '.md') return;
      
      const { data, content } = matter(fs.readFileSync(filepath, 'utf8'));
      if (!data.specialty) return;
      
      const relativePath = filepath
        .split(/[\/\\]questions[\/\\]/)[1]
        .replace(/\\/g, '/');
        
      questions.push({
        filepath: `questions/${relativePath}`,
        specialty: data.specialty,
        difficulty: data.difficulty,
        title: extractTitle(content)
      });
    });
  };

  walkSync(questionsDir);
  return questions.sort((a, b) => a.specialty.localeCompare(b.specialty));
}

// Setup paths
const sourceQuestionsDir = path.join(__dirname, '../questions');
const distDir = path.join(__dirname, '../dist');
const distQuestionsDir = path.join(distDir, 'questions');

// Ensure dist directory exists
fs.mkdirSync(distDir, { recursive: true });
fs.mkdirSync(distQuestionsDir, { recursive: true });

// Copy all questions to dist
fs.cpSync(sourceQuestionsDir, distQuestionsDir, { 
  recursive: true,
  force: true 
});

// Generate and write index
const index = indexQuestions(sourceQuestionsDir);
fs.writeFileSync(
  path.join(distDir, 'questionIndex.json'),
  JSON.stringify(index, null, 2)
);
