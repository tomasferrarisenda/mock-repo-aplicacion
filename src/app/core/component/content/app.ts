/**
 * @author:			Ezequiel Mansilla
 * @description:	Content
 * @type:			Module
 **/
import * as angular from 'angular';
import fwContentDirective from "./fwContentDirective";
(function () {
	'use strict';
	/* Core.Component.Content Module */
	const ngModule = angular.module('core.component.content',[]);

	fwContentDirective.init(ngModule);
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Component.Content');
		$log.debug('ON.-');
	}

})();