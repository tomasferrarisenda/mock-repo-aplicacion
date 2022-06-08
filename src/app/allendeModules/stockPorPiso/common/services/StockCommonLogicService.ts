/**
* @author:         emansilla
* @description:    Logica comun al modulo de stock
* @type:           Service
**/
import * as angular from 'angular';
import * as uiBootstrap from 'angular-ui-bootstrap';

export interface IStockCommonLogicService {
	existeEnArray(array: any[], element: any): boolean;
	getUbicacionMedicaByPiso(piso, ubicacionesPiso: any[]);
	materialesPorMovimiento(movimiento, materiales:any[]);
	getFechaHastaByDesde(fechaDesde: Date, fechaHasta: Date);
}

class logicService implements IStockCommonLogicService {

	constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils) {
		this.$log = this.$log.getInstance('StockCommonLogicService');
		this.$log.debug('ON');
	}

	public existeEnArray(pArray, pElement) {
		for (var i = pArray.length - 1; i >= 0; i--) {
			if (pArray[i].NAME == pElement.NAME) {
				return true;
			}
		}
		return false;
	}

	public getUbicacionMedicaByPiso(pPiso, pUbicacionesPiso) {
		var ubicaciones: Array<any> = [];
		var j = 0;
		for (var i = pUbicacionesPiso.length - 1; i >= 0; i--) {
			if (pUbicacionesPiso[i].id_piso == pPiso.id_piso) {
				ubicaciones[j] = pUbicacionesPiso[i];
				j++;
			}
		}
		return ubicaciones;
	}

	public materialesPorMovimiento(pMovimiento, pMateiales) {
		pMovimiento.total = 0;
		for (var j = 0; j < pMovimiento.DetallesMovimiento.length; j++) {
			pMovimiento.total += pMovimiento.DetallesMovimiento[j].cantidad_productos;
			for (var k = 0; k < pMateiales.length; k++) {
				if (pMateiales[k].id_producto == pMovimiento.DetallesMovimiento[j].id_producto) {
					pMovimiento.DetallesMovimiento[j].Producto = pMateiales[k];
				}
			}
		}
		return pMovimiento;
	}

	public getFechaHastaByDesde(pFechaDesde, pFechaHasta) {
		var fechaHasta = angular.copy(pFechaHasta);
		if ((fechaHasta - pFechaDesde) > 172900000 || pFechaDesde > fechaHasta) {
			fechaHasta = new Date(pFechaDesde + 172900000);
		}
		return fechaHasta;
	}

	static serviceFactory(log, uibModal, dateUtils) {
		return new logicService(log, uibModal, dateUtils);
	}
}
logicService.serviceFactory.$inject = ['Logger', '$uibModal', 'DateUtils'];

export class StockCommonLogicService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('StockCommonLogicService', logicService.serviceFactory)
	}
}