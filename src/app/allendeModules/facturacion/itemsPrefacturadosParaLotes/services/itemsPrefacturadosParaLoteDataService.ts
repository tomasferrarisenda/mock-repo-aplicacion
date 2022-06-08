/**
* @author: rbassi
* @description: items prefacturados data service
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';
import { filtroItemsPrefacturadosParaLoteDTO } from '../models/filtroItemsPrefacturadosParaLoteDTO'

export interface IitemsPrefacturadosParaLoteDataService {
	obtenerItemsParaLote(filtroDTO: filtroItemsPrefacturadosParaLoteDTO): angular.IPromise<any>;
	crearFiltroItemsParaLotes(): angular.IPromise<any>;
}

class dataService implements IitemsPrefacturadosParaLoteDataService {

 // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

 /**
 * @class itemsPrefacturadosParaLoteDataService
 * @constructor
 */
 constructor(private $log: ILogger, private DtoService: IDtoService) {
 this.$log = this.$log.getInstance('itemsPrefacturadosParaLoteDataService');
 this.$log.debug('ON');
 }

 // #endregion

 // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

 obtenerItemsParaLote(filtroDTO) {
 let url = 'CierreRecepcion/ObtenerItemsParaLotes';
 return this.DtoService.Post(url, filtroDTO);
 }

crearFiltroItemsParaLotes(){
	let url = 'CierreRecepcion/CrearFiltroItemsParaLotes';
	return this.DtoService.Get(url)
}




 static serviceFactory() {
 const service = (log, dtoService) => new dataService(log, dtoService);
 service.$inject = ['Logger', 'DtoService'];
 return service;
 }
 // #endregion
}

export class itemsPrefacturadosParaLoteDataService {
 static init(ngModule: angular.IModule) {
 ngModule.factory('itemsPrefacturadosParaLoteDataService', dataService.serviceFactory())
 }
}	
