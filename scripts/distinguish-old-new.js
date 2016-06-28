var fs = require('fs-extra'),
    files = fs.readdirSync("spec-sheets-maps/"),
    DIR = "spec-sheets-maps/",
    NEWLocation = "NEW-MAP-HTML/";

files.forEach(function(file){
    
  if(!fs.existsSync("map-html/"+file))
    fs.copySync(DIR+ file, NEWLocation + file);
});