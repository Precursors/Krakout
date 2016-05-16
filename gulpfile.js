'use strict';
let gulp = require('gulp');
let babel = require('gulp-babel');
let uglify = require('gulp-uglify');
let rename = require('gulp-rename');
let concat = require('gulp-concat');

const jsPath = [
  'src/libs/*.js',
  'src/krakout.js',
  'src/Base/ModuleBase.js',
  'src/Base/Board.js',
  'src/Base/Ball.js',
  'src/Board/*.js',
  'src/Ball/*.js'
];

gulp.task('watch', () => gulp.watch(jsPath, ['build']));

gulp.task('build', () =>
  gulp.src(jsPath).pipe(babel({
		presets: ['es2015']
	}))
  .pipe(concat('all.js'))
	.pipe(gulp.dest('dist'))
  .pipe(uglify())
  .pipe(rename({
    extname: '.min.js'
  }))
	.pipe(gulp.dest('dist'))
);


gulp.task('default', ['build'])
