const https = require('https');
const fs = require('fs');
const { URL } = require('url');

const API_KEY = process.env.CREEM_TEST_API_KEY;
const API_URL = process.env.CREEM_TEST_API_URL || 'https://test-api.creem.io/v1';
const logFile = 'scripts/test-output-2.txt';

fs.writeFileSync(logFile, "Starting List Products Test...\n");

if (!API_KEY) {
    throw new Error('Missing CREEM_TEST_API_KEY');
}

const endpoint = new URL(API_URL.replace(/\/$/, '') + '/products');
const options = {
    hostname: endpoint.hostname,
    path: endpoint.pathname,
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
