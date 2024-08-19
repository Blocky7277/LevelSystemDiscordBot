const fs = require('fs');
const path = require('path');
const getFiles = require("./getFiles.js")

module.exports = function getCommands(dir) {
    const files = getFiles(dir);
    let commands = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if(file.isDirectory()) {
            let subDirCmds = getCommands(dir+"/"+file.name);
            for (let j = 0; j < subDirCmds.length; j++) {
                commands.push(subDirCmds[j])
            }
        }
        else if (file.name.endsWith(".js")) {
            commands.push(dir + "/" + file.name)
        }
    }
    return commands
}