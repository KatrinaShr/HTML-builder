const fs = require('fs');
const path = require('path');
const pathStyles = path.join(__dirname, 'styles');
const pathBundle = path.join(__dirname, 'project-dist', 'bundle.css');

function checkFileExists() {
  fs.access(pathBundle, (err) => {
    if (err) {
      createFileBundle();
    } else {
      fs.unlink(pathBundle, function (err) {
        if (err) console.log(err);
        createFileBundle();
      });
    }
  });
}
checkFileExists();

function createFileBundle() {
  fs.writeFile(pathBundle, '', function (err) {
    if (err) {
      console.log(err);
    }
    console.log('File bundle created');
    mergeStyles();
  });
}

function mergeStyles() {
  let arrCss = [];
  const writeStream = fs.createWriteStream(pathBundle);
  // get files css
  fs.readdir(pathStyles, { withFileTypes: true }, (err, files) => {
    if (err) console.log(err);
    else {
      files
        .filter(
          (file) =>
            file.isFile() === true &&
            path.extname(`${pathStyles}\\${file.name}`) === '.css',
        )
        .forEach((file) => arrCss.push(file.name));
      arrCss.forEach((style) => {
        const pathStyle = path.join(pathStyles, style);
        const readStream = fs.createReadStream(pathStyle);
        const handleError = () => {
          console.log('Error');
          readStream.destroy();
          writeStream.end('Finished with error...');
        };

        readStream
          .on('error', handleError)
          .pipe(writeStream)
          .on('error', handleError);
      });
    }
  });
}
