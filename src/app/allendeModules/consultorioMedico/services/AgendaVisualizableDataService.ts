/**
 * @author: ppautasso
 * @description: service que apunta a AgendaVisualizableController
 * @type: Service
 **/
import * as angular from 'angular';
import {
	IDtoService
} from 'core/http';

export interface IAgendaVisualizableDataService {
	getAll(): angular.IPromise < any > ;
	getOne(id: number): angular.IPromise<any>;
	obtenerPorProfesionalServicioSucursal(pIdProfesianal, pIdServicio, pIdSucursal, pEsJefeServicio): angular.IPromise<any>;
}

class dataService implements IAgendaVisualizableDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	 * @class AgendaVisualizableDataService
	 * @constructor
	 */
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('AgendaVisualizableDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'AgendaVisualizable/';
		return this.DtoService.Get(url);
	}

	getOne(id) {
		let url = `AgendaVisualizable/${id}`;
		return this.DtoService.Get(url);
	}

	obtenerPorProfesionalServicioSucursal(pIdProfesianal, pIdServicio, pIdSucursal, pEsJefeServicio) { 
		let url = `AgendaVisualizable/ObtenerPorProfesionalServicioSucursal/${pIdProfesianal}/${pIdServicio}/${pIdSucursal}/${pEsJefeServicio}`;
		return this.DtoService.Get(url);
	}

	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class AgendaVisualizableDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('AgendaVisualizableDataService', dataService.serviceFactory())
	}
}