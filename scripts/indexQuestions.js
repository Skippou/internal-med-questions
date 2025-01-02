const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

function indexQuestions(questionsDir) {
    const questions = [];
    const walkSync = (dir) => {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filepath = path.join(dir, file);
            if (fs.statSync(filepath).isDirectory()) {
                walkSync(filepath);
            } else if (path.extname(file) === '.md') {
                const content = fs.readFileSync(filepath, 'utf8');
                const { data, content: markdownContent } = matter(content);
                if (data.specialty) {
                    // Get the first non-empty line after frontmatter that starts with #
                    const title = markdownContent
                        .split('\n')
                        .find(line => line.trim().startsWith('# '))
                        ?.replace('# ', '')
                        ?.trim() || 'Untitled Question';
                        
                    const relativePath = filepath
                        .split(/[\/\\]questions[\/\\]/)[1]
                        .replace(/\\/g, '/')
                        .replace('.md', '.html');
                        
                    questions.push({
                        filepath: `questions/${relativePath}`,
                        specialty: data.specialty,
                        topic: data.topic,
                        difficulty: data.difficulty,
                        id: data.id,
                        title: title
                    });
                }
            }
        });
    };

    walkSync(questionsDir);
    return questions.sort((a, b) => a.specialty.localeCompare(b.specialty));
}

const questionsDir = path.join(__dirname, '../questions');
const index = indexQuestions(questionsDir);
fs.writeFileSync(
    path.join(__dirname, '../public/questionIndex.json'),
    JSON.stringify(index, null, 2)
);
