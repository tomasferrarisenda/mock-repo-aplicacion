/**
* @author: crusso
* @description: Tecnicos del Servicio
* @type: Module
**/
import * as angular from 'angular';
import { TecnicoDelServicioStates } from './config';
import { TecnicosDelServicioListComponent, TecnicosDelServicioEditComponent } from './components';
import { TecnicoDelServicioDataService, TecnicoDelServicioLogicService } from './services';

const modules: angular.IModule[] = [

];

const config: fw.IConfig[] = [
	TecnicoDelServicioStates
];

const components: fw.IComponent[] = [
	TecnicosDelServicioListComponent,
	TecnicosDelServicioEditComponent
];

const services: fw.IService[] = [
	TecnicoDelServicioDataService,
	TecnicoDelServicioLogicService
];

// Se crea y exporta el módulo
export const ProfesionalTecnicoDelServicioModule = angular.module('profesionales.tecnicosServicio', modules.map(module => module.name));

config.forEach(c => c.init(ProfesionalTecnicoDelServicioModule));
components.forEach(c => c.init(ProfesionalTecnicoDelServicioModule));
services.forEach(s => s.init(ProfesionalTecnicoDelServicioModule));

// Run
ProfesionalTecnicoDelServicioModule.run(runMethod);

runMethod.$inject = ['Logger'];
function runMethod($log: ILogger) {
	$log = $log.getInstance('ProfesionalTecnicoDelServicio');
	$log.debug('ON.-');
}