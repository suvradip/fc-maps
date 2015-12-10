
var fs = require('fs');
var files = fs.readdirSync("map-html/");


    files.forEach(function(file){
        
        var Data = fs.readFileSync("map-html/"+file,'utf-8');
        var mapName = file.match(/(.*)\./i)[1];
       	Data = Data.match(/<script>[\s\S]*<\/script>/gi);
     
        var md_FileData = fs.readFileSync("map-md-template.txt",'utf-8'); 
            md_FileData = md_FileData.toString().replace("###DATA###", Data);  

        var mapMdFile = fs.readFileSync("maps/spec-sheets/" + mapName + ".md", 'utf-8');
            mapMdFile = mapMdFile.toString().replace("### List of Entities", md_FileData);

           fs.writeFileSync('ready-spec-sheets/'+ mapName +'.md', mapMdFile, 'utf8'); 
      		
    });