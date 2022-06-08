/**
* @author:         ppautasso
* @description:    Configuracion de recepcion turnos
* @type:           Module
**/
import * as angular from 'angular';
import { RecepcionTurnosStates } from './states';
import permissions from "./permissions";

export const RecepcionTurnosConfigModule = angular.module('recepcionTurnos.config', [

])
    .run(runMethod);
RecepcionTurnosStates.init(RecepcionTurnosConfigModule);
permissions.init(RecepcionTurnosConfigModule);

runMethod.$inject = ['Logger'];
function runMethod($log: ILogger) {
    $log = $log.getInstance('RecepcionTurnos.Config');
    $log.debug('ON.-');
}