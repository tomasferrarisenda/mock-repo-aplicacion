/**
* @author:         emansilla
* @description:    Configuración de informes de turno
* @type:           Module
**/
import * as angular from 'angular';
import { TurnoReportesStates } from './states';

export const TurnoReportesConfigModule = angular.module('turno.informes.config', []);

TurnoReportesStates.init(TurnoReportesConfigModule);

// Run
TurnoReportesConfigModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('TurnoReportesConfig');
	$log.debug('ON.-');
}