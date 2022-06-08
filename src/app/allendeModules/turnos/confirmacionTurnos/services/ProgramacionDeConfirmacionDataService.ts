/**
* @author: ppautasso
* @description: service data para \ProgramacionDeConfirmacionController.cs
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IProgramacionDeConfirmacionDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
}

class dataService implements IProgramacionDeConfirmacionDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class ProgramacionDeConfirmacionDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('ProgramacionDeConfirmacionDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'Turnos/ConfirmacionDeTurnos/ProgramacionDeConfirmacion/ObtenerTodos/';
		return this.DtoService.Get(url);
	}

	getOne(id) {
		let url = `Turnos/ConfirmacionDeTurnos/ProgramacionDeConfirmacion/${id}`;
		return this.DtoService.Get(url);
	}

	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class ProgramacionDeConfirmacionDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('ProgramacionDeConfirmacionDataService', dataService.serviceFactory())
	}
}