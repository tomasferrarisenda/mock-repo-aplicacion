/**
* @author: ppautasso
* @description: data service 
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';
import {FiltroBusquedaEnfermera} from '../models'

export interface IEnfermeriaDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
	obtenerTodos(): angular.IPromise<any>;
	obtenerPorFiltros(pFiltroBusquedaEnfermera: FiltroBusquedaEnfermera): angular.IPromise<any>;
	obtenerNuevoFiltroBusquedaEnfermera(): angular.IPromise<any>;
	obtenerInternacionesPorSectorListaUpa(id: number):angular.IPromise<any>;

}

class dataService implements IEnfermeriaDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class EnfermeriaDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('EnfermeriaDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'Admision2/Enfermera2/';
		return this.DtoService.Get(url);
	}

	getOne(id) {
		let url = `Admision2/Enfermera2/${id}`;
		return this.DtoService.Get(url);
	}

	obtenerTodos(){
		let url = 'Admision2/Enfermera2/ObtenerTodos';
		return this.DtoService.Get(url);
	}

	obtenerPorFiltros(pFiltroBusquedaEnfermera: FiltroBusquedaEnfermera){
		let url = "Admision2/Enfermera2/ObtenerPorFiltros/";
		return this.DtoService.Post(url, pFiltroBusquedaEnfermera);
	}

	obtenerNuevoFiltroBusquedaEnfermera(){
		let url = 'Admision2/Enfermera2/ObtenerNuevoFiltroBusquedaEnfermera/';
		return this.DtoService.Get(url);
	}

	obtenerInternacionesPorSectorListaUpa(id){
		let url = `Internaciones/Internaciones/ObtenerInternacionesPorSectorListaUpa/${id}`;
		return this.DtoService.Get(url);
	}

	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class EnfermeriaDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('EnfermeriaDataService', dataService.serviceFactory())
	}
}