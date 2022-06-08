/**
* @author: ppautasso
* @description: Data service para movimientos stock
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IMovimientosStockDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
	autorizarMovimiento(idMovimiento: number): angular.IPromise<any>;
	cancelarMovimiento(idMovimiento: number): angular.IPromise<any>;
	verDetalleMovimiento(idMovimiento: number): angular.IPromise<any>;
	verDetalleMovimientoDeDeposito(idMovimiento: number, idDeposito:number): angular.IPromise<any>;
	verHistorialMovimientos(pFechaDesde: string, pFechaHasta: string, pIdDeposito: number, 
		pIdTipoStockeable: number, pIdStockeable: number): angular.IPromise<any>;
}

class dataService implements IMovimientosStockDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class MovimientosStockDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('MovimientosStockDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'Stock2/Movimientos/MovStock/';
		return this.DtoService.Get(url);
	}

	getOne(id) {
		let url = `Stock2/Movimientos/MovStock/${id}`;
		return this.DtoService.Get(url);
	}

	autorizarMovimiento(idMovimiento: number) {
		let url = `Stock2/Movimientos/MovStock/AutorizarMovimiento/${idMovimiento}`;
		return this.DtoService.Get(url);
	}

	cancelarMovimiento(idMovimiento: number) {
		let url = `Stock2/Movimientos/MovStock/CancelarMovimiento/${idMovimiento}`;
		return this.DtoService.Get(url);
	}

	verDetalleMovimiento(idMovimiento: number) {
		let url = `Stock2/Movimientos/MovStock/VerDetalleMovimiento/${idMovimiento}`;
		return this.DtoService.Get(url);
	}

	verDetalleMovimientoDeDeposito(idMovimiento: number, idDeposito: number) {
		let url = `Stock2/Movimientos/MovStock/VerDetalleMovimientoDeDeposito/${idMovimiento}/${idDeposito}`;
		return this.DtoService.Get(url);
	}

	verHistorialMovimientos(pFechaDesde: string, pFechaHasta: string, pIdDeposito: number, pIdTipoStockeable: number, pIdStockeable: number){
		let url = `Stock2/Movimientos/MovStock/VerHistorialMovimientos/${pFechaDesde}/${pFechaHasta}/${pIdDeposito}/${pIdTipoStockeable}/${pIdStockeable}`;
		return this.DtoService.Get(url);
	}
	
	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class MovimientosStockDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('MovimientosStockDataService', dataService.serviceFactory())
	}
}