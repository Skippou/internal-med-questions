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
                try {
                    const content = fs.readFileSync(filepath, 'utf8');
                    const { data, content: markdownContent } = matter(content);
                    
                    // Verify required fields exist
                    if (data.specialty && data.topic && data.difficulty) {
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
                            filepath: relativePath,  // Remove 'questions/' prefix
                            specialty: data.specialty,
                            topic: data.topic,
                            difficulty: data.difficulty,
                            id: data.id || `Q${questions.length + 1}`,
                            title: title,
                            type: data.type || 'regular', // Default to 'regular' if not specified
                            tags: data.tags || []
                        });
                    } else {
                        console.warn(`Warning: Missing required fields in ${filepath}`);
                    }
                } catch (error) {
                    console.error(`Error processing file ${filepath}:`, error);
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
