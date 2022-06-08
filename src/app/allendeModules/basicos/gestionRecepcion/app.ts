/**
* @author: crusso
* @description: APP Gestion Recepcion
* @type: Module
**/
import * as angular from 'angular';
import { gestionRecepcionStates } from './config';
import { gestionRecepcionListComponent, gestionRecepcionEditComponent } from './components';
import { GestionRecepcionDataService, IGestionRecepcionLogicService, GestionRecepcionLogicService } from './services';


const modules: angular.IModule[] = [

];

const config: fw.IConfig[] = [
    gestionRecepcionStates
];

const components: fw.IComponent[] = [
    gestionRecepcionEditComponent,
    gestionRecepcionListComponent,
];

const services: fw.IService[] = [
    GestionRecepcionDataService,
    GestionRecepcionLogicService
];

// Se crea y exporta el módulo
export const gestionRecepcionModule = angular.module('basicos.gestionRecepcion', modules.map(module => module.name));

config.forEach(c => c.init(gestionRecepcionModule));
components.forEach(c => c.init(gestionRecepcionModule));
services.forEach(s => s.init(gestionRecepcionModule));

// Run
gestionRecepcionModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log: ILogger) {
    $log = $log.getInstance('basicos.gestionRecepcion');
    $log.debug('ON.-');
}