const fs = require('fs');
try {
    const pkg = require('next/package.json');
    fs.writeFileSync('version_output_post_fix.txt', 'Detected Next.js Version: ' + pkg.version);
} catch (e) {
    fs.writeFileSync('version_output_post_fix.txt', 'Error finding next version: ' + e.message);
}
