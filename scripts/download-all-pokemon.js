
const fs = require('fs');
const https = require('https');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'lib', 'pokemon-data.ts');
const targetDir = path.join(__dirname, '..', 'public', 'images', 'pokemon');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// 1. Read TS file as text
const fileContent = fs.readFileSync(dataPath, 'utf8');

// 2. Extract ID and Number (and optional imageUrl if present) using Regex
// This regex looks for: id: 'pikachu', [anything] number: 25
const regex = /id:\s*'([^']+)'[\s\S]*?number:\s*(\d+)/g;

let match;
const downloads = [];

while ((match = regex.exec(fileContent)) !== null) {
    const id = match[1];
    const number = match[2];
    const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${number}.png`;

    downloads.push({ id, number, url });
}

console.log(`Found ${downloads.length} Pokemon to download.`);

// 3. Download function
function downloadNext(index) {
    if (index >= downloads.length) {
        console.log('All downloads completed!');
        return;
    }

    const item = downloads[index];
    const dest = path.join(targetDir, `${item.id}.png`);

    console.log(`[${index + 1}/${downloads.length}] Downloading ${item.id} from ${item.url}...`);

    const file = fs.createWriteStream(dest);
    https.get(item.url, (response) => {
        if (response.statusCode === 200) {
            response.pipe(file);
            file.on('finish', () => {
                file.close(() => {
                    // console.log(`Saved to ${dest}`);
                    downloadNext(index + 1); // Serial download to be safe
                });
            });
        } else {
            console.error(`Failed to download ${item.id}: Status ${response.statusCode}`);
            file.close();
            fs.unlink(dest, () => { });
            downloadNext(index + 1);
        }
    }).on('error', (err) => {
        console.error(`Error downloading ${item.id}:`, err.message);
        fs.unlink(dest, () => { });
        downloadNext(index + 1);
    });
}

// Start
downloadNext(0);
