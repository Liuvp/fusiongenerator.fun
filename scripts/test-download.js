
const fs = require('fs');
const https = require('https');
const path = require('path');

const url = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png';
const dest = path.join(__dirname, '..', 'public', 'images', 'pokemon', 'pikachu-test.png');

console.log('Testing download from:', url);
console.log('Saving to:', dest);

const file = fs.createWriteStream(dest);
https.get(url, function (response) {
    console.log('Response status:', response.statusCode);
    if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', function () {
            file.close(() => console.log('Download finished!'));
        });
    } else {
        console.error('Download failed with status:', response.statusCode);
    }
}).on('error', function (err) {
    fs.unlink(dest, () => { });
    console.error('Network error:', err.message);
});
