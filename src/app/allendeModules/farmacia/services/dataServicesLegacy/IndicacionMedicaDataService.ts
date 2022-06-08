/**
* @author: ppautasso
* @description: data service para indicacion medica controller
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IIndicacionMedicaDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
	obtenerPorId(pId:number, pIdSucursal: number, pidTipoIndicacion: number): angular.IPromise<any>;
	obtenerInternacionPorIdConAltas(pIdInternacion: number): angular.IPromise<any>;
	obtenerPorIdInternacionYFiltros(pIdInternacion: number,fechaDesde:string, fechaHasta: string, pIdTipoIndicacion: number, pIdEstadoIndicacion: number): angular.IPromise<any>;
}

class dataService implements IIndicacionMedicaDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class IndicacionMedicaDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('IndicacionMedicaDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'IndicacionesMedicas/FarmaciaInterna/IndicacionMedica/';
		return this.DtoService.Get(url);
	}

	getOne(id) {
		let url = `IndicacionesMedicas/FarmaciaInterna/IndicacionMedica/${id}`;
		return this.DtoService.Get(url);
	}
	
	obtenerPorId(pId, pIdSucursal, pidTipoIndicacion){
		let url = `IndicacionesMedicas/FarmaciaInterna/IndicacionMedica/ObtenerPorId/${pId}/${pIdSucursal}/${pidTipoIndicacion}`;
		return this.DtoService.Get(url);
	}

	obtenerInternacionPorIdConAltas(pIdInternacion){
		let url = `IndicacionesMedicas/FarmaciaInterna/IndicacionMedica/ObtenerInternacionPorIdConAltas/${pIdInternacion}`;
		return this.DtoService.Get(url);
	}

	obtenerPorIdInternacionYFiltros(pIdInternacion,fechaDesde, fechaHasta, pIdTipoIndicacion, pIdEstadoIndicacion){
		let url = `IndicacionesMedicas/FarmaciaInterna/IndicacionMedica/ObtenerPorIdInternacionYFiltros/${pIdInternacion}/${fechaDesde}/${fechaHasta}/${pIdTipoIndicacion}/${pIdEstadoIndicacion}`;
		return this.DtoService.Get(url);
	}

	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class IndicacionMedicaDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('IndicacionMedicaDataService', dataService.serviceFactory())
	}
}