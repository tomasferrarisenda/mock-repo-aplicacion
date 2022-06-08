/**
* @author: ppautasso
* @description: controller para modal de entrega de productos en ventanilla para farmacia
* @type: Controller
**/
import * as angular from 'angular';
import { IStockeableDataService } from '../../../enfermeria/services';
import { IFarmaciaFacturacionDataService } from '../../services';
import { IFacturarMedicamentoInternadoDto, IMedicamentoAFacturar } from '../../models';

export class FarmaciaEntregarProductosVentanillaModalController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	resolve;
	dismiss;
	close;
	loading: boolean = false;
	// mas propiedades ..
	internado;
	sucursal;
	productosList: Array<any> = [];
	producto;
	facturarMedicamentoInternado: IFacturarMedicamentoInternadoDto = {};
	modosEntrega;
	modoEntrega;
	credenciales;

	private _stockeable: any;
	public get stockeable(): any {
		return this._stockeable;
	}
	public set stockeable(v: any) {
		this._stockeable = v;
		if (v) {
			this.buscarStockProducto();
		}
	}

	optionsObj = {
		ok: 'Si',
		cancel: 'No'
	};
	
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'StockeableDataService', 'ModalService', 'AlertaService', '$q',
		'FarmaciaFacturacionDataService', 'SecurityLogicService', 'ModoEntregaMovimientoStockDataService'];
	/**
	* @class FarmaciaEntregarProductosVentanillaModalController
	* @constructor
	*/
	constructor(private $log: ILogger, private StockeableDataService: IStockeableDataService,
		private ModalService, private AlertaService: IAlertaService, private $q,
		private FarmaciaFacturacionDataService: IFarmaciaFacturacionDataService,
		private SecurityLogicService, private ModoEntregaMovimientoStockDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	buscarStockProducto() {
		this.loading = true;
		this.StockeableDataService.obtenerPorIdConStock(this.stockeable.IdTipoStockeable, this.stockeable.Id, this.sucursal.Id)
			.then((pResultStockProductoSeleccionado) => {
				this.$log.debug('pResultStockProductoSeleccionado', pResultStockProductoSeleccionado);
				this.producto = Object.assign({}, pResultStockProductoSeleccionado);
				this.agregarProducto();
				this.loading = false;
			}, (pError) => {
				this.$log.error('pError', pError);
				this.loading = false;
			});
	}

	agregarProducto() {
		if (this.producto.StockFarmacia <= 0) {
			this.ModalService.confirm("El producto seleccionado tiene stock en cero, ¿está seguro que quiere facturar este producto?",
				(pResponse) => {

					if (pResponse) {
						this.agregarProductoALista(this.producto);
					}

				}, undefined, this.optionsObj);
		} else {
			this.agregarProductoALista(this.producto);
		}
	}

	cancel() {
		if (this.productosList && this.productosList.length) {
			// tengo productos en la lista pero presione cancelar -> consulto si realmente quiero salir
			this.ModalService.confirm("Atención, existen productos en la lista sin guardar. Desea cerrar la ventana de todas maneras?", (pResponse) => {
				if (pResponse) this.dismiss({ $value: 'cancel' });
			});
		} else this.dismiss({ $value: 'cancel' });
	}

	cerrar(pClose) {
		this.close({ $value: pClose });
	}

	guardar() {

		if (this.productosList.find(x => x.Cantidad === 0)) {
			this.AlertaService.NewWarning("Atención", "Existen productos con Cantidad igual a 0");
			return;
		}

		this.ModalService.confirm("Atención. Esta seguro de agregar los productos al internado?", (result) => {
			if (result) {

				if (this.modoEntrega.Id == 2) {
					// tengo modo de entrega 2 (ventanilla) entonces consulto credenciales
					// se agrega control de usuario para verificar cual es el usuario que esta retirando esta entrega
					this.SecurityLogicService.ValidarUsuario()
						.then((pCredentials) => {
							this.$log.debug('usuario retira', pCredentials);
							if (pCredentials && pCredentials.id) {
								// logueo exitoso
								this.credenciales = pCredentials;
								this.save();
							} else {
								this.AlertaService.NewWarning("Error de logueo");
							}
						}, (pError) => {
							this.$log.debug('pError logueo', pError);
	
						});
				} else { 
					this.save();
				}


			}

		}, undefined, this.optionsObj);

	}

	save() { 
		this.loading = true;
		this.setDataToSave();
		this.facturarMedicamentoInternado.IdUsuario = (this.credenciales) ? this.credenciales.id : 0;
		this.facturarMedicamentoInternado.IdInternacion = this.internado.Id;
		this.facturarMedicamentoInternado.IdModoEntrega = this.modoEntrega.Id;

		this.FarmaciaFacturacionDataService.agregarMultiples(this.facturarMedicamentoInternado)
			.then((pResult) => {
				this.$log.debug('pResult', pResult);
				this.loading = false;
				this.AlertaService.NewSuccess("Productos Facturados correctamente");
				this.cerrar(true);
			}, (pError) => {
				this.$log.error('pError', pError);
				this.loading = false;
			});
	}
	// #endregion

	// #region SUPPORT

	setDataToSave() {

		let _producto: IMedicamentoAFacturar = {};
		if (this.facturarMedicamentoInternado.Medicamentos)
			this.facturarMedicamentoInternado.Medicamentos.length = 0;

		this.productosList.forEach(producto => {

			_producto = {};
			_producto.Cantidad = angular.copy(producto.Cantidad);
			_producto.IdStockeable = angular.copy(producto.Id);
			_producto.IdTipoStockeable = angular.copy(producto.IdTipoStockeable);
			if (this.facturarMedicamentoInternado.Medicamentos)
				this.facturarMedicamentoInternado.Medicamentos.push(_producto);
		});
	}

	agregarProductoALista(pProducto) {
		if (!this.productosList.find(x => x.Id === pProducto.Id)) {
			pProducto.Cantidad = 0;
			this.productosList.push(pProducto);
			this.inputFocus();
			// tengo que limpiar el selector de producto
			delete this.stockeable;
		} else this.AlertaService.NewWarning("El producto ya existe en la lista");
	}

	quitarProductoDeLista(pProducto) {

		this.productosList = this.productosList.filter(x => x.Id !== pProducto.Id);
	}


	suma(item) {
		this.$log.debug('sumando 1...', item.Cantidad);
		item.Cantidad = item.Cantidad + 1

	}

	resta(item) {
		this.$log.debug('resta valor', item);
		if (item.Cantidad > 0)
			item.Cantidad = item.Cantidad - 1;
	}

	inputFocus() {
		setTimeout(() => { $('#input_producto')[0].focus(); }, 300);
	}

	changeModoEntrega() {
		let options: Array<any> = [];

		this.modosEntrega.forEach(modo => {
			options.push(
				{ id: modo.Id, label: modo.Nombre },
			);
		});

		this.ModalService.selectOptionModal(options)
			.then((opcionElegida) => {
				this.modoEntrega = this.modosEntrega.find(x => x.Id === opcionElegida.id);
			});
	}
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class FarmaciaEntregarProductosVentanillaModalController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('FarmaciaEntregarProductosVentanillaModalController');
		this.$log.debug('ON');

		this.internado = angular.copy(this.resolve.Internado);
		this.sucursal = angular.copy(this.resolve.Sucursal);

		let _modosEntrega = this.ModoEntregaMovimientoStockDataService.getAll();
		let _nuevoFacturaMedicamento = this.FarmaciaFacturacionDataService.obtenerNuevoFacturarMedicamentoInternado();

		this.loading = true;
		this.$q.all([_modosEntrega, _nuevoFacturaMedicamento])
			.then((pResult) => {
				this.$log.debug('pResult', pResult);
				this.loading = false;
				this.modosEntrega = pResult[0];
				this.facturarMedicamentoInternado = pResult[1];

				// seteo el modo de entrega por "programado"
				this.modoEntrega = pResult[0][0];

				// pongo input en el buscador de prodcto
				this.inputFocus();
			}, (pError) => {
				this.$log.error('pError', pError);
				this.loading = false;
			});
	}
	// #endregion
}