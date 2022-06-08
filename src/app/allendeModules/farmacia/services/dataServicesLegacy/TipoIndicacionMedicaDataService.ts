/**
* @author: ppautasso
* @description: Data service para tipo indicacion data service
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface ITipoIndicacionMedicaDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
}

class dataService implements ITipoIndicacionMedicaDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class TipoIndicacionMedicaDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('TipoIndicacionMedicaDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'IndicacionesMedicas/Legacy/TipoIndicacionMedica/ObtenerTodos';
		return this.DtoService.Get(url, { isCachable: true });
	}

	getOne(id) {
		let url = `IndicacionesMedicas/Legacy/TipoIndicacionMedica/${id}`;
		return this.DtoService.Get(url);
	}

	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class TipoIndicacionMedicaDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('TipoIndicacionMedicaDataService', dataService.serviceFactory())
	}
}