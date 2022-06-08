/**
* @author: rbassi
* @description: Lote Module
* @type: Module
**/
import * as angular from 'angular';
import {loteRecepcionPorFiltroStates} from './config';
import {loteReceptarPorFiltroListComponent} from './components/loteReceptarPorFiltroList';
import {loteReceptarPorFiltroDataService} from './services/loteReceptarPorFiltroDataService';
import {loteReceptarPorFiltroLogicService} from './services/loteReceptarPorFiltroLogicService';
import {loteReceptarPorFiltroEditComponent} from './components/loteReceptarPorFiltroEdit';




const config: fw.IConfig[] = [
    loteRecepcionPorFiltroStates
];


const components: fw.IComponent[] = [
    loteReceptarPorFiltroListComponent,
    loteReceptarPorFiltroEditComponent,
];

const services: fw.IService[] = [
    loteReceptarPorFiltroDataService,
    loteReceptarPorFiltroLogicService
];

// Se crea y exporta el módulo
export const loteModule = angular.module('facturacion.loteslistview',[]);


config.forEach(c => c.init(loteModule));
components.forEach(c => c.init(loteModule));
services.forEach(s => s.init(loteModule));

// Run
loteModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
 $log = $log.getInstance('facturacion.loteslistview');
 $log.debug('ON.-');
}
