/**
* @author: rbassi
* @description: cierre Recepcion Logic Service
* @type: Service
**/
import * as angular from 'angular';

export interface ICierreRecepcionLogicService {
	editarDetalleItemEstadoCierres(ItemDetalle: {}, NombreUsuarioCierre: string, NombreEstado: string, IdEstado: number, IdUsuario: number ): any;
	historialCambiosSobreItem(IdItemPrefactura: number): any;
	generarNuevoCierreRecepcion(usuariosDisponibles: any, otroColaborador: any): any;
	imprimirCierreRecepcion(detalleCierre) : any;
	imprimirCierreRecepcionParaControl(detalleCierre) : any;
	imprimirCierreDirecto(detalleCierreDirecto) : any;
}

class logicService implements ICierreRecepcionLogicService {

 // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

 /**
 * @class CierreRecepcionLogicService
 * @constructor
 */
 constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils) {
 this.$log = this.$log.getInstance('CierreRecepcionLogicService');
 this.$log.debug('ON');
 }

 // #endregion

 // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */


 editarDetalleItemEstadoCierres(ItemDetalle, NombreUsuarioCierre,NombreEstado,IdEstado, IdUsuario) {
	return this.$uibModal.open({
		component: 'saCierreRecepcionCambioEstadoItemEdit',
		size: 'md',
		resolve: {
			itemDetalle : () => ItemDetalle,
			nombreUsuarioCierre : () => NombreUsuarioCierre,
			nombreEstado : () => NombreEstado,
			idEstado : () => IdEstado,
			idUsuario : () => IdUsuario,
		}
	}).result;
}


historialCambiosSobreItem(IdItemPrefactura) {
	return this.$uibModal.open({
		component: 'saCierreRecepcionHistoricoItem',
		size: 'lg',
		resolve: {
			idItemPrefactura : () => IdItemPrefactura,
		}
	}).result;
}

generarNuevoCierreRecepcion(usuariosDisponibles, otroColaborador) {
	return this.$uibModal.open({
		component: 'saCierreRecepcionGenerarNuevoCierre',
		size: 'lg',
		resolve: {
			usuariosDisponibles : () => usuariosDisponibles,
			otroColaborador : () => otroColaborador,

		}

	}).result;
}


imprimirCierreRecepcion(detalleCierre) {
	return this.$uibModal.open({
		component: 'saCierreRecepcionImprimirCierre',
		size: 'lg',
		resolve: {
			imprimirCierre : () => detalleCierre,
		}

	}).result;
}

imprimirCierreRecepcionParaControl(detalleCierre) {
	return this.$uibModal.open({
		component: 'saCierreRecepcionImprimirControl',
		size: 'lg',
		resolve: {
			imprimirCierre : () => detalleCierre,
		}

	}).result;
}

imprimirCierreDirecto(detalleCierreDirecto) {
	return this.$uibModal.open({
		component: 'saCierreRecepcionImprimirCierreDirecto',
		size: 'lg',
		resolve: {
			imprimirCierreDiercto : () => detalleCierreDirecto,
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




export class CierreRecepcionLogicService {
 static init(ngModule: angular.IModule) {
 ngModule.factory('CierreRecepcionLogicService', logicService.serviceFactory())
 }
}	
