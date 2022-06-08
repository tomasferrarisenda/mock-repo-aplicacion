/**
 * @author:			Ezequiel Mansilla
 * @description:	Módulo de paginas basicas
 * @type:			Module
 **/
import * as angular from 'angular';
import './about/app';
import './home/app';
import './user/app';

(function () {
	'use strict';
	/* Allende.Basic Module */
	const ngModule = angular.module('allende.basic',[
		'allende.basic.about',
		'allende.basic.home',
		'allende.basic.user'
	]);

	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Allende.Basic');
		$log.debug('ON.-');
	}
})();