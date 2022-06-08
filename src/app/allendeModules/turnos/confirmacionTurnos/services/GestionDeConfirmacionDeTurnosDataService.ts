/**
* @author: ppautasso
* @description: data service para GestionDeConfirmacionDeTurnoController
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';
import { IFiltroGestionesPorEjecucionDTO } from '../models';

export interface IGestionDeConfirmacionDeTurnoDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
	obtenerExcluidosPorEjecucion(filtroDto: IFiltroGestionesPorEjecucionDTO): angular.IPromise<any>;
	obtenerSinDatosDeContacto(filtroDto: IFiltroGestionesPorEjecucionDTO): angular.IPromise<any>;

}

class dataService implements IGestionDeConfirmacionDeTurnoDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class GestionDeConfirmacionDeTurnoDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('GestionDeConfirmacionDeTurnoDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'Turnos/ConfirmacionDeTurnos/GestionDeConfirmacionDeTurno/';
		return this.DtoService.Get(url);
	}

	getOne(id) {
		let url = `Turnos/ConfirmacionDeTurnos/GestionDeConfirmacionDeTurno/${id}`;
		return this.DtoService.Get(url);
	}

	obtenerExcluidosPorEjecucion(filtroDto: IFiltroGestionesPorEjecucionDTO){
		let url = `Turnos/ConfirmacionDeTurnos/GestionDeConfirmacionDeTurno/ObtenerExcluidosPorEjecucion/`;
		return this.DtoService.Post(url, filtroDto);
	}

	obtenerSinDatosDeContacto(filtroDto: IFiltroGestionesPorEjecucionDTO){
		let url = `Turnos/ConfirmacionDeTurnos/GestionDeConfirmacionDeTurno/ObtenerSinDatosDeContacto/`;
		return this.DtoService.Post(url, filtroDto);
	}

	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class GestionDeConfirmacionDeTurnoDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('GestionDeConfirmacionDeTurnoDataService', dataService.serviceFactory())
	}
}