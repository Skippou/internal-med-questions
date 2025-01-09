const fs = require('fs');
const path = require('path');

function verifyStructure() {
    const publicDir = path.join(__dirname, '../public');
    const expectedDirs = ['styles', 'scripts', 'templates'];
    const expectedFiles = {
        styles: ['main.css', 'ecg.css'],
        scripts: ['ecg-generator.js', 'svg-renderer.js'],
        templates: ['ecg-grid.svg']
    };

    console.log('Verifying directory structure...');

    // Check directories
    expectedDirs.forEach(dir => {
        const fullPath = path.join(publicDir, dir);
        if (!fs.existsSync(fullPath)) {
            console.error(`Missing directory: ${dir}`);
            fs.mkdirSync(fullPath, { recursive: true });
            console.log(`Created directory: ${dir}`);
        }

        // Check files in each directory
        expectedFiles[dir]?.forEach(file => {
            const filePath = path.join(fullPath, file);
            if (!fs.existsSync(filePath)) {
                console.error(`Missing file: ${dir}/${file}`);
            }
        });
    });

    console.log('Structure verification complete');
}

verifyStructure();
