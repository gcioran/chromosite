'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var del = require('del');
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify-es').default;;
var usemin = require('gulp-usemin');
var rev = require('gulp-rev');
var cleanCss = require('gulp-clean-css');
var flatmap = require('gulp-flatmap');
var htmlmin = require('gulp-htmlmin');

gulp.task('browser-sync', function () {
   var files = [
      './*.html',
      './css/*.css',
      './img/*.{png,jpg,gif}',
      './js/*.js'
   ];

   browserSync.init(files, {
      server: {
         baseDir: "./"
      }
   });

});

// Clean
gulp.task('clean', function() {
   return del(['dist']);
});

gulp.task('copyNodeModules', function () {
   return gulp
       .src([
           './node_modules/angular-translate/dist/angular-translate.min.js',
           './node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
           './service/loader-static-files.js',
           '.htaccess',
           './l10n/*'
       ], { base: './' })
       .pipe(gulp.dest('./dist/'));
});

// Images
gulp.task('imagemin', function() {
   return gulp.src('images/**/**/*.{png,jpg,gif}')
     .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
     .pipe(gulp.dest('dist/images'));
 });

 gulp.task('usemin', function() {
   return gulp.src([
    './*.html',
    './pages/*.html',
    './components/map/*.html',
    './angular/*.html'
], { base: './' })
   .pipe(flatmap(function(stream, file){
       return stream
         .pipe(usemin({
             css: [ rev() ],
             html: [ function() { return htmlmin({ collapseWhitespace: true })} ],
             js: [ rev() ],
             inlinejs: [ uglify() ],
             inlinecss: [ cleanCss(), 'concat' ]
         }))
     }))
     .pipe(gulp.dest('dist/'));
 });
 
 gulp.task('build',['clean'], function() {
     gulp.start('copyNodeModules','imagemin', 'usemin');
 });

// Default task
gulp.task('default', ['browser-sync'], function() {
   //   gulp.start('sass:watch');
});