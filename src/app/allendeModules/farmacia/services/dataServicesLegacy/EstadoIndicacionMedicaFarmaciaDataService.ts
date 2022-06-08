/**
* @author: ppautasso
* @description: data service para estados de indicacion medica farmacia
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IEstadoIndicacionmedicaFarmaciaDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
}

class dataService implements IEstadoIndicacionmedicaFarmaciaDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class EstadoIndicacionmedicaFarmaciaDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('EstadoIndicacionmedicaFarmaciaDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'IndicacionesMedicas/Legacy/EstadoIndicacionMedicaFarmacia/ObtenerTodos';
		return this.DtoService.Get(url, { isCachable: true });
	}

	getOne(id) {
		let url = `IndicacionesMedicas/Legacy/EstadoIndicacionMedicaFarmacia/${id}`;
		return this.DtoService.Get(url);
	}

	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class EstadoIndicacionmedicaFarmaciaDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('EstadoIndicacionmedicaFarmaciaDataService', dataService.serviceFactory())
	}
}