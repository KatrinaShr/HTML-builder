const fs = require('fs');
const path = require('path');

const pathFile = path.join(__dirname, 'text.txt');
const streamRead = fs.createReadStream(pathFile, 'utf-8');
let data = '';

streamRead.on('data', (chunk) => (data += chunk));
streamRead.on('error', (error) => console.log('Error', error.message));
streamRead.on('end', () => console.log('End', console.log(data)));
