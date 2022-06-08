/**
* @author:         emansilla
* @description:    Manejo de lógiac para modulo Persona
* @type:           Service
**/
import * as angular from 'angular';
import personaNewView = require('../templates/persona-new.tpl.html');

export interface IPersonaLogicService {
	openModal(pTipoDocumento, pNumeroDocumento, pUser);
}

class logicService implements IPersonaLogicService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	 * @class       PersonaLogicService
	 * @constructor
	 */
	constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils) {
		this.$log = this.$log.getInstance('PersonaLogicService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	openModal(pTipoDocumento, pNumeroDocumento, pUser) {
		return this.$uibModal.open({
			template: personaNewView,
			controller: 'PersonaNewController',
			controllerAs: 'vm',
			size: 'lg',
			resolve: {
				User: function () {
					return pUser;
				},
				TipoDocumento: function () {
					return pTipoDocumento;
				},
				NumeroDocumento: function () {
					return pNumeroDocumento;
				}
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

export class PersonaLogicService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('PersonaLogicService', logicService.serviceFactory())
	}
}