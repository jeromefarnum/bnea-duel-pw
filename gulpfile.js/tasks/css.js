var config       = require('../config')
if(!config.tasks.css) return

var gulp         = require('gulp')
var gulpif       = require('gulp-if')
var gulpconcat   = require('gulp-concat')
var browserSync  = require('browser-sync')
var sass         = require('gulp-sass')
var sourcemaps   = require('gulp-sourcemaps')
var handleErrors = require('../lib/handleErrors')
var autoprefixer = require('gulp-autoprefixer')
var path         = require('path')
var cssnano      = require('gulp-cssnano')

var paths = {
  src: [path.join(config.root.src, config.tasks.css.src, '/**/*.{' + config.tasks.css.extensions + '}')],
  dest: path.join(config.root.dest, config.tasks.css.dest)
}

var cssTask = function () {
  if(global.production) {
    paths.src.push('!**/development.{' + config.tasks.css.extensions + '}');
  }
  
  return gulp.src(paths.src)
    .pipe(gulpif(!global.production, sourcemaps.init()))
    .pipe(sass(config.tasks.css.sass))
    .on('error', handleErrors)
    .pipe(autoprefixer(config.tasks.css.autoprefixer))
    .pipe(gulpif(global.production, cssnano({autoprefixer: false, reduceIdents: false})))
    .pipe(gulpif(!global.production, sourcemaps.write()))
    .pipe(gulpconcat('custom.css'))
    .pipe(gulp.dest(paths.dest))
    .pipe(browserSync.stream())
}

gulp.task('css', cssTask)
module.exports = cssTask
