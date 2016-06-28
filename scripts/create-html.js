/**
 * @description - crawl from dev center map spec sheet page and prepare a html files which render the map
 * @how to run - phantomjs crate-html.js
 *  and one more thing, to run this script you need to update `map-links.json` file, if required.
 * this file content the links and this link will be crawl.
 * @dependencies - phantomjs
 */

var fs = require('fs'),
    PAGE, fcResource ={},
    //output folder  location
    DIR = "../totalmaps/html/", 
    //fusionChrats lib. location
    JSLib = "fusioncharts/fusioncharts.js";

fcResource.counter = 201; //initial -1, 
PAGE = require('webpage').create();

// ignoring all the console log of the site
PAGE.onConsoleMessage = (function(msg) {
  //console.log("");
});

// ignoring all the javascript error of the site
PAGE.onError = (function(msg) {
  //console.log("");
}); 

// ignoring all the javascript alert of the site
PAGE.onAlert = (function(msg) {
  //console.log("");
});

/**
 * @description - check map data with previously stored data.
 *  is this step is not required then we can omit it
 */
var checkDuplicate = function (currentData) { 
  var population = JSON.parse(fs.read("DATA.json"));
  for(var i=0; i<population.length; i++) {
      if(population[i].id === currentData.id && population[i].shortL === currentData.shortL)
      return population[i]; 
  }
  population.push(currentData);
  fs.write("DATA.json", JSON.stringify(population, null, 4));

  return currentData;
};

var readContents = (function(url) {

  var data;
  if (PAGE.injectJs("jquery.js")) {
    data = PAGE.evaluate(function() {
      var prep = [];
      $("#map-content table > tbody > tr").each(function() {
        var temp = {}, temp1={};
        $(this).find('td').each(function (key, val) {
          if(key === 0) {
            temp.id = $(this).text();
            temp.value = Math.floor((Math.random()*(4560-100) + 100));
          }
          if(key === 1) {
            temp.shortL = $(this).text();
          }   
        });
        prep.push(temp);
      });
      return prep;
    });
  } //end of IF
  
  if( data.length > 0 ) {

    var prepData = [];
    for(var i=0; i<data.length; i++) {

      var temp = {}, temp1={};
      //data[i] = checkDuplicate(data[i]);
      temp.id = data[i].id;
      temp.value = data[i].value;
      prepData.push(temp);               
    }

    //htm file generation
    var detailsContent  = JSON.stringify(prepData),
        mapName = url.match(/(.*spec-sheets\/)(.*)\./)[2],
        mapTemplate = fs.read("template/map-html-template.txt");

    mapTemplate = mapTemplate.replace("###JSLib###", JSLib);    
    mapTemplate = mapTemplate.replace("###mapName###", mapName);
    mapTemplate = mapTemplate.replace("###data###", detailsContent);
    
    fs.write(DIR + mapName + ".html", mapTemplate);
    console.log("saved at "+ DIR + mapName + ".html");
    console.log("****** File write done ******");
    console.log("");
    openThisLink();

  } else {

    fcResource.counter -= 1;
    openThisLink();             
  }    
});

var openThisLink = (function() {
   
  fcResource.counter += 1;
  if (fcResource.counter >= fcResource.url.length) {
    phantom.exit();
  }
  console.log("** Openning --> "+ (fcResource.counter + 1) +" link " + fcResource.url[fcResource.counter] + " **");
  
  PAGE.open(fcResource.url[fcResource.counter], function(status) {
      if (status == 'success') {
         setTimeout(function() {
             readContents(fcResource.url[fcResource.counter]);
          }, 3000);      
          
      } else {
          fcResource.counter -= 1;
          console.log("****** Link cannot be opened **");

          setTimeout(function() {
              openThisLink();
          }, 10000);      
      }
  });    
});

(function(){
  fcResource.url = JSON.parse(fs.read("map-links.json"));
  openThisLink();
})();


