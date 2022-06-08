/**
* @author:         ppautasso
* @description:    Modulo de Consultorio Medico
* @type:           Module
**/
import * as angular from 'angular';
import { ConsultorioMedicoConfigModule } from './config';
import {ConsultorioMedicoAgendaListComponent,VerHistorialClinicaPacienteModalComponent, SeleccionarConsultorioMedicoModalComponent} from './components';
import {ConsultorioMedicoStorageHelperService, AgendaVisualizableDataService,IngresoHceDataService,ConsultorioMedicoLogicService, ConsultorioDataService} from './services';


const modules = [
	ConsultorioMedicoConfigModule
];

export const ConsultorioMedicoModule = angular.module('consultorioMedico', modules.map(m => m.name))

// Components
ConsultorioMedicoAgendaListComponent.init(ConsultorioMedicoModule);
VerHistorialClinicaPacienteModalComponent.init(ConsultorioMedicoModule);
SeleccionarConsultorioMedicoModalComponent.init(ConsultorioMedicoModule);
// Services
ConsultorioMedicoStorageHelperService.init(ConsultorioMedicoModule);
AgendaVisualizableDataService.init(ConsultorioMedicoModule);
IngresoHceDataService.init(ConsultorioMedicoModule);
ConsultorioMedicoLogicService.init(ConsultorioMedicoModule);
ConsultorioDataService.init(ConsultorioMedicoModule);
// Run
ConsultorioMedicoModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log: ILogger) {
	$log = $log.getInstance('ConsultorioMedico');
	$log.debug('ON.-');
}
