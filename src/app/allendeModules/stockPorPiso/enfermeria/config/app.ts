import * as angular from 'angular';
import tabs from "./tabs";
import states from "./states";

export const StockEnfermeriaConfigModule = angular.module('stockPorPiso.enfermeria.config', []);

tabs.init(StockEnfermeriaConfigModule);
states.init(StockEnfermeriaConfigModule);

StockEnfermeriaConfigModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log) {
	$log = $log.getInstance("StockPorPiso.Enfermeria.Config");
	$log.debug('ON.-');
}