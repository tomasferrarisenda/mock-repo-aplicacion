/**
* @author: ppautasso
* @description: logic service para farmacia
* @type: Service
**/
import * as angular from 'angular';

export interface IFarmaciaLogicService {
	openAgregarProductoADeposito(deposito:any): any;
	openEditarStockNormalDeProductoDeDeposito(deposito:any, producto: any): any;
	openEditarItemFacturadoDeUnInternadoFarmacia(pProductoEnInternacion: any, pEditPrecio): any;
	openAgregarProductoFacturadoAInternado(pInternado: any):any;
	openVerDetalleItemProductoFacturadoEnInternado(pProductoInternado: any): any;
	openSeleccionarInternadosConIndicacionesPendientes(conAlta: boolean): any;
	openVerDetalleIndicacionMedicaFarmacia(pIndicacionMedica: any): any;
	openFacturarDevolverIndicacion(pIndicacionesAFacturarDevolver: any, pInternado: any): any;
	openEntregarProductosPorVentanilla(pInternado, pSucursal): any;
	openEntregarProductos(pSucursal, pPiso, pSector): any;
	openPreparadoIndicacionMedica(pIndicacion, pInternado, pSucursal): any;
	imprimirRemitoEntregaProductos(data:any): any;
	imprimirInformesPorInternado(data:any): any;
	openVerDetalleMovimientoFarmacia(pIdMovimiento: number): any;
	imprimirPrevioEntregaProductos(data: any, sector: any, piso: any, sucursal: any): any;
	openModificarPorcentajesMedicamentosInternado(pInternado: any):any;
}

class logicService implements IFarmaciaLogicService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class FarmaciaLogicService
	* @constructor
	*/
	constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils) {
		this.$log = this.$log.getInstance('FarmaciaLogicService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	openAgregarProductoADeposito(deposito) {
		return this.$uibModal.open({
			component: 'saFarmaciaAgregarProductoAStock',
			size: 'lg',
			keyboard: true,
			resolve: {
				Deposito: () => {
					return deposito;
				}
			}
		}).result;
	}

	openEditarStockNormalDeProductoDeDeposito(deposito, producto) {
		return this.$uibModal.open({
			component: 'saFarmaciaEditarStockNormalDeProducto',
			size: 'md',
			keyboard: true,
			resolve: {
				Deposito: () => {
					return deposito;
				},
				Producto: () => {
					return producto;
				}
			}
		}).result;
	}

	openEditarItemFacturadoDeUnInternadoFarmacia(pProductoEnInternacion, pEditPrecio) {
		return this.$uibModal.open({
			component: 'saFarmaciaFacturacionEditarItemFacturado',
			size: 'lg',
			keyboard: true,
			resolve: {
				ProductoEnInternacion: () => {
					return pProductoEnInternacion;
				},
				EditPrecio: () => {
					return pEditPrecio;
				}
			}
		}).result;
	};

	openAgregarProductoFacturadoAInternado(pInternado: any){
		return this.$uibModal.open({
			component: 'saFarmaciaAgregarProductoFacturadoAInternado',
			size: 'lg',
			keyboard: true,
			resolve: {
				Internado: () => {
					return pInternado;
				}
			}
		}).result;
	}

	openVerDetalleItemProductoFacturadoEnInternado(pProductoInternado: any){
		return this.$uibModal.open({
			component: 'saFarmaciaVerDetalleProductoFacturadoDeInternado',
			size: 'lg',
			keyboard: true,
			resolve: {
				ProductoInternado: () => {
					return pProductoInternado;
				}
			}
		}).result;
	}

	openSeleccionarInternadosConIndicacionesPendientes(conAlta: boolean){
		return this.$uibModal.open({
			component: 'saFarmaciaSeleccionarInternadosConIndicacionesPendientesModal',
			size: 'lg',
			keyboard: true,
			resolve: {
				ConAlta: () => { 
					return conAlta;
				}
			}
		}).result;
	}

	openVerDetalleIndicacionMedicaFarmacia(pIndicacionMedica){
		return this.$uibModal.open({
			component: 'saVerDetalleIndicacionMedicaFarmacia',
			size: 'lg',
			keyboard: true,
			resolve: {
				IndicacionMedica: () => {
					return pIndicacionMedica;
				}
			}
		}).result;
	}

	openFacturarDevolverIndicacion(pIndicacionesAFacturarDevolver, pInternado){
		return this.$uibModal.open({
			component: 'saVerFacturarDevolverIndicacion',
			size: 'lg',
			keyboard: true,
			resolve: {
				IndicacionesAFacturarDevolver: () => {
					return pIndicacionesAFacturarDevolver;
				},
				Internado: () => {
					return pInternado;
				}
			}
		}).result;
	}

	openEntregarProductosPorVentanilla(pInternado, pSucursal){
		return this.$uibModal.open({
			component: 'saFarmaciaEntregarProductosVentanillaModal',
			size: 'lg',
			keyboard: true,
			resolve: {
				Internado: () => {
					return pInternado;
				},
				Sucursal: () => {
					return pSucursal;
				}
			}
		}).result;
	}

	openEntregarProductos(pSucursal, pPiso, pSector){
		return this.$uibModal.open({
			component: 'saFarmaciaEntregarProductosPorSectorModal',
			size: 'lg',
			keyboard: true,
			resolve: {
				Sucursal: () => {
					return pSucursal;
				},
				Sector: () => {
					return pSector;
				},
				Piso: () => {
					return pPiso;
				}
			}
		}).result;
	}

	openPreparadoIndicacionMedica(pIndicacion, pInternado, pSucursal){
		return this.$uibModal.open({
			component: 'saFarmaciaPreparadoIndicacionMedicaModal',
			size: 'lg',
			keyboard: true,
			resolve: {
				Indicacion: () => {
					return pIndicacion;
				},
				Internado: () => {
					return pInternado;
				},
				Sucursal: () => {
					return pSucursal;
				}
			}
		}).result;
	}

	imprimirRemitoEntregaProductos(data: any){
		return this.$uibModal.open({
			component: 'saFarmaciaImprimirRemitoEntregaProductos',
			size: 'lg',
			keyboard: true,
			resolve: {
				Data: () => {
					return data;
				}
			}
		}).result;
	}

	imprimirInformesPorInternado(data: any){
		return this.$uibModal.open({
			component: 'saFarmaciaImprimirInformesPorInternado',
			size: 'lg',
			keyboard: true,
			resolve: {
				Data: () => {
					return data;
				}
			}
		}).result;
	}

	openVerDetalleMovimientoFarmacia(pIdMovimiento: number){
		return this.$uibModal.open({
			component: 'saFarmaciaVerDetalleMovimientoModal',
			size: 'lg',
			keyboard: true,
			resolve: {
				IdMovimiento: () => {
					return pIdMovimiento;
				}
			}
		}).result;
	}

	imprimirPrevioEntregaProductos(data: any, sector: any, piso: any, sucursal: any){
		return this.$uibModal.open({
			component: 'saFarmaciaImprimirPrevioEntregaProductos',
			size: 'lg',
			keyboard: true,
			resolve: {
				Data: () => {
					return data;
				},
				Sector: () => {
					return sector;
				},
				Piso: () => {
					return piso;
				},
				Sucursal: () => {
					return sucursal;
				},
			}
		}).result;
	}

	openModificarPorcentajesMedicamentosInternado(pInternado: any){
		return this.$uibModal.open({
			component: 'saFarmaciaFacturacionEditarPorcentajesMedicModal',
			size: 'lg',
			keyboard: true,
			resolve: {
				Internado: () => {
					return pInternado;
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

export class FarmaciaLogicService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('FarmaciaLogicService', logicService.serviceFactory())
	}
}