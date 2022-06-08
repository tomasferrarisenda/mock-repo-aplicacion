/**
* @author: ppautasso
* @description: service data para MovimientoStockIndicacionMedicaController
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';
import { IFiltroBusquedaMovimientoIndicacionMedicaDto } from '../models';

export interface IMovimientoStockIndicacionMedicaDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
	obtenerPorFiltros(filtroBusquedaMovimientoIndicacionMedicaDto: IFiltroBusquedaMovimientoIndicacionMedicaDto): angular.IPromise<any>;
	obtenerNuevoFiltro(): angular.IPromise<any>;
	obtenerDetalleEntregaMovimiento(pIdMovimiento: number): angular.IPromise<any>;
	obtenerRemito(pIdMovimiento: number): angular.IPromise<any>;
	verDetalleMovimiento(pIdMovimiento: number): angular.IPromise<any>;
}

class dataService implements IMovimientoStockIndicacionMedicaDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class MovimientoStockIndicacionMedicaDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('MovimientoStockIndicacionMedicaDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'Stock2/Movimientos/MovimientoStockIndicacionMedica/';
		return this.DtoService.Get(url);
	}

	getOne(id) {
		let url = `Stock2/Movimientos/MovimientoStockIndicacionMedica/${id}`;
		return this.DtoService.Get(url);
	}

	obtenerPorFiltros(filtroBusquedaMovimientoIndicacionMedicaDto: IFiltroBusquedaMovimientoIndicacionMedicaDto){
		let url = `Stock2/Movimientos/MovimientoStockIndicacionMedica/ObtenerPorFiltros`;
		return this.DtoService.Post(url, filtroBusquedaMovimientoIndicacionMedicaDto);
	}

	obtenerNuevoFiltro(){
		let url = `Stock2/Movimientos/MovimientoStockIndicacionMedica/ObtenerNuevoFiltro`;
		return this.DtoService.Get(url);
	}

	obtenerDetalleEntregaMovimiento(pIdMovimiento){
		let url = `Stock2/Movimientos/MovimientoStockIndicacionMedica/ObtenerDetalleEntregaMovimiento/${pIdMovimiento}`;
		return this.DtoService.Get(url);
	}

	obtenerRemito(pIdMovimiento){
		let url = `Stock2/Movimientos/MovimientoStockIndicacionMedica/ObtenerRemito/${pIdMovimiento}`;
		return this.DtoService.Get(url);
	}
		
	verDetalleMovimiento(pIdMovimiento: number){
		let url = `Stock2/Movimientos/MovimientoStockIndicacionMedica/VerDetalleMovimiento/${pIdMovimiento}`;
		return this.DtoService.Get(url);
	}

	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class MovimientoStockIndicacionMedicaDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('MovimientoStockIndicacionMedicaDataService', dataService.serviceFactory())
	}
}