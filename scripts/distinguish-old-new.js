
var fs = require('fs-extra');
var files = fs.readdirSync("spec-sheets-maps/");


    files.forEach(function(file){
        
        if(!fs.existsSync("map-html/"+file)){
          fs.copySync("spec-sheets-maps/"+ file, "NEW-MAP-HTML/"+file);
        }
		
    });