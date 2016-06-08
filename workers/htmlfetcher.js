// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var request = require('request');
var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');

exports.fetch = function(url){
  // create a file
  // fetch url
  // save content to file
  var path = archive.paths.archivedSites+'/'+url;
  request('http://'+url, function(error, response, body){
    if(!error){
      fs.writeFile(path, body);
    }
  });
}
