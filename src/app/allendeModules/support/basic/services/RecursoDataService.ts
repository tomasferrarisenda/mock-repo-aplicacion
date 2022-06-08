/**
* @author:         emansilla
* @description:    Data de Recurso
* @type:           Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IRecursoDataService {
	getAllRecursos();
	obtenerRecursoPorId(idTipo: number, idRecurso: number);
	obtenerTodosDeUnServicioEnSucursal(idServicio: number, idSucursal: number);
	obtenerRecursoPorMatricula(idTipo: number, numeroMatricula: number);
	obtenerTodosTipoRecurso();
	obtenerTodosConServiciosDondeAtiende();
	obtenerTodosDeUnServicio(pIdServicio: number): any;
	obtenerTodosDeUnServicioEnSucursalConGrupoDePrestaciones(_relacion: any): any;
}

class dataService implements IRecursoDataService {

	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('RecursoDateService');
		this.$log.debug('ON');
	}

	public getAllRecursos() {
		var _url = 'Recurso/GetParaBusqueda';
		return this.DtoService.Get(_url);
	}

	public obtenerRecursoPorId(idTipo, idRecurso) {
		var _url = 'Recurso/ObtenerPorId/' + idTipo + '/' + idRecurso;
		return this.DtoService.Get(_url);
	}

	public obtenerTodosDeUnServicioEnSucursal(idServicio, idSucursal){
		var _url = 'Recurso/ObtenerTodosDeUnServicioEnSucursal/' + idServicio + '/' + idSucursal;
		return this.DtoService.Get(_url);
	}

	public obtenerTodosDeUnServicio(pIdServicio) {
		var _url = 'Recurso/ObtenerTodosDeUnServicio/' + pIdServicio;
		return this.DtoService.Get(_url);
	}

	public obtenerRecursoPorMatricula(idTipo, numeroMatricula) {
		var _url = 'Recurso/ObtenerRecursoPorMatricula/' + idTipo + '/' + numeroMatricula;
		return this.DtoService.Get(_url);
	}

	public obtenerTodosTipoRecurso() {
		var _url = 'TipoRecurso/ObtenerTodos';
		return this.DtoService.Get(_url);
	}

	public obtenerTodosConServiciosDondeAtiende(){
		var _url = 'Recurso/ObtenerTodosConServiciosDondeAtiende';
		return this.DtoService.Get(_url);
	}

	obtenerTodosDeUnServicioEnSucursalConGrupoDePrestaciones(_relacion: any){
		var _url = 'Recurso/ObtenerTodosDeUnServicioEnSucursalConGrupoDePrestaciones/' + _relacion.pIdServicio + '/' + _relacion.pIdSucursal + '/' + _relacion.pIdGrupoDePrestaciones;
		return this.DtoService.Get(_url);
	}

	static serviceFactory(log, dtoService) {
		return new dataService(log, dtoService);
	}
}

dataService.serviceFactory.$inject = ['Logger', 'DtoService'];

export class RecursoDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('RecursoDataService', dataService.serviceFactory)
	}
}