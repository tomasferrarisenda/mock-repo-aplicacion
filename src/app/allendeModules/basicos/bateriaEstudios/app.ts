/**
* @author: crusso
* @description: APP Gestion Recepcion
* @type: Module
**/
import * as angular from 'angular';
import { bateriaEstudiosStates } from './config';
import { bateriaEstudiosListComponent, bateriaEstudiosEditComponent, itemBateriaEstudiosEditComponent } from './components';
import { bateriaEstudiosDataService, IBateriaEstudiosLogicService, bateriaEstudiosLogicService } from './services';


const modules: angular.IModule[] = [

];

const config: fw.IConfig[] = [
    bateriaEstudiosStates
];

const components: fw.IComponent[] = [
    bateriaEstudiosListComponent,
    bateriaEstudiosEditComponent,
    itemBateriaEstudiosEditComponent
];

const services: fw.IService[] = [
    bateriaEstudiosDataService,
    bateriaEstudiosLogicService
];

// Se crea y exporta el módulo
export const bateriaEstudiosModule = angular.module('basicos.bateriaEstudios', modules.map(module => module.name));

config.forEach(c => c.init(bateriaEstudiosModule));
components.forEach(c => c.init(bateriaEstudiosModule));
services.forEach(s => s.init(bateriaEstudiosModule));

// Run
bateriaEstudiosModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log: ILogger) {
    $log = $log.getInstance('basicos.bateriaEstudios');
    $log.debug('ON.-');
}