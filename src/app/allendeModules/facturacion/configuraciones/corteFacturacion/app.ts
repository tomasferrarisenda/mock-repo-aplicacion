/**
* @author: crusso
* @description: App Corte Facturacion
* @type: Module
**/

import * as angular from 'angular';
import { corteFacturacionStates } from './config';
import { corteFacturacionEditComponent } from './components/corteFacturacionEdit';
import { corteFacturacionListComponent } from './components/corteFacturacionList/corteFacturacionListComponent';
import { CorteFacturacionDataService } from './services/corteFacturacionDataService';
import { CorteFacturacionLogicService } from './services/corteFacturacionLogicServices';

const modules: angular.IModule[] = [
];

const config: fw.IConfig[] = [
    corteFacturacionStates
];

const components: fw.IComponent[] = [
    corteFacturacionListComponent,
    corteFacturacionEditComponent
];

const services: fw.IService[] = [
    CorteFacturacionDataService,
    CorteFacturacionLogicService
];

// Se crea y exporta el módulo
export const corteFacturacionModule = angular.module('facturacion.configuraciones.corteFacturacion', modules.map(module => module.name));

//export const corteFacturacionModule = angular.module('facturacion.configuraciones.corteFacturacion', []);

config.forEach(c => c.init(corteFacturacionModule));
components.forEach(c => c.init(corteFacturacionModule));
services.forEach(s => s.init(corteFacturacionModule));

// Run
corteFacturacionModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log: ILogger) {
    $log = $log.getInstance('corteFacturacion');
    $log.debug('ON.-');
}