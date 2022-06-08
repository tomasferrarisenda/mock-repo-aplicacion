/**
* @author: ppautasso
* @description: service data para TipoAntibioticoController
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface ITipoAntibioticoDataDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
}

class dataService implements ITipoAntibioticoDataDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class TipoAntibioticoDataDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('TipoAntibioticoDataDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'Productos/TipoAntibiotico/ObtenerTodos';
		return this.DtoService.Get(url, { isCachable: true });
	}

	getOne(id) {
		let url = `Productos/TipoAntibiotico/${id}`;
		return this.DtoService.Get(url);
	}

	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class TipoAntibioticoDataDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('TipoAntibioticoDataDataService', dataService.serviceFactory())
	}
}