/**
* @author:         emansilla
* @description:    Modales para StockFarmacia
* @type:           Service
**/
import * as angular from 'angular';
import detalleTemplate = require('../templates/view-detalle.tpl.html');
import detalleReposicionTemplate = require('../templates/view-detalle-reposicion.tpl.html');
import movimientoPrintTemplate = require('../templates/movimiento-print.tpl.html');
import internadoPrintTemplate = require('../templates/internado-stock-print.tpl.html');
import stockMinimoPrintTemplate = require('../templates/stock-minimo-print.tpl.html');
import dosificacionPrintTemplate = require('../templates/dosificacion-print.tpl.html');
import detalleDosificacionTemplate = require('../templates/view-detalle-dosificacion.tpl.html');
import detalleInfusionTemplate = require('../templates/view-detalle-infusion.tpl.html');
import newEntregaTemplate = require('../templates/new-entrega.tpl.html');
import newEntregaGuardiaTemplate = require('../templates/new-entrega-guardia.tpl.html');
import viewFacturadoTemplate = require('../templates/view-facturado.tpl.html');
import entregaDescartableTemplate = require('../templates/entregar-descartable.tpl.html');
import gruposTemplate = require('../templates/view-grupos.tpl.html');
import cambiarProductoTemplate = require('../templates/cambiar-producto.tpl.html');

export interface IStockFarmaciaModalService {
	viewDetalle();
	viewDetalleReposicion();
	printMovimiento(pMovimiento);
	printInternado(pMovimiento);
	printStockMinimo(pUbicacion);
	printDosificacion();
	viewDetalleDosificacion();
	viewDetalleInfusion();
	newEntrega();
	newEntregaGuardia();
	viewFacturado();
	entregarDescartables();
	printInternadoDosificacion(pMovimiento);
	viewGrupos();
	cambiarProducto(pNumeroArticulo, pDroga);
}

class logicService implements IStockFarmaciaModalService {

	constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils) {
		this.$log = this.$log.getInstance('StockFarmaciaModalService');
		this.$log.debug('ON');
	}

	public viewDetalle() {
		return this.$uibModal.open({
			template: detalleTemplate,
			controller: 'ViewDetalleController',
			controllerAs: 'vm',
			size: 'lg'
		}).result;
	}

	/**
	 * @class StockFarmaciaModalService
	 * @description Se llama desde solapa reposición
	 */
	public viewDetalleReposicion() {
		return this.$uibModal.open({
			template: detalleReposicionTemplate,
			controller: 'ViewDetalleReposicionController',
			controllerAs: 'vm',
			size: 'lg'
		}).result;
	}

	public printMovimiento(pMovimiento) {
		return this.$uibModal.open({

			template: movimientoPrintTemplate,
			controller: 'MovimientoPrintController',
			size: 'lg',
			resolve: {
				Movimiento: function () {
					return pMovimiento;
				}
			}
		}).result;
	}

	public printInternado(pMovimiento) {
		return this.$uibModal.open({
			template: internadoPrintTemplate,
			controller: 'InternadoStockPrintController',
			size: 'lg',
			resolve: {
				Movimiento: function () {
					return pMovimiento;
				}
			}
		}).result;
	}

	public printStockMinimo(pUbicacion) {
		return this.$uibModal.open({
			template: stockMinimoPrintTemplate,
			controller: 'StockPrintController',
			size: 'lg',
			resolve: {
				Ubicacion: function () {
					return pUbicacion;
				}
			}
		}).result;
	}

	public printDosificacion() {
		return this.$uibModal.open({
			template: dosificacionPrintTemplate,
			controller: 'DosificacionStockPrintController',
			size: 'lg'
		}).result;
	}


	public viewDetalleDosificacion() {
		return this.$uibModal.open({
			template: detalleDosificacionTemplate,
			controller: 'ViewDetalleDosificacionController',
			// controllerAs: 'vm',
			size: 'lg'
		}).result;
	}

	public viewDetalleInfusion() {
		return this.$uibModal.open({
			template: detalleInfusionTemplate,
			controller: 'ViewDetalleInfusionController',
			// controllerAs: 'vm',
			size: 'lg'
		}).result;
	}

	public newEntrega() {
		return this.$uibModal.open({
			template: newEntregaTemplate,
			controller: 'NewEntregaController',
			// controllerAs: 'vm',
			size: 'lg'
		}).result;
	}

	public newEntregaGuardia() {
		return this.$uibModal.open({
			template: newEntregaGuardiaTemplate,
			controller: 'NewEntregaGuardiaController',
			// controllerAs: 'vm',
			size: 'lg'
		}).result;
	}

	public viewFacturado() {
		return this.$uibModal.open({
			template: viewFacturadoTemplate,
			controller: 'ViewFacturadoController',
			controllerAs: 'vm',
			size: 'lg'
		}).result;
	}

	public entregarDescartables() {
		return this.$uibModal.open({
			template: entregaDescartableTemplate,
			controller: 'EntregarDescartableController',
			controllerAs: 'vm',
			size: 'lg'
		}).result;
	}

	public printInternadoDosificacion(pMovimiento) {
		return this.$uibModal.open({
			template: dosificacionPrintTemplate,
			controller: 'DosificacionStockInternadoPrintCotroller',
			controllerAs: 'vm',
			size: 'lg',
			resolve: {
				Movimiento: function () {
					return pMovimiento;
				}
			}
		}).result;
	}

	public viewGrupos() {
		return this.$uibModal.open({
			template: gruposTemplate,
			controller: 'ViewGruposController',
			controllerAs: 'vm',
			size: 'lg'
		}).result;
	}

	public cambiarProducto(pNumeroArticulo, pDroga) {
		return this.$uibModal.open({
			template: cambiarProductoTemplate,
			controller: 'CambiarProductoController',
			controllerAs: 'vm',
			size: 'lg',
			resolve: {
				NumeroArticulo : function(){
					return pNumeroArticulo;
				},
				Droga : function(){
					return pDroga;
				}
			}
		}).result;
	}

	static serviceFactory(log, uibModal, dateUtils) {
		return new logicService(log, uibModal, dateUtils);
	}
}
logicService.serviceFactory.$inject = ['Logger', '$uibModal', 'DateUtils'];

export class StockFarmaciaModalService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('StockFarmaciaModalService', logicService.serviceFactory)
	}
}