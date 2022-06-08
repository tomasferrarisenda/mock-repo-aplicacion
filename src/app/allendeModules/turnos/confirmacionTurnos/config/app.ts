/**
* @author:         ppautasso
* @description:    Configuración de confirmacion de turnos
* @type:           Module
**/
import * as angular from 'angular';
import { TurnoConfirmacionStates } from './states';

export const TurnConfirmacionConfigModule = angular.module('turno.confirmacion.config', []);

TurnoConfirmacionStates.init(TurnConfirmacionConfigModule);

// Run
TurnConfirmacionConfigModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('TurnConfirmacionConfig');
	$log.debug('ON.-');
}