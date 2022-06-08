import * as angular from 'angular';
import tabs from "./tabs";
import states from "./states";

export const StockFarmaciaConfigModule = angular.module('stockPorPiso.farmacia.config', []);

tabs.init(StockFarmaciaConfigModule);
states.init(StockFarmaciaConfigModule);

runMethod.$inject = ['Logger'];
function runMethod($log) {
	$log = $log.getInstance("StockPorPiso.Farmacia.Config");
	$log.debug('ON.-');
}
