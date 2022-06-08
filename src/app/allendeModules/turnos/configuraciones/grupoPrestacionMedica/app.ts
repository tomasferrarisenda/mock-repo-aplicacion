/**
* @author: pferrer
* @description: Grupo Prestacion
* @type: Module
**/
import * as angular from 'angular';
import { TurnoGrupoPrestacionMedicaStates } from './config/states';
import { GrupoPrestacionMedicaEditComponent } from './components/grupoPrestacionMedicaEdit/GrupoPrestacionMedicaEditComponent';
import { GrupoPrestacionMedicaListComponent } from './components/grupoPrestacionMedicaList/GrupoPrestacionMedicaListComponent';
import { GrupoPrestacionMedicaDataService, GrupoPrestacionMedicaLogicService,GrupoDePrestacionesDeRecursoServicioSucursalDataService } from './services';

const config: fw.IConfig[] = [
    TurnoGrupoPrestacionMedicaStates
];

const components: fw.IComponent[] = [
    GrupoPrestacionMedicaListComponent,
    GrupoPrestacionMedicaEditComponent
];

const services: fw.IService[] = [
    GrupoPrestacionMedicaDataService,
    GrupoPrestacionMedicaLogicService,
    GrupoDePrestacionesDeRecursoServicioSucursalDataService
];

// Se crea y exporta el módulo
export const TurnoGrupoPrestacionMedicaModule = angular.module('turno.configuraciones.grupoPrestacionMedica', []);


config.forEach(c => c.init(TurnoGrupoPrestacionMedicaModule));
components.forEach(c => c.init(TurnoGrupoPrestacionMedicaModule));
services.forEach(s => s.init(TurnoGrupoPrestacionMedicaModule));

// Run
TurnoGrupoPrestacionMedicaModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log: ILogger) {
    $log = $log.getInstance('Turnos.Configuraciones.GrupoPrestacionesMedicas');
    $log.debug('ON.-');
}
