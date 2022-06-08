/**
 * @author:			Ezequiel Mansilla
 * @description:	Tablas para allende
 * @type:			Module
 **/
import * as angular from 'angular';
import saTableExtDirective from './saTableExtDirective';
(function () {
	'use strict';
	/* Allende.Component.Table Module */
	const ngModule = angular.module('allende.component.table',[]);

	saTableExtDirective.init(ngModule);
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Allende.Component.Table');
		$log.debug('ON.-');
	}
})();