/**
* @author: rbassi
* @description: Data services Definitivos
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';
import {filtroDefinitivoDTO} from '../models/filtroDefinitivoDTO';
import {generarDefinitivoDTO} from '../models/generarDefinitivoDTO';


export interface IDefinitivosDataService {
	
 crearFiltroBusqueda(): angular.IPromise<any>;
 obtenerDefinitivosPorFiltro(filtroDto:filtroDefinitivoDTO): angular.IPromise<any>;
 ambitosObtenerTodos(): angular.IPromise<any>;
 obtenerCierresParaDefinitivo(idUsuario):angular.IPromise<generarDefinitivoDTO>;
 ObtenerNuevaListaDeCierresParaSeleccion(): angular.IPromise<any>;
 generarDefinitivoAPartirDeCierres(cierres): angular.IPromise<any>;
 ObtenerDefinitivoPorId(id): angular.IPromise<any>;
 anularDefinitivo(id): angular.IPromise<any>;
 imprimirDefinitivo(id): angular.IPromise<any>;
 generarLoteDeDefinitivos(definitivos): angular.IPromise<any>;
 exportarListaDefinitivoExcel(definitivo): angular.IPromise<any>;
 exportarItemsDefinitivoExcel(idDefinitivo): angular.IPromise<any>;
 ImprimirDefinitivosSeleccionados(definitivos): angular.IPromise<any>;
 generaControlDeDefinitivo(cierres): angular.IPromise<any>;
 imprimirLotesSeleccionados(lotes): angular.IPromise<any>;
 
}


class dataService implements IDefinitivosDataService {

 // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

 /**
 * @class DefinitivosDataService
 * @constructor
 */
 constructor(private $log: ILogger, private DtoService: IDtoService) {
 this.$log = this.$log.getInstance('DefinitivosDataService');
 this.$log.debug('ON');
 }

 // #endregion

 // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

crearFiltroBusqueda(){
	let url = 'Definitivo/CrearFiltroBusqueda';
	return this.DtoService.Get(url);
}

obtenerDefinitivosPorFiltro(filtroDto) {
	var _url = 'Definitivo/ObtenerPorFiltro';
	return this.DtoService.Post(_url, filtroDto);
}

ambitosObtenerTodos(){
	let url = 'Ambitos/ObtenerTodos';
	return this.DtoService.Get(url);
}


obtenerCierresParaDefinitivo(idUsuario){
	var _url = 'CierreRecepcion/ObtenerParaGenerarDefinitivos/'+idUsuario;
	return this.DtoService.Post(_url,{});
}


generarDefinitivoAPartirDeCierres(cierres){
	var _url = "Definitivo/GenerarDefinitivosAPartirDeCierres";
	return this.DtoService.Post(_url,cierres);
}

ObtenerNuevaListaDeCierresParaSeleccion(){
	let url = 'Definitivo/ObtenerNuevaListaDeCierresParaSeleccion';
	return this.DtoService.Get(url);
}

anularDefinitivo(id){
	let url = 'Definitivo/Anular/'+id;
	return this.DtoService.Get(url);
}

ObtenerDefinitivoPorId(id){
	let url = 'Definitivo/ObtenerPorId/'+id;
	return this.DtoService.Get(url);
}

imprimirDefinitivo(id){
	let url = 'Definitivo/ObtenerDefinitivoParaEmision/'+id;
	return this.DtoService.Get(url);
}

generarLoteDeDefinitivos(definitivos){
	var _url = "Lotes/GenerarLoteAPartirDeDefinitivos";
	return this.DtoService.Post(_url,definitivos);
};

exportarListaDefinitivoExcel(definitivo){
	let url = 'Definitivo/ExportListaDefinitivosAExcel/';
	//return this.DtoService.Post(url, lote);
	return this.DtoService.DownloadFileDto(url, 'ListaDeDefintiivos.xlsx', definitivo);
} 

exportarItemsDefinitivoExcel(idDefinitivo){
	let url = 'Definitivo/ExportListaItemsDefinitivosAExcel/'+idDefinitivo;
	//return this.DtoService.Post(url, lote);
	return this.DtoService.DownloadFile(url, 'ListaDeItemsDeDefintiivos.xlsx');
} 

ImprimirDefinitivosSeleccionados(definitivos){
	var _url = "Definitivo/ObtenerDefinitivosParaEmision";
	return this.DtoService.Post(_url,definitivos);
};

generaControlDeDefinitivo(cierres){
	var _url = "Definitivo/GenerarDefinitivosAPartirDeCierresParaControl";
	return this.DtoService.Post(_url,cierres);
}

imprimirLotesSeleccionados(lotes){
	var _url = "Lotes/ObtenerPorIdsParaImpresion";
	return this.DtoService.Post(_url,lotes);
};


static serviceFactory() {
 const service = (log, dtoService) => new dataService(log, dtoService);
 service.$inject = ['Logger', 'DtoService'];
 return service;
 }
 // #endregion
}

export class DefinitivosDataService {
 static init(ngModule: angular.IModule) {
 ngModule.factory('DefinitivosDataService', dataService.serviceFactory())
 }
}