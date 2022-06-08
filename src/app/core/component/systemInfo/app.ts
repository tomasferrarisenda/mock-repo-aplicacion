/**
 * @author:			Ezequiel Mansilla
 * @description:	Informaación de sistema
 * @type:			Module
 **/
import * as angular from 'angular';
import fwSystemInfoDirective from "./fwSystemInfoDirective";
(function () {
	'use strict';
	/* Core.Component.SystemInfo Module */
	const ngModule = angular.module('core.component.systemInfo',[]);

	fwSystemInfoDirective.init(ngModule);
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Component.SystemInfo');
		$log.debug('ON.-');
	}
})();