/**
* @author: ppautasso
* @description: common logic service de servicio medico
* @type: Service
**/
import * as angular from 'angular';

export interface IServicioMedicoCommonLogicService {
	openSelectorMultipleServicios(serviciosSeleccionados): any;
}

class logicService implements IServicioMedicoCommonLogicService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class ServicioMedicoCommonLogicService
	* @constructor
	*/
	constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils) {
		this.$log = this.$log.getInstance('ServicioMedicoCommonLogicService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	openSelectorMultipleServicios(serviciosSeleccionados) {
		return this.$uibModal.open({
			component: 'saSelectorMultipleServiciosModal',
			size: 'lg',
			keyboard: true,
			resolve: {
				ServiciosSeleccionados: function () {
					return serviciosSeleccionados;
				},
			} 
		}).result;	}

	static serviceFactory() {
		const service = (log, uibModal, dateUtils) => new logicService(log, uibModal, dateUtils);
		service.$inject = ['Logger', '$uibModal', 'DateUtils'];
		return service
	}

	// #endregion
}

export class ServicioMedicoCommonLogicService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('ServicioMedicoCommonLogicService', logicService.serviceFactory())
	}
}