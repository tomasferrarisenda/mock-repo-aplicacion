/**
 * @author:			Ezequiel Mansilla
 * @description:	Sidebar
 * @type:			Module
 **/
import * as angular from 'angular';
import fwSidebarDirective from "./fwSidebarDirective";
(function () {
	'use strict';
	/* Core.Component.Sidebar Module */
	const ngModule = angular.module('core.component.sidebar',[]);

	fwSidebarDirective.init(ngModule);
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Component.Sidebar');
		$log.debug('ON.-');
	}

})();