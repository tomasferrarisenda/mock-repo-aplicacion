/**
* @author: ppautasso
* @description: data service para RecursoTecnologicoRisLegacyController
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IRecursoTecnologicoRisLegacyDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
}

class dataService implements IRecursoTecnologicoRisLegacyDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class RecursoTecnologicoRisLegacyDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('RecursoTecnologicoRisLegacyDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'RisLegacy/RecursoTecnologicoRisLegacy/ObtenerTodos';
		return this.DtoService.Get(url);
	}

	getOne(id) {
		let url = `RisLegacy/RecursoTecnologicoRisLegacy/${id}`;
		return this.DtoService.Get(url);
	}

	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class RecursoTecnologicoRisLegacyDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('RecursoTecnologicoRisLegacyDataService', dataService.serviceFactory())
	}
}