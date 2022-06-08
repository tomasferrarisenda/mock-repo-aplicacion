/**
* @author: rbassi
* @description: receptar lote por filtro Logic Service
* @type: Service
**/
import * as angular from 'angular';

export interface IloteReceptarPorFiltroLogicService {
 method(): any;
}

class logicService implements IloteReceptarPorFiltroLogicService {

 // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

 /**
 * @class loteReceptarPorFiltroLogicService
 * @constructor
 */
 constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils) {
 this.$log = this.$log.getInstance('loteReceptarPorFiltroLogicService');
 this.$log.debug('ON');
 }

 // #endregion

 // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

 method() {
 // body
 }

 static serviceFactory() {
 const service = (log, uibModal, dateUtils) => new logicService(log, uibModal, dateUtils);
 service.$inject = ['Logger', '$uibModal', 'DateUtils'];
 return service
 }

 // #endregion
}

export class loteReceptarPorFiltroLogicService {
 static init(ngModule: angular.IModule) {
 ngModule.factory('loteReceptarPorFiltroLogicService', logicService.serviceFactory())
 }
}		