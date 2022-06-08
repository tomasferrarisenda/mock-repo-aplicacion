/**
 * @author:			Ezequiel Mansilla
 * @description:	Módulo con funcionalidad propia del sanatorio
 * @type:			Module
 **/
import * as angular from 'angular';
import "./config/app";
import "./basic/app";
import "./component/app";
import "./input/app";
import "./logo/app";
import "./print/app";

export const AllendeModule = angular
	.module('allende',[
		'allende.config',
		'allende.basic',
		'allende.component',
		'allende.input',
		'allende.logo',
		'allende.print',
		// 'allende.security',
	])
	.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod ($log) {
	$log = $log.getInstance('Allende');
	$log.info('ON.-');
}