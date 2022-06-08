
/**
* @author:         ppautasso
* @description:    TUrnos
* @type:           Module
**/
import * as angular from 'angular';

import "./config/app";
import "./asignacionTurno/app";
import "./common/app";
import { TurnoReportesModule } from './reportes';
import "./listaTurnos/app";
import "./mantenimientoagenda/app";
import "./plantilla/app";
import "./reprogramacion/app";
import "./configuraciones/app";
import {TurnoConfirmacionModule} from './confirmacionTurnos';

const modules: angular.IModule[] = [

];

// Se crea y exporta el módulo
export const TurnoModule = angular.module('turno', [
	'turno.config',
	'turno.asignacionturno',
	'turno.common',
	TurnoReportesModule.name,
	'turno.listaTurnos',
	'turno.mantenimientoagenda',
	'turno.plantilla',
	'turno.reprogramacion',
	'turno.configuraciones',
	TurnoConfirmacionModule.name
]);

// Run
TurnoModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('Turno');
	$log.debug('ON.-');
}