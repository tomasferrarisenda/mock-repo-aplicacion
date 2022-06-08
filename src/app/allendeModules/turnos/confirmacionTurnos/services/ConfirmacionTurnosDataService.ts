/**
* @author: ppautasso
* @description: data service para confirmacion de turnos
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IConfirmacionTurnosDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
}

class dataService implements IConfirmacionTurnosDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class ConfirmacionTurnosDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('ConfirmacionTurnosDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'Turnos/ConfirmacionDeTurnos/';
		return this.DtoService.Get(url);
	}

	getOne(id) {
		let url = `Turnos/ConfirmacionDeTurnos/${id}`;
		return this.DtoService.Get(url);
	}
	

	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class ConfirmacionTurnosDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('ConfirmacionTurnosDataService', dataService.serviceFactory())
	}
}