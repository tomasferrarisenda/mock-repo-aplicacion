/**
 * @author:			Ezequiel Mansilla
 * @description:	Loading
 * @type:			Module
 **/
import * as angular from 'angular';
import fwLoadingDirective from "./fwLoadingDirective";
import './fwLoading.scss';
import './fwLoadingYear.scss';
(function () {
	'use strict';
	/* Core.Component.Loading Module */
	const ngModule = angular.module('core.component.loading',[]);

	fwLoadingDirective.init(ngModule);
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Component.Loading');
		$log.debug('ON.-');
	}
})();