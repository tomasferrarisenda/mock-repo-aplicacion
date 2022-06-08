/**
* @author: ppautasso
* @description: logic service para modulo commons de componentes de enfermeria
* @type: Service
**/
import * as angular from 'angular';

export interface IEnfermeriaLogicService {
	openDetalleMovimiento(idMovimiento: number, idDeposito: number): any;
	openAuditoriaMovimiento(idMovimiento: number, idDeposito: number): any;
	openNuevoPrestamoEnfermera(enfermera): any;
	openVerHistorialEnfermera(enfermera): any;
	openImprimirRemitoMovimientoStock(pIdMovimiento: number, pIdDeposito: number): any;
	openDevolverParcialAsignacion(pIdMovimiento: number): any;
	openSuministrarEjecucionEnfermeria(pTomaId:number, pSucursalId:number, pTipoDocumento: string, pNumeroDocumento: string): any;
	openColocarSueroEnfermeria(pInfusionId: number, pSucursalId: number, pTipoDocumento: string, pNumeroDocumento: string, pModoEdicion): any;
	openSeleccionadorInternadosEnfermeria(pInternadosList: any): any;
	openScannerEnfermeria(pTitulo: any, typeScan: string): any;
}

class logicService implements IEnfermeriaLogicService {

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	/**
	* @class EnfermeriaLogicService
	* @constructor
	*/
	constructor(private $log: ILogger, private $uibModal: any, private DateUtils: IDateUtils) {
		this.$log = this.$log.getInstance('EnfermeriaLogicService');
		this.$log.debug('ON');
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	openDetalleMovimiento(idMovimiento, idDeposito) {
		return this.$uibModal.open({
			component: 'saEnfermeriaVerDetalleMovimiento',
			size: 'lg',
			keyboard: true,
			resolve: {
				IdMovimiento: () => {
					return idMovimiento;
				}, 
				IdDeposito: () => {
					return idDeposito;
				}
			}
		}).result;
	}

	openAuditoriaMovimiento(idMovimiento, idDeposito){
		return this.$uibModal.open({
			component: 'saEnfermeriaVerAuditoriaMovimiento',
			size: 'lg',
			keyboard: true,
			resolve: {
				IdMovimiento: () => {
					return idMovimiento;
				},
				IdDeposito: () => {
					return idDeposito;
				}
			}
		}).result;
	}


	openNuevoPrestamoEnfermera(enfermera) {
		return this.$uibModal.open({
			component: 'saEnfermeriaNuevoPrestamoEnfermera',
			size: 'lg',
			keyboard: true,
			resolve: {
				Enfermera: () => {
					return enfermera;
				}
			}
		}).result;
	}

	openVerHistorialEnfermera(enfermera){
		return this.$uibModal.open({
			component: 'saEnfermeriaVerHistorialPrestamoEnfermera',
			size: 'lg',
			keyboard: true,
			resolve: {
				Enfermera: () => {
					return enfermera;
				}
			}
		}).result;
	}

	openImprimirRemitoMovimientoStock(pIdMovimiento, pIdDeposito){
		return this.$uibModal.open({
			component: 'saImprimirRemitoMovimientoStock',
			size: 'lg',
			keyboard: true,
			resolve: {
				IdMovimiento: () => {
					return pIdMovimiento;
				},
				IdDeposito: () => {
					return pIdDeposito;
				}
			}
		}).result;
	}

	openDevolverParcialAsignacion(pIdMovimiento){
		return this.$uibModal.open({
			component: 'saEnfermeriaDevolverParcialAsignacion',
			size: 'lg',
			keyboard: true,
			resolve: {
				IdMovimiento: () => {
					return pIdMovimiento;
				}
			}
		}).result;
	}

	openSuministrarEjecucionEnfermeria(pTomaId, pSucursalId, pTipoDocumento, pNumeroDocumento){
		return this.$uibModal.open({
			component: 'saEnfermeriaSuministrarEjecucionModal',
			size: 'md',
			keyboard: true,
			resolve: {
				TomaId: () => {
					return pTomaId;
				},
				SucursalId: () => {
					return pSucursalId;
				},
				TipoDocumento: () => {
					return pTipoDocumento;
				},
				NumeroDocumento: () => {
					return pNumeroDocumento;
				}
			}
		}).result;
	}

	openColocarSueroEnfermeria(pInfusionId, pSucursalId, pTipoDocumento, pNumeroDocumento, pModoEdicion){
		return this.$uibModal.open({
			component: 'saEnfermeriaColocarSueroModal',
			size: 'lg',
			keyboard: true,
			resolve: {
				InfusionId: () => {
					return pInfusionId;
				},
				SucursalId: () => {
					return pSucursalId;
				},
				TipoDocumento: () => {
					return pTipoDocumento;
				},
				NumeroDocumento: () => {
					return pNumeroDocumento;
				},
				ModoEdicion: () => {
					return pModoEdicion;
				}
			}
		}).result;
	}

	openSeleccionadorInternadosEnfermeria(pInternadosList){
		return this.$uibModal.open({
			component: 'saEnfermeriaSeleccionadorInternados',
			size: 'md',
			keyboard: true,
			resolve: {
				InternadosList: () => {
					return pInternadosList;
				}
			}
		}).result;
	}

	openScannerEnfermeria(pTitulo, typeScan: string){
		return this.$uibModal.open({
			component: 'saBarcodeScanModalEnfermeria',
			size: 'md',
			keyboard: true,
			resolve: {
				Titulo: () => {
					return pTitulo;
				},
				TypeScan: () => {
					return typeScan;
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

export class EnfermeriaLogicService {
	static init(ngModule: angular.IModule) {
		ngModule.factory('EnfermeriaLogicService', logicService.serviceFactory())
	}
}