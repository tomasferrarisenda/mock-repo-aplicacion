/**
* @author: aminoldo
* @description: Logic Service de Organizacion 
* @type: Service
**/
import * as angular from 'angular';

export interface IOrganizacionLogicService {
	
}

class logicService implements IOrganizacionLogicService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class OrganizacionLogicService
	* @constructor
	*/
	constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils) {
		this.$log = this.$log.getInstance('OrganizacionLogicService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	

	static serviceFactory() {
		const service = (log, uibModal, dateUtils) => new logicService(log, uibModal, dateUtils);
		service.$inject = ['Logger', '$uibModal', 'DateUtils'];
		return service
	}

	// #endregion
}

export class OrganizacionLogicService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('OrganizacionLogicService', logicService.serviceFactory())
	}
}