/**
* @author: rbassi
* @description: Data Services buscador de Usuarios
* @type: Service
**/
import * as angular from 'angular';
import { IDtoService } from 'core/http';

export interface IbuscadorDinamicoUsuarioDataService {
}

class dataService implements IbuscadorDinamicoUsuarioDataService {

 // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

 /**
 * @class buscadorDinamicoUsuarioDataService
 * @constructor
 */
 constructor(private $log: ILogger, private DtoService: IDtoService) {
 this.$log = this.$log.getInstance('buscadorDinamicoUsuarioDataService');
 this.$log.debug('ON');
 }

 // #endregion

 // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
 static serviceFactory() {
 const service = (log, dtoService) => new dataService(log, dtoService);
 service.$inject = ['Logger', 'DtoService'];
 return service;
 }
 // #endregion
}

export class buscadorDinamicoUsuarioDataService {
 static init(ngModule: angular.IModule) {
 ngModule.factory('buscadorDinamicoUsuarioDataService', dataService.serviceFactory())
 }
}