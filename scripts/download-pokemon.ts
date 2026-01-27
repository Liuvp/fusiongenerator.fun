
import fs from 'fs';
import path from 'path';
import https from 'https';
import { POKEMON_DATABASE, getPokemonImageUrl } from '../lib/pokemon-data';

const TARGET_DIR = path.join(process.cwd(), 'public', 'images', 'pokemon');

if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
}

async function downloadImage(url: string, filepath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
            } else {
                file.close();
                fs.unlink(filepath, () => { }); // Delete empty file
                reject(`Server responded with ${response.statusCode}: ${url}`);
            }
        }).on('error', (err) => {
            fs.unlink(filepath, () => { }); // Delete empty file
            reject(err.message);
        });
    });
}

async function main() {
    console.log(`Starting download of ${POKEMON_DATABASE.length} images to ${TARGET_DIR}...`);

    let successCount = 0;
    let failCount = 0;

    for (const p of POKEMON_DATABASE) {
        const url = getPokemonImageUrl(p);
        const filename = `${p.id}.png`;
        const filepath = path.join(TARGET_DIR, filename);

        // process.stdout.write(`Downloading ${p.name}... `);

        try {
            await downloadImage(url, filepath);
            // console.log('✅');
            successCount++;
        } catch (err) {
            console.error(`❌ Failed to download ${p.name} (${url}):`, err);
            failCount++;
        }
    }

    console.log(`\nDownload complete! Success: ${successCount}, Failed: ${failCount}`);
}

main();
