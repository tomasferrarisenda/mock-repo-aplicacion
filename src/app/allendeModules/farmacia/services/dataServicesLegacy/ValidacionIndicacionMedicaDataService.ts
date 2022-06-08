/**
* @author: ppautasso
* @description: data service para ValidacionIndicacionMedicaController
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';
import { IInfusionEditDto } from '../../models/dto/InfusionEditDto';
import { IDosificacionEditDto } from '../../models/dto';

export interface IValidacionIndicacionMedicaDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
	obtenerInternacionesPorSector(pidSector: number): angular.IPromise<any>;
	obtenerIndicacionesPorInternacion(pIdInternacion: number): angular.IPromise<any>;
	obtenerInfusionPorId(pIdDosificacion: number, pIdSucursal: number): angular.IPromise<any>;
	obtenerDosificacionPorId(pIdDosificacion: number, pIdSucursal: number): angular.IPromise<any>;
	agregarDescartableADosificacion(pIdDosificacion: number, pIdSucursal: number, pIdStockeable: number, pIdTipoStockeable: number): angular.IPromise<any>;
	eliminarDescartable(pIdDescartable: number, pIdSucursal: number): angular.IPromise<any>;
	editarInfusion(infusionEdit: IInfusionEditDto): angular.IPromise<any>;
	editarDosificacion(dosificacionEdit: IDosificacionEditDto): angular.IPromise<any>;
	asignarProductoAInfusion(pIdInfusion: number, pIdSucursal: number, pIdStockeable: number, pIdTipoStockeable: number): angular.IPromise<any>;
	desasignarProductoAInfusion(pIdInfusion:number, pIdSucursal: number): angular.IPromise<any>;

	
}

class dataService implements IValidacionIndicacionMedicaDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class ValidacionIndicacionMedicaDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('ValidacionIndicacionMedicaDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'IndicacionesMedicas/FarmaciaInterna/ValidacionIndicacionMedica/';
		return this.DtoService.Get(url);
	}

	getOne(id) {
		let url = `IndicacionesMedicas/FarmaciaInterna/ValidacionIndicacionMedica/${id}`;
		return this.DtoService.Get(url);
	}
	
	obtenerInternacionesPorSector(pidSector: number){
		let url = `IndicacionesMedicas/FarmaciaInterna/ValidacionIndicacionMedica/ObtenerInternacionesPorSector/${pidSector}`;
		return this.DtoService.Get(url);
	}

	obtenerIndicacionesPorInternacion(pIdInternacion: number){
		let url = `IndicacionesMedicas/FarmaciaInterna/ValidacionIndicacionMedica/ObtenerIndicacionesPorInternacion/${pIdInternacion}`;
		return this.DtoService.Get(url);
	}

	obtenerInfusionPorId(pIdInfusion, pIdSucursal){
		let url = `IndicacionesMedicas/FarmaciaInterna/ValidacionIndicacionMedica/ObtenerInfusionPorId/${pIdInfusion}/${pIdSucursal}`;
		return this.DtoService.Get(url);
	}

	obtenerDosificacionPorId(pIdDosificacion, pIdSucursal){
		let url = `IndicacionesMedicas/FarmaciaInterna/ValidacionIndicacionMedica/ObtenerDosificacionPorId/${pIdDosificacion}/${pIdSucursal}`;
		return this.DtoService.Get(url);
	}

	agregarDescartableADosificacion(pIdDosificacion: number, pIdSucursal: number, pIdStockeable: number, pIdTipoStockeable: number){
		let url = `IndicacionesMedicas/FarmaciaInterna/ValidacionIndicacionMedica/AgregarDescartableADosificacion/${pIdDosificacion}/${pIdSucursal}/${pIdStockeable}/${pIdTipoStockeable}`;
		return this.DtoService.Get(url);
	}
		
	eliminarDescartable(pIdDescartable: number, pIdSucursal: number){
		let url = `IndicacionesMedicas/FarmaciaInterna/ValidacionIndicacionMedica/EliminarDescartable/${pIdDescartable}/${pIdSucursal}`;
		return this.DtoService.Get(url);
	}

	editarInfusion(infusionEdit: IInfusionEditDto){
		let url = `IndicacionesMedicas/FarmaciaInterna/ValidacionIndicacionMedica/EditarInfusion/`;
		return this.DtoService.Post(url, infusionEdit);
	}

	editarDosificacion(dosificacionEdit: IDosificacionEditDto){
		let url = `IndicacionesMedicas/FarmaciaInterna/ValidacionIndicacionMedica/EditarDosificacion/`;
		return this.DtoService.Post(url, dosificacionEdit);
	}

	asignarProductoAInfusion(pIdInfusion: number, pIdSucursal: number, pIdStockeable: number, pIdTipoStockeable: number){
		let url = `IndicacionesMedicas/FarmaciaInterna/ValidacionIndicacionMedica/AsignarProductoAInfusion/${pIdInfusion}/${pIdSucursal}/${pIdStockeable}/${pIdTipoStockeable}`;
		return this.DtoService.Get(url);
	}

	desasignarProductoAInfusion(pIdInfusion:number, pIdSucursal: number){
		let url = `IndicacionesMedicas/FarmaciaInterna/ValidacionIndicacionMedica/DesasignarProductoAInfusion/${pIdInfusion}/${pIdSucursal}`;
		return this.DtoService.Get(url);
	}

	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class ValidacionIndicacionMedicaDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('ValidacionIndicacionMedicaDataService', dataService.serviceFactory())
	}
}