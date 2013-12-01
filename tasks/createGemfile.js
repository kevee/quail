'use strict';

module.exports = function (grunt) {
  grunt.registerTask('createGemfile', 'Create a Gemfile for Jekyll.', function (dir) {
    var exists = grunt.file.isDir(dir);
    var message;

    if (exists) {
      var gemfile = "source \'https://rubygems.org\'\ngem \'github-pages\'";
      grunt.file.write(dir + '/Gemfile', gemfile);
      message = 'Gemfile written to "' + dir + '/Gemfile"';
      grunt.log.writeln(message);
    }
    else {
      message = '"' + dir + '" is not a directory';
      grunt.log.writeln(message);
    }
  });
};
