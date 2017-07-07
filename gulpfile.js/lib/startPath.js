var config  	= require('../config')
var fs 				= require('fs')
var argv      = require('yargs').argv


var getShortcuts = function() {
  var map = {}
	var files = fs.readdirSync(config.root.dest)
  var pages = files.filter(file => file.endsWith('.html'))

  for (page of pages) {
		var key = page.split('.')[0]
		
		map[key] = page
  }
	
	return map[argv.go] ? '/' + map[argv.go] : ''
}

module.exports = getShortcuts()