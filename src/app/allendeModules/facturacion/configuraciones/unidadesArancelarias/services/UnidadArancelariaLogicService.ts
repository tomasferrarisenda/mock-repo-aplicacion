/**
* @author: Aldo Minoldo
* @description: Logi Service para Unidaes Arancelarias
* @type: Service
**/
import * as angular from 'angular';
import { unidadArancelariaDto } from '../model/unidadArancelariaDto';

export interface IUnidadArancelariaLogicService {
	
	editUnidadArancelaria(idUnidad : number): angular.IPromise<any>;
}

class logicService implements IUnidadArancelariaLogicService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class UnidadArancelariaLogicService
	* @constructor
	*/


	constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils) {
		this.$log = this.$log.getInstance('UnidadArancelariaLogicService');
		this.$log.debug('ON');
	}


	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	editUnidadArancelaria(idUnidad : number) {
		return this.$uibModal.open({
			component: 'saUnidadesArancelariasEdit',
			size : 'lg',
			resolve : {
				idUnidad : idUnidad
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

export class UnidadArancelariaLogicService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('UnidadArancelariaLogicService', logicService.serviceFactory())
	}
}