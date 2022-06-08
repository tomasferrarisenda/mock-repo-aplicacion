/**
* @author: emansilla
* @description: Llamadas para conceptos de ajuste
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from '../../../../../core/http';
import { ConceptoAjusteDto } from '../../../common/models/conceptoDeAjusteDto';
import { filtroConceptoAjustesDTO } from '../modal'

export interface IConceptoAjusteDataService {
	getAll(): angular.IPromise<any>;
	getOne(id: number): angular.IPromise<any>;
	//ObtenerListaConceptoAjuste(): angular.IPromise<any>;
	obtenerFiltroConceptoAjuste(): angular.IPromise<any>;
	obtenerTodosTiposConcepto(): angular.IPromise<IEntidadDto[]>;
	eliminarConceptoAjuste(id: number): angular.IPromise<ValidationResultDto>;
	obtenerConceptosPorFiltro(filtroDto: filtroConceptoAjustesDTO): angular.IPromise<any>;
	guardar(concepto: ConceptoAjusteDto): angular.IPromise<any>
	nuevoConceptoAjuste(): angular.IPromise<ConceptoAjusteDto>;
	
}

class dataService implements IConceptoAjusteDataService{

	/**
	* @class ConceptoAjusteDataService
	* @constructor
	*/

	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('ConceptoDeAjusteDataService');
		this.$log.debug('ON');
	}

	getAll() {
		var url = 'LiquidacionHonorarios/ConceptoDeAjuste/ObtenerTodos';
		return this.DtoService.Get(url);
	}

	getOne(id) {
		var url = 'LiquidacionHonorarios/ConceptoDeAjuste/ObtenerPorId/' + id;
		return this.DtoService.Get(url);
	}

	/*Descarga el Combo de Tipo*/
	obtenerTodosTiposConcepto() {
		var url = 'LiquidacionHonorarios/TipoConceptoDeAjuste/ObtenerTodos';
		return this.DtoService.Get(url, { isCachable: true });
	}

	/*Obtener Filtros - Datos del Back*/
	obtenerFiltroConceptoAjuste(){
		var url = 'LiquidacionHonorarios/ConceptoDeAjuste/ObtenerFiltroConceptoDto';
		return this.DtoService.Get(url)
	}

	// *Descarga Lista - Datos del Back*/
	obtenerConceptosPorFiltro(filtroDto) {
		var url = 'LiquidacionHonorarios/ConceptoDeAjuste/ObtenerConceptosPorFiltro';
		return this.DtoService.Post(url, filtroDto);
	}
	
	// ObtenerListaConceptoAjuste() {
	// 	var url = 'LiquidacionHonorarios/ConceptoAjuste/ObtenerTodos';
	// 	return this.DtoService.Get(url);
	// }

	/*Elimina un Concepto de Ajuste*/
	eliminarConceptoAjuste(id){
		var url = 'LiquidacionHonorarios/ConceptoDeAjuste/Eliminar/' + id;
		return this.DtoService.Get(url);
	}

	// Guardar Modal
	guardar(concepto: ConceptoAjusteDto) {
		var url = 'LiquidacionHonorarios/ConceptoDeAjuste/Guardar';
		return this.DtoService.Post(url, concepto);
	}

	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}

	/*Nuevo Concepto*/
	nuevoConceptoAjuste() {
		var url = 'LiquidacionHonorarios/ConceptoDeAjuste/ObtenerNuevo';
		return this.DtoService.Get(url);
	}
}

export class ConceptoAjusteDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('ConceptoAjusteDataService', dataService.serviceFactory())
	}
}