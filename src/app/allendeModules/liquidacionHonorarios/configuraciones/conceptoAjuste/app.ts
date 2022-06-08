// /**
// * @author:         emansilla
// * @description:    Concepto de ajuste para contratos internos
// * @type:           Module
// **/
// import * as angular from 'angular';
// import { ConceptoAjusteStates } from './config';
// import { ConceptoAjusteListComponent } from './components/conceptoAjusteList/conceptoAjusteListComponent';
// import { ConceptoAjusteDataService } from './services';

// export const LiquidacionHonorariosConceptoAjusteModule = angular.module('liquidacionHonorarios.configuraciones.conceptoAjuste', []);

// ConceptoAjusteStates.init(LiquidacionHonorariosConceptoAjusteModule)
// ConceptoAjusteListComponent.init(LiquidacionHonorariosConceptoAjusteModule);
// ConceptoAjusteDataService.init(LiquidacionHonorariosConceptoAjusteModule);

// // Run
// LiquidacionHonorariosConceptoAjusteModule.run(runMethod);

// runMethod.$inject = ['Logger'];
// function runMethod($log:ILogger){
// 	$log = $log.getInstance('LiquidacionHonorariosConceptoAjuste');
// 	$log.debug('ON.-');
// }


/**
* @author: crusso
* @description: App Concepto
* @type: Module
**/
import * as angular from 'angular';
import { ConceptoAjusteStates } from './config';
import { ConceptoAjusteListComponent, ConceptoAjusteEditComponent } from './components/';
import { ConceptoAjusteDataService } from './services';
import { ConceptoAjusteLogicService } from '../conceptoAjuste/services/ConceptoAjusteLogicService';

const modules: angular.IModule[] = [

];

const config: fw.IConfig[] = [
	ConceptoAjusteStates
];

const components: fw.IComponent[] = [
	ConceptoAjusteListComponent,
	ConceptoAjusteEditComponent
];

const services: fw.IService[] = [
	ConceptoAjusteDataService,
	ConceptoAjusteLogicService
];

// Se crea y exporta el módulo
export const ConceptoAjusteModule = angular.module('ConceptoAjuste', modules.map(module => module.name));

config.forEach(c => c.init(ConceptoAjusteModule));
components.forEach(c => c.init(ConceptoAjusteModule));
services.forEach(s => s.init(ConceptoAjusteModule));

// Run
ConceptoAjusteModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log: ILogger) {
	$log = $log.getInstance('ConceptoAjuste');
	$log.debug('ON.-');
}