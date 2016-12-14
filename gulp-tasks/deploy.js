
module.exports = function ( gulp, ftp ) {

  return function () {

  const credenitals = require('../deploy-credentials.json')
  const config = require('../config.json')

  var user = credenitals.user,
      password = credenitals.password,
      host = credenitals.host,
      port = 21,
      localFilesGlob = [config.output + '/**/*'],
      remoteFolder = credenitals.remoteFolder;

  function getFtpConnection() {
    return ftp.create({
      host: host,
      port: port,
      user: user,
      password: password,
      parallel: 5
    });
  }

  var conn = getFtpConnection();

  gulp.src(localFilesGlob, { buffer: false })
    .pipe( conn.newer( remoteFolder ) )
    .pipe( conn.dest( remoteFolder ) );
  };

};