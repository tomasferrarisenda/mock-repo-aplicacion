/**
* @author: ppautasso
* @description: Data service para tipo movimientos stock
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface ITipoMovimientoStockDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
	obtenerTodosParaStockPorPiso(): angular.IPromise<any>;
	obtenerTodosParaStockPorPisoPorUsuarioActual(): angular.IPromise<any>;
	obtenerTodosParaIndicacionesMedica(): angular.IPromise<any>;
	obtenerTodosParaStockPorPisoParaListaMovimientos(): angular.IPromise<any>;
}

class dataService implements ITipoMovimientoStockDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class TipoMovimientoStockDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('TipoMovimientoStockDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'Stock2/Movimientos/TipoMovimientoStock2/';
		return this.DtoService.Get(url);
	}

	getOne(id) {
		let url = `Stock2/Movimientos/TipoMovimientoStock2/${id}`;
		return this.DtoService.Get(url);
	}

	obtenerTodosParaStockPorPiso() {
		let url = `Stock2/Movimientos/TipoMovimientoStock2/ObtenerTodosParaStockPorPiso/`;
		return this.DtoService.Get(url);
	}

	obtenerTodosParaStockPorPisoPorUsuarioActual() {
		let url = `Stock2/Movimientos/TipoMovimientoStock2/ObtenerTodosParaStockPorPisoPorUsuarioActual/`;
		return this.DtoService.Get(url);
	}

	obtenerTodosParaIndicacionesMedica(){
		let url = `Stock2/Movimientos/TipoMovimientoStock2/ObtenerTodosParaIndicacionMedica/`;
		return this.DtoService.Get(url);
	}

	obtenerTodosParaStockPorPisoParaListaMovimientos(){
		let url = `Stock2/Movimientos/TipoMovimientoStock2/ObtenerTodosParaStockPorPisoParaListaMovimientos/`;
		return this.DtoService.Get(url);
	}


	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class TipoMovimientoStockDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('TipoMovimientoStockDataService', dataService.serviceFactory())
	}
}