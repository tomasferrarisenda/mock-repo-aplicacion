/**
* @author: rbassi
* @description: cierre Recepcion Module
* @type: Module
**/
import * as angular from 'angular';
import {cierreRecepcionStates} from './config';
import {cierreRecepcionListComponent} from './components/cierreRecepcionList';
import {cierreRecepcionEditComponent} from './components/cierreRecepcionEdit';
import {cierreRecepcionCambioEstadoItemEditComponent} from './components/cierreRecepcionCambioEstadoItemEdit';
import {CierreRecepcionDataService, CierreRecepcionLogicService} from './services';
import {cierreRecepcionHistoricoItemComponent} from './components/cierreRecepcionHistoricoItem';
import {cierreRecepcionGenerarNuevoCierreComponent} from './components/cierreRecepcionGenerarNuevoCierre';
import {cierreRecepcionImprimirCierreComponent} from './components/cierreRecepcionImprimirCierre';
import {cierreRecepcionImprimirControlComponent} from './components/cierreRecepcionImprimirControl';
import {cierreRecepcionImprimirCierreDirectoComponent} from './components/cierreRecepcionImprimirCierreDirecto'



const config: fw.IConfig[] = [
    cierreRecepcionStates
];


const components: fw.IComponent[] = [
    cierreRecepcionListComponent,
    cierreRecepcionEditComponent,
    cierreRecepcionCambioEstadoItemEditComponent,
    cierreRecepcionHistoricoItemComponent,
    cierreRecepcionGenerarNuevoCierreComponent,
    cierreRecepcionImprimirCierreComponent,
    cierreRecepcionImprimirControlComponent,
    cierreRecepcionImprimirCierreDirectoComponent
];

const services: fw.IService[] = [
    CierreRecepcionDataService,
    CierreRecepcionLogicService
];

// Se crea y exporta el módulo
export const CierreRecepcionModule = angular.module('facturacion.cierreRecepcionList',[]);


config.forEach(c => c.init(CierreRecepcionModule));
components.forEach(c => c.init(CierreRecepcionModule));
services.forEach(s => s.init(CierreRecepcionModule));

// Run
CierreRecepcionModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
 $log = $log.getInstance('facturacion.cierreRecepcionList');
 $log.debug('ON.-');
}
