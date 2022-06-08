/**
* @author: ppautasso
* @description: data service para estado facturacion de indicaciones medicas
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IEstadoFacturacionIndicacionMedicaDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
}

class dataService implements IEstadoFacturacionIndicacionMedicaDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class EstadoFacturacionIndicacionMedicaDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('EstadoFacturacionIndicacionMedicaDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'IndicacionesMedicas/Legacy/EstadoFacturacionIndicacionMedica/ObtenerTodos';
		return this.DtoService.Get(url, { isCachable: true });
	}

	getOne(id) {
		let url = `IndicacionesMedicas/Legacy/EstadoFacturacionIndicacionMedica/${id}`;
		return this.DtoService.Get(url);
	}

	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class EstadoFacturacionIndicacionMedicaDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('EstadoFacturacionIndicacionMedicaDataService', dataService.serviceFactory())
	}
}