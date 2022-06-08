/**
* @author: ppautasso
* @description: data service para CambiarEstadoFarmaciaIndicacionMedicaController
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface ICambiarEstadoFarmaciaIndicacionMedicaDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
	obtenerEstadosPosiblesParaCambiar(pIdTipoConcepto: number, pIdConcepto: number, pIdSucursal: number): angular.IPromise<any>;
	cambiarEstadoFarmaciaIndicacionMedica(pIdTipoConcepto: number, pIdConcepto: number, pIdSucursal: number, pIdEstado: number): angular.IPromise<any>;
}

class dataService implements ICambiarEstadoFarmaciaIndicacionMedicaDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class CambiarEstadoFarmaciaIndicacionMedicaDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('CambiarEstadoFarmaciaIndicacionMedicaDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'IndicacionesMedicas/FarmaciaInterna/CambiarEstadoFarmaciaIndicacionMedicaController/';
		return this.DtoService.Get(url);
	}

	getOne(id) {
		let url = `IndicacionesMedicas/FarmaciaInterna/CambiarEstadoFarmaciaIndicacionMedicaController/${id}`;
		return this.DtoService.Get(url);
	}

	obtenerEstadosPosiblesParaCambiar(pIdTipoConcepto: number, pIdConcepto: number, pIdSucursal: number){
		let url = `IndicacionesMedicas/FarmaciaInterna/CambiarEstadoFarmaciaIndicacionMedicaController/ObtenerEstadosPosiblesParaCambiar/${pIdTipoConcepto}/${pIdConcepto}/${pIdSucursal}`;
		return this.DtoService.Get(url);
	}

	cambiarEstadoFarmaciaIndicacionMedica(pIdTipoConcepto: number, pIdConcepto: number, pIdSucursal: number, pIdEstado: number){
		let url = `IndicacionesMedicas/FarmaciaInterna/CambiarEstadoFarmaciaIndicacionMedicaController/CambiarEstado/${pIdTipoConcepto}/${pIdConcepto}/${pIdSucursal}/${pIdEstado}`;
		return this.DtoService.Get(url);
	}

	
	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class CambiarEstadoFarmaciaIndicacionMedicaDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('CambiarEstadoFarmaciaIndicacionMedicaDataService', dataService.serviceFactory())
	}
}