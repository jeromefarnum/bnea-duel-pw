var config  = require('../config')
var changed = require('gulp-changed')
var gulp    = require('gulp')
var path    = require('path')

var paths = {
  src: [
    path.join(config.root.src, config.tasks.javascripts.src, '/**/*.{' + config.tasks.javascripts.extensions + '}'),
    path.join('!' + config.root.src, config.tasks.javascripts.src, '/README.md')
  ],
  dest: path.join(config.root.dest, config.tasks.javascripts.dest)
}

var javascriptsTask = function() {
  return gulp.src(paths.src)
    .pipe(changed(paths.dest)) // Ignore unchanged files
    .pipe(gulp.dest(paths.dest))
}

gulp.task('javascripts', javascriptsTask)
module.exports = javascriptsTask
