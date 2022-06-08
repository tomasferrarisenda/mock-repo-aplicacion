/**
* @author:         mastore
* @description:    Configuracion de CUestionario
* @type:           Module
**/
import * as angular from 'angular';
import states from './states';

export const AllendeSupportCuestionarioConfigModule = angular.module('allende.support.cuestionario.config', []);

states.init(AllendeSupportCuestionarioConfigModule);

AllendeSupportCuestionarioConfigModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('Allende.Support.Cuestionario.Config');
	$log.debug('ON.-');
}