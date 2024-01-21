const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const pathFile = path.join(__dirname, 'text.txt');

const writeableStream = fs.createWriteStream(pathFile);

stdout.write('Hello!\nPlease input a text: ');
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  } else if (writeableStream) {
    stdout.write('Please input a text: ');
    writeableStream.write(`${data}\n`);
  }
});

process.on('error', (error) => stdout.write(error));
process.on('SIGINT', function () {
  process.exit();
});
process.on('exit', () => console.log('\nGood luck learning Node.js!'));
