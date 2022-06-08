/**
* @author: rbassi
* @description: dataservices items prefacturados pendientes
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';
import { filtroItemsPrefacturadosPendientesDTO } from '../models/filtroItemsPrefacturadosPendientesDTO';

export interface IitemsPrefacturadosPendientesDataService {
obtenerFiltroPendientes(): angular.IPromise<any>;
ObtenerItemsPendientesPorFiltros(filtroDTO: filtroItemsPrefacturadosPendientesDTO): angular.IPromise<any>;
obtenerEstadosPendientes(): angular.IPromise<any>;
exportarItemsPendientesAExcel(filtro): angular.IPromise<any>;
ObtenerEstadosPendientesConEstadoNormal(): angular.IPromise<any>;
GenerarCierreItemsPendientesParaControl(ListaIds): angular.IPromise<any>;
GenerarCierreItemsPendientes(ListaIds): angular.IPromise<any>;
}

class dataService implements IitemsPrefacturadosPendientesDataService {

 // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

 /**
 * @class itemsPrefacturadosPendientesDataService
 * @constructor
 */
 constructor(private $log: ILogger, private DtoService: IDtoService) {
 this.$log = this.$log.getInstance('itemsPrefacturadosPendientesDataService');
 this.$log.debug('ON');
 }

 // #endregion

 // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

 obtenerFiltroPendientes() {
 let url = 'CierreRecepcion/CrearFiltroPendientes';
 return this.DtoService.Get(url);
 }

 ObtenerItemsPendientesPorFiltros(filtroDTO) {
	let url = 'CierreRecepcion/ObtenerItemsPendientesPorFiltros';
	return this.DtoService.Post(url, filtroDTO); 
 } 

 obtenerEstadosPendientes() {
	let url = 'CambioEstadoLoteItemPrefacturado/ObtenerEstadosPendientes';
	return this.DtoService.Get(url);
 }
   
 ObtenerEstadosPendientesConEstadoNormal(){
	let url = 'CambioEstadoLoteItemPrefacturado/ObtenerEstadosPendientesConEstadoNormal'
	return this.DtoService.Get(url);
 }
 

 exportarItemsPendientesAExcel(filtro) {
	let url = 'CierreRecepcion/ExportarItemsPendientesPorFiltros';
	return this.DtoService.DownloadFileDto(url,"ItemsPendientes.xlsx",filtro)
 }


 GenerarCierreItemsPendientesParaControl(ListaIds){
	let url = 'CierreRecepcion/GenerarCierreItemsPendientesParaControl'
	return this.DtoService.Post(url,ListaIds);
 }
 
 GenerarCierreItemsPendientes(ListaIds){
	let url = 'CierreRecepcion/GenerarCierreItemsPendientes'
	return this.DtoService.Post(url,ListaIds);
 }


 static serviceFactory() {
 const service = (log, dtoService) => new dataService(log, dtoService);
 service.$inject = ['Logger', 'DtoService'];
 return service;
 }
 // #endregion
}

export class itemsPrefacturadosPendientesDataService {
 static init(ngModule: angular.IModule) {
 ngModule.factory('itemsPrefacturadosPendientesDataService', dataService.serviceFactory())
 }
}
