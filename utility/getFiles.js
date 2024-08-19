const fs = require('fs');
const path = require('path');

/**
 * 
 * @param {String} dir 
 * @returns {fs.Dirent}
 */
module.exports = function getFiles(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    // return files;
    return files
}