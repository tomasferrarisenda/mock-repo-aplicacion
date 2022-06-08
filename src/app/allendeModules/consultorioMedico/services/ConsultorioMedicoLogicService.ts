/**
* @author: ppautasso
* @description: service logic para consultiro medico 
* @type: Service
**/
import * as angular from 'angular';

export interface IConsultorioMedicoLogicService {
	openBuscadorPacienteParaHce(): any;
	openSeleccionarConsultorioMedico(idServicio): any;
}

class logicService implements IConsultorioMedicoLogicService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class ConsultorioMedicoLogicService
	* @constructor
	*/
	constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils) {
		this.$log = this.$log.getInstance('ConsultorioMedicoLogicService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	
	openBuscadorPacienteParaHce() {
		return this.$uibModal.open({
			component: 'saVerHistorialClinicaPacienteModal',
			size: 'lg',
			keyboard: true,
		}).result;
	}

	openSeleccionarConsultorioMedico(idSucursal) {
		return this.$uibModal.open({
			component: 'saSeleccionarConsultorioMedicoModal',
			size: 'lg',
			keyboard: true,
			resolve: {
				IdSucursal: function () {
					return idSucursal;
				},
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

export class ConsultorioMedicoLogicService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('ConsultorioMedicoLogicService', logicService.serviceFactory())
	}
}