/**
 * @description - creates both md and js files from map-html file
 *
 */

var fs = require('fs'),
    dir_spec = "../kazakhstan/specsheets/",
    dir_html = "../kazakhstan/html/",
    dir_md_out = "../kazakhstan/md/",
    dir_js_out = "../kazakhstan/js/";

var checkDir = function(){
  var _path = arguments;
  if(_path.length === 1) {

      if(!fs.existsSync(_path[0]))
        fs.mkdirSync(_path[0]);

  } else {

    for(var i=0; i<_path.length; i++)
      checkDir(_path[i]);
  }  
};


files = fs.readdirSync(dir_spec);
checkDir(dir_spec, dir_html, dir_md_out, dir_js_out);
files.forEach(function(file){

  var Data = fs.readFileSync(dir_spec + file,'utf-8'),
      mapName = file.match(/(.*)\./i)[1],
      str = '{% embed_spec_map {"source": "'+ mapName +'-map.js", "id": "1"} %}\n\n### List of Entities';
      jsstr = fs.readFileSync(dir_html + mapName + '.html', 'utf-8');
      
  jsstr = jsstr.match(/new FusionCharts\(([\s\S]*?)\)\.render\(\);/)[1];
  Data = Data.toString().replace("### List of Entities", str);
  fs.writeFileSync(dir_md_out + mapName +'.md', Data, 'utf8');
  fs.writeFileSync(dir_js_out + mapName +'-map.js', jsstr, 'utf8');
});

console.log("file write done"); 