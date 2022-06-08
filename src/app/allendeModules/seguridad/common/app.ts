/**
 * @author:         ppautasso
 * @description:    Cosas comunes de seguridad
 * @type:           Module
 **/
import * as angular from 'angular';

import saPermisosXModuloList from './directives/saPermisosXModuloList';
import ModulosPermisoDataService from './services/ModulosPermisoDataService';
import PermisosDataService from './services/PermisosDataService';

const modules: angular.IModule[] = [

];

const config: fw.IDirective[] = [
	saPermisosXModuloList
];

const services: fw.IService[] = [
	ModulosPermisoDataService,
	PermisosDataService
];

// Se crea y exporta el módulo
export const SeguridadCommonModule = angular.module('seguridad.common', modules.map(module => module.name));

config.forEach(c => c.init(SeguridadCommonModule));
services.forEach(s => s.init(SeguridadCommonModule));

// Run
SeguridadCommonModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('Seguridad.Common');
	$log.debug('ON.-');
}