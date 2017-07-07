if(global.production) return

var browserSync       = require('browser-sync')
var gulp              = require('gulp')
var config            = require('../config')
var pathToUrl         = require('../lib/pathToUrl')
var startPath         = require('../lib/startPath')

var browserSyncTask = function() {
  var options = config.tasks.browserSync
  options.startPath = startPath
  browserSync.init(options)
}

gulp.task('browserSync', browserSyncTask)
module.exports = browserSyncTask
