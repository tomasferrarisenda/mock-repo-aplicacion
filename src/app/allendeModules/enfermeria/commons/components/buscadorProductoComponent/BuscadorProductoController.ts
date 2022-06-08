/**
* @author: ppautasso
* @description: controller para el componente de buscador de productos tipo modal
* @type: Controller
**/
import * as angular from 'angular';
import { IStockeableDataService } from '../../../services';
import { FiltroStockeable } from '../../../models'

export class BuscadorProductoController implements angular.IController {

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

	productosList;
	tipoStockeableList;
	tipoStockeable;
	codigoStockeable;
	nombreFilter;
	presentacionFilter;

	filtroStockeable: FiltroStockeable = {
		IdTipoStockeable: 0,
		Codigo: 0,
		Nombre: '',
		Descripcion: ''
	};

	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'StockeableDataService', 'AlertaService'];
	/**
	* @class BuscadorProductoController
	* @constructor
	*/
	constructor(private $log: ILogger, private StockeableDataService:IStockeableDataService, private AlertaService:IAlertaService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	selectRow(row){
		this.close({ $value: row });
	}

	buscar(){

		this.loading = true;
		this.setFilter();
		if(this.filtroStockeable.IdTipoStockeable !== 0){

			this.StockeableDataService.obtenerPorFiltro(this.filtroStockeable)
			.then((pResponse) => {
				this.$log.debug('pResponse ObtenerPorFiltro',pResponse);
				this.productosList = pResponse;
				this.loading = false;
			}, (pError) => {
				this.$log.error('pError ObtenerPorFiltro',pError);
				this.loading = false;
			});

		}else {
			this.AlertaService.NewWarning("Debe seleccionar un Tipo de Producto para buscar");
			this.loading = false;
		}
	}

	setFilter(){
		this.filtroStockeable.IdTipoStockeable = (this.tipoStockeable) ? this.tipoStockeable.Id : 0;
		this.filtroStockeable.Codigo = (this.codigoStockeable) ? this.codigoStockeable : 0;
		this.filtroStockeable.Nombre = (this.nombreFilter) ? this.nombreFilter : '';
		this.filtroStockeable.Descripcion = (this.presentacionFilter) ? this.presentacionFilter : '';
	}

	limpiarFiltros(){
		delete (this.tipoStockeable);
		delete (this.codigoStockeable);
		delete (this.nombreFilter);
		delete (this.presentacionFilter)
		delete this.productosList;
	}
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class BuscadorProductoController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('BuscadorProductoController');
		this.$log.debug('ON');
		this.tipoStockeableList = angular.copy(this.resolve.TiposStockeable);
		this.tipoStockeable = angular.copy(this.resolve.TipoStockeable);
	}
	// #endregion
}