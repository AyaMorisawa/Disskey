/// <reference path="./typings/bundle.d.ts" />

import { task, src, dest } from 'gulp';
import * as ts from 'gulp-typescript';
import * as tslint from 'gulp-tslint';
var dtsm = require('gulp-dtsm');

var tsProject = ts.createProject('tsconfig.json');

task('dtsm', function() {
	return src('./dtsm.json')
		.pipe(dtsm());
});

task('build', function() {
	var tsResult = tsProject.src()
		.pipe(ts(tsProject));

	return tsResult.js.pipe(dest('./'));
});

task('tslint', function() {
	return src('./src/**/*.ts')
		.pipe(tslint())
		.pipe(tslint.report('verbose'));
});

task('test', ['build', 'tslint']);