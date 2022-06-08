/**
* @author: ppautasso
* @description: logic service para repo fron
* @type: Service
**/
import * as angular from 'angular';

export interface IRepoFrontLogicService {
	openRepoIconosFront(): any;
	openModalBarCode(): any;
}

class logicService implements IRepoFrontLogicService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class RepoFrontLogicService
	* @constructor
	*/
	constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils) {
		this.$log = this.$log.getInstance('RepoFrontLogicService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	openRepoIconosFront() {
		return this.$uibModal.open({
			component: 'saRepoFrontIconos',
			size: 'lg',
			keyboard: true,
		}).result;
	}

	openModalBarCode(){
		return this.$uibModal.open({
			component: 'saRepoModalBarCode',
			size: 'lg',
			keyboard: true,
		}).result;
	}

	static serviceFactory() {
		const service = (log, uibModal, dateUtils) => new logicService(log, uibModal, dateUtils);
		service.$inject = ['Logger', '$uibModal', 'DateUtils'];
		return service
	}

	// #endregion
}

export class RepoFrontLogicService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('RepoFrontLogicService', logicService.serviceFactory())
	}
}