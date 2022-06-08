/**
 * @author:			Ezequiel Mansilla
 * @description:	Modulo para dashboards
 * @type:			Module
 **/
import * as angular from 'angular';
import fwDashboardDirective from './directives/fwDashboardDirective';
import 'angular-gridster';

(function () {
	'use strict';
	/* Integration.Dashboard Module */
	const ngModule = angular.module('integration.dashboard', ['gridster']);

	fwDashboardDirective.init(ngModule);

	ngModule.run(['Logger', function ($log) {
		$log = $log.getInstance('Integration.Dashboard');
		$log.debug('ON.-');
	}]);
	
})();