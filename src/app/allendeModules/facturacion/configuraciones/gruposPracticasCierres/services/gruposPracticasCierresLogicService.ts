/**
* @author: rbassi
* @description: Logic Service de Grupos de Practicas para cierre
* @type: Service
**/
import * as angular from 'angular';

export interface IGruposPracticasCierresLogicService {
	editarGrupoPracticasCierres(IdGrupoPracticas) : any;
}

class logicService implements IGruposPracticasCierresLogicService {

 // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

 /**
 * @class GruposPracticasCierresLogicService
 * @constructor
 */
 constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils) {
 this.$log = this.$log.getInstance('GruposPracticasCierresLogicService');
 this.$log.debug('ON');
 }

 // #endregion

 // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
 editarGrupoPracticasCierres(IdGrupoPracticas) {
	return this.$uibModal.open({
		component: 'saGruposPracticasCierresEdit',
		size: 'lg',
		resolve: {
			IdGrupoPracticas : IdGrupoPracticas,
		}
	}).result;

}


 static serviceFactory() {
 const service = (log, uibModal, dateUtils) => new logicService(log, uibModal, dateUtils);
 service.$inject = ['Logger', '$uibModal', 'DateUtils'];
 return service
 }

 // #endregion
}

export class GruposPracticasCierresLogicService {
 static init(ngModule: angular.IModule) {
 ngModule.factory('GruposPracticasCierresLogicService', logicService.serviceFactory())
 }
}
