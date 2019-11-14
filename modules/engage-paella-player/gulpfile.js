
/**
 * Licensed to The Apereo Foundation under one or more contributor license
 * agreements. See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 *
 * The Apereo Foundation licenses this file to you under the Educational
 * Community License, Version 2.0 (the "License"); you may not use this file
 * except in compliance with the License. You may obtain a copy of the License
 * at:
 *
 *   http://opensource.org/licenses/ecl2.txt
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 */

/* global require */

"use strict"
const	gulp = require('gulp'),
		clean = require('gulp-clean'),
		spawn = require('child_process').spawn,
		mergeStream = require('merge-stream'),
		rename = require('gulp-rename'),
		browserify = require('gulp-browserify'),
		gls = require('gulp-live-server'),
		serveStatic = require('serve-static'),
		httpProxy = require('http-proxy'),
		proxy = httpProxy.createProxyServer({secure: false});

const config = {
      buildPath: 'build',
      paellaSrc: 'src/main/paella-opencast',
      dceExtPath: 'node_modules/dce-paella-extensions'
    };

gulp.task('paella-opencast:clean', function () {
	return gulp.src(config.buildPath, {read: false, allowEmpty: true}).pipe(clean());
});

// Can be copied over in parallel to copying other javascript
// Jim's app router - can be after the build path is built
gulp.task('hudce:app-dist', function() {
  return gulp.src('app-src/index.js').pipe(browserify()).pipe(rename({
    dirname: '', basename: 'app-index'
  })).pipe(gulp.dest(config.buildPath + '/paella-opencast/javascript'));
});

// Seventh, Seventh to last, and the very middle, and the first one to do anything.
// MOVE paella to the build directory -  must happen first - before copying overrides and plugins
gulp.task('paella-opencast:prepare:source.paella',  function(){
	var s1 = gulp.src('node_modules/paellaplayer/**').pipe(gulp.dest(config.buildPath + '/paella'));
	var s2 = gulp.src(config.paellaSrc + '/plugins/**').pipe(gulp.dest(config.buildPath + '/paella/plugins'));
	return mergeStream(s1,s2);
});

// Sixth and Sith to last
// GATHER up DCE-extentions plugins to copy into build path -- should be last
gulp.task('hudce:prepare:source.dce-extensions', function () {
  // #DCE MATT-2386 include DCE dce-paella-extension plugins, icons, override style, skin
  var s1 = gulp.src(config.dceExtPath + '/vendor/plugins/**').pipe(gulp.dest(config.buildPath + '/paella/plugins'));
  var s2 = gulp.src(config.dceExtPath + '/vendor/skins/**').pipe(gulp.dest(config.buildPath + '/paella/vendor/skins'));
  var s3 = gulp.src(config.dceExtPath + '/resources/images/paella_icons_light_dce.png').pipe(gulp.dest(config.buildPath + '/paella/resources/images'));
  var s4 = gulp.src(config.dceExtPath + '/resources/style/overrides.less').pipe(gulp.dest(config.buildPath + '/paella/resources/style'));
  return mergeStream(s1, s2, s3, s4);
});

// Fith and Fith to last
// GATHER up DCE vendor Opencast override JS to copy into build path - should be second to last
gulp.task('hudce:prepare:source.dce-overrides', function () {
  // #DCE MATT-2386 After paellalayer is copied, override with DCE overrides
  var s1 = gulp.src('vendor/paella_overrides/plugins/**').pipe(gulp.dest(config.buildPath + '/paella/plugins'));
  var s2 = gulp.src('vendor/paella_overrides/src/**').pipe(gulp.dest(config.buildPath + '/paella/src'));
  return mergeStream(s1, s2);
});

// Fourth and Fourth to last
// Add paella specific node dependencies to build/paella/node_modules
gulp.task('paella:npm-install',  function(done){
	return spawn('npm', ['install'], { cwd: config.buildPath + '/paella', stdio: 'inherit', detached: false })
	  .on('close', done);
});

// Third and Third to last
// Everything is copied into place in build/paella, so allow paella to build!
// Gulp build the paella with buildDebug target
gulp.task('paella:node-buildDebug', function(done){
	return spawn('node', ['node_modules/gulp/bin/gulp.js', 'buildDebug'], {cwd: config.buildPath + '/paella', stdio: 'inherit', detached: false})
	   .on('close', done);
});

// SECOND!! and Second to last
// Copy the finished compiled build/paella to build/paella-opencast
gulp.task('hudce:copy-dist', function(){
	return gulp.src([
		config.buildPath + '/paella/build/player/**',
		config.paellaSrc + '/ui/**'
	]).pipe(gulp.dest(config.buildPath + '/paella-opencast'));
});

gulp.task('hudce:copy-dce-dist', function(){
    // #DCE MATT-2386 after all is built, finally, copy DCE config, profiles (from extensions), htmls, and DCE's opencast style
    var s1 = gulp.src(config.dceExtPath + '/config/config.json').pipe(gulp.dest(config.buildPath + '/paella-opencast/config'));
    var s2 = gulp.src(config.dceExtPath + '/config/profiles/profiles.json').pipe(gulp.dest(config.buildPath + '/paella-opencast/config/profiles'));
    var s3 = gulp.src('vendor/mh_dce_resources/**').pipe(gulp.dest(config.buildPath + '/paella-opencast/mh_dce_resources'));
    return mergeStream(s1, s2, s3);
});

// FIRST and LAST!!
// GATHER up DCE config, CSS, UI to copy into build path - should very last
gulp.task('paella-opencast:build.dce',
//'paella-opencast:clean',
  gulp.series('paella-opencast:prepare:source.paella',
    'hudce:prepare:source.dce-extensions',
    'hudce:prepare:source.dce-overrides',
    'paella:npm-install',
    'paella:node-buildDebug',
    'hudce:copy-dist',
    'hudce:copy-dce-dist',
    'hudce:app-dist')
);

// --------start #DCE test server target ----
/// #DCE use DCE Test server and local data fixture files from dce-paella-opencast
// Example usage: http://127.0.0.1:3000/engage/player/watch.html?id=ee39049c-05f0-4d2b-94b4-625ce59f1b2b&logLevel=debug
gulp.task('paella-opencast:serverproxied', function () {
  var server = gls.new('test-server.js');
  server.start();
});

gulp.task('build', gulp.series('paella-opencast:build.dce'));
gulp.task('server', gulp.series('paella-opencast:serverproxied'));
// -------- end #DCE test server target ----

// #DCE default starts with build.dce
gulp.task('default', gulp.series('paella-opencast:build.dce'));
