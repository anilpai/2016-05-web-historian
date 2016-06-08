var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var urlParser = require('url');
var utils = require('./http-helpers');


var actions = {
	'GET': function(request, response) {
		var parts = urlParser.parse(request.url);
		var urlPath = parts.pathname === '/' ? '/index.html' : parts.pathname;
		utils.serveAssets(response, urlPath, function(){
			archive.isUrlInList(urlPath.slice(1), function(found) {
				if (found) {
					utils.sendRedirect(response, '/loading.html');
				} else {
					utils.send404(response);
				}
			});
		});
	},
	'POST' : function(request, response) {
		utils.collectData(request, function(data) {
			var url = data.split('=')[1];
			archive.isUrlInList(url, function (found) {
				if (found) {
					archive.isUrlArchived(url, function(exists) {
						if (exists) {
							utils.sendRedirect(response, '/'+url);
						} else {
							utils.sendRedirect(response, '/loading.html');
              archive.downloadUrls(url);
						}
					});
				} else {
					archive.addUrlToList(url, function() {
						utils.sendRedirect(response, '/loading.html');
					});
				}
			});
		});
	}
};


exports.handleRequest = function (request, response) {
  var action = actions[request.method];
  if (action) {
  	action(request, response);
  }
  else {
  	utils.sendResponse(response, "Not Found", 404);
  }
};
