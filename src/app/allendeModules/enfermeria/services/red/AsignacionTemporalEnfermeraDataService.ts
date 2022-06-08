/**
* @author: ppautasso
* @description: data service para asignacion temporal enfermera data service
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';
import { EnfermeraAsignacionTemporal } from '../../models';

export interface IAsignacionTemporalEnfermeraDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
	eliminar(pId: number): angular.IPromise<any>;
	obtenerNuevo(): angular.IPromise<any>;
	obtenerPorFechas(pFechaDesde, pFechaHasta): angular.IPromise<any>;
	obtenerPorFechasYEnfermera(pIdEnfermera: number, pFechaDesde: string, pFechaHasta: string): angular.IPromise<any>; 
	validarGuardar(enfermeraAsignacionTemporal: EnfermeraAsignacionTemporal): angular.IPromise<any>; 
	guardar(enfermeraAsignacionTemporal: EnfermeraAsignacionTemporal): angular.IPromise<any>; 
}

class dataService implements IAsignacionTemporalEnfermeraDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class AsignacionTemporalEnfermeraDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('AsignacionTemporalEnfermeraDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		let url = 'Admision2/AsignacionTemporalEnfermera';
		return this.DtoService.Get(url);
	}

	getOne(id) {
		let url = `Admision2/AsignacionTemporalEnfermera/${id}`;
		return this.DtoService.Get(url);
	}

	eliminar(pId) {
		let url = `Admision2/AsignacionTemporalEnfermera/Eliminar/${pId}`;
		return this.DtoService.Get(url);
	}

	obtenerNuevo(){
		let url = 'Admision2/AsignacionTemporalEnfermera/ObtenerNuevo';
		return this.DtoService.Get(url);
	}

	obtenerPorFechas(pFechaDesde, pFechaHasta){
		let url = `Admision2/AsignacionTemporalEnfermera/ObtenerPorFechas/${pFechaDesde}/${pFechaHasta}`;
		return this.DtoService.Get(url);
	}

	obtenerPorFechasYEnfermera(pIdEnfermera: number, pFechaDesde: string, pFechaHasta: string){
		let url = `Admision2/AsignacionTemporalEnfermera/ObtenerAsignacionesPorEnfermeraYFechas/${pIdEnfermera}/${pFechaDesde}/${pFechaHasta}`;
		return this.DtoService.Get(url);
	}

	validarGuardar(enfermeraAsignacionTemporal: EnfermeraAsignacionTemporal){
		let url = `Admision2/AsignacionTemporalEnfermera/ValidarGuardar`;
		return this.DtoService.Post(url, enfermeraAsignacionTemporal);
	}

	guardar(enfermeraAsignacionTemporal: EnfermeraAsignacionTemporal){
		let url = `Admision2/AsignacionTemporalEnfermera/Guardar`;
		return this.DtoService.Post(url, enfermeraAsignacionTemporal);
	}

	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
	// #endregion
}

export class AsignacionTemporalEnfermeraDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('AsignacionTemporalEnfermeraDataService', dataService.serviceFactory())
	}
}