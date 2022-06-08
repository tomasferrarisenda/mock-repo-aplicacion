/**
* @author: ppautasso
* @description: data service para RecursoPrestadoController
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IRecursoPrestadoDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
	obtenerRecursosPrestadores(pFechaDesde, pFechaHasta, pIdSucursal, pIdFinanciador, pIdPlan, pSoloConAgenda, pSoloHabilitados): angular.IPromise<any>;
}

class dataService implements IRecursoPrestadoDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class RecursoPrestadoDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('RecursoPrestadoDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'RecursoPrestador/ObtenerTodos';
		return this.DtoService.Get(url);
	}

	getOne(id) {
		let url = `RecursoPrestador/${id}`;
		return this.DtoService.Get(url);
	}

	obtenerRecursosPrestadores(pFechaDesde, pFechaHasta, pIdSucursal, pIdFinanciador, pIdPlan, pSoloConAgenda, pSoloHabilitados){
		let url = `RecursoPrestador/ObtenerRecursosPrestadores/${pFechaDesde}/${pFechaHasta}/${pIdSucursal}/${pIdFinanciador}/${pIdPlan}/${pSoloConAgenda}/${pSoloHabilitados}`;
		return this.DtoService.Get(url);
	}

	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class RecursoPrestadoDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('RecursoPrestadoDataService', dataService.serviceFactory())
	}
}