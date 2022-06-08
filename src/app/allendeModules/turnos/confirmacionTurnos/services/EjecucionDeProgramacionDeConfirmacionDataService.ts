/**
* @author: ppautasso
* @description: service data para \EjecucionDeProgramacionDeConfirmacionController.cs
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IEjecucionDeProgramacionDeConfirmacionDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
	obtenerPorFecha(pFechaDesde: string, pFechaHasta: string, pTipoProgramacion: number): angular.IPromise<any>;
}

class dataService implements IEjecucionDeProgramacionDeConfirmacionDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class EjecucionDeProgramacionDeConfirmacionDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('EjecucionDeProgramacionDeConfirmacionDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'Turnos/ConfirmacionDeTurnos/EjecucionDeProgramacionDeConfirmacion/';
		return this.DtoService.Get(url);
	}

	getOne(id) {
		let url = `Turnos/ConfirmacionDeTurnos/EjecucionDeProgramacionDeConfirmacion/${id}`;
		return this.DtoService.Get(url);
	}

	obtenerPorFecha(pFechaDesde: string, pFechaHasta: string, pTipoProgramacion:number){
		let url = `Turnos/ConfirmacionDeTurnos/EjecucionDeProgramacionDeConfirmacion/ObtenerReportePorFecha/${pFechaDesde}/${pFechaHasta}/${pTipoProgramacion}`;
		return this.DtoService.Get(url);
	}

	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class EjecucionDeProgramacionDeConfirmacionDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('EjecucionDeProgramacionDeConfirmacionDataService', dataService.serviceFactory())
	}
}