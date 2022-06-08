/**
* @author: rbassi
* @description: items prefacturados para lote
* @type: Module
**/
import * as angular from 'angular';
import {itemsPrefacturadosParaLoteStates} from './config';
import {itemsPrefacturadosParaLoteListComponent} from './components/itemsPrefacturadosParaLoteList'
import {itemsPrefacturadosParaLoteDataService} from './services/itemsPrefacturadosParaLoteDataService'


const config: fw.IConfig[] = [
	itemsPrefacturadosParaLoteStates
];

const components: fw.IComponent[] = [
	itemsPrefacturadosParaLoteListComponent
];

const services: fw.IService[] = [
	itemsPrefacturadosParaLoteDataService
];

// Se crea y exporta el módulo
export const itemsPrefacturadosParaLoteModule = angular.module('facturacion.itemsPrefacturadosParaLotes',[]);

config.forEach(c => c.init(itemsPrefacturadosParaLoteModule));
components.forEach(c => c.init(itemsPrefacturadosParaLoteModule));
services.forEach(s => s.init(itemsPrefacturadosParaLoteModule));

// Run
itemsPrefacturadosParaLoteModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
 $log = $log.getInstance('facturacion.itemsPrefacturadosParaLotes');
 $log.debug('ON.-');
}
