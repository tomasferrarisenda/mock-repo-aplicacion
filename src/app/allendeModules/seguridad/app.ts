/**
* @author:         ppautasso
* @description:    Seguridad
* @type:           Module
**/
import * as angular from 'angular';
import { SeguridadCommonModule } from './common';
import { SeguridadConfigModule } from './config';
import { SeguridadRolModule } from './rol';
import { SeguridadUsuarioModule } from './usuario';

const modules: angular.IModule[] = [
	SeguridadCommonModule,
	SeguridadConfigModule,
	SeguridadRolModule,
	SeguridadUsuarioModule
];

// Se crea y exporta el módulo
export const SeguridadModule = angular.module('moduleName', modules.map(module => module.name));

// Run
SeguridadModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('Name');
	$log.debug('ON.-');
}