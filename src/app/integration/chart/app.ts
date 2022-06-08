/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import HighchartsService from './services/HighchartsService';
import fwChartDirective from './directives/fwChartDirective';
import fwPieChartDirective from './directives/fwPieChartDirective';

(function () {
	'use strict';
	/* Integration.Charts Module */
	const ngModule = angular.module('integration.chart', []);

	HighchartsService.init(ngModule);

	fwChartDirective.init(ngModule);
	fwPieChartDirective.init(ngModule);

	ngModule.run(['Logger', function ($log) {
		$log = $log.getInstance('Integration.Charts');
		$log.debug('ON.-');
	}]);
})();