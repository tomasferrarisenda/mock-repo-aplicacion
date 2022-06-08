/**
* @author: ppautasso
* @description: service data para ObservacionesRecursoServicioController
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IObservacionesRecursoServicioDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
	obtenerPorServicioRecurso(pIdServicio: number, pIdRecurso:number, pIdTipoRecurso:number, pFechaDesde:string, pFechaHasta: string): angular.IPromise<any>;
}

class dataService implements IObservacionesRecursoServicioDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class ObservacionesRecursoServicioDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('ObservacionesRecursoServicioDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'ObservacionesRecursoServicio/ObtenerTodos';
		return this.DtoService.Get(url);
	}

	getOne(id) {
		let url = `ObservacionesRecursoServicio/${id}`;
		return this.DtoService.Get(url);
	}

	obtenerPorServicioRecurso(pIdServicio: number, pIdRecurso:number, pIdTipoRecurso:number, pFechaDesde:string, pFechaHasta: string){
		let url = `ObservacionesRecursoServicio/ObtenerPorServicioRecurso/${pIdServicio}/${pIdRecurso}/${pIdTipoRecurso}/${pFechaDesde}/${pFechaHasta}`;
		return this.DtoService.Get(url);
	}

	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class ObservacionesRecursoServicioDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('ObservacionesRecursoServicioDataService', dataService.serviceFactory())
	}
}