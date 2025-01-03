import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import os from 'os';

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
const outputPath = process.env.NODE_ENV === 'production'
  ? path.join(__dirname, '../dist')
  : path.join(os.tmpdir(), 'internal-med-questions');

// Ensure output directory exists
fs.mkdirSync(outputPath, { recursive: true });

// Generate and write index
const index = indexQuestions(sourceQuestionsDir);
fs.writeFileSync(
  path.join(outputPath, 'questionIndex.json'),
  JSON.stringify(index, null, 2)
);

// Handle development symlink
if (process.env.NODE_ENV !== 'production') {
  const publicLink = path.join(__dirname, '../public');
  if (!fs.existsSync(publicLink)) {
    fs.symlinkSync(outputPath, publicLink, 'junction');
  }
} else {
  // Copy questions to dist in production
  fs.cpSync(sourceQuestionsDir, path.join(outputPath, 'questions'), { recursive: true });
}
