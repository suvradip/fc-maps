/**
 * @description - list out all the file name inside a folder
 */

var fs = require('fs');
var files = fs.readdirSync('./files');
fs.writeFileSync('filename.txt', files.join('\n'));