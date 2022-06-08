/**
* @author: rbassi
* @description: lote Logic Services
* @type: Service
**/
import * as angular from 'angular';

export interface IloteLogicService {
	imprimirReporteLote(lote) : any
}

class logicService implements IloteLogicService {

 // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

 /**
 * @class loteLogicService
 * @constructor
 */
 constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils) {
 this.$log = this.$log.getInstance('loteLogicService');
 this.$log.debug('ON');
 }

 // #endregion

 // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

 static serviceFactory() {
 const service = (log, uibModal, dateUtils) => new logicService(log, uibModal, dateUtils);
 service.$inject = ['Logger', '$uibModal', 'DateUtils'];
 return service
 }


 imprimirReporteLote(lote) {
	return this.$uibModal.open({
		component: 'saLoteImprimir',
		size: 'lg',
		resolve: {
			imprimeLote : () => lote,
		}
	}).result;
}





 // #endregion
}

export class loteLogicService {
 static init(ngModule: angular.IModule) {
 ngModule.factory('loteLogicService', logicService.serviceFactory())
 }
}