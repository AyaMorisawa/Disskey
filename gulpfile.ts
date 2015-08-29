/// <reference path="typings/bundle.d.ts" />

import { task, src, dest } from 'gulp';
import * as ts from 'gulp-typescript';
import * as tslint from 'gulp-tslint';
import * as shelljs from 'shelljs';
import * as del from 'del';

var tsProject = ts.createProject('tsconfig.json');

task('start', () => {
	shelljs.exec('electron .');
});

task('build', ['build:ts', 'build:html']);

task('build:ts', () => {
	var tsResult = tsProject.src()
		.pipe(ts(tsProject));

	return tsResult.js.pipe(dest('./built'));
});

task('build:html', () => {
	return src('./src/**/*.html')
		.pipe(dest('./built'));
});

task('lint', () => {
	return src('./src/**/*.ts')
		.pipe(tslint())
		.pipe(tslint.report('verbose'));
});

task('clean', (cb) => {
	del(['./node_modules', './typings', './built', './tmp'], cb);
})

task('test', ['build', 'lint']);
