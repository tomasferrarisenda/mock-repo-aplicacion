/**
 * @author:			Ezequiel Mansilla
 * @description:	Body
 * @type:			Module
 **/
import * as angular from 'angular';
import fwBodyDirective from "./fwBodyDirective";
(function () {
	'use strict';
	/* Core.Component.Body Module */
	const ngModule = angular.module('core.component.body',[]);

	fwBodyDirective.init(ngModule);
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Component.Body');
		$log.debug('ON.-');
	}
})();