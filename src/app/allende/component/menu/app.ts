/**
 * @author:			Ezequiel Mansilla
 * @description:	Menu Allende
 * @type:			Module
 **/
import * as angular from 'angular';
import saMenuDirective from "./saMenuDirective";
import MenuService from "./MenuService";
(function () {
	'use strict';
	/* Allende.Component.Menu Module */
	const ngModule = angular.module('allende.component.menu',[]);

	saMenuDirective.init(ngModule);
	MenuService.init(ngModule);
	
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Allende.Component.Menu');
		$log.debug('ON.-');
	}
})();