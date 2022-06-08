/**
* @author: Piter
* @description: Documentos DS
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';
import { FiltroDocumentoAsociadoDto, FiltroEntidadDocumentoAsociado, EntidadDocumentacion, DocumentoAsociado } from '../model';

export interface IAdministradorDocumentoDataService {
	AmbitoDocumentoObtenerTodos() : angular.IPromise<any>;
	TipoEntidadObtenerTodos() : angular.IPromise<any>;
	TiposDocumentosAsociadosObtenerTodos() : angular.IPromise<IEntidadDto[]>;
	TiposDocumentosAsociadosObtenerTodosPorTipoEntidad(idTipo:number): angular.IPromise<IEntidadDto[]>;
	ObtenerPorTipoEntidadYEntidadesRelacionadas(idTipo:number): angular.IPromise<IEntidadDto[]>;
	ObtenerNuevoFiltroDto() : angular.IPromise<FiltroDocumentoAsociadoDto>;
	ObtenerDocumentosPorFiltro(filtroDocumentoDto : FiltroDocumentoAsociadoDto) : angular.IPromise<any>;
	ObtenerDocumentosAsociadosJerarquia (idTipo : number, id: number) : angular.IPromise<any>;
	Guardar(documentoDto : any) : angular.IPromise<ValidationResultDto>;
	EliminarDocumento(id : number) : angular.IPromise<ValidationResultDto>;

	//Directiva de Entidades
	ObtenerFiltroEntidadConDocumentacion() : angular.IPromise<FiltroEntidadDocumentoAsociado>;
	ObtenerEntidadesPorFiltro(filtroDto : FiltroEntidadDocumentoAsociado) : angular.IPromise<EntidadDocumentacion[]>;
	//
	ObtenerPorIdEntidadConDocumentacion(idTipoEntidad, idEntidad) :angular.IPromise<any>;
	DescargarDocumentoAsociadoPorId(id: number, fileName: string):angular.IPromise<any>;
	ObtenerPorId(id:number) : angular.IPromise<any>;
	ObtenerNuevoDto() : angular.IPromise<any>;
	ObtenerDocumentosAsociados(idTipoEntidad : number, id : number) : angular.IPromise<any>;

	ObtenerJerarquiaEntidades(idTipoEntidad: number, idEntidad: number) : angular.IPromise<any>;
	DescargarZip(listIdArchivos : number[]) : angular.IPromise<any>;
}

class dataService implements IAdministradorDocumentoDataService {

	constructor(private $log: ILogger, private DtoService: IDtoService) {
		this.$log = this.$log.getInstance('DocumentoDateService');
		this.$log.debug('ON');
	}

	ObtenerNuevoFiltroDto () {
		var _url = 'DocumentoAsociado/ObtenerNuevoFiltroDto';
		return this.DtoService.Get(_url);
	}

	ObtenerDocumentosPorFiltro (filtro){
		var url = 'DocumentoAsociado/ObtenerDocumentosPorFiltro';
		return this.DtoService.Post(url, filtro);
	}

	EliminarDocumento(id){
		var url = 'DocumentoAsociado/Eliminar/'+id;
		return this.DtoService.Get(url);
	}

	ObtenerDocumentosAsociadosJerarquia (idTipo : number, id: number){
		var url = 'EntidadConDocumentacion/ObtenerDocumentosAsociadosJerarquia/'+idTipo+'/'+id;
		return this.DtoService.Get(url);
	}

	TiposDocumentosAsociadosObtenerTodos(){
		var url = 'TipoDocumentoAsociado/ObtenerTodos';
		return this.DtoService.Get(url);
	}

	TiposDocumentosAsociadosObtenerTodosPorTipoEntidad(idTipoEntidad){
		var url = 'TipoDocumentoAsociado/ObtenerPorTipoEntidad/' + idTipoEntidad;
		return this.DtoService.Get(url);
	}

	ObtenerPorTipoEntidadYEntidadesRelacionadas(idTipoEntidad){
		var url = 'TipoDocumentoAsociado/ObtenerPorTipoEntidadYEntidadesRelacionadas/' + idTipoEntidad;
		return this.DtoService.Get(url);
	}

	AmbitoDocumentoObtenerTodos () {
		var _url = 'AmbitoUsoDocumentacion/ObtenerTodos';
		return this.DtoService.Get(_url, { isCachable: true });
	}

	TipoEntidadObtenerTodos () {
		var _url = 'TipoEntidadConDocumentacion/ObtenerTodos';
		return this.DtoService.Get(_url);
	}

	//Directiva Entidades
	ObtenerFiltroEntidadConDocumentacion() {
		var url = 'EntidadConDocumentacion/ObtenerFiltroEntidadConDocumentacion';
		return this.DtoService.Get(url);
	}

	ObtenerEntidadesPorFiltro(filtroDto : FiltroEntidadDocumentoAsociado){
		var url = 'EntidadConDocumentacion/ObtenerEntidadesPorFiltro';
		return this.DtoService.Post(url, filtroDto);
	}
	//

	ObtenerPorIdEntidadConDocumentacion(idTipoEntidad, idEntidad) {
		var url = 'EntidadConDocumentacion/ObtenerPorId/' + idTipoEntidad +'/'+idEntidad;
		return this.DtoService.Get(url);
	}

	DescargarDocumentoAsociadoPorId(id, fileName) {
		var url = 'DocumentoAsociado/Descargar/' + id;
		return this.DtoService.DownloadFile(url, fileName);
	}

	ObtenerPorId(id) {
		var url = 'DocumentoAsociado/ObtenerPorId/' + id;
		return this.DtoService.Get(url);
	}

	ObtenerNuevoDto () {
		var url = 'DocumentoAsociado/ObtenerNuevoDocumentoDto';
		return this.DtoService.Get(url);
	}

	Guardar(documentoDto) {
		var url = 'DocumentoAsociado/Guardar';
		return this.DtoService.Post(url, documentoDto);
	}

	ObtenerJerarquiaEntidades(idTipoEntidad: number, idEntidad: number){
		var url = 'EntidadConDocumentacion/ObtenerJerarquiaEntidades/'+idTipoEntidad+'/'+idEntidad;
		return this.DtoService.Get(url);
	}

	DescargarZip(listIdArchivos) {
		var url = 'DocumentoAsociado/DescargarZip/'+listIdArchivos;
		return this.DtoService.DownloadFile(url, 'DocumentosAsociados.zip');
	}

	ObtenerDocumentosAsociados(idTipoEntidad, id) {
		var _url = 'DocumentoAsociado/ObtenerPorEntidad/' + idTipoEntidad + '/' + id;
		return this.DtoService.Get(_url);
	}

	static serviceFactory() {
		const service = (log, dtoService) => new dataService(log, dtoService);
		service.$inject = ['Logger', 'DtoService'];
		return service;
	}
}

export class AdministradorDocumentoDataService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('AdministradorDocumentoDataService', dataService.serviceFactory())
	}
}