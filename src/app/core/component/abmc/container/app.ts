/**
 * @author:			Ezequiel Mansilla
 * @description:	COntenedor de ABMC
 * @type:			Module
 **/
import * as angular from 'angular';
import fwAbmcContainerDirective from "./fwAbmcContainerDirective";
(function () {
	'use strict';
	/* Core.Component.Abmc.Container Module */
	const ngModule = angular.module('core.component.abmc.container',[]);

	fwAbmcContainerDirective.init(ngModule);
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Component.Abmc.Container');
		$log.debug('ON.-');
	}
})();