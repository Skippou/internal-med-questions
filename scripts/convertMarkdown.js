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
                
                const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.topic || 'Medical Question'}</title>
    <style>
        body { max-width: 800px; margin: 40px auto; padding: 0 20px; font-family: -apple-system, system-ui, sans-serif; }
        pre { overflow-x: auto; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        details { margin: 20px 0; padding: 10px; background: #f5f5f5; border-radius: 4px; }
    </style>
</head>
<body>
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
