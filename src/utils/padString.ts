export default function(str: string, length: number, padStr: string) {
	'use strict';
	return padStr.repeat(Math.max(0, length - str.length)) + str;
}
