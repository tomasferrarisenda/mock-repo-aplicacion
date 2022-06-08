/**
* @author: ppautasso
* @description: data service para internaciones
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';
import { FiltroBusquedaInternaciones } from '../models';

export interface IInternacionesDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
	obtenerInternadoPorNumeroInternacion(pNumeroInternacion: number): angular.IPromise<any>;
	obtenerInternacionesPorSector(pIdSector: number): angular.IPromise<any>;
	obtenerInternacionesPorFiltros(pFiltroBusquedaInternaciones: FiltroBusquedaInternaciones): angular.IPromise<any>;
	obtenerNuevoFiltroBusquedaInternaciones(): angular.IPromise<any>;
}

class dataService implements IInternacionesDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class InternacionesDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('InternacionesDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'Internaciones/Internaciones/';
		return this.DtoService.Get(url);
	}

	getOne(id) {
		let url = `Internaciones/Internaciones/${id}`;
		return this.DtoService.Get(url);
	}

	obtenerInternadoPorNumeroInternacion(pNumeroInternacion: number){
		let url = `Internaciones/Internaciones/ObtenerPorNumeroInternacion/${pNumeroInternacion}`;
		return this.DtoService.Get(url);
	}

	obtenerInternacionesPorSector(pIdSector){
		let url = `Internaciones/Internaciones/ObtenerInternacionesPorSector/${pIdSector}`;
		return this.DtoService.Get(url);
	}

	obtenerInternacionesPorFiltros(pFiltroBusquedaInternaciones: FiltroBusquedaInternaciones){
		let url = "Internaciones/Internaciones/ObtenerPorFiltros";
		return this.DtoService.Post(url, pFiltroBusquedaInternaciones);
	}

	obtenerNuevoFiltroBusquedaInternaciones(){
		let url = 'Internaciones/Internaciones/ObtenerNuevoFiltroBusqueda/';
		return this.DtoService.Get(url);
	}


	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class InternacionesDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('InternacionesDataService', dataService.serviceFactory())
	}
}