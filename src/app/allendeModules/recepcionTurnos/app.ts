/**
* @author:         ppautasso
* @description:    Modulo de recepcion de turnos
* @type:           Module
**/
import * as angular from 'angular';
import { RecepcionTurnosConfigModule } from './config';
import { RecepcionTurnosComponent, AsignarTurnoEnRecepcionComponent, ReporteTurnosDelDiaProfesionalComponent, 
    ImprimirReporteTurnosPorFechaYProfesionalComponent, DocumentosRecepcionComponent, AnularRecepcionComponent } from './componentes';
import { RecepcionTurnosDataService, RecepcionTurnosLogicService, RecepcionTurnosStorageHelperService } from './services';
import RecepcionTurnosAuthService from './services/RecepcionTurnosAuthService';

const modules = [
    RecepcionTurnosConfigModule
];

export const RecepcionTurnosModule = angular.module('recepcionTurnos', modules.map(module => module.name))

// Components
RecepcionTurnosComponent.init(RecepcionTurnosModule);
AsignarTurnoEnRecepcionComponent.init(RecepcionTurnosModule);
ReporteTurnosDelDiaProfesionalComponent.init(RecepcionTurnosModule);
ImprimirReporteTurnosPorFechaYProfesionalComponent.init(RecepcionTurnosModule);
DocumentosRecepcionComponent.init(RecepcionTurnosModule);
AnularRecepcionComponent.init(RecepcionTurnosModule);

// Services
RecepcionTurnosDataService.init(RecepcionTurnosModule);
RecepcionTurnosLogicService.init(RecepcionTurnosModule);
RecepcionTurnosStorageHelperService.init(RecepcionTurnosModule);
RecepcionTurnosAuthService.init(RecepcionTurnosModule);

// Run
RecepcionTurnosModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log: ILogger) {
    $log = $log.getInstance('RecepcionTurnos');
    $log.debug('ON.-');
}