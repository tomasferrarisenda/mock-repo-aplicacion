/**
* @author: ppautasso
* @description: data service para IndicacionMedicaEnfermeriaController
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';
import { IEjecucionParaSuministroDTo, IInfusionParaColocarSueroDto } from '../../models';

export interface IIndicacionMedicaEnfermeriaDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
	obtenerIndicacionesPorSector(pIdSector): angular.IPromise<any>;
	obtenerIndicacionesPorInternacion(pIdInternacion, pFecha): angular.IPromise<any>;
	obtenerEjecucionParaSuministro(pIdToma: number, pIdSucursal: number): angular.IPromise<any>;
	suministrarEjecucion(pEjecucionParaSuministro: IEjecucionParaSuministroDTo): angular.IPromise<any>;
	obtenerInfusionParaColocarSuero(pIdInfusion: number, pIdSucursal: number): angular.IPromise<any>;
	colocarSuero(pInfusionParaColocarSueroDto: IInfusionParaColocarSueroDto): angular.IPromise<any>;
	obtenerInfoImpresionEtiqueta(pIdIndicacionMedica: number, pIdTipo: number, pIdSucursal: number): angular.IPromise<any>;
	validarSuministroMedicamento(pNroInternacion: number, pCodigoProducto:number): angular.IPromise<any>;
}

class dataService implements IIndicacionMedicaEnfermeriaDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class IndicacionMedicaEnfermeriaDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('IndicacionMedicaEnfermeriaDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'IndicacionesMedicas/Enfermeria/IndicacionMedicaEnfermeria/';
		return this.DtoService.Get(url);
	}

	getOne(id) {
		let url = `IndicacionesMedicas/Enfermeria/IndicacionMedicaEnfermeria/${id}`;
		return this.DtoService.Get(url);
	}

	obtenerIndicacionesPorSector(pIdSector){
		let url = `IndicacionesMedicas/Enfermeria/IndicacionMedicaEnfermeria/ObtenerInternacionesPorSector/${pIdSector}`;
		return this.DtoService.Get(url);
	}

	obtenerIndicacionesPorInternacion(pIdInternacion, pFecha){
		let url = `IndicacionesMedicas/Enfermeria/IndicacionMedicaEnfermeria/ObtenerIndicacionesPorInternacion/${pIdInternacion}/${pFecha}`;
		return this.DtoService.Get(url);
	}

	obtenerEjecucionParaSuministro(pIdToma: number, pIdSucursal: number){
		let url = `IndicacionesMedicas/Enfermeria/IndicacionMedicaEnfermeria/ObtenerEjecucionParaSuministro/${pIdToma}/${pIdSucursal}`;
		return this.DtoService.Get(url);
	}

	suministrarEjecucion(pEjecucionParaSuministro: IEjecucionParaSuministroDTo){
		let url = `IndicacionesMedicas/Enfermeria/IndicacionMedicaEnfermeria/SuministrarEjecucion/`;
		return this.DtoService.Post(url, pEjecucionParaSuministro);
	}

	obtenerInfusionParaColocarSuero(pIdInfusion: number, pIdSucursal: number){
		let url = `IndicacionesMedicas/Enfermeria/IndicacionMedicaEnfermeria/ObtenerInfusionParaColocarSuero/${pIdInfusion}/${pIdSucursal}`;
		return this.DtoService.Get(url);
	}

	colocarSuero(pInfusionParaColocarSueroDto: IInfusionParaColocarSueroDto){
		let url = `IndicacionesMedicas/Enfermeria/IndicacionMedicaEnfermeria/ColocarSuero/`;
		return this.DtoService.Post(url, pInfusionParaColocarSueroDto);
	}

	obtenerInfoImpresionEtiqueta(pIdIndicacionMedica: number, pIdTipo: number, pIdSucursal: number){
		let url = `IndicacionesMedicas/Enfermeria/IndicacionMedicaEnfermeria/ObtenerInfoImpresionEtiqueta/${pIdIndicacionMedica}/${pIdTipo}/${pIdSucursal}`;
		return this.DtoService.Get(url);
	}

	validarSuministroMedicamento(pNroInternacion: number, pCodigoProducto:number){
		let url = `IndicacionesMedicas/Enfermeria/IndicacionMedicaEnfermeria/ValidarSuministroMedicamento/${pNroInternacion}/${pCodigoProducto}`;
		return this.DtoService.Get(url);
	}


	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class IndicacionMedicaEnfermeriaDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('IndicacionMedicaEnfermeriaDataService', dataService.serviceFactory())
	}
}