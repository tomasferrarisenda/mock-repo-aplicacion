/**
 * @author:			Ezequiel Mansilla
 * @description:	Sidebar allende
 * @type:			Module
 **/
import * as angular from 'angular';
import saSidebarDirective from './saSidebarDirective';

(function () {
	'use strict';
	/* Allende.Component.Sidebar Module */
	const ngModule = angular.module('allende.component.sidebar',[]);

	saSidebarDirective.init(ngModule);
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Allende.Component.Sidebar');
		$log.debug('ON.-');
	}
})();