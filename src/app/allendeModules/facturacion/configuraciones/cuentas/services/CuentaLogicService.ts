/**
* @author: Carlos Russo
* @description: Cuenta Facturación Edit Modal
* @type: Service
**/
import * as angular from 'angular';

export interface ICuentaLogicService {
	editarCuenta(id: number): any;
}

class logicService implements ICuentaLogicService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class CuentaLogicService
	* @constructor
	*/
	constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils) {
		this.$log = this.$log.getInstance('CuentaLogicService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	editarCuenta(idCuenta) {
		return this.$uibModal.open({
			component: 'saFacturacionCuentaEdit',
			size: 'md',
			keyboard: true,
			resolve: {
				idCuenta: function () {
					return idCuenta;
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

export class CuentaLogicService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('CuentaLogicService', logicService.serviceFactory())
	}
}