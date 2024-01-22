const fs = require('fs');
const path = require('path');
const promises = require('fs/promises');
const pathProjectDist = path.join(__dirname, 'project-dist');
const pathStyleCss = path.join(__dirname, 'project-dist', 'style.css');
const pathIndexHtml = path.join(__dirname, 'project-dist', 'index.html');
const pathAssetsDir = path.join(__dirname, 'project-dist', 'assets');

// create dir and files
function checkFolderExists(pathFile) {
  fs.access(pathFile, (err) => {
    if (err) {
      createDir(pathFile);
    } else {
      fs.rm(pathFile, { recursive: true }, (err) => {
        if (err) console.log(err);
        createDir(pathFile);
      });
    }
  });
}
checkFolderExists(pathProjectDist);

function createDir(pathFile) {
  fs.mkdir(pathFile, (err) => {
    if (err) console.log(err);
    else if (path.basename(pathFile) === 'project-dist') {
      checkFileExists(pathStyleCss);
      checkFileExists(pathIndexHtml);
      checkFolderExists(pathAssetsDir);
    }
    // console.log(`Folder ${path.basename(pathFile)} created`);
  });

  if (path.basename(pathFile) === 'assets') {
    copyFiles(path.join(__dirname, 'assets'), pathAssetsDir);
  }
}

function checkFileExists(pathFile) {
  fs.access(pathFile, (err) => {
    if (err) {
      createFile(pathFile);
    } else {
      fs.unlink(pathFile, function (err) {
        if (err) console.log(err);
        createFile(pathFile);
      });
    }
  });
}

function createFile(pathFile) {
  fs.writeFile(pathFile, '', function (err) {
    if (err) {
      console.log(err);
    }
    // console.log(`File ${path.basename(pathFile)} created`);
  });
  if (path.basename(pathFile) === 'index.html') {
    buildHtml();
  }
  if (path.basename(pathFile) === 'style.css') {
    buildStyles();
  }
}

function copyFiles(pathFileFrom, pathFileTo) {
  fs.readdir(pathFileFrom, (err, files) => {
    if (err) console.log(err);

    files.forEach((file) => {
      fs.stat(path.join(pathFileFrom, file), (err, fileStatus) => {
        if (err) console.log(err);
        else if (fileStatus.isDirectory()) {
          checkFolderExists(path.join(pathFileTo, file));
          copyFiles(path.join(pathFileFrom, file), path.join(pathFileTo, file));
        } else if (fileStatus.isFile()) {
          fs.copyFile(
            path.join(pathFileFrom, file),
            path.join(pathFileTo, file),
            (err) => {
              if (err) console.log(err);
            },
          );
        }
      });
    });
  });
}

function buildStyles() {
  let arrCss = [];
  const writeStream = fs.createWriteStream(pathStyleCss);
  const pathStyleFrom = path.join(__dirname, 'styles');

  fs.readdir(pathStyleFrom, { withFileTypes: true }, (err, files) => {
    if (err) console.log(err);
    else {
      files
        .filter(
          (file) =>
            file.isFile() === true &&
            path.extname(path.join(pathStyleFrom, file.name)) === '.css',
        )
        .forEach((file) => arrCss.push(file.name));

      arrCss.forEach((style) => {
        const pathStyle = path.join(pathStyleFrom, style);
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

async function buildHtml() {
  const pathHtmlFrom = path.join(__dirname, 'template.html');
  const readStreamHtml = fs.createReadStream(pathHtmlFrom, 'utf-8');
  let htmlComponents = await promises.readdir(
    path.join(__dirname, 'components'),
  );

  try {
    let resultHtml = '';

    readStreamHtml.on('data', (data) => {
      resultHtml = resultHtml + data;
    });

    readStreamHtml.on('end', () => {
      htmlComponents.forEach((file) => {
        if (path.extname(file) === '.html') {
          const htmlComponentName = file.slice(0, file.length - 5);

          if (resultHtml.includes(htmlComponentName)) {
            const readStreamHtml = fs.createReadStream(
              path.join(__dirname, 'components', file),
              'utf-8',
            );
            let currentString = '';

            readStreamHtml.on('data', (data) => {
              currentString = currentString + data;
            });

            readStreamHtml.on('end', () => {
              resultHtml = resultHtml.replace(
                `{{${htmlComponentName}}}`,
                currentString,
              );
              promises.writeFile(pathIndexHtml, resultHtml, 'utf-8');
            });
          }
        }
      });
    });
  } catch (err) {
    console.log(err);
  }
}
