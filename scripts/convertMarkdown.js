const fs = require('fs');
const path = require('path');
const marked = require('marked');
const matter = require('gray-matter');

function convertMarkdownFiles(questionsDir, outputDir) {
    console.log(`Converting markdown files from ${questionsDir} to ${outputDir}`);
    
    const walkSync = (dir) => {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filepath = path.join(dir, file);
            const stat = fs.statSync(filepath);
            
            // Calculate relative path maintaining directory structure
            const relativeToQuestions = path.relative(questionsDir, dir);
            const currentOutputDir = path.join(outputDir, relativeToQuestions);
            
            if (stat.isDirectory()) {
                console.log(`Creating directory: ${currentOutputDir}`);
                fs.mkdirSync(currentOutputDir, { recursive: true });
                walkSync(filepath);
            } else if (path.extname(file) === '.md') {
                // Create output directory if it doesn't exist
                if (!fs.existsSync(currentOutputDir)) {
                    console.log(`Creating directory: ${currentOutputDir}`);
                    fs.mkdirSync(currentOutputDir, { recursive: true });
                }

                const content = fs.readFileSync(filepath, 'utf8');
                const { data, content: markdownContent } = matter(content);
                
                // Calculate path to root based on current file depth
                const pathToRoot = '../'.repeat(relativeToQuestions.split('/').length + 1);
                
                const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.topic || 'Medical Question'}</title>
    <script>
        // Path utilities for consistent local and GitHub Pages handling
        const pathUtils = {
            isGitHubPages: location.hostname.includes('github.io'),
            
            getBasePath() {
                return this.isGitHubPages ? '/internal-med-questions' : '';
            },

            getStylePath() {
                return \`\${this.getBasePath()}/styles/main.css\`;
            },

            getIndexPath() {
                return \`\${this.getBasePath()}/index.html\`;
            },

            // Preserve URL parameters when navigating back
            getBackUrl() {
                const params = new URLSearchParams(window.location.search);
                const indexPath = this.getIndexPath();
                return params.toString() ? \`\${indexPath}?\${params.toString()}\` : indexPath;
            }
        };

        // Add stylesheet
        document.write('<link rel="stylesheet" href="' + pathUtils.getStylePath() + '">');
    </script>
</head>
<body>
    <script>
        // Dynamic back button with preserved filters
        const backButton = document.createElement('a');
        backButton.href = pathUtils.getBackUrl();
        backButton.className = 'back-to-list';
        backButton.textContent = '← Back to Questions';
        document.body.insertBefore(backButton, document.body.firstChild);

        function saveToLocalStorage(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                console.log('Saved to localStorage:', key, value);
                return true;
            } catch (e) {
                console.error('Failed to save to localStorage:', e);
                return false;
            }
        }

        function getFromLocalStorage(key, defaultValue = []) {
            try {
                const value = localStorage.getItem(key);
                console.log('Read from localStorage:', key, value);
                return value ? JSON.parse(value) : defaultValue;
            } catch (e) {
                console.error('Failed to read from localStorage:', e);
                return defaultValue;
            }
        }

        // Normalize path for tracking
        const isGitHubPages = location.hostname.includes('github.io');
        const fullPath = location.pathname;
        const questionPath = fullPath
            .replace('/internal-med-questions/', '/')  // Remove repo name if on GitHub Pages
            .split('/')
            .filter(Boolean)  // Remove empty segments
            .join('/');      // Reconstruct path
        
        console.log('Current path:', questionPath);
        
        // Store normalized path
        const storageKey = 'viewedQuestions';
        const viewedQuestions = getFromLocalStorage(storageKey);
        
        if (!viewedQuestions.includes(questionPath)) {
            viewedQuestions.push(questionPath);
            if (saveToLocalStorage(storageKey, viewedQuestions)) {
                console.log('Successfully marked as viewed:', questionPath);
            }
        }
    </script>
    ${marked.parse(markdownContent)}
</body>
</html>`;

                const outputPath = path.join(currentOutputDir, file.replace('.md', '.html'));
                console.log(`Writing file: ${outputPath}`);
                fs.writeFileSync(outputPath, html);
            }
        });
    };

    // Ensure base output directory exists
    if (!fs.existsSync(outputDir)) {
        console.log(`Creating base output directory: ${outputDir}`);
        fs.mkdirSync(outputDir, { recursive: true });
    }

    walkSync(questionsDir);
}

module.exports = convertMarkdownFiles;
