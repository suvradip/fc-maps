var fs,
	PARENT_Dir,
	DIR_Html,
	DIR_Spec,
	DIR_Md,
	DIR_Jd,
	JSLib,
	files,
	template,
	checkDir,
	genData,
	path;

fs = require("fs");
path = require("path");
/**
 * @description - varibale defination
 * PARENT_dir - location of root dir.
 * DIR_Html - location of html files.
 * DIR_Md - location of markdown files.
 * DIR_JS - location of JS files that required to render the map.
 * JSLib - in html files, location of FC lib.
 */
console.log(__dirname);
console.log(path.resolve(__dirname, '..', 'vendor'));
PARENT_Dir = path.resolve(__dirname, '..', 'vendor');
DIR_Spec = PARENT_Dir + "/spec-sheets/";
DIR_Html = PARENT_Dir + "/html/";
DIR_Md = PARENT_Dir + "/md/";
DIR_Js = PARENT_Dir + "/js/";
JSLib = path.resolve(__dirname, '..', 'fusioncharts', 'fusioncharts.js');

/**
 * @description - checks the directory location, if
 *              the directory doesn't exit then it creates that
 *              directory in that same.
 */
checkDir = function(){
  var _path = arguments;
  if(_path.length === 1) {

    if(!fs.existsSync(_path[0]))
      fs.mkdirSync(_path[0]);

  } else {

    for(var i=0; i<_path.length; i++)
      checkDir(_path[i]);
  }
};

/**
 * @description - generates the data that required to render the chart.
 */
genData = function(ids){
	var dataSet,
		temp;
	dataSet = [];
	for(var i=0; i<ids.length; i++) {
		temp = {};
		temp.id = ids[i];
		temp.value = Math.floor((Math.random()*(4560-100) + 100));
		dataSet.push(temp);
	}

	return JSON.stringify(dataSet);
};

//loads all the files name @files named variable as Array
files = fs.readdirSync(DIR_Spec);
//filte hidden files
files = files.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));

//count of total files
console.log("+ Total files : "+ files.length);
//template loaded @template variable {for devcenter}
template = fs.readFileSync(path.resolve(__dirname, 'template/html.txt'), "utf-8");
/**
 * template loaded @template variable {this template used to test render map}
 */
//template = fs.readFileSync(path.resolve(__dirname, 'template/render-test.txt'), "utf-8");

//check the directories or create it
checkDir(DIR_Html, DIR_Md, DIR_Js);
console.log("+ Running...");
files.forEach(function(file){

	var copyTemplate,
		contents,
		data,
		mapName,
		str,
		jsstr;

	contents = fs.readFileSync(DIR_Spec + file, "utf-8");
	data = contents.match(/---\|---\|---\|?-?-?-?\n?([\S\s]*)\n?$/i)[1].trim();
	data = data.split("\n").map(function(ele){
		return ele.split("|")[0];
	});

	copyTemplate = template;
	mapName = file.split(".")[0].toLowerCase();

	copyTemplate = copyTemplate.replace("###JSLib###", JSLib);
    copyTemplate = copyTemplate.replace("###mapName###", mapName);
    copyTemplate = copyTemplate.replace("###data###", genData(data));

    fs.writeFileSync(DIR_Html + mapName + '.html', copyTemplate, "utf-8");

	str = '{% embed_spec_map {"source": "'+ mapName +'-map.js", "id": "1"} %}\n\n### List of Entities';
	jsstr = fs.readFileSync(DIR_Html + mapName + '.html', 'utf-8');

	jsstr = jsstr.match(/new FusionCharts\(([\s\S]*?)\)\.render\(\);/)[1];
	contents = contents.toString().replace("### List of Entities", str);
	fs.writeFileSync(DIR_Md + mapName +'.md', contents, 'utf-8');
	fs.writeFileSync(DIR_Js + mapName +'-map.js', jsstr, 'utf-8');
});

console.log("+ Operation finished.");
