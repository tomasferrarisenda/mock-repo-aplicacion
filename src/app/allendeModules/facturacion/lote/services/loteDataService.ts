/**
* @author: rbassi
* @description: data services lote
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IloteDataService {
	obtenerLotePorNumeroDeLote(nroLote) : angular.IPromise<any>;
	receptarLote(lote) : angular.IPromise<any>;
	rechazarLote(lote) : angular.IPromise<any>;
	validarReceptar(lote) : angular.IPromise<any>;
	receptarLotePorId(id: number) : angular.IPromise<any>;
	rechazarLotePorId(id: number) : angular.IPromise<any>;
	exportarListaLoteExcel(lote) : angular.IPromise<any>;
}

class dataService implements IloteDataService {

 // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

 /**
 * @class loteDataService
 * @constructor
 */
 constructor(private $log: ILogger, private DtoService: IDtoService) {
 this.$log = this.$log.getInstance('loteDataService');
 this.$log.debug('ON');
 }

 // #endregion
obtenerLotePorNumeroDeLote(nroLote){
	let url = 'Lotes/ObtenerPorNroLoteLegacy/'+nroLote;
	return this.DtoService.Get(url);
}


validarReceptar(lote){
	let url = 'Lotes/ValidarReceptar/';
	return this.DtoService.Post(url, lote);
}


receptarLote(lote){
	let url = 'Lotes/Receptar/';
	return this.DtoService.Post(url, lote);
}

rechazarLote(lote){
	let url = 'Lotes/Rechazar/';
	return this.DtoService.Post(url, lote);
} 

receptarLotePorId(id){
	let url = 'Lotes/ReceptarPorId/'+id;
	return this.DtoService.Get(url);
}

rechazarLotePorId(id){
	let url = 'Lotes/RechazarPorId/'+id;
	return this.DtoService.Get(url);
} 

exportarListaLoteExcel(lote){
	let url = 'Lotes/ExportListaLotesAExcel/';
	//return this.DtoService.Post(url, lote);
	return this.DtoService.DownloadFileDto(url, 'LotesDeFacturacion.xlsx', lote);
} 

// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */


 static serviceFactory() {
 const service = (log, dtoService) => new dataService(log, dtoService);
 service.$inject = ['Logger', 'DtoService'];
 return service;
 }
 // #endregion
}

export class loteDataService {
 static init(ngModule: angular.IModule) {
 ngModule.factory('loteDataService', dataService.serviceFactory())
 }
}


