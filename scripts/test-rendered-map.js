/**
 * @description - To check whethe the map is rendered or not, each html file has a map.
 * @how to run - phantomjs test-render.js
 *  and one more thing, to run this script you need to update `map-links.json` file, if required.
 * this file content the links and this link will be crawl.
 * @dependencies - phantomjs
 */

var fs = require('fs'),
    PAGE, fcResource ={},
    //output folder location
    DIR = "../kazakhstan/",
    DIR_LOG_FILE = "../kazakhstan/log/log.csv",
    DIR_HTMLFILES = "../kazakhstan/html/";

fcResource.counter = -1; //initial -1, 
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

var getTime = function(){
  var dateTime = new Date();
  dateTime = dateTime.toDateString() + ", " + dateTime.toLocaleTimeString(); 
  return dateTime;
};

var writeLog = function (msg) {
  var header = "Data, Time, Links, Status, File name",
      newline = "\n",
      str,
      fileName;
 
  fileName = msg.link.split("/").pop().split(".")[0];    
  if(!fs.exists(msg.path)) {
    str = header;
    str += newline; 
    str += getTime() +","+ msg.link + "," + msg.status + "," + fileName;
  } else {
    str = newline;
    str += getTime() +","+ msg.link + "," + msg.status + "," + fileName;
  }

  return str;
};

var readContents = (function(url) {

  var data;
  if (PAGE.injectJs("jquery.js")) {
    data = PAGE.evaluate(function() {
      var prep;
      if(window.hasOwnProperty("_checkRendered"))
        prep = true;
      else
        prep = false; 
      return prep;
    });
  } //end of IF
  
  var msg = {};
  msg.path = DIR_LOG_FILE;
  msg.link = fcResource.pathOfHtml;

  if(data)
    msg.status = "OK";
  else 
    msg.status = "FAIL";

  fs.write(msg.path, writeLog(msg), 'a');
  openThisLink();
});

var openThisLink = (function() {
  
  fcResource.counter += 1;
  if (fcResource.counter >= fcResource.files.length)
    phantom.exit();

  fcResource.pathOfHtml = fs.absolute(DIR_HTMLFILES + fcResource.files[fcResource.counter]); 
  console.log("** Openning --> "+ (fcResource.counter + 1) +" file " + fcResource.files[fcResource.counter] + " **");
  
  PAGE.open(fcResource.pathOfHtml, function(status) {
    if (status == 'success') {
      setTimeout(function() {
         readContents(fcResource.files[fcResource.counter]);
      }, 5000);      
        
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
  fcResource.files = fs.list(DIR +"html/");
  fcResource.files = fcResource.files.slice(2, fcResource.files.length);
  openThisLink();
})();


