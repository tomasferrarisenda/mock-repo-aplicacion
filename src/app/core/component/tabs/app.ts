/**
 * @author:			Ezequiel Mansilla
 * @description:	Tabs
 * @type:			Module
 **/
import * as angular from 'angular';
import fwTabsDirective from "./fwTabsDirective";

(function () {
	'use strict';
	/* Core.Component.Tabs Module */
	const ngModule = angular.module('core.component.tabs',[]);

	fwTabsDirective.init(ngModule);
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Component.Tabs');
		$log.debug('ON.-');
	}
})();