/**
 * @author:			Ezequiel Mansilla
 * @description:	Footer
 * @type:			Module
 **/
import * as angular from 'angular';
import fwFooterDirective from "./fwFooterDirective";

(function () {
	'use strict';
	/* Core.Component.Footer Module */
	const ngModule = angular.module('core.component.footer',[]);

	fwFooterDirective.init(ngModule);
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Component.Footer');
		$log.debug('ON.-');
	}
})();