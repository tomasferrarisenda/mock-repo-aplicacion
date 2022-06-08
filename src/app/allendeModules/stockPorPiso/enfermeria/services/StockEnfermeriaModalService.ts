/**
* @author:         emansilla
* @description:    Modales para Stock Enfermería
* @type:           Service
**/
import * as angular from 'angular';

import asignarEnfermeraTemplate = require('../templates/asignar-enfermera-tpl.html');
import autorizarScrapTemplate = require('../templates/autorizar-scrap.tpl.html');
import newScrapTemplate = require('../templates/new-scrap.tpl.html');
import stockActualPrintTemplate = require('../templates/stock-actual-print.tpl.html');
import viewDetalleTemplate = require('../templates/view-detalle.tpl.html');
import newAsignacionTemplate = require('../templates/new-asignacion.tpl.html');

export interface IStockEnfermeriaModalService {
	asignarEnfermera();
	autorizarScrap();
	newMovimientoScrap();
	viewDetalle(movimiento?);
	newScrapEnfermera();
	printStockActual(pUbicacion);
	printUtilizados(pUbicacion, pTipoUbicacion);
	newAsignacion(pMovimiento, pListado, pInternado);
}

class logicService implements IStockEnfermeriaModalService {

	constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils) {
		this.$log = this.$log.getInstance('StockEnfermeriaModalService');
		this.$log.debug('ON');
	}

	public asignarEnfermera() {
		return this.$uibModal.open({
			template: asignarEnfermeraTemplate,
			controller: 'AsignarEnfermeraController',
			controllerAs: 'vm',
			size: 'lg'
		}).result;
	}

	public autorizarScrap() {
		return this.$uibModal.open({
			template: autorizarScrapTemplate,
			controller: 'AutorizarScrapController',
			controllerAs: 'vm',
			size: 'lg'
		}).result;
	}

	public newMovimientoScrap() {
		return this.$uibModal.open({
			template: newScrapTemplate,
			controller: 'NewScrapController',
			controllerAs: 'vm',
			size: 'lg'
		}).result;
	}

	public viewDetalle(pMovimiento?) {
		return this.$uibModal.open({
			template: viewDetalleTemplate,
			controller: 'ViewDetalleEnfermeriaController',
			controllerAs: 'vm',
			size: 'lg'
		}).result;
	}

	public newScrapEnfermera() {
		return this.$uibModal.open({
			template: newScrapTemplate,
			controller: 'NewScrapEnfermeraController',
			controllerAs: 'vm',
			size: 'lg'
		}).result;
	}

	public printStockActual(pUbicacion) {
		this.$uibModal.open({
			template: stockActualPrintTemplate,
			controller: 'StockPrintController',
			size: 'lg',
			resolve: {
				Ubicacion: function () {
					return pUbicacion;
				}
			}
		});
	}

	public printUtilizados(pUbicacion, pTipoUbicacion) {
		this.$uibModal.open({
			template: stockActualPrintTemplate,
			controller: 'UtilizadosPrintController',
			size: 'lg',
			resolve: {
				Ubicacion: function () {
					return pUbicacion;
				},
				TipoUbicacion: function () {
					return pTipoUbicacion;
				}
			}
		});
	}

	public newAsignacion(pMovimiento, pListado, pInternado) {
		return this.$uibModal.open({
			template: newAsignacionTemplate,
			controller: 'NewAsignacionController',
			// controllerAs: 'vm',
			size: 'lg',
			resolve: {
				Movimiento: function () {
					return pMovimiento;
				},

				ListaAsignados: function () {
					return pListado;
				},
				Internado: function () {
					return pInternado;
				}
			}
		}).result;
	}

	static serviceFactory(log, uibModal, dateUtils) {
		return new logicService(log, uibModal, dateUtils);
	}
}
logicService.serviceFactory.$inject = ['Logger', '$uibModal', 'DateUtils'];

export class StockEnfermeriaModalService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('StockEnfermeriaModalService', logicService.serviceFactory)
	}
}