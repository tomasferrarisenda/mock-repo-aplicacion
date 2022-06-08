/**
* @author: ppautasso
* @description: data service para endpoint de grupo de prestaciones de recurso en servicio sucursal
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IGrupoDePrestacionesDeRecursoServicioSucursalDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
	eliminar(id: number): angular.IPromise<any>;
	validarAsignarARecurso(idGrupo, idRecurso, idTipoRecurso, idServicio, idSucursal): angular.IPromise<any>;
	asignarARecurso(idGrupo, idRecurso, idTipoRecurso, idServicio, idSucursal): angular.IPromise<any>;
	obtenerRelacionadosPorRecursoServicioSucursalGrupo(idRecurso, idTipoRecurso, idServicio, idSucursal, idGrupo): angular.IPromise<any>;
	
}

class dataService implements IGrupoDePrestacionesDeRecursoServicioSucursalDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class GrupoDePrestacionesDeRecursoServicioSucursalDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('GrupoDePrestacionesDeRecursoServicioSucursalDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'GrupoDePrestacionesDeRecursoServicioSucursal/';
		return this.DtoService.Get(url);
	}

	getOne(id) {
		let url = `GrupoDePrestacionesDeRecursoServicioSucursal/${id}`;
		return this.DtoService.Get(url);
	}

	eliminar(id) {
		let url = `GrupoDePrestacionesDeRecursoServicioSucursal/Eliminar/${id}`;
		return this.DtoService.Get(url);
	}

	validarAsignarARecurso(idGrupo, idRecurso, idTipoRecurso, idServicio, idSucursal) {
		let url = `GrupoDePrestacionesDeRecursoServicioSucursal/ValidarAsignarGrupoAlRecurso/${idGrupo}/${idRecurso}/${idTipoRecurso}/${idServicio}/${idSucursal}`;
        return this.DtoService.Get(url);
	}
	
	asignarARecurso(idGrupo, idRecurso, idTipoRecurso, idServicio, idSucursal) {
        let url = `GrupoDePrestacionesDeRecursoServicioSucursal/AsignarGrupoAlRecurso/${idGrupo}/${idRecurso}/${idTipoRecurso}/${idServicio}/${idSucursal}`;
        return this.DtoService.Get(url);
	}
	
	obtenerRelacionadosPorRecursoServicioSucursalGrupo(idRecurso, idTipoRecurso, idServicio, idSucursal, idGrupo){
		let url = `GrupoDePrestacionesDeRecursoServicioSucursal/ObtenerRelacionadoPorRecursoServicioSucursalGrupo/${idRecurso}/${idTipoRecurso}/${idServicio}/${idSucursal}/${idGrupo}`;
        return this.DtoService.Get(url);
	}

	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class GrupoDePrestacionesDeRecursoServicioSucursalDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('GrupoDePrestacionesDeRecursoServicioSucursalDataService', dataService.serviceFactory())
	}
}