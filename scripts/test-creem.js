const https = require('https');
const fs = require('fs');
const { URL } = require('url');

const API_KEY = process.env.CREEM_TEST_API_KEY;
const PRODUCT_ID = process.env.CREEM_TEST_PRODUCT_ID;
const API_URL = process.env.CREEM_TEST_API_URL || 'https://test-api.creem.io/v1';

const logFile = 'scripts/test-output.txt';
fs.writeFileSync(logFile, "Starting Test...\n");

if (!API_KEY || !PRODUCT_ID) {
    throw new Error('Missing CREEM_TEST_API_KEY or CREEM_TEST_PRODUCT_ID');
}

const endpoint = new URL(API_URL.replace(/\/$/, '') + '/checkouts');
const data = JSON.stringify({
    product_id: PRODUCT_ID
});

const options = {
    hostname: endpoint.hostname,
    path: endpoint.pathname,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'Content-Length': data.length
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

req.write(data);
req.end();
