/**
* @author: ppautasso
* @description: data service para EntregarIndicacionMedicaController
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';
import { IEntregaFarmaciaDto } from '../models';

export interface IEntregarIndicacionMedicaDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
	obtenerParaEntregarPorSector(pIdSector: number): angular.IPromise<any>;
	entregar(entregaFarmaciaDto: IEntregaFarmaciaDto): angular.IPromise<any>;
	obtenerNuevoEntregaFarmacia(): angular.IPromise<any>;
}

class dataService implements IEntregarIndicacionMedicaDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class EntregarIndicacionMedicaDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('EntregarIndicacionMedicaDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'IndicacionesMedicas/FarmaciaInterna/EntregarIndicacionMedica/';
		return this.DtoService.Get(url);
	}

	getOne(id) {
		let url = `IndicacionesMedicas/FarmaciaInterna/EntregarIndicacionMedica/${id}`;
		return this.DtoService.Get(url);
	}

	obtenerParaEntregarPorSector(pIdSector: number){
		let url = `IndicacionesMedicas/FarmaciaInterna/EntregarIndicacionMedica/ObtenerParaEntregarPorSector/${pIdSector}`;
		return this.DtoService.Get(url);
	}

	entregar(entregaFarmaciaDto: IEntregaFarmaciaDto){
		let url = `IndicacionesMedicas/FarmaciaInterna/EntregarIndicacionMedica/Entregar`;
		return this.DtoService.Post(url, entregaFarmaciaDto);
	}

	obtenerNuevoEntregaFarmacia(){
		let url = `IndicacionesMedicas/FarmaciaInterna/EntregarIndicacionMedica/ObtenerNuevoEntregaFarmacia`;
		return this.DtoService.Get(url);
	}
	
	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class EntregarIndicacionMedicaDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('EntregarIndicacionMedicaDataService', dataService.serviceFactory())
	}
}