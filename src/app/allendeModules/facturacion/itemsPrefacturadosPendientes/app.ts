/**
* @author: rbassi
* @description: items prefacturados para lote
* @type: Module
**/
import * as angular from 'angular';
import {itemsPrefacturadosPendientesStates} from './config';
import {itemsPrefacturadosPendientesListComponent} from './components/itemsPrefacturadosPendientesList'
import {itemsPrefacturadosPendientesDataService} from './services/itemsPrefacturadosPendientesDataService'


const config: fw.IConfig[] = [
	itemsPrefacturadosPendientesStates
];

const components: fw.IComponent[] = [
	itemsPrefacturadosPendientesListComponent
];

const services: fw.IService[] = [
	itemsPrefacturadosPendientesDataService
];

// Se crea y exporta el módulo
export const itemsPrefacturadosPendientesModule = angular.module('facturacion.itemsPrefacturadosPendientes',[]);

config.forEach(c => c.init(itemsPrefacturadosPendientesModule));

components.forEach(c => c.init(itemsPrefacturadosPendientesModule));
services.forEach(s => s.init(itemsPrefacturadosPendientesModule));

// Run
itemsPrefacturadosPendientesModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
 $log = $log.getInstance('facturacion.itemsPrefacturadosPendientes');
 $log.debug('ON.-');
}

