/**
* @author: ppautasso
* @description: data service para indicaciones medicas y estados legacy
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IEstadoEjecucionindicacionMedicaDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
}

class dataService implements IEstadoEjecucionindicacionMedicaDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class EstadoEjecucionindicacionMedicaDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('EstadoEjecucionindicacionMedicaDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'IndicacionesMedicas/Legacy/EstadoEjecucionIndicacionMedica/ObtenerTodos';
		return this.DtoService.Get(url, { isCachable: true });
	}

	getOne(id) {
		let url = `IndicacionesMedicas/Legacy/EstadoEjecucionIndicacionMedica/${id}`;
		return this.DtoService.Get(url);
	}

	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class EstadoEjecucionindicacionMedicaDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('EstadoEjecucionindicacionMedicaDataService', dataService.serviceFactory())
	}
}