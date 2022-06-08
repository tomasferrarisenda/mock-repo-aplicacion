/**
* @author: ppautasso
* @description: modal para levantar auditoria de un elemento por id y endpoint
* @type: Controller
**/
import * as angular from 'angular';

export class ModalOpenAuditoriaPorElementoController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	resolve;
	dismiss;
	close;
	loading: boolean = false;
	optionConfig: any;
	dataService: any;
	auditoria;

	tableOption = {
		CurrentPage: 1,
		PageSize: 10
	};
	// mas propiedades ..

	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'AlertaService'];
	/**
	* @class ModalOpenAuditoriaPorElementoController
	* @constructor
	*/
	constructor(private $log: ILogger, private AlertaService:IAlertaService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	buscar() {
		var dataCall;
		this.loading = true;

		if (angular.isFunction(this.dataService[this.optionConfig.method])) {

			if (this.optionConfig.idElemento) {

				dataCall = this.dataService[this.optionConfig.method].call(this.dataService, this.optionConfig.idElemento)
					.then((SearchAuditoriaOk) => {
						this.loading = false;
						if(SearchAuditoriaOk && SearchAuditoriaOk.Rows && SearchAuditoriaOk.Rows.length > 0){
							this.auditoria = this.setDifferencesColor(SearchAuditoriaOk);
						}else {
							this.AlertaService.NewWarning("No hay auditoria disponible");
							this.cancel();
						}
						this.$log.debug('SearchAuditoriaOk: ', SearchAuditoriaOk);
					}, (SearchAuditoriaError) => {
						this.loading = false;
						this.$log.error('SearchAuditoriaError: ', SearchAuditoriaError);
					});
			}

		} else {
			this.$log.error('Error', "El " + this.optionConfig.method + " no es una funcion");
			this.cancel();
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
		// vm.filter.currentPage = pPagination.currentPage;
		this.buscar();
	}


	setDifferencesColor(data){
		if(data){
			angular.forEach(data.Rows, (row, key) =>{
				if(key != 0){
					angular.forEach(data.Columns,  (column) => {
						if(row[column.Field] !== data.Rows[key-1][column.Field]){
							
							if(!column.Field.includes("FechaCambio")){
								row.colorCambio = 'color-aquaorange-turno';
								column.classCell = 'colorCambio';
							}
						}
					});
				}
			});
		}
		return data;
	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class ModalOpenAuditoriaPorElementoController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('ModalOpenAuditoriaPorElementoController');
		this.$log.debug('ON');
		this.optionConfig = angular.copy(this.resolve.Options);
		this.dataService = angular.copy(this.resolve.DataService);

		if (this.optionConfig) {
			this.buscar();
		}
	}
	// #endregion
}