/**
* @author: ppautasso
* @description: data service para EstadoMovimientoStockController
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IEstadoMovimientoStockDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
}

class dataService implements IEstadoMovimientoStockDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class EstadoMovimientoStockDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('EstadoMovimientoStockDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'Stock2/Movimientos/EstadoMovimientoStock/ObtenerTodos';
		return this.DtoService.Get(url, { isCachable: true });
	}

	getOne(id) {
		let url = `Stock2/Movimientos/EstadoMovimientoStock/${id}`;
		return this.DtoService.Get(url);
	}

	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class EstadoMovimientoStockDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('EstadoMovimientoStockDataService', dataService.serviceFactory())
	}
}