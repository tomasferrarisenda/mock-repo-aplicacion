/**
* @author: ppautasso 
* @description: Data service para IndicacionMedicaEntregadasPendientes endpoint
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';
import { IEntregaPendienteDto } from '../models';

export interface IFarmaciaIndicacionesMedicasDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
	obtenerInternacionesConDevolucionesPendientes(pIdSucursal: number): angular.IPromise<any>;
	obtenerInternacionesConDevolucionesPendientesPorSector(pIdSector: number): angular.IPromise<any>;
	obtenerInternacionesConAltaConDevolucionesPendientes(pIdSucursal: number): angular.IPromise<any>;
	obtenerConDevolucionesPendientesPorInternacion(pIdInternacion: number): angular.IPromise<any>;
	obtenerNuevaEntregaPendiente(): angular.IPromise<any>;
	obtenerNuevoConceptoFacturable(): angular.IPromise<any>;
	facturarODevolverEntregasPendientes(pEntregaPendienteDto: IEntregaPendienteDto): angular.IPromise<any>;

}

class dataService implements IFarmaciaIndicacionesMedicasDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class FarmaciaIndicacionesMedicasDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('FarmaciaIndicacionesMedicasDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'IndicacionesMedicas/FarmaciaInterna/IndicacionMedicaEntregadasPendientes/';
		return this.DtoService.Get(url);
	}

	getOne(id) {
		let url = `IndicacionesMedicas/FarmaciaInterna/IndicacionMedicaEntregadasPendientes/${id}`;
		return this.DtoService.Get(url);
	}

	obtenerInternacionesConDevolucionesPendientesPorSector(pIdSector: number) { 
		let url = `IndicacionesMedicas/FarmaciaInterna/IndicacionMedicaEntregadasPendientes/ObtenerInternacionesConDevolucionesPendientesPorSector/${pIdSector}`;
		return this.DtoService.Get(url);
	}

	obtenerInternacionesConAltaConDevolucionesPendientes(pIdSucursal: number) { 
		let url = `IndicacionesMedicas/FarmaciaInterna/IndicacionMedicaEntregadasPendientes/ObtenerInternacionesConAltaConDevolucionesPendientes/${pIdSucursal}`;
		return this.DtoService.Get(url);
	}

	obtenerInternacionesConDevolucionesPendientes(pIdSucursal: number){
		let url = `IndicacionesMedicas/FarmaciaInterna/IndicacionMedicaEntregadasPendientes/ObtenerInternacionesConDevolucionesPendientes/${pIdSucursal}`;
		return this.DtoService.Get(url);
	}

	obtenerConDevolucionesPendientesPorInternacion(pIdInternacion: number){
		let url = `IndicacionesMedicas/FarmaciaInterna/IndicacionMedicaEntregadasPendientes/ObtenerConDevolucionesPendientesPorInternacion/${pIdInternacion}`;
		return this.DtoService.Get(url);
	}

	obtenerNuevaEntregaPendiente(){
		let url = `IndicacionesMedicas/FarmaciaInterna/IndicacionMedicaEntregadasPendientes/ObtenerNuevaEntregaPendiente`;
		return this.DtoService.Get(url);
	}

	obtenerNuevoConceptoFacturable(){
		let url = `IndicacionesMedicas/FarmaciaInterna/IndicacionMedicaEntregadasPendientes/ObtenerNuevoConceptoFacturable`;
		return this.DtoService.Get(url);
	}

	facturarODevolverEntregasPendientes(pEntregaPendienteDto: IEntregaPendienteDto){
		var url = `IndicacionesMedicas/FarmaciaInterna/IndicacionMedicaEntregadasPendientes/FacturarODevolverEntregasPendientes`;
		return this.DtoService.Post(url, pEntregaPendienteDto);
	}
	
	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class FarmaciaIndicacionesMedicasDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('FarmaciaIndicacionesMedicasDataService', dataService.serviceFactory())
	}
}