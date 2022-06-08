/**
* @author: rbassi
* @description: definitivos Module
* @type: Module
**/
import * as angular from 'angular';
import {definitivosStates} from './config';
import {definitivosListComponent} from './components/definitivosList';
import {definitivosEditComponent} from './components/definitivosEdit';
import {definitivosObtenerCierresListComponent} from './components/definitivosObtenerCierresList';
import {DefinitivosDataService,DefinitivosLogicService} from './services';
import {definitivoImprimirComponent} from './components/definitivoImprmir';
import {definitivoImprimirSeleccionComponent} from './components/definitivoImprimirSeleccion'
import {definitivoImprimirControlComponent} from './components/definitivoImprimirControl'
import { loteImprimirSeleccionComponent } from './components';

const config: fw.IConfig[] = [
    definitivosStates
];


const components: fw.IComponent[] = [
    definitivosListComponent,
    definitivosObtenerCierresListComponent,
    definitivosEditComponent,
    definitivoImprimirComponent,
    definitivoImprimirSeleccionComponent,
    definitivoImprimirControlComponent,
    loteImprimirSeleccionComponent
];

const services: fw.IService[] = [
    DefinitivosDataService,
    DefinitivosLogicService
];

// Se crea y exporta el módulo
export const definitivosModule = angular.module('facturacion.definitivosList',[]);


config.forEach(c => c.init(definitivosModule));
components.forEach(c => c.init(definitivosModule));
services.forEach(s => s.init(definitivosModule));

// Run
definitivosModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
 $log = $log.getInstance('facturacion.definitivosList');
 $log.debug('ON.-');
}
