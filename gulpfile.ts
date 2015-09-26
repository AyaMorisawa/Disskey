/// <reference path="typings/bundle.d.ts" />

import { task, src, dest, watch } from 'gulp';
import * as ts from 'gulp-typescript';
import * as tslint from 'gulp-tslint';
import * as shelljs from 'shelljs';
import * as del from 'del';
import * as plumber from 'gulp-plumber';
const notify = require('gulp-notify');
const babel = require('gulp-babel');

const tsProject = ts.createProject('tsconfig.json', <any>{
	typescript: require('typescript')
});

task('start', () => {
	shelljs.exec('electron .');
});

task('watch', ['build', 'lint'], () => {
	watch('./src/**/*.+(ts|tsx)', ['build:ts', 'lint']);
	watch('./src/**/*.html', ['build:html']);
	watch('./src/**/*.html', ['build:css']);
});

task('build', ['build:ts', 'build:html', 'build:css', 'build:image']);

task('build:ts', () => {
	return tsProject.src()
		.pipe(plumber({errorHandler: notify.onError('Build error: <%= error.message %>')}))
		.pipe(ts(tsProject))
		.pipe(babel({
			modules: 'commonStrict'
		}))
		.pipe(dest('./built'));
});

task('build:html', () => {
	return src('./src/**/*.html')
		.pipe(dest('./built'));
});

task('build:css', () => {
	return src('./src/**/*.css')
		.pipe(dest('./built'));
});

task('build:image', () => {
	return src('./src/images/**/*.png')
		.pipe(dest('./built/images'));
});

task('lint', () => {
	return src('./src/**/*.+(ts|tsx)')
		.pipe(plumber({errorHandler: notify.onError('Lint error: <%= error.message %>')}))
		.pipe(tslint(<any>{
			tslint: require('tslint')
		}))
		.pipe(tslint.report('verbose'));
});

task('clean', (cb) => {
	del(['./built', './tmp', './release'], cb);
});

task('clean-all', ['clean'], (cb) => {
	del(['./node_modules', './typings'], cb);
});

task('test', ['build', 'lint']);

task('release', () => {
	shelljs.exec('electron-packager ./ disskey --all --version=0.33.0 --out=release --ignore=src --overwrite');
});
