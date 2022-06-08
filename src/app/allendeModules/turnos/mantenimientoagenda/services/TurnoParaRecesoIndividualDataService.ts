/**
* @author: ppautasso
* @description: service data para TurnoParaRecesoIndividualController
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';
import { IRecesoIndividualProcesarDto } from '../models';

export interface ITurnoParaRecesoIndividualDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
	obtenerTurnosParaRecesoIndividuales(pIdRecurso: number, pIdTipoRecurso: number, pIdServicio: number, 
		pIdSucursal: number, pFechaDesde: string, pFechaHasta: string): angular.IPromise<any>;
	aplicarRecesosIndividuales(recesoIndividualProcesarDto: IRecesoIndividualProcesarDto): angular.IPromise<any>;
}

class dataService implements ITurnoParaRecesoIndividualDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class TurnoParaRecesoIndividualDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('TurnoParaRecesoIndividualDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'TurnoParaRecesoIndividual/ObtenerTodos';
		return this.DtoService.Get(url);
	}

	getOne(id) {
		let url = `TurnoParaRecesoIndividual/${id}`;
		return this.DtoService.Get(url);
	}

	obtenerTurnosParaRecesoIndividuales(pIdRecurso: number, pIdTipoRecurso: number, pIdServicio: number, pIdSucursal: number, pFechaDesde: string, pFechaHasta: string){
		let url = `TurnoParaRecesoIndividual/ObtenerTurnosParaRecesosIndividuales/${pIdRecurso}/${pIdTipoRecurso}/${pIdServicio}/${pIdSucursal}/${pFechaDesde}/${pFechaHasta}`;
		return this.DtoService.Get(url);
	}

	aplicarRecesosIndividuales(recesoIndividualProcesarDto: IRecesoIndividualProcesarDto){
		let url = `TurnoParaRecesoIndividual/AplicarRecesosIndividuales`;
        return this.DtoService.Post(url, recesoIndividualProcesarDto);
	}
	
	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class TurnoParaRecesoIndividualDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('TurnoParaRecesoIndividualDataService', dataService.serviceFactory())
	}
}