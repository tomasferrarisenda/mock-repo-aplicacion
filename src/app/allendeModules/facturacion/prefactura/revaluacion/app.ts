/**
* @author:         ppautasso
* @description:    Modulo de farmacia
* @type:           Module
**/
import * as angular from 'angular';
import { RevaluacionConfigModule } from './config';
import { RevaluacionPrefacturaListComponent, RevaluacionLoadingProgressComponent } from './components';
import { RevaluacionDataService,RevaluacionModalService } from './services';


const modules = [
	RevaluacionConfigModule
];

export const RevaluacionModule = angular.module('facturacion.prefactura.revaluacion', modules.map(m => m.name))

// Components
RevaluacionPrefacturaListComponent.init(RevaluacionModule);
RevaluacionLoadingProgressComponent.init(RevaluacionModule);
// Services
RevaluacionDataService.init(RevaluacionModule);
RevaluacionModalService.init(RevaluacionModule),
// Run
RevaluacionModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log: ILogger) {
	$log = $log.getInstance('Revaluacion');
	$log.debug('ON.-');
}
