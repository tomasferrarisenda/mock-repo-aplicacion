/**
* @author: rbassi
* @description: items prefacturados para lote logicservice
* @type: Service
**/
import * as angular from 'angular';

export interface IitemsPrefacturadosParaLoteLogicService {
 method(): any;
}

class logicService implements IitemsPrefacturadosParaLoteLogicService {

 // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

 /**
 * @class itemsPrefacturadosParaLoteLogicService
 * @constructor
 */
 constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils) {
 this.$log = this.$log.getInstance('itemsPrefacturadosParaLoteLogicService');
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

export class itemsPrefacturadosParaLoteLogicService {
 static init(ngModule: angular.IModule) {
 ngModule.factory('itemsPrefacturadosParaLoteLogicService', logicService.serviceFactory())
 }
}
