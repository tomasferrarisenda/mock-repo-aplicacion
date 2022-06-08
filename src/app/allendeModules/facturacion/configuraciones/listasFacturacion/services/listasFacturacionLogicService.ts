/**
* @author: rbassi
* @description: lista de Facturacion 
* @type: Service
**/
import * as angular from 'angular';
//import { PrefacturableDto } from '../../../../support/models';
import { itemListaFacturacionDTO } from '../models';

export interface IListasFacturacionLogicService {
	editaritemListaFacturacion(item: itemListaFacturacionDTO, tipoPrefacturableLista : number): angular.IPromise<itemListaFacturacionDTO>;
}

class logicService implements IListasFacturacionLogicService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class ListasFacturacionLogicService
	* @constructor
	*/
	constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils) {
		this.$log = this.$log.getInstance('ListasFacturacionLogicService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	
	editaritemListaFacturacion(item, tipoPrefacturableLista) {
		return this.$uibModal.open({
			component: 'saitemListasFacturacionEdit',
			size: 'lg',
			resolve: {
				item: item,
				tipoPrefacturableLista: tipoPrefacturableLista
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

export class ListasFacturacionLogicService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('ListasFacturacionLogicService', logicService.serviceFactory())
	}
}	