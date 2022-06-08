/**
* @author:         emansilla
* @description:    Datos para Turnos informes 
* @type:           Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface ITurnoReportesDataService {
	getAll(): any;
	getOne(id: number): any;
}

class dataService implements ITurnoReportesDataService {

	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('TurnoReportesDateService');
		this.$log.debug('ON');
	}

	getAll() {}

	getOne(id) {}

	static serviceFactory(log, dtoService) {
		return new dataService(log, dtoService);
	}
}

dataService.serviceFactory.$inject = ['Logger', 'DtoService'];

export class TurnoReportesDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('TurnoReportesDataService', dataService.serviceFactory)
	}
}