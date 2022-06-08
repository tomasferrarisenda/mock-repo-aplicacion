/**
* @author: rbassi
* @description: logic services definitivos
* @type: Service
**/
import * as angular from 'angular';

export interface IDefinitivosLogicService {
	obtenerCierresParaGenerarDefinitivos(): any;
	imprimirReporteDefinitivo(definitivo): any;
	imprimirDefinitivosSeleccion(listaIds): any;
	imprimirDefinitivosControl(definitivos): any;
	imprimirLotesSeleccion(listaIds): any;
}

class logicService implements IDefinitivosLogicService {

 // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

 /**
 * @class DefinitivosLogicService
 * @constructor
 */
 constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils) {
 this.$log = this.$log.getInstance('DefinitivosLogicService');
 this.$log.debug('ON');
 }

 // #endregion

 // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

 obtenerCierresParaGenerarDefinitivos() {
	return this.$uibModal.open({
		component: 'saDefinitivosObtenerCierresList',
		size: 'md',
		keyboard: true,
		resolve: {
			//imprimirCierre : () => detalleCierre,
		}

	}).result;
}


imprimirReporteDefinitivo(definitivo) {
	return this.$uibModal.open({
		component: 'saDefinitivoImprimir',
		size: 'lg',
		keyboard: true,
		resolve: {
			imprimeDefinitivo : () => definitivo,
		}
	}).result;
}

imprimirDefinitivosSeleccion(listaIds) {
	return this.$uibModal.open({
		component: 'saDefinitivoImprimirSeleccion',
		size: 'lg',
		keyboard: true,
		resolve: {
			listaIdsDefinitivos : () => listaIds,
		}
	}).result;
}


imprimirDefinitivosControl(definitivos) {
	return this.$uibModal.open({
		component: 'saDefinitivoImprimirControl',
		size: 'lg',
		keyboard: true,
		resolve: {
			listaDefinitivos : () => definitivos,
		}
	}).result;
}

imprimirLotesSeleccion(listaIds) {
	return this.$uibModal.open({
		component: 'saLoteImprimirSeleccion',
		size: 'lg',
		keyboard: true,
		resolve: {
			listaIdsLotes : () => listaIds,
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

export class DefinitivosLogicService {
 static init(ngModule: angular.IModule) {
 ngModule.factory('DefinitivosLogicService', logicService.serviceFactory())
 }
}	