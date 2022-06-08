/**
* @author: ppautasso
* @description: controller para el componente de gestion de enfermeras
* @type: Controller
**/
import * as angular from 'angular';
import { IEnfermeriaDataService, IEnfermeriaLogicService, IAsignacionTemporalEnfermeraDataService } from '../../services';
import {FiltroBusquedaEnfermera} from '../../models'

export class EnfermeriaGestionEnfermerasController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	loading: boolean = false;
	enfermerasListado;
	
	legajo;
	nombre;
	filtroBusquedaEnfermera: FiltroBusquedaEnfermera = {};
	
	tableOption = {
		CurrentPage: 1,
		PageSize: 7
	};
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'AlertaService',
	'EnfermeriaDataService', 'EnfermeriaLogicService', 
	'AsignacionTemporalEnfermeraDataService'];
	/**
	* @class EnfermeriaGestionEnfermerasController
	* @constructor
	*/
	constructor(private $log: ILogger, private AlertaService: IAlertaService,
		private EnfermeriaDataService: IEnfermeriaDataService, private EnfermeriaLogicService:IEnfermeriaLogicService,
		private AsignacionTemporalEnfermeraDataService:IAsignacionTemporalEnfermeraDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	buscar(){

		this.loading = true;

		this.filtroBusquedaEnfermera.Legajo = (this.legajo) ? angular.copy(this.legajo) : 0;
		this.filtroBusquedaEnfermera.Nombre = (this.nombre) ? angular.copy(this.nombre) : '';
		this.filtroBusquedaEnfermera.CurrentPage = angular.copy(this.tableOption.CurrentPage);
		this.filtroBusquedaEnfermera.PageSize = angular.copy(this.tableOption.PageSize);

		this.EnfermeriaDataService.obtenerPorFiltros(this.filtroBusquedaEnfermera)
		.then((pBuscarOk)=>{

			this.$log.debug('BuscarOk',pBuscarOk);
			this.enfermerasListado = angular.copy(pBuscarOk);
			this.loading = false;

		}, (pBuscarError)=>{

			this.$log.error('BuscarError',pBuscarError);
			this.loading = false;
		})
	}
	
	getPage(pPagination) {
		if (pPagination) {
			this.tableOption.CurrentPage = pPagination.currentPage || 1;
			this.tableOption.PageSize = pPagination.pageSize || 7;
		} else {
			this.tableOption.CurrentPage = 1;
			this.tableOption.PageSize = 7;
		}
		// Guardo la pagina actual
		// vm.filter.currentPage = pPagination.currentPage;
		this.buscar();
	}

	limpiar(){
		delete this.nombre;
		delete this.legajo;
		this.getPage(null);
		this.buscar();
	}

	prestarEnfermera(row){
		this.$log.debug('prestarEnfermera',row.row);
		let _enfermera = row.row;

		this.EnfermeriaLogicService.openNuevoPrestamoEnfermera(_enfermera)
		.then((pResponse) => {
			this.buscar();
		}, (pError)=>{
		});
	}

	verHistorialEnfermera(row){
		this.$log.debug('verHistorialEnfermera', row.row);
		let _enfermera = row.row;

		this.EnfermeriaLogicService.openVerHistorialEnfermera(_enfermera)
		.then( (pResult) => {
			this.$log.debug('pResult',pResult);
		}, (pError) => {
			this.$log.error('pError',pError);
		});
	}

	eliminarSubseccionTemporal(row){
		this.$log.debug('eliminarSubseccionTemporal', row.row);
		let _enfermera = row.row;
		this.loading = true;
		this.AsignacionTemporalEnfermeraDataService.eliminar(_enfermera.IdAsignacionTemporal)
		.then( (pResult) => {
			this.$log.debug('pResult',pResult);
			this.AlertaService.NewSuccess("Asignación Temporal Eliminada");
			this.buscar();
			this.loading = false;
		}, (pError) => {
			this.$log.error('pError',pError);
			this.loading = false;
		});

	}

	puedeEliminarSubseccionTemporal(row){
		return row.row.PuedeEliminarAsignacionTemporal
	}
	
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class EnfermeriaGestionEnfermerasController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('EnfermeriaGestionEnfermerasController');
		this.$log.debug('ON');
		// this.loading = true;
		this.buscar();
	}
	// #endregion
}