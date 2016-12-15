/* gulpfile.js */

// Add gulp-changed

/* Plugins */
const gulp          = require('gulp'),
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
      config        = require('./config.json');

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
  './src/_data.json',
  './src/_markdown/*.markdown',
  './src/_sass/**/*.sass'
]

// SASS
gulp.task('sass', function (){
  gulp.src(['./src/_sass/main.sass'])
    .pipe(sass({
      includePaths: [
        './src/_sass/*/**'
      ],
      outputStyle: 'expanded'
    }))
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
});

/* SHELL - WEBACK WATCH */
gulp.task('webpack-watch', shell.task([
  'npm run watch'
]))

gulp.task('watchgulp', function() {
  gulp.watch(filesToWatch, ['pug','sass']);    
});

/* Task Library */
gulp.task('pug', require('./gulp-tasks/pug')(gulp, data, pug, rename, fs, connect));
gulp.task('deploy', require('./gulp-tasks/deploy')(gulp, ftp));

/* Default Task */
gulp.task('default', ['webpack-watch','watchgulp','connect']);

/* GULP SYNC */
sync(gulp, {
  path: './package.json',
  excluded: ['default','pug','deploy','move','webpack-watch','watchgulp','server']
});