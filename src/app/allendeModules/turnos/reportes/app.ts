/**
* @author:         emansilla
* @description:    Informe de turnos
* @type:           Module
**/
import * as angular from 'angular';
import { TurnoReportesConfigModule } from './config';
import { TurnoReportesDataService, TurnoReportesLogicService,RecursoPrestadoDataService } from './services';
import { ReportePrimerosTurnosComponent, ReporteGenericoTurnosComponent,ReporteRecesosComponent,ReporteProfesionalesPrestadoresComponent } from './components'


const modules =  [ TurnoReportesConfigModule ]

export const TurnoReportesModule = angular.module('turno.informes', modules.map(m => m.name));

// Services
TurnoReportesDataService.init(TurnoReportesModule);
TurnoReportesLogicService.init(TurnoReportesModule);
RecursoPrestadoDataService.init(TurnoReportesModule);

// Components
ReportePrimerosTurnosComponent.init(TurnoReportesModule);
ReporteGenericoTurnosComponent.init(TurnoReportesModule);
ReporteRecesosComponent.init(TurnoReportesModule);
ReporteProfesionalesPrestadoresComponent.init(TurnoReportesModule);

// Run
TurnoReportesModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log:ILogger){
	$log = $log.getInstance('TurnosReportes');
	$log.debug('ON.-');
}