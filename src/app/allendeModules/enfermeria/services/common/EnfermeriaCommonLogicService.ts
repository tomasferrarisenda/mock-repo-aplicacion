/**
* @author: ppautasso
* @description: logic service para modulo commons de componentes de enfermeria
* @type: Service
**/
import * as angular from 'angular';

export interface IEnfermeriaCommonLogicService {
	openBuscadorDeProductos(tipoStockeableList: any, pTipoStockeable: any): any;
	openMovimientosHistoricosPorProducto(pProducto: any, pIdDeposito: number): any;
}

class logicService implements IEnfermeriaCommonLogicService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class EnfermeriaCommonLogicService
	* @constructor
	*/
	constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils) {
		this.$log = this.$log.getInstance('EnfermeriaCommonLogicService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	openBuscadorDeProductos(tipoStockeableList, pTipoStockeable) {
		return this.$uibModal.open({
			component: 'saBuscadorProducto',
			size: 'lg',
			keyboard: true,
			resolve: {
				TiposStockeable: () =>{
					return tipoStockeableList;
				},
				TipoStockeable: () =>{
					return pTipoStockeable;
				}
			}
		}).result;
	}

	openMovimientosHistoricosPorProducto(pProducto, pIdDeposito){
		return this.$uibModal.open({
			component: 'saHistorialMovimientosPorProducto',
			size: 'lg',
			keyboard: true,
			resolve: {
				Producto: () =>{
					return pProducto;
				},
				IdDeposito: () =>{
					return pIdDeposito;
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

export class EnfermeriaCommonLogicService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('EnfermeriaCommonLogicService', logicService.serviceFactory())
	}
}