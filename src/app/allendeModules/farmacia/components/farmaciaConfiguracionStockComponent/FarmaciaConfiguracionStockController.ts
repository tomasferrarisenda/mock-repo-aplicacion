/**
* @author: ppautasso
* @description: controller para la configuracion del stock de farmacia componente
* @type: Controller
**/
import * as angular from 'angular';
import { IDepositoDataService } from '../../../enfermeria/services';
import { IFarmaciaLogicService } from '../../services/FarmaciaLogicService';

export class FarmaciaConfiguracionStockController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	sucursal;
	piso;
	sector;
	deposito;
	loading: boolean = false;
	productosPorDeposito;
	optionsEditGenericoCantidadMaxima: IInputEditModalOptions = {};

	optionsObj = {
		ok: 'Si',
		cancel: 'No'
	};
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger','AlertaService', 'DepositoDataService', 'FarmaciaLogicService', 'ModalService'];
	/**
	* @class FarmaciaConfiguracionStockController
	* @constructor
	*/
	constructor(private $log: ILogger,private AlertaService:IAlertaService, private DepositoDataService:IDepositoDataService,
		private FarmaciaLogicService:IFarmaciaLogicService, private ModalService:IModalService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	buscar(){
		if (this.deposito) {
			this.loading = true;
			this.DepositoDataService.obtenerStockDelDeposito(this.deposito.Id)
				.then((pResponse) => {
					this.$log.debug('obtenerStockDelDepositoOk', pResponse);
					this.productosPorDeposito = angular.copy(pResponse);
					this.loading = false;
				}, (pError) => {
					this.$log.error('obtenerStockDelDepositoError', pError);
					this.loading = false;
				});
		}else this.AlertaService.NewWarning("Atención","Debe seleccionar un deposito para buscar");
	}

	agregarNuevoProducto(obj){
		this.FarmaciaLogicService.openAgregarProductoADeposito(this.deposito)
		.then( (pResult) => {
			this.$log.debug('pResult',pResult);
			if(pResult){
				this.buscar();
			}
		}, (pError) => {
			this.$log.error('pError',pError);
		});
	}

	editarStockNormal(producto){
		this.$log.debug('producto a editar stock normal',producto);
		// levanto modal para editar stock normal
		this.FarmaciaLogicService.openEditarStockNormalDeProductoDeDeposito(this.deposito, producto)
		.then( (pResult) => {
			this.$log.debug('pResult',pResult);
			if(pResult) this.buscar();
		}, (pError) => {
			this.$log.error('pError',pError);
		});
	}

	editarCantidadMaxima(producto){
		this.$log.debug('producto a editar cantidad maxima',producto);
		this.optionsEditGenericoCantidadMaxima.tituloModal = "Editar Cantidad Maxima Utilizable del Producto: " + producto.Nombre;
		this.optionsEditGenericoCantidadMaxima.objetoAEditarLabel = "Cantidad Maxima Actual";
		this.optionsEditGenericoCantidadMaxima.objetoAEditarValue = producto.CantidadMaximaUtilizable;
		this.optionsEditGenericoCantidadMaxima.objetoAEditarDisabled = true;
		this.optionsEditGenericoCantidadMaxima.labelNuevoInput = "Nueva Cantidad Máxima";
		this.optionsEditGenericoCantidadMaxima.showObjetoAEditar = true;

		this.ModalService.openEditInputGenerico(this.optionsEditGenericoCantidadMaxima)
		.then( (pResult) => {
			this.$log.debug('pResult',pResult);
			if(pResult){
				this.loading = true;
				this.DepositoDataService.editarCantidadMaximaProducto(producto.Id, pResult)
				.then( (pEditarCantidadMaximaOK) => {
					this.loading = false;
					this.AlertaService.NewSuccess("Cantidad máxima editada");
					this.buscar();
					this.$log.debug('pEditarCantidadMaximaOK',pEditarCantidadMaximaOK);
				}, (pErrorEditarCantMax) => {
					this.loading = false;
					this.$log.error('pErrorEditarCantMax',pErrorEditarCantMax);
				});
			}
		}, (pError) => {
			this.$log.error('pError',pError);
		});
	}

	borrarProducto(producto){
		
		if(producto.StockActual === 0){

			this.ModalService.confirm("Desea eliminar el producto " + producto.Nombre + " del deposito?", (pResponse) => {
				if(pResponse){
					this.loading = true;
					this.DepositoDataService.eliminarItemStockDeposito(producto.Id)
					.then( (pResult) => {
						if(pResult){
							this.$log.debug('pResult',pResult);
							this.loading = false;
							this.AlertaService.NewSuccess("Producto Eliminado del Deposito");
							this.buscar();
						}
					}, (pError) => {
						this.$log.error('pErrr',pError);
						this.loading = false;
					});
				}
			}, undefined, this.optionsObj)
		}else {
			this.AlertaService.NewWarning("Atención", "Para eliminar un producto del deposito, el Stock Actual debe ser 0");
		}

		
	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class FarmaciaConfiguracionStockController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('FarmaciaConfiguracionStockController');
		this.$log.debug('ON');
	}
	// #endregion
}