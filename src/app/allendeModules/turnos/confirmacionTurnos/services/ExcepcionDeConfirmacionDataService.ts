/**
* @author: ppautasso
* @description: service data para \ExcepcionDeConfirmacionController.cs
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IExcepcionDeConfirmacionDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
	obtenerPorReprogramacion(pIdProgramacion: number): angular.IPromise<any>;
}

class dataService implements IExcepcionDeConfirmacionDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class ExcepcionDeConfirmacionDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('ExcepcionDeConfirmacionDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'Turnos/ConfirmacionDeTurnos/ExcepcionDeConfirmacion/';
		return this.DtoService.Get(url);
	}

	getOne(id) {
		let url = `Turnos/ConfirmacionDeTurnos/ExcepcionDeConfirmacion/${id}`;
		return this.DtoService.Get(url);
	}

	obtenerPorReprogramacion(pIdProgramacion: number){
		let url = `Turnos/ConfirmacionDeTurnos/ExcepcionDeConfirmacion/ObtenerPorProgramacion/${pIdProgramacion}`;
		return this.DtoService.Get(url);
	}

	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class ExcepcionDeConfirmacionDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('ExcepcionDeConfirmacionDataService', dataService.serviceFactory())
	}
}