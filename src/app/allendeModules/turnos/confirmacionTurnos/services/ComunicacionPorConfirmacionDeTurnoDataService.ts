/**
* @author: ppautasso
* @description: service data para ComunicacionPorConfirmacionDeTurnoController
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';
import { IFiltroListaComunicacionesDTO } from '../models';

export interface IComunicacionPorConfirmacionDeTurnoDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
	obtenerPorTurno(pIdTurno: number): angular.IPromise<any>;
	obtenerPorLista(filtroListaComunicacionesDTO: IFiltroListaComunicacionesDTO): angular.IPromise<any>;
}

class dataService implements IComunicacionPorConfirmacionDeTurnoDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class ComunicacionPorConfirmacionDeTurnoDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('ComunicacionPorConfirmacionDeTurnoDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'Turnos/ConfirmacionDeTurnos/ComunicacionPorConfirmacionDeTurno/';
		return this.DtoService.Get(url);
	}

	getOne(id) {
		let url = `Turnos/ConfirmacionDeTurnos/ComunicacionPorConfirmacionDeTurno/${id}`;
		return this.DtoService.Get(url);
	}

	obtenerPorTurno(pIdTurno: number){
		let url = `Turnos/ConfirmacionDeTurnos/ComunicacionPorConfirmacionDeTurno/ObtenerPorTurno/${pIdTurno}`;
		return this.DtoService.Get(url);
	}

	obtenerPorLista(filtroListaComunicacionesDTO: IFiltroListaComunicacionesDTO){
		let url = `Turnos/ConfirmacionDeTurnos/ComunicacionPorConfirmacionDeTurno/ObtenerLista/`;
		return this.DtoService.Post(url, filtroListaComunicacionesDTO);
	}

	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class ComunicacionPorConfirmacionDeTurnoDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('ComunicacionPorConfirmacionDeTurnoDataService', dataService.serviceFactory())
	}
}