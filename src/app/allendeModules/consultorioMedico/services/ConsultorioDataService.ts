/**
* @author: ppautasso
* @description: consultorio medico data service apunta a consultorioController
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IConsultorioDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
	obtenerPorSala(idSalaEspera: number): angular.IPromise<any>;
	proponerConsultorioAUsuario(idServicio, idSucursal): angular.IPromise<any>;
	obtenerPorSalaParaSeleccion(idSalaEspera): angular.IPromise<any>;
}

class dataService implements IConsultorioDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class ConsultorioDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('ConsultorioDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'Consultorios/';
		return this.DtoService.Get(url);
	}

	getOne(id) {
		let url = `Consultorios/${id}`;
		return this.DtoService.Get(url);
	}

	obtenerPorSala(idSalaEspera) { 
		let url = `Consultorios/ObtenerPorSala/${idSalaEspera}`;
		return this.DtoService.Get(url);
	}
	
	proponerConsultorioAUsuario(idServicio, idSucursal) { 
		let url = `Consultorios/ProponerConsultorioAUsuario/${idServicio}/${idSucursal}`;
		return this.DtoService.Get(url);
	}

	obtenerPorSalaParaSeleccion(idSalaEspera) { 
		let url = `Consultorios/ObtenerPorSalaParaSeleccion/${idSalaEspera}`;
		return this.DtoService.Get(url);
	}

	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class ConsultorioDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('ConsultorioDataService', dataService.serviceFactory())
	}
}