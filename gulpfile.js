var gulp = require("gulp");
var less = require("gulp-less");
var cssnano = require("gulp-cssnano");
var jsuglify = require('gulp-uglify');
var pump = require('pump');
var concat = require('gulp-concat');
var sourcemaps = require("gulp-sourcemaps");
var sync = require("browser-sync").create();
var htmlExtend = require("gulp-html-extend");
var rename = require('gulp-rename');
var fontmin = require('gulp-fontmin');
var imagemin = require('gulp-imagemin');

gulp.task('html:build', function() {
	return gulp.src('src/index.html')
		.pipe(htmlExtend())
		.pipe(gulp.dest('dist/'))
});
 
gulp.task('cssOwn:build', function() {
	return gulp.src([
		'src/styles/partials/reset.less',
		'src/styles/partials/general.less',
		'src/styles/partials/header.less',
		'src/styles/partials/menu.less',
		'src/styles/partials/carousel.less',
		'src/styles/partials/showcase.less',
		'src/styles/partials/application-form.less',
		'src/styles/partials/footer.less',
		])
	.pipe(sourcemaps.init())
	.pipe(concat('all.less'))
	.pipe(less())
	.pipe(cssnano())
	.pipe(sourcemaps.write())
	.pipe(rename('custom.min.css'))
	.pipe(gulp.dest("dist/styles"))
	.pipe(sync.stream())
});


gulp.task('minifyFont', function () {
  return gulp.src('src/fonts/*.ttf')
    .pipe(fontmin())
    .pipe(gulp.dest('dist/fonts'))
});
gulp.task('fontsCss:build', ['minifyFont'], function() {
  return gulp.src('src/styles/font-style.css')
    .pipe(gulp.dest('dist/styles'))
});
gulp.task('font:build', ['minifyFont', 'fontsCss:build']);


gulp.task('images:build', function() {
	return gulp.src('src/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images'))
});


gulp.task('jsOwn:build', function() {
	return gulp.src([
		'src/js/jquery.carousel.js',
		'src/js/custom.js'
	])
	.pipe(concat('all.js'))
	.pipe(sourcemaps.init())
	.pipe(jsuglify())
	.pipe(sourcemaps.write())
	.pipe(rename('custom.min.js'))
	.pipe(gulp.dest('dist/js'))
});
gulp.task('jsVendor:build', function() {
	return gulp.src('node_modules/jquery/dist/jquery.min.js')
	.pipe(concat('vendor.min.js'))
	.pipe(gulp.dest('dist/js'))
});
gulp.task('js:build', ['jsOwn:build', 'jsVendor:build']);


gulp.task("build", ["html:build", "cssOwn:build",
	"font:build", "images:build", "js:build"]);

gulp.task('watch', ["build"], function() {
	sync.init({
		server: "dist"
	});
	gulp.watch('src/include/*.html', ['html:build']);
	gulp.watch('src/**/*{.less, .css}', ['cssOwn:build']);
	gulp.watch('src/fonts/*.ttf', ['font:build']);
	gulp.watch('src/images/*.*', ['images:build']);
	gulp.watch('src/js/*.js', ['js:build']);

	gulp.watch('dist/*.html').on('change', sync.reload);
	gulp.watch('dist/styles/custom.min.css').on('change', sync.reload);
	gulp.watch('dist/js/*.js').on('change', sync.reload);
});
gulp.task("default", ["watch"]);