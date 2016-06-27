//crawl from dev center map spec sheet page and prepare a html files which render the map

var fs = require('fs');
var page, fcResource ={};
var dir = "../kazakhstan/html/";

fcResource.counter = -1; //initial -1, 


page = require('webpage').create();
// ignoring all console log of the site
page.onConsoleMessage = (function(msg) {
  //console.log("");
});

// ignoring all javascript error of the site
page.onError = (function(msg) {
  //console.log("");
}); 

// ignoring all javascript alert of the page
page.onAlert = (function(msg) {
  //console.log("");
});


function checkDuplicate(currentData)
{ 
  var population = JSON.parse(fs.read("DATA.json"));
  for(var i=0; i<population.length; i++) {
      if(population[i].id === currentData.id && population[i].shortL === currentData.shortL)
      return population[i]; 
  }
  population.push(currentData);
  fs.write("DATA.json", JSON.stringify(population, null, 4));

  return currentData;
}

var readContents = (function(url){

    var data;
    if (page.injectJs("jquery.js")) {

        data = page.evaluate(function() {

          var prep = [];
          $("#map-content table > tbody > tr").each(function() {
            var temp = {}, temp1={};
            $(this).find('td').each(function (key, val) {
              if(key === 0){
                temp.id = $(this).text();
                temp.value = Math.floor((Math.random()*(5000-100) + 100));
              }
              if(key === 1){
                temp.shortL = $(this).text();
              }   
            });
            prep.push(temp);
          });
          return prep;

        });
    } //end of IF
  
             if( data.length > 0 )
             {
              var prepData = [];
              for(var i=0; i<data.length; i++)
              {
                var temp = {}, temp1={};
                data[i] = checkDuplicate(data[i]);
                temp.id = data[i].id;
                temp.value = data[i].value;
                prepData.push(temp);               
              }  
              var detailsContent  = JSON.stringify(prepData);
              var mapName = url.match(/(.*spec-sheets\/)(.*)\./)[2];
              var mapTemplate = fs.read("map-template.txt");
              mapTemplate = mapTemplate.replace("###mapName###", mapName);
              mapTemplate = mapTemplate.replace("###data###", detailsContent);
              fs.write(dir + mapName + ".html", mapTemplate);

              console.log("saved at "+ dir + mapName + ".html");
              console.log("****** File write done ******");
              console.log("");

              opensublink();

            }else {
             fcResource.counter -= 1;
             opensublink();             
          }    
    });



var opensublink = (function() {
   
    fcResource.counter += 1;
    if (fcResource.counter >= fcResource.url.length) {
        phantom.exit();
    }
    console.log("** Openning --> "+ (fcResource.counter + 1) +" link " + fcResource.url[fcResource.counter] + " **");
    

    page.open(fcResource.url[fcResource.counter], function(status) {
        if (status == 'success') {
           setTimeout(function() {
               readContents(fcResource.url[fcResource.counter]);
            }, 3000);      
            
        } else {
            fcResource.counter -= 1;
            console.log("****** Link cannot be opened **");

            setTimeout(function() {
                opensublink();
            }, 10000);      
        }

    });    
});


(function(){
fcResource.url = JSON.parse(fs.read("maps-links.json"));
opensublink();
})();


