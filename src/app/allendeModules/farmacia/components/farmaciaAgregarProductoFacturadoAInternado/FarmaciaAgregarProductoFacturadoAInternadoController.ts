/**
* @author: ppautasso
* @description: controller para agregar producto facturado a internado
* @type: Controller
**/
import * as angular from 'angular';
import { ITipoStockeableDataService, IStockeableDataService } from '../../../enfermeria/services';
import { FiltroStockeable } from '../../../enfermeria/models';
import { IFarmaciaFacturacionDataService } from '../../services';
import { FacturacionMedicamentoEdit } from '../../models/FacturacionMedicamentoEdit';

export class FarmaciaAgregarProductoFacturadoAInternadoController implements angular.IController {

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
	internado;

	tableOption = {
		CurrentPage: 1,
		PageSize: 6
	};

	obtenerNuevoProductoFacturado;

	facturacionMedicamento: FacturacionMedicamentoEdit = {};
		
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', '$q',
		'TipoStockeableDataService', 'AlertaService', 'FarmaciaFacturacionDataService',
		'StockeableDataService'];
	/**
	* @class FarmaciaAgregarProductoFacturadoAInternadoController
	* @constructor
	*/
	constructor(private $log: ILogger, private $q,
		private TipoStockeableDataService: ITipoStockeableDataService, 
		private AlertaService:IAlertaService, 
		private FarmaciaFacturacionDataService:IFarmaciaFacturacionDataService,
		private StockeableDataService: IStockeableDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	cerrar(val) {
		this.close({ $value: val });
	}


	buscar() {
		this.loading = true;

		delete this.productoSeleccionado;

		this.filtroStockeable.IdTipoStockeable = (this.tipoProducto) ? this.tipoProducto.Id : 0;
		this.filtroStockeable.Codigo = (this.filterCodigo) ? this.filterCodigo : 0;
		this.filtroStockeable.Nombre = (this.filterNombre) ? this.filterNombre : '';
		this.filtroStockeable.CurrentPage = this.tableOption.CurrentPage;
		this.filtroStockeable.PageSize = this.tableOption.PageSize

		if (this.filtroStockeable.IdTipoStockeable !== 0) {

			this.StockeableDataService.obtenerPorFiltroGrilla(this.filtroStockeable)
				.then((productosOk) => {
					this.$log.debug('productosOk', productosOk);
					this.productos = angular.copy(productosOk);
					this.loading = false;

				}, (pError) => {
					this.$log.error('pError', pError);
					this.loading = false;
				});
		} else {
			this.AlertaService.NewWarning("Atención debe seleciconar un tipo de producto para buscar");
			this.loading = false;
		}

	}

	guardar() {

		if (this.productoSeleccionado) {
			this.loading = true;
			this.$log.debug('productoSeleccionado',this.productoSeleccionado);
			this.facturacionMedicamento.IdTipoStockeable = this.productoSeleccionado.IdTipoStockeable;
			this.facturacionMedicamento.IdStockeable = this.productoSeleccionado.Id;
			this.facturacionMedicamento.IdInternacion = this.internado.Id;

			this.FarmaciaFacturacionDataService.guardar(this.facturacionMedicamento)
			.then( (pResult) => {
				this.$log.debug('pResult',pResult);
				if(pResult.IsOk){
					this.loading = false;
					this.AlertaService.NewSuccess("Se agregó el producto correctamente");
					this.cerrar(true);
				}else if(pResult.IsOk == false){
					this.loading = false;
					this.AlertaService.NewError(pResult.Message);
				}
			}, (pError) => {
				this.loading = false;
				this.$log.error('pError',pError);
			});
		}
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


	limpiarDatosTable() {
		delete this.productos;
	}

	selectProducto(row) {
		this.$log.debug('rowSelect', row);
		row.row.classRow = 'color-aquaorange-turno';
		this.limpiarRowClass(row.row);
		this.productoSeleccionado = row.row;
	}

	limpiarRowClass(rowSelected) {
		angular.forEach(this.productos.Rows, (row) => {
			if (rowSelected.Id !== row.Id)
				row.classRow = '';
		});
	}
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class FarmaciaAgregarProductoFacturadoAInternadoController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('FarmaciaAgregarProductoFacturadoAInternadoController');
		this.$log.debug('ON');
		this.loading = true;

		this.internado = angular.copy(this.resolve.Internado);

		let _obtenerNuevoProducto = this.FarmaciaFacturacionDataService.obtenerNuevo();
		let _obtenerTodos = this.TipoStockeableDataService.obtenerTodos()

		this.$q.all([_obtenerNuevoProducto,_obtenerTodos
		])
		.then((pResult) => {
				this.$log.debug('pResult', pResult);
				this.tiposProductos = angular.copy(pResult[1]);
				this.obtenerNuevoProductoFacturado = angular.copy(pResult[0]);
				this.loading = false;
			}, (pError) => {
				this.$log.error('pError', pError);
				this.loading = false;
			});
	}
	// #endregion
}