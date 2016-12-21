/* gulpfile.js */
/* Plugins */
const gulp          = require('gulp'),
      runSequence   = require('run-sequence'),
      gutil         = require('gulp-util'),
      pug           = require('gulp-pug'),
      ftp           = require('vinyl-ftp'),
      sync          = require('gulp-npm-script-sync'),
      data          = require('gulp-data'),
      clean         = require('gulp-clean'),
      rename        = require("gulp-rename"),
      merge         = require('gulp-merge-json'),
      fs            = require('fs'),
      shell         = require('gulp-shell'),
      sass          = require('gulp-sass'),
      autoprefixer  = require('gulp-autoprefixer'),
      minifycss     = require('gulp-minify-css'),
      path          = require('path'),
      connect       = require('gulp-connect'),
      config        = require('./config.json'),
      //json
      concat        = require('gulp-concat'),
      jsonCss       = require('gulp-json-css');

/* I - O  */
input  = {
  'pug': './src/*.pug'
},

output = {
  'dist': config.output
};

// Move Files
var filesToMove = [
  './src/imgs',
  './src/.htaccess'
];

gulp.task('move', function(){
  gulp.src(filesToMove, { base: './src/' })
  .pipe(gulp.dest(output.dist));
});

// Watch Files
var filesToWatch = [
  './src/*.pug',
  './src/**/*.pug',
  './src/_includes/*.pug',
  './src/_data/**/*.json',
  './src/_markdown/*.markdown',
  './src/_sass/**/*.sass'
]

// JSON SASS
gulp.task('sass', function() {
  return gulp
  .src(['./src/_data/_vars.json', './src/_sass/main.sass'])
  .pipe(jsonCss())
  .pipe(concat('main.sass'))
  .pipe(sass())
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe(gulp.dest('./src/_temp/css'))
  .pipe(minifycss())
  .pipe(gulp.dest('./dist/static/css'));
});

/* SERVER */
gulp.task('connect', function() {
  connect.server({
    root: './dist/',
    livereload: true
  });
  // run sequence
  //callback();
});

/* SHELL - WEBACK WATCH */
gulp.task('webpack-watch', shell.task([
  'npm run watch'
]))

/* SHELL - WEBACK WATCH */
gulp.task('webpack-build', shell.task([
  'npm run build'
]))

gulp.task('watchgulp', function() {
  gulp.watch(filesToWatch, ['merge-json','pug','sass']);    
});

// MERGE JSON DATA
gulp.task('merge-json', function() {
  gulp.src('./src/_data/**/*.json')
      .pipe(merge('data.json'))
      .pipe(gulp.dest('./src/_temp/'));
});

/* Task Library */
gulp.task('pug', require('./gulp-tasks/pug')(gulp, data, pug, rename, fs, merge));
gulp.task('deploy', require('./gulp-tasks/deploy')(gulp, ftp));

/* Default Task */
gulp.task('default', ['merge-json','webpack-watch','watchgulp','connect']);

// GET RUN SEQUENCE WORKING
gulp.task('seq', function(callback) {
  runSequence('merge-json', ['sass', 'pug'],'webpack-watch','watchgulp','connect', callback);
});

// PRODUCTION
gulp.task('prod', ['webpack-build']);

/* GULP SYNC */
sync(gulp, {
  path: './package.json',
  excluded: ['default','pug','deploy','move','webpack-watch','watchgulp','server']
});