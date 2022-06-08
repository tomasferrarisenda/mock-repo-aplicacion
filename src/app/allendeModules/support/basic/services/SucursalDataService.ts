/**
* @author:         emansilla
* @description:    Sucursal
* @type:           Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface ISucursalDataService {
	getAllSucursales();
	getAllSucursalesConFiltro();
	getAllSucursalesSinTodas();
	getAllSucursalesCombo();
	obtenerSucursalXRecursoXServicio(idRecurso: number, idTipoRecurso: number, idServicio: number);
	obtenerSucursalesXServicio(idServicio: number);
	obtenerTodasSinExcepciones();
}

class dataService implements ISucursalDataService {

	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('SucursalDateService');
		this.$log.debug('ON');
	}

	public getAllSucursales() {
		var _url = 'Sucursal/';
		return this.DtoService.Get(_url);
	}

	public getAllSucursalesConFiltro() {
		var _url = 'Sucursal/ObtenerTodas';
		return this.DtoService.Get(_url);
	}

	public getAllSucursalesSinTodas() {
		var _url = 'legacy/Sucursal/GetSinTodas';
		return this.DtoService.Get(_url);
	}

	public getAllSucursalesCombo() {
		var _url = 'Sucursal/ObtenerTodas';
		return this.DtoService.Get(_url);
	}

	public obtenerSucursalXRecursoXServicio(pIdRecurso, pIdTipoRecurso, pIdServicio) {
		var _url = 'Sucursal/ObtenerPorRecursoYServicio/' + pIdRecurso + '/' + pIdTipoRecurso +
			'/' + pIdServicio;
		return this.DtoService.Get(_url);
	}

	public obtenerSucursalesXServicio(pIdServicio) {
		var _url = 'Sucursal/ObtenerPorServicio/' +  pIdServicio;
		return this.DtoService.Get(_url);
	}

	public obtenerTodasSinExcepciones(){
		var _url = 'Sucursal/ObtenerTodasSinExcepciones';
		return this.DtoService.Get(_url);
	}

	static serviceFactory(log, dtoService) {
		return new dataService(log, dtoService);
	}

	
}

dataService.serviceFactory.$inject = ['Logger', 'DtoService'];

export class SucursalDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('SucursalDataService', dataService.serviceFactory)
	}
}