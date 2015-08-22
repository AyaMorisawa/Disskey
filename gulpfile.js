var gulp = require('gulp');
var ts = require('gulp-typescript');
var tslint = require('gulp-tslint');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('build', function() {
	var tsResult = tsProject.src()
		.pipe(ts(tsProject));

	return tsResult.js.pipe(gulp.dest('./'));
});

gulp.task('tslint', function() {
	return gulp.src('./src/**/*.ts')
		.pipe(tslint())
		.pipe(tslint.report('verbose'));
});

gulp.task('test', ['build', 'tslint']);
