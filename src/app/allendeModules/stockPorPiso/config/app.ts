import * as angular from 'angular';

export const StockConfigModule = angular.module('stockPorPiso.config', []);

StockConfigModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod ($log) {
	$log = $log.getInstance("StockPorPiso.Config");
	$log.debug('ON.-');
}