const fs = require('fs');
const path = require('path');
const marked = require('marked');
const matter = require('gray-matter');

function getPathToRoot(relativePath) {
    // Calculate depth to root based on number of path segments
    const depth = relativePath.split(path.sep).filter(Boolean).length;
    const pathToRoot = depth > 0 ? '../'.repeat(depth) : './';
    console.log(`Path depth: ${depth}, Path to root: ${pathToRoot}`);
    return pathToRoot;
}

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
                // Get relative path excluding 'questions' directory
                const relativePath = path.relative(questionsDir, dir);
                const outputRelativePath = relativePath;
                const currentOutputDir = path.join(outputDir, outputRelativePath);
                
                // Create output directory if it doesn't exist
                if (!fs.existsSync(currentOutputDir)) {
                    console.log(`Creating directory: ${currentOutputDir}`);
                    fs.mkdirSync(currentOutputDir, { recursive: true });
                }

                const content = fs.readFileSync(filepath, 'utf8');
                const { data, content: markdownContent } = matter(content);
                
                // Calculate the relative path from the current file to the root
                const pathToRoot = getPathToRoot(relativeToQuestions);
                
                let html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.topic || 'Medical Question'}</title>
    <link rel="stylesheet" href="/styles/main.css">
    ${data.type === 'ecg-simulation' ? `<link rel="stylesheet" href="/styles/ecg.css">` : ''}
</head>
<body>
    <a href="/index.html" class="back-to-list">← Back to Questions</a>
    <script>
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
    ${marked.parse(markdownContent)}`;

                // For ECG simulations, inject required scripts and containers
                if (data.type === 'ecg-simulation') {
                    html = html.replace('[Interactive ECG display would be here]',
                        `<div class="ecg-container">
                            <div id="ecg-display"></div>
                            <div class="ecg-controls">
                                <button onclick="toggleCalipers()">Toggle Calipers</button>
                                <button onclick="measureInterval()">Measure Interval</button>
                                <button onclick="resetView()">Reset View</button>
                                <button onclick="highlightSegments()">Highlight ST</button>
                            </div>
                            <div class="ecg-measurements">
                                <div>Rate: <span id="rate">--</span> bpm</div>
                                <div>PR: <span id="pr">--</span> ms</div>
                                <div>QRS: <span id="qrs">--</span> ms</div>
                                <div>QT: <span id="qt">--</span> ms</div>
                            </div>
                        </div>
                        <script id="ecg-data" type="application/json">
                            ${JSON.stringify(data.ecgData)}
                        </script>
                        <script src="/scripts/svg-renderer.js"></script>
                        <script src="/scripts/ecg-generator.js"></script>
                        <script>
                            window.addEventListener('load', async () => {
                                try {
                                    const ecgData = JSON.parse(document.getElementById('ecg-data').textContent);
                                    const renderer = new SVGRenderer(document.getElementById('ecg-display'));
                                    await renderer.init('/templates/ecg-grid.svg');
                                    const generator = new ECGGenerator(renderer.svg);
                                    generator.renderFullECG(ecgData);
                                } catch (error) {
                                    console.error('Failed to initialize ECG:', error);
                                }
                            });
                        </script>`
                    );
                }

                html += `\n</body>\n</html>`;

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
