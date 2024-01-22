const fs = require('fs');
const path = require('path');
const pathSecretFolder = path.join(__dirname, 'secret-folder');

fs.readdir(pathSecretFolder, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  console.log('\nCurrent directory files:');
  files.forEach((file) => {
    let fileExtension = path.extname(path.join(file.path, file.name));
    let fileName = path.basename(file.name, fileExtension);
    let fileDescription = [];

    let currentFile = path.join(file.path, file.name);

    fs.stat(currentFile, (error, stats) => {
      if (error) {
        console.log(error);
      } else {
        if (stats.isFile()) {
          fileDescription.push(
            fileName,
            fileExtension.slice(1),
            stats.size + ' byte(s)',
          );
          console.log(fileDescription.join(' - '));
        }
      }
    });
  });
});
