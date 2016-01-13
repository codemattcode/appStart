'use strict';

var gulp          = require('gulp'),
    babel         = require('gulp-babel'),
    postcss       = require('gulp-postcss'),
    autoprefixer  = require('autoprefixer-core'),
    rucksack      = require('rucksack-css'),
    sass          = require('gulp-ruby-sass'),
    uglify        = require('gulp-uglify'),
    jade          = require('gulp-jade'),
    browserSync   = require('browser-sync'),
    reload        = browserSync.reload,
    plumber       = require('gulp-plumber'),
    del           = require('del'),
    rename        = require('gulp-rename');

//sass to css conversion and compression
gulp.task('sass', function() {
  var processors = [
      rucksack,
      autoprefixer({browsers: ['last 3 versions']}),
  ];
  return sass('sass/style.sass', {
  style: 'compressed', })
  .pipe(plumber())
  .pipe(postcss(processors))
  .pipe(gulp.dest('css/'))
  .pipe(reload({stream:true}));
});

//javascript compression / transpile
gulp.task('js', function() {
  gulp.src('js/app.js')
  .pipe(plumber())
  .pipe(babel())
  .pipe(rename({suffix:'.min'}))
  .pipe(uglify())
  .pipe(gulp.dest('js-min/'))
  .pipe(reload({stream:true}));
});

//jade task
gulp.task('jade', function() {
  gulp.src(['!jade/*.jade', './index.jade'])
  .pipe(jade({
    pretty: true, //uncompressed
  }))
  .pipe(plumber())
  .pipe(gulp.dest('./'))
  .pipe(reload({stream:true}))
});
//html tasks
gulp.task('html', function() {
  gulp.src('*.html')
  .pipe(reload({stream:true}));
});

//final production build
gulp.task('build:copy', function() {
  return gulp.src('./**/*/')
  .pipe(gulp.dest('build/'));
});

gulp.task('build:delete', ['build:copy'], function(cb) {
  del([
    'build/sass',
    'build/js',
    'build/jade',
    'build/node_modules',
    'build/gulpfile.js',
    'build/package.json',
    'build/codebits.txt',
    'build/bourbon',
    'build/index.jade',
  ], cb);
});

gulp.task('build', ['build:copy', 'build:delete']);

//browserSync
gulp.task('browser-sync', function() {
  browserSync({
    browser: "google chrome canary",
    server:{
      baseDir: './',
    },
  });
});

// watch
gulp.task('watch', function() {
  gulp.watch('sass/style.sass', ['sass']);
  gulp.watch('js/app.js', ['js']);
  gulp.watch(['jade/*.jade', 'index.jade'], ['jade']);
  gulp.watch('*.html', ['html']);
});

//default tasks
gulp.task('default', ['sass', 'js', 'jade', 'html', 'browser-sync', 'watch']);
