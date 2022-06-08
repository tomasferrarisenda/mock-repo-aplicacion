/**
* @author: ppautasso
* @description: controller para agregar a producto a stock controller
* @type: Controller
**/
import * as angular from 'angular';
import { IStockeableDataService, ITipoStockeableDataService, IDepositoDataService } from '../../../enfermeria/services';
import { FiltroStockeable } from '../../../enfermeria/models'


export class FarmaciaAgregarProductoAStockController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	resolve;
	dismiss;
	close;
	loading: boolean = false;
	deposito;
	tipoProducto;
	tiposProductos;
	filtroStockeable: FiltroStockeable = {
		IdTipoStockeable: 0,
		Codigo: 0,
		Nombre: '',
		Descripcion: ''
	};
	filterCodigo;
	filterNombre;
	productos;
	productoSeleccionado;
	stockNormal;
	cantidadMaxima;

	tableOption = {
		CurrentPage: 1,
		PageSize: 6
	};
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'StockeableDataService', 
	'TipoStockeableDataService', 'AlertaService', 'DepositoDataService'];
	/**
	* @class FarmaciaAgregarProductoAStockController
	* @constructor
	*/
	constructor(private $log: ILogger, private StockeableDataService: IStockeableDataService,
		private TipoStockeableDataService: ITipoStockeableDataService, private AlertaService:IAlertaService,
		private DepositoDataService:IDepositoDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	buscar() {
		this.loading = true;

		delete this.productoSeleccionado;

		this.filtroStockeable.IdTipoStockeable = (this.tipoProducto) ? this.tipoProducto.Id : 0;
		this.filtroStockeable.Codigo = (this.filterCodigo) ? this.filterCodigo : 0;
		this.filtroStockeable.Nombre = (this.filterNombre) ? this.filterNombre : '';
		this.filtroStockeable.CurrentPage = this.tableOption.CurrentPage;
		this.filtroStockeable.PageSize = this.tableOption.PageSize

		if(this.filtroStockeable.IdTipoStockeable !== 0){

			this.StockeableDataService.obtenerPorFiltroGrilla(this.filtroStockeable)
				.then((productosOk) => {
					this.$log.debug('productosOk', productosOk);
					this.productos = angular.copy(productosOk);
					this.loading = false;
	
				}, (pError) => {
					this.$log.error('pError', pError);
					this.loading = false;
				});
		}else {
			this.AlertaService.NewWarning("Atención debe seleciconar un tipo de producto para buscar");
			this.loading = false;
		}

	}

	limpiarDatosTable() {
		delete this.productos;
	}

	selectProducto(row){
		this.$log.debug('rowSelect',row);
		row.row.classRow = 'color-aquaorange-turno';
		this.limpiarRowClass(row.row);
		this.productoSeleccionado = row.row;
	}

	limpiarRowClass(rowSelected){
		angular.forEach(this.productos.Rows, (row) => {
			if(rowSelected.Id !== row.Id)
			row.classRow = '';
		});
	}

	/**
		 * Busca por cambio de pagina o tamaño de pagina
		 * @param  {Pagination} pPagination
		 */
	getPage(pPagination) {
		if (pPagination) {
			this.tableOption.CurrentPage = pPagination.currentPage || 1;
			this.tableOption.PageSize = pPagination.pageSize || 8;
		} else {
			this.tableOption.CurrentPage = 1;
			this.tableOption.PageSize = 8;
		}
		// Guardo la pagina actual
		this.buscar()
	}


	guardar(){

		if(this.productoSeleccionado){

			this.loading = true;
			let _stockNormal = (this.stockNormal) ? angular.copy(this.stockNormal) : 0;
			let _cantidadMaxima = (this.cantidadMaxima) ? angular.copy(this.cantidadMaxima) : 0;

			this.DepositoDataService.agregarStockeable(this.deposito.Id,  this.tipoProducto.Id, 
				this.productoSeleccionado.Id,_stockNormal, _cantidadMaxima)
			.then( (pResult) => {
				// esta ok entonces muestro cartel y cierro
				if(pResult && pResult.IsOk){
					this.$log.debug('pResult',pResult);
					this.loading = false;
					this.AlertaService.NewSuccess("Producto Agregado al deposito");
					this.cerrar(true);
				}else {
					this.$log.debug('pResult',pResult);
					this.loading = false;
					this.AlertaService.NewWarning(pResult.Message);
				}
			}, (pError) => {
				this.$log.error('pError',pError);
				this.loading = false;
			});

		}else {
			this.AlertaService.NewWarning("Atención", "Debe seleccionar un producto para agregar")
		}
	}

	cancel() {
		this.dismiss({ $value: 'cancel' });
	}
	
	cerrar(val){
		this.close({ $value: val });
	}
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class FarmaciaAgregarProductoAStockController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('FarmaciaAgregarProductoAStockController');
		this.$log.debug('ON');
		this.deposito = angular.copy(this.resolve.Deposito);
		this.loading = true;
		this.TipoStockeableDataService.obtenerTodos()
			.then((pResult) => {
				this.$log.debug('pResult', pResult);
				this.tiposProductos = angular.copy(pResult);
				this.loading = false;
			}, (pError) => {
				this.$log.error('pError', pError);
				this.loading = false;
			});
	}
	// #endregion
}