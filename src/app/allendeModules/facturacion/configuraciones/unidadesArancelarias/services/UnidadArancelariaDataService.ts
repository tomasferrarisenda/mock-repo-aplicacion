/**
* @author: emansilla
* @description: Llamadas de Unidades Arancelaria
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';
import { unidadArancelariaDto } from '../model/unidadArancelariaDto';
import { FiltroUnidadArancelariaDto } from '../model';

export interface IUnidadArancelariaDataService {
	getAll(): angular.IPromise<unidadArancelariaDto[]>;
	getOne(id: number): angular.IPromise<unidadArancelariaDto>;
	nuevaUnidadArancelaria():angular.IPromise<unidadArancelariaDto>;
	eliminar(id:number):angular.IPromise<FiltroUnidadArancelariaDto>;
	obtenerTipoUnidadArancelaria():angular.IPromise<any>;
	ObtenerFiltroUnidadArancelaria():angular.IPromise<any>;
	ObtenerUnidadArancelariaPorFiltro(filtroDto : FiltroUnidadArancelariaDto):angular.IPromise<any>;
	Guardar(UnidadArancelaria:unidadArancelariaDto):angular.IPromise<any>;
}

class dataService implements IUnidadArancelariaDataService {

	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('UnidadArancelariaDateService');
		this.$log.debug('ON');
	}

	getAll() { 
		var url = 'UnidadArancelaria/ObtenerTodos';
		return this.DtoService.Get(url, { isCachable: true });
	}

	getOne(id) { 
		var url = 'UnidadArancelaria/ObtenerPorId/' + id;
		return this.DtoService.Get(url);
	}

	nuevaUnidadArancelaria() {
		var url = 'UnidadArancelaria/ObtenerNuevo';
		return this.DtoService.Get(url, { isCachable: true });
	}
	//en el back en la clase heredada "UnidadArancelariaController : ControllerEntidadBase<UnidadArancelariaEditDto" tengo el metodo eliminar
	//Me voy a la clase ControllerEntidadBase "ir a definicion"
	eliminar(id){
		var url = 'UnidadArancelaria/Eliminar/'+id;
		return this.DtoService.Get(url);
	}

	//obtengo los datos del Back
	obtenerTipoUnidadArancelaria(){
		var url = 'UnidadArancelaria/ObtenerTiposUnidadesArancelarias';
		return this.DtoService.Get(url);
	}

	ObtenerFiltroUnidadArancelaria(){
		var url = 'UnidadArancelaria/ObtenerFiltroUnidadArancelaria';
		return this.DtoService.Get(url);
	}

	ObtenerUnidadArancelariaPorFiltro(filtroDto){
		var url = 'UnidadArancelaria/ObtenerUnidadArancelariaPorFiltro';
		return this.DtoService.Post(url,filtroDto);
	}

	Guardar(UnidadArancelaria){
		var url = 'UnidadArancelaria/Guardar';
		return this.DtoService.Post(url,UnidadArancelaria);
	}
	

	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
}

export class UnidadArancelariaDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('UnidadArancelariaDataService', dataService.serviceFactory())
	}
}