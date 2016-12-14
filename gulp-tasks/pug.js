module.exports = function ( gulp, data, pug, rename, fs ) {
  return function () {
    gulp.src(input.pug)
    .pipe(data(function(file) {
      return JSON.parse(
        fs.readFileSync('./src/_data.json')
      );
    }))
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest(output.dist))
  };
};