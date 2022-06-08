/**
* @author: ppautasso
* @description: controller para buscador dinamico de producto 
* @type: Controller
**/
import * as angular from 'angular';
import { IStockeableDataService, IEnfermeriaCommonLogicService } from '../../../services';

export class BuscadorDinamicoProductoController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	loading = false;
	stockeable;
	productosPorNombre;
	nombreProducto;
	codigoStockeable
	banderaBusqueda = false;
	tipoStockeableList;
	tipoStockeable;
	borrarDatos;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'StockeableDataService',
		'EnfermeriaCommonLogicService', 'TipoStockeableDataService', 'AlertaService'];
	/**
	* @class BuscadorDinamicoProductoController
	* @constructor
	*/
	constructor(private $log: ILogger, private StockeableDataService: IStockeableDataService,
		private EnfermeriaCommonLogicService: IEnfermeriaCommonLogicService,
		private TipoStockeableDataService, private AlertaService:IAlertaService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	buscarProductosPorNombre() {
		// voy a busca productos por nombre
		this.$log.debug('this.nombreProducto', this.nombreProducto);
		this.codigoStockeable = undefined;
		if (this.nombreProducto && this.nombreProducto.length > 1) {

			if (!this.banderaBusqueda) {

				// busqueda por LETRAS
				if (!Number.isInteger(parseInt(this.nombreProducto.charAt(0))) && !Number.isInteger(parseInt(this.nombreProducto.charAt(1)))) {
					// tengo mas de 2 caracteres entonces busco
					//si los primeros caracteres son letras => busco por nombre
					if (this.nombreProducto) {
						//this.loading = true;
						this.StockeableDataService.obtenerTodosPorCodigoYNombre({
							Codigo: 0, Nombre: this.nombreProducto
						})
							.then((pResultBusquedaPorNombre) => {

								this.$log.debug('pResultBusquedaPorNombre', pResultBusquedaPorNombre);
								this.productosPorNombre = pResultBusquedaPorNombre;
								this.banderaBusqueda = true;
								//this.loading = false;
								this.inputFocus();
							}, (pError) => {
								this.$log.error('pError', pError);
								//this.loading = false;
								this.inputFocus();
							});
					}

				}
			}
		} else if (!this.nombreProducto) {
			delete this.productosPorNombre;
			this.nombreProducto = "";
			this.banderaBusqueda = false;
		}
	}

	buscadorProductoPorCodigo() {
		// Busqueda por NUMEROS

		// busco por numeros exactamente tiene que ser 5
		if (this.codigoStockeable && this.codigoStockeable.length > 1) {

			this.loading = true;
			this.StockeableDataService.obtenerTodosPorCodigoYNombre({
				Codigo: parseInt(this.codigoStockeable), Nombre: ""
			})
				.then((pResultBusquedaPorNombre) => {

					this.$log.debug('pResultBusquedaPorNombre', pResultBusquedaPorNombre);
					this.nombreProducto = pResultBusquedaPorNombre[0];
					this.stockeable = angular.copy(this.nombreProducto);
					if (this.borrarDatos) {
						delete this.productosPorNombre;
						this.nombreProducto = "";
						this.codigoStockeable = undefined;
					}
					this.loading = false;
					this.inputFocus();
				}, (pError) => {
					this.$log.error('pError', pError);
					this.loading = false;
					this.inputFocus();
				});
		}
	}

	updateModel(nombreProducto) {
		if (nombreProducto) {
			this.stockeable = this.productosPorNombre.find(x => x.Id === nombreProducto.Id);
			this.codigoStockeable = angular.copy(this.stockeable.Codigo);
			if (this.borrarDatos) {
				delete this.productosPorNombre;
				this.nombreProducto = "";
				this.codigoStockeable = undefined;
			}
			this.banderaBusqueda = false;
		}
	}


	openBusquedaProducto() {
		this.EnfermeriaCommonLogicService.openBuscadorDeProductos(this.tipoStockeableList, this.tipoStockeableList[1])
			.then((pProducto) => {
				this.$log.debug('productoSeleccionado', pProducto);
				if (pProducto) {
					this.stockeable = angular.copy(pProducto);
					this.nombreProducto = angular.copy(pProducto);
				}
			}, (pErrorProducto) => {
				this.$log.error('productoSeleccionadoError', pErrorProducto);
			});
	}

	inputFocus() {
		setTimeout(() => { $('#input_producto')[0].focus(); }, 300);
	}

	limpiarCodigo(){
		this.codigoStockeable = undefined;
	}

	limpiarProductoNombre(){
		this.nombreProducto = undefined;
	}
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class BuscadorDinamicoProductoController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('BuscadorDinamicoProductoController');
		this.$log.debug('ON');

		this.loading = true;

		this.TipoStockeableDataService.obtenerTodos()
			.then((pResponse) => {
				this.$log.debug('TipoStockeableDataService obtenerTodosOK', pResponse);
				this.tipoStockeableList = angular.copy(pResponse);
				this.tipoStockeable = Object.assign({}, this.tipoStockeableList[0]);
				this.loading = false;
			}, (pError) => {
				this.$log.error('TipoStockeableDataService obtenerTodosError', pError);
				this.loading = false;
			});
	}
	// #endregion
}