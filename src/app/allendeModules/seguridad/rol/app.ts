/**
* @author:         ppautasso
* @description:    Roles en seguridad
* @type:           Module
**/
import * as angular from 'angular';

import './common/app';
import './config/app';
import './gestion/app';

// Se crea y exporta el módulo
export const SeguridadRolModule = angular.module('seguridad.rol', [
	'seguridad.rol.common',
	'seguridad.rol.config',
	'seguridad.rol.gestion'
]);

// Run
SeguridadRolModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('Seguridad.Rol');
	$log.debug('ON.-');
}