/**
 * Plugins
 */

// main plugins
const gulp = require('gulp');
const del = require('del');
const rename = require('gulp-rename');
const notify = require('gulp-notify');
const eslint = require('gulp-eslint');
// CSS plugins
const sass = require('gulp-sass');
const minifyCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
// JS plugins
const minifyJS = require('gulp-minify');
const babel = require('gulp-babel');

/**
 * Config
 */
const browsers = [
  'ie >= 10',
  'Firefox >= 11',
  'Chrome >= 18',
  'Safari >= 6',
  'Opera >= 12.1',
];
const paths = {
  dist: 'dist',
  src: {
    sass: 'src/**/*.scss',
    js: 'src/**/*.js',
  },
};

/**
 * Functions
 */
gulp.task('sass', () => {
  return gulp.src(paths.src.sass)
    .pipe(sass().on('error', notify.onError({
      message: '<%= error.message %>',
      title: 'Sass Error!',
    })))
    .pipe(autoprefixer({
      browsers,
    }))
    .pipe(gulp.dest(paths.dist))
    .pipe(minifyCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('lint', () => {
  return gulp.src(paths.src.js)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('scripts', ['lint'], () => {
  return gulp.src(paths.src.js)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(babel({
      presets: ['es2015'],
    })
      .on('error', notify.onError({
        message: '<%= error.message %>',
        title: 'Babel Error!',
      })))
    .pipe(minifyJS({
      ext: {
        min: '.min.js',
      },
      preserveComments: 'some',
    }))
    .pipe(gulp.dest(paths.dist));
});

// Default task
gulp.task('default', ['sass', 'scripts'], () => {
  gulp.watch(paths.src.js, ['lint', 'scripts']);
  gulp.watch(paths.src.sass, ['sass']);
});

gulp.task('del', () => {
  return del.sync(paths.dist);
});
