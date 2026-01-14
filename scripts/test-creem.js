const https = require('https');
const fs = require('fs');

const API_KEY = 'creem_test_f76IwcwVBXBqKdThUruEY';
const PRODUCT_ID = 'prod_38TAuMDtTBnEvNarzoEIdJ';

const logFile = 'scripts/test-output.txt';
fs.writeFileSync(logFile, "Starting Test...\n");

const data = JSON.stringify({
    product_id: PRODUCT_ID
});

const options = {
    hostname: 'api.creem.io',
    path: '/v1/checkouts',
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
