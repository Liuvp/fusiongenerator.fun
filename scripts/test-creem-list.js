const https = require('https');
const fs = require('fs');

const API_KEY = 'creem_test_6oc9M0jw3dJcIHYY2EOboi';
const logFile = 'scripts/test-output-2.txt';

fs.writeFileSync(logFile, "Starting List Products Test...\n");

const options = {
    hostname: 'api.creem.io',
    path: '/v1/products',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
    }
};

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (d) => body += d);
    res.on('end', () => {
        const msg = `STATUS: ${res.statusCode}\nBODY: ${body}\n`;
        console.log(msg);
        fs.appendFileSync(logFile, msg);
    });
});

req.on('error', (error) => {
    const msg = `ERROR: ${error.message}\n`;
    console.error(msg);
    fs.appendFileSync(logFile, msg);
});

req.end();
