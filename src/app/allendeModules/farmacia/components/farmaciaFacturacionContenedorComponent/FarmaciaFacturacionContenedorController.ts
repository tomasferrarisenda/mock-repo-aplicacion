/**
* @author: ppautasso
* @description: controller para facturacion d farmacia tipo contedor
* @type: Controller
**/
import * as angular from 'angular';
import { IFarmaciaFacturacionDataService, IFarmaciaLogicService } from '../../services';

export class FarmaciaFacturacionContenedorController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	loading: boolean = false;
	editPrecio;

	facturacionPorInternado;
	
	private _numeroInternado : any;
	public get numeroInternado() : any {
		return this._numeroInternado;
	}
	public set numeroInternado(v : any) {
		this._numeroInternado = v;
		delete this.facturacionPorInternado;
		this.internado = undefined;
	}

	
	private _internado : any;
	public get internado() : any {
		return this._internado;
	}
	public set internado(v : any) {
		this._internado = v;
		if(v) this.buscarFacturacionDeInternado();
	}
	
	
	optionsObj = {
		ok: 'Si',
		cancel: 'No'
	};
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'FarmaciaFacturacionDataService', 'FarmaciaLogicService',
		'ModalService', 'AlertaService'];
	/**
	* @class FarmaciaFacturacionContenedorController
	* @constructor
	*/
	constructor(private $log: ILogger, private FarmaciaFacturacionDataService: IFarmaciaFacturacionDataService, private FarmaciaLogicService: IFarmaciaLogicService,
		private ModalService: IModalService, private AlertaService: IAlertaService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	buscarFacturacionDeInternado() {
		
		if(this.facturacionPorInternado && this.facturacionPorInternado.Rows && this.facturacionPorInternado.Rows.length){
			delete this.facturacionPorInternado;
		}
		
		// buscamos la facturacion de un internado
		if (this.internado && this.internado.Id) {
			this.loading = true;
			this.$log.debug('internado', this.internado);
			this.FarmaciaFacturacionDataService.obtenerPorInternacion(this.internado.Id)
				.then((pResult) => {
					this.$log.debug('pResult', pResult);
					this.loading = false;
					this.facturacionPorInternado = angular.copy(pResult)
					if(this.facturacionPorInternado.Rows && this.facturacionPorInternado.Rows.length == 0){
						this.AlertaService.NewWarning("Atención", "No existen productos facturados para el internado");
					}
				}, (pError) => {
					this.$log.error('pErrr', pError);
					this.loading = false;
				});
		}
	}

	limpiar() {
		this.internado = {};
		delete this.facturacionPorInternado;
		this.numeroInternado = "";
	}

	verDetalleItem(row) {
		this.$log.debug('verDetalleItem', row);
		this.FarmaciaLogicService.openVerDetalleItemProductoFacturadoEnInternado(row.row);
	}

	editarItem(row) {
		this.$log.debug('editarItem', row);
		// levanto modal para editar item
		this.FarmaciaLogicService.openEditarItemFacturadoDeUnInternadoFarmacia(row.row, this.editPrecio)
			.then((pResult) => {
				this.$log.debug('pResult', pResult);
				if(pResult) this.buscarFacturacionDeInternado();
			}, (pError) => {
				this.$log.error('pError', pError);
			});
	}

	eliminarItem(row) {
		this.$log.debug('eliminarItem', row);
		this.ModalService.confirm("Desea eliminar el producto facturado?",
			(pResponse) => {
				if (pResponse) {

					this.loading = true;
					this.FarmaciaFacturacionDataService.eliminarPorIdInternacion(row.row.Id, row.row.IdInternacion)
						.then((pResponse) => {
							this.$log.debug("eliminar item facturacion response", pResponse);
							if (pResponse.IsOk === true) {
								this.loading = false;
								this.AlertaService.NewSuccess("Producto Facturado Eliminado");
								this.buscarFacturacionDeInternado();
							} else {
								if (pResponse.Message != null)
									this.AlertaService.NewError("", pResponse.Message);
								else
									this.AlertaService.NewError("", "Error");
								this.loading = false;
							}
						}, (pError) => {
							this.loading = false;
							this.$log.error('deleteServicio ON.-');
						})
				}
			}, undefined, this.optionsObj);
	}


	agregarProductoAFacturado(){

		if(this.internado){
			this.FarmaciaLogicService.openAgregarProductoFacturadoAInternado(this.internado)
			.then( (pResult) => {
				this.$log.debug('pResult',pResult);
				if(pResult) this.buscarFacturacionDeInternado();
			}, (pError) => {
				this.$log.error('pError',pError);
			});
		}else {
			this.AlertaService.NewWarning("Atención", "Debe seleccionar un internado");
		}
	}

	modificarPorcentajesMedicamentosInternado() { 
			this.FarmaciaLogicService.openModificarPorcentajesMedicamentosInternado(this.internado)
			.then( (pResult) => {
				this.$log.debug('pResult', pResult);
				if(pResult && this.facturacionPorInternado && this.facturacionPorInternado.Rows)
				this.buscarFacturacionDeInternado();
			}, (pError) => {
				this.$log.error('pError',pError);
			});
		
	}


	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class FarmaciaFacturacionContenedorController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('FarmaciaFacturacionContenedorController');
		this.$log.debug('ON');
	}
	// #endregion
}