const fs = require('fs');
const path = require('path');
const pathFileFrom = path.join(__dirname, 'files');
const pathFileTo = path.join(__dirname, 'files-copy');

function createDir() {
  fs.mkdir(pathFileTo, (err) => {
    if (err) console.log(err);
    copyFiles();
  });
}

function checkFolderExists() {
  fs.access(pathFileTo, (err) => {
    if (err) {
      createDir();
    } else {
      fs.rm(pathFileTo, { recursive: true }, (err) => {
        if (err) console.log(err);
        createDir();
      });
    }
  });
}
checkFolderExists();

function copyFiles() {
  fs.readdir(pathFileFrom, (err, files) => {
    if (err) console.log(err);

    files.forEach((file) => {
      fs.copyFile(
        `${pathFileFrom}\\${file}`,
        `${pathFileTo}\\${file}`,
        (err) => {
          if (err) console.log(err);
          console.log(`File(s) copied successfully: ${file}`);
        },
      );
    });
  });
}
