const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

let originalPath = path.join(__dirname, 'files');
let targetPath = path.join(__dirname, 'files-copy');

async function deleteFolder(target) {
  try {
    await fsPromises.rm(target, { recursive: true });
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('Error:', error.message);
    }
  }
}

async function createFolder(target) {
  try {
    await fsPromises.mkdir(target, { recursive: true });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function getFiles(target) {
  try {
    return await fsPromises.readdir(target);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function copyDirectory(originalPath, targetPath) {
  try {
    await deleteFolder(targetPath);
    await createFolder(targetPath);
    let files = await getFiles(originalPath);

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(originalPath, file);
        const fileCopyPath = path.join(targetPath, file);
        const stat = await fsPromises.stat(filePath);

        if (stat.isDirectory()) {
          await copyDirectory(filePath, fileCopyPath);
        } else {
          await fsPromises.copyFile(filePath, fileCopyPath);
        }
      }),
    );
  } catch (error) {
    console.error('Error:', error.message);
  }
}

copyDirectory(originalPath, targetPath);
