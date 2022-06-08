/**
* @author:         ppautasso
* @description:    Modulo confirmacion de turnos
* @type:           Module
**/
import * as angular from 'angular';
import { TurnConfirmacionConfigModule } from './config';
import { ConfirmacionTurnosDataService,ProgramacionDeConfirmacionDataService,ExcepcionDeConfirmacionDataService,
	ConfirmacionTurnosLogicService,EjecucionDeProgramacionDeConfirmacionDataService,GestionDeConfirmacionDeTurnoDataService,
	ComunicacionPorConfirmacionDeTurnoDataService,EstadoDeConfirmacionDataService } from './services';
import {ConfirmacionTurnosProgramacionesListComponent,VerExcepcionesPorProgramacionModalComponent,
	ConfirmacionTurnosLogsEjecucionesListComponent,ConfirmacionTurnosResultadosConfirmacionListComponent,VerComunicacionesDelTurnoModalComponent,
	ConfirmacionTurnosListadoComunicacionesListComponent} from './components';


const modules =  [ TurnConfirmacionConfigModule ]

export const TurnoConfirmacionModule = angular.module('turno.confirmacion', modules.map(m => m.name));

// Services
ConfirmacionTurnosDataService.init(TurnoConfirmacionModule);
ProgramacionDeConfirmacionDataService.init(TurnoConfirmacionModule);
ExcepcionDeConfirmacionDataService.init(TurnoConfirmacionModule);
ConfirmacionTurnosLogicService.init(TurnoConfirmacionModule);
EjecucionDeProgramacionDeConfirmacionDataService.init(TurnoConfirmacionModule);
GestionDeConfirmacionDeTurnoDataService.init(TurnoConfirmacionModule);
ComunicacionPorConfirmacionDeTurnoDataService.init(TurnoConfirmacionModule);
EstadoDeConfirmacionDataService.init(TurnoConfirmacionModule);


// Components
ConfirmacionTurnosProgramacionesListComponent.init(TurnoConfirmacionModule);
VerExcepcionesPorProgramacionModalComponent.init(TurnoConfirmacionModule);
ConfirmacionTurnosLogsEjecucionesListComponent.init(TurnoConfirmacionModule);
ConfirmacionTurnosResultadosConfirmacionListComponent.init(TurnoConfirmacionModule);
VerComunicacionesDelTurnoModalComponent.init(TurnoConfirmacionModule);
ConfirmacionTurnosListadoComunicacionesListComponent.init(TurnoConfirmacionModule);

// Run
TurnoConfirmacionModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('TurnosConfirmacionTurnos');
	$log.debug('ON.-');
}