import * as angular from 'angular';
import { StockConfigModule } from './config';
import { StockCommonModule } from './common';
import { StockEnfermeriaModule } from './enfermeria';
import { StockFarmaciaModule } from './farmacia';
import { StockReportesModule} from './reportes';

const modules = [
	StockConfigModule,
	StockCommonModule,
	StockEnfermeriaModule,
	StockFarmaciaModule,
	StockReportesModule
];

export const StockModule = angular.module('stockPorPiso', modules.map(m => m.name));

StockModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log) {
	$log = $log.getInstance('StockPorPiso');
	$log.info('ON.-');
}