/**
* @author: rbassi
* @description: receptar lote por filtro data service
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';
import { filtroLoteDTO } from '../models';

export interface IloteReceptarPorFiltroDataService {
	obtenerLotesPorFiltro(filtroDTO:filtroLoteDTO):angular.IPromise<any>;
	obtenerEstadosLote():angular.IPromise<any>;
	receptarLotesPorIds(ids):angular.IPromise<any>;
}

class dataService implements IloteReceptarPorFiltroDataService {

 // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

 /**
 * @class loteReceptarPorFiltroDataService
 * @constructor
 */
 constructor(private $log: ILogger, private DtoService: IDtoService) {
 this.$log = this.$log.getInstance('loteReceptarPorFiltroDataService');
 this.$log.debug('ON');
 }

 // #endregion

 // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */


 obtenerLotesPorFiltro(filtroDto) {
	var _url = 'Lotes/ObtenerPorFiltro';
	return this.DtoService.Post(_url, filtroDto);
}

obtenerEstadosLote() {
	var _url = 'EstadoLote/ObtenerTodos';
	return this.DtoService.Get(_url, { isCachable: true });
}

receptarLotesPorIds(ids){
	var _url = "Lotes/ReceptarPorIds";
	return this.DtoService.Post(_url,ids);
};

 static serviceFactory() {
 const service = (log, dtoService) => new dataService(log, dtoService);
 service.$inject = ['Logger', 'DtoService'];
 return service;
 }
 // #endregion
}

export class loteReceptarPorFiltroDataService {
 static init(ngModule: angular.IModule) {
 ngModule.factory('loteReceptarPorFiltroDataService', dataService.serviceFactory())
 }
}	