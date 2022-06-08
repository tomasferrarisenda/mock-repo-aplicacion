/**
 * @author:			Ezequiel Mansilla
 * @description:	Panel
 * @type:			Module
 **/
import * as angular from 'angular';
import fwPanelItemDirective from "./fwPanelItemDirective";
(function () {
	'use strict';
	/* Core.Component.Panel Module */
	const ngModule = angular.module('core.component.panel',[]);

	fwPanelItemDirective.init(ngModule);
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Component.Panel');
		$log.debug('ON.-');
	}
})();