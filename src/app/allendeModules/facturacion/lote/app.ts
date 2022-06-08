/**
* @author: rbassi
* @description: Lote Module
* @type: Module
**/
import * as angular from 'angular';
import {loteStates} from './config';
import {loteReceptarListComponent} from './components/loteReceptarList';
import {loteImprimirComponent} from './components/loteImprimir';
import {loteDataService} from './services/loteDataService';
import {loteLogicService} from './services/loteLogicService';


const config: fw.IConfig[] = [
    loteStates
];


const components: fw.IComponent[] = [
    loteReceptarListComponent,
    loteImprimirComponent
];

const services: fw.IService[] = [
    loteDataService,
    loteLogicService
];

// Se crea y exporta el módulo
export const loteModule = angular.module('facturacion.loteList',[]);


config.forEach(c => c.init(loteModule));
components.forEach(c => c.init(loteModule));
services.forEach(s => s.init(loteModule));

// Run
loteModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
 $log = $log.getInstance('facturacion.loteList');
 $log.debug('ON.-');
}
