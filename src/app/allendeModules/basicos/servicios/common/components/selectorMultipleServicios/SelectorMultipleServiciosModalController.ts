/**
* @author: ppautasso
* @description: controller para selector de servicios multiples modal
* @type: Controller
**/
import * as angular from 'angular';
import { IServiciosGestionDataService } from '../../../gestion/services/ServiciosGestionDataService';

export class SelectorMultipleServiciosModalController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	loading: boolean = false;
	dismiss;
	close;
	resolve;
	serviciosMedicos;
	serviciosPreviamenteSeleccionados;

	currentPage;
	pageSize;
	totalItems;
	filterData;
	filterBuscarItem;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'ServiciosGestionDataService', 'AlertaService', '$filter'];
	/**
	* @class SelectorMultipleServiciosModalController
	* @constructor
	*/
	constructor(private $log: ILogger, private ServiciosGestionDataService: IServiciosGestionDataService,
	private AlertaService:IAlertaService, private $filter) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */	

	selectServicio(row) {
		this.$log.debug('rowSelect', row);
		if (!row.selected) {
			row.selected = true;
			this.serviciosMedicos.find(x => x.Id === row.Id).selected = true;
		} else if (row.selected) {
			row.selected = false;
			this.serviciosMedicos.find(x => x.Id === row.Id).selected = false;
		}
	}

	getPage() {

		var begin = ((this.currentPage - 1) * this.pageSize);
		var end = begin + this.pageSize;

		this.filterData = this.$filter('filter')
			(this.serviciosMedicos,this.filterBuscarItem);

		this.$log.debug('filtro ', this.filterData);
		this.filterData = this.filterData.slice(begin, end);
		this.totalItems = this.serviciosMedicos.length;

	}

	initPage() {

		this.currentPage = 1;
		this.pageSize = 10;
		this.totalItems = 0;
	
	}

	cancel() {
		this.dismiss({ $value: 'cancel' });
	}
	
	seleccionarServicios(){

		if(this.serviciosMedicos.find(x => x.selected))
		// tengo un servicio seleccionado entonces cierro
		{
			let val = this.serviciosMedicos.filter(x => x.selected);
			this.close({ $value: val });
		}else {
			this.AlertaService.NewWarning("Debe seleccionar al menos un servicio");
		}
	}

	getItemsFiltered() {

		this.filterData = this.$filter('filter')
			(this.serviciosMedicos,this.filterBuscarItem);

	}
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class SelectorMultipleServiciosModalController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('SelectorMultipleServiciosModalController');
		this.$log.debug('ON');

				

		this.loading = true;
		this.ServiciosGestionDataService.getAll()
			.then((pResult) => {

				this.$log.debug('pResult', pResult);
				this.serviciosMedicos = angular.copy(pResult);
				for (let index = 0; index < this.serviciosMedicos.length; index++) {
					this.serviciosMedicos[index].selected = false;
				}
				// consulto si tengo servicios previos seleccionados
				// y si tengo los pongo en selected 
				this.serviciosPreviamenteSeleccionados = angular.copy(this.resolve.ServiciosSeleccionados);
				if(this.serviciosPreviamenteSeleccionados && this.serviciosPreviamenteSeleccionados.length > 0){
					angular.forEach(this.serviciosPreviamenteSeleccionados, (servicioPrev) => {
						this.serviciosMedicos.find(x => x.Id === servicioPrev.Id).selected = true;
					});
				}
				this.loading = false;
				this.initPage();
				this.getPage();


			}, (pError) => {

				this.$log.error('pError', pError);
				this.loading = false;

			});

	}
	// #endregion
}