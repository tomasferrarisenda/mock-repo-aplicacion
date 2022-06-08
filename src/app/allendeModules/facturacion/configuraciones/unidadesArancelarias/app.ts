/**
* @author: emansilla
* @description: Unidades arancelarias
* @type: Module
**/
import * as angular from 'angular';
import { FacturacionUnidadesArancelariasStates } from './config';
import { UnidadesArancelariasListComponent, UnidadesArancelariasEditComponent } from './components';
import { UnidadArancelariaDataService, UnidadArancelariaLogicService } from './services';

const config: fw.IConfig[] = [
	FacturacionUnidadesArancelariasStates
];


const components: fw.IComponent[] = [
	UnidadesArancelariasListComponent,
	UnidadesArancelariasEditComponent
];

const services: fw.IService[] = [
	UnidadArancelariaDataService,
	UnidadArancelariaLogicService
];

export const FacturacionUnidadesArancelariasModule = angular.module('facturacion.configuraciones.unidadesArancelarias', []);

config.forEach(c => c.init(FacturacionUnidadesArancelariasModule));
/*
for (let i = 0; i < config.length; i++) {
	config[i].init(FacturacionUnidadesArancelariasModule);	
}
 */

components.forEach(c => c.init(FacturacionUnidadesArancelariasModule));
services.forEach(s => s.init(FacturacionUnidadesArancelariasModule));

// Run
FacturacionUnidadesArancelariasModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log: ILogger) {
	$log = $log.getInstance('Facturacion.Configuraciones.UnidadesArancelarias');
	$log.debug('ON.-');
}