/**
* @author:         ppautasso
* @description:    App para consultorio medico home
* @type:           Module
**/
import * as angular from 'angular';
import { ConsultorioMedicoHomeStates } from './states';

export const ConsultorioMedicoConfigModule = angular.module('consultorioMedico.config', []);

ConsultorioMedicoConfigModule.run(runMethod);
ConsultorioMedicoHomeStates.init(ConsultorioMedicoConfigModule);

runMethod.$inject = ['Logger'];
function runMethod($log: ILogger) {
	$log = $log.getInstance('ConsultorioMedico.Config');
	$log.debug('ON.-');
}