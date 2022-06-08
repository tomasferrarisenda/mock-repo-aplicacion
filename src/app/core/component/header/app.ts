/**
 * @author:			Ezequiel Mansilla
 * @description:	Modulo de header
 * @type:			Module
 **/
import * as angular from 'angular';
import fwHeaderDirective from "./fwHeaderDirective";
(function () {
	'use strict';
	/* Core.Component.Header Module */
	const ngModule = angular.module('core.component.header',[]);

	fwHeaderDirective.init(ngModule);
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Component.Header');
		$log.debug('ON.-');
	}
})();