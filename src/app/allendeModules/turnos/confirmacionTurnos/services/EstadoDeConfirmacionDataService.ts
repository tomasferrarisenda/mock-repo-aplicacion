/**
* @author: ppautasso
* @description: data service para EstadoDeConfirmacionController
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IEstadoDeConfirmacionDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
}

class dataService implements IEstadoDeConfirmacionDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class EstadoDeConfirmacionDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('EstadoDeConfirmacionDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'Turnos/ConfirmacionDeTurnos/EstadoDeConfirmacion/ObtenerTodos';
		return this.DtoService.Get(url, { isCachable: true });
	}

	getOne(id) {
		let url = `Turnos/ConfirmacionDeTurnos/EstadoDeConfirmacion/${id}`;
		return this.DtoService.Get(url);
	}

	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class EstadoDeConfirmacionDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('EstadoDeConfirmacionDataService', dataService.serviceFactory())
	}
}