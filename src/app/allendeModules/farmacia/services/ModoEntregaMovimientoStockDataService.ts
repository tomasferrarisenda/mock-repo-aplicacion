/**
* @author: ppautasso
* @description: Data service para ModoEntregaMovimientoStockController
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IModoEntregaMovimientoStockDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
}

class dataService implements IModoEntregaMovimientoStockDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class ModoEntregaMovimientoStockDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('ModoEntregaMovimientoStockDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'Stock2/Movimientos/ModoEntregaMovimientoStock/ObtenerTodos/';
		return this.DtoService.Get(url, { isCachable: true });
	}

	getOne(id) {
		let url = `Stock2/Movimientos/ModoEntregaMovimientoStock/${id}`;
		return this.DtoService.Get(url);
	}

	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class ModoEntregaMovimientoStockDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('ModoEntregaMovimientoStockDataService', dataService.serviceFactory())
	}
}