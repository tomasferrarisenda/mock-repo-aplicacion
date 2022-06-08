/**
* @author: crusso
* @description: Tecnico Del Servicio
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';
import { FiltroListaTecnico} from '../model/filtroTecnicoDelServicioDto' ;
import { TecnicoDelServicioDTO} from '../model/tenicoDelServicioDto';

export interface ITecnicoDelServicioDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<TecnicoDelServicioDTO>;//Ver esto que agregue //
	//borrarCuenta(id: number): angular.IPromise<ValidationResultDto>;
	ObtenerFiltroTecnicoServicio(): angular.IPromise<FiltroListaTecnico>;
	ObtenerTecnicoServicioPorFiltro(filtroDto: FiltroListaTecnico) : any;
	eliminarTecnicoServicio(id: number): angular.IPromise<ValidationResultDto>;
	ObtenerFiltroTecnicoServicioPorFiltro(filtroDto: FiltroListaTecnico): angular.IPromise<any>;
	guardar(tecnico: TecnicoDelServicioDTO): angular.IPromise<any>;
	nuevoTecnico():angular.IPromise<TecnicoDelServicioDTO>;


}

class dataService implements ITecnicoDelServicioDataService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class TecnicoDelServicioDataService
	* @constructor
	*/
	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('TecnicoDelServicioDataService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	getAll() {
		var url = 'TecnicoDelServicio/ObtenerTodos';
		return this.DtoService.Get(url);
	}

	getOne(id) {
		var url = 'TecnicoDelServicio/ObtenerPorId/'+ id;
		return this.DtoService.Get(url);
	}

	ObtenerNuevo() {
		var url = 'TecnicoDelServicio/ObtenerNuevo';
		return this.DtoService.Get(url);
	}

	//Obtener Datos Back//
	ObtenerFiltroTecnicoServicio(){
		var url ='TecnicoDelServicio/ObtenerFiltroTecnicoServicio';
		return this.DtoService.Get(url);
	}

	ObtenerFiltroTecnicoServicioPorFiltro(filtroDto) {
		var url = 'TecnicoDelServicio/ObtenerFiltroTecnicoServicioPorFiltro';
		return this.DtoService.Post(url, filtroDto);
	}

	///Descargar Listado ///	
	getAllSucursalesCombo() {
		var _url = 'Sucursal/ObtenerTodas';
		return this.DtoService.Get(_url, { isCachable: true });
	}

	///Obtener filtro de B de tecn del Servicio ///
	/// Obtener los tecnicos del Servicio usando el filtro anterior///

	eliminarTecnicoServicio(id) {
		var url = 'TecnicoDelServicio/Eliminar/' + id;
		return this.DtoService.Get(url);
	}

	ObtenerTecnicoServicioPorFiltro(filtroDto) {
		var url = 'TecnicoDelServicio/ObtenerTecnicoServicioPorFiltro';
		return this.DtoService.Post(url, filtroDto);
	}

	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}

	//Guardar Modal//
	guardar(tecnico: TecnicoDelServicioDTO) {
		var url = 'TecnicoDelServicio/Guardar';
		return this.DtoService.Post(url, tecnico);
	}

	nuevoTecnico() {
		var url = 'TecnicoDelServicio/ObtenerNuevo';
		return this.DtoService.Get(url);
	}
}
	// #endregion

export class TecnicoDelServicioDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('TecnicoDelServicioDataService', dataService.serviceFactory())
	}
}