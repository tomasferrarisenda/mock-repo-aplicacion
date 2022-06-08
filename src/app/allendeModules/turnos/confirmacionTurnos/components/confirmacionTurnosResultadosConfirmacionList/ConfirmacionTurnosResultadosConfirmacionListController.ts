/**
* @author: ppautasso
* @description: controller para mostrar la confirmacion de turnos resultados
* @type: Controller
**/
import * as angular from 'angular';
import { IConfirmacionTurnosLogicService } from '../../services';

export class ConfirmacionTurnosResultadosConfirmacionListController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	loading: boolean = false;
	fechaDesde = new Date();
	fechaHasta = new Date();
	fechadesdeMin = new Date();

	sucursal;
	servicio;
	serviciosList;
	recursosList;
	recurso;

	data;

	tableOption = {
		CurrentPage: 1,
		PageSize: 10
	};
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'TurnoDataService', 'ServiciosGestionDataService', 
	'RecursosDataService', 'moment', 'ConfirmacionTurnosLogicService'];
	/**
	* @class ConfirmacionTurnosResultadosConfirmacionListController
	* @constructor
	*/
	constructor(private $log: ILogger, private TurnoDataService, private ServiciosGestionDataService, 
		private RecursosDataService, private moment, private ConfirmacionTurnosLogicService:IConfirmacionTurnosLogicService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	changeFechaDesde() {
		this.fechadesdeMin.setDate(this.fechaDesde.getDate() - 1);
	}

	buscar() {

		this.loading = true;

		let _fechaDesde = angular.copy(this.moment(this.fechaDesde).format("MM-DD-YYYY"));
		let _fechaHasta = angular.copy(this.moment(this.fechaHasta).format("MM-DD-YYYY"));

		let _IdSucursal = (this.sucursal) ? this.sucursal.id_sucursal : 0;
		let _IdServicio = (this.servicio) ? this.servicio.Id : 0;
		let _IdRecurso = (this.recurso) ? this.recurso.Id : 0;
		let _IdTipoRecurso = (this.recurso) ? this.recurso.IdTipoRecurso : 0;

		let dto = {
			FechaDesde: _fechaDesde,
			fechaHasta: _fechaHasta,
			IdSucursal: _IdSucursal,
			IdServicio: _IdServicio,
			IdRecurso: _IdRecurso,
			IdTipoRecurso: _IdTipoRecurso,
			CurrentPage: this.tableOption.CurrentPage,
			PageSize: this.tableOption.PageSize
		}

		this.TurnoDataService.obtenerTurnosConEstadoDeConfirmacion(dto)
			.then((pResult) => {
				this.$log.debug('pResult', pResult);
				if(pResult && pResult.Rows){
					this.data = pResult;
				}
				this.loading = false;
			}, (pError) => {
				this.$log.error('pError', pError);
				this.loading = false;
			});
	}

	getPage(pPagination) {
		if (pPagination) {
			this.tableOption.CurrentPage = pPagination.currentPage || 1;
			this.tableOption.PageSize = pPagination.pageSize || 10;
		} else {
			this.tableOption.CurrentPage = 1;
			this.tableOption.PageSize = 10;
		}
		// Guardo la pagina actual
		// vm.filter.currentPage = pPagination.currentPage;
		this.buscar();
	}

	verComunicaciones(row){

		this.$log.debug('ver Comunicaciones..',row.row);
		this.ConfirmacionTurnosLogicService.openVerComunicacionesDelTurno(row.row);

	}


	// #endregion


	// #region /* ----------------------------------------- SUPPORT ----------------------------------------- */
	// changeSucursal(){
	// 	// cambie la sucursal voy a buscar todos los servicios de la sucursal
	// 	this.loading = true;

	// 	let _idSucursal;
	// 	if(this.sucursal && this.sucursal.id_sucursal){
	// 		_idSucursal = this.sucursal.id_sucursal;
	// 	}else _idSucursal = 0;

	// 	this.ServiciosGestionDataService.getServiciosBySucursal(_idSucursal)
	// 	.then( (pResult) => {
	// 		this.$log.debug('pResult',pResult);
	// 		this.serviciosList = angular.copy(pResult);
	// 		this.loading = false;
	// 	}, (pError) => {
	// 		this.$log.error('pError',pError);
	// 		this.loading = false;
	// 	});
	// }

	obtenerServicios() {
		this.loading = true;
		this.ServiciosGestionDataService.getAll()
			.then((pResult) => {
				this.$log.debug('pResult', pResult);
				this.serviciosList = angular.copy(pResult);
				this.loading = false;
			}, (pError) => {
				this.$log.error('pError', pError);
				this.loading = false;
			});
	}

	obtenerRecursos() {
		this.loading = true;
		this.RecursosDataService.getAll()
		.then((pResult) => {
			this.$log.debug('pResult', pResult);
			this.recursosList = angular.copy(pResult);
			this.loading = false;
		}, (pError) => {
			this.$log.error('pError', pError);
			this.loading = false;
		});
	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class ConfirmacionTurnosResultadosConfirmacionListController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('ConfirmacionTurnosResultadosConfirmacionListController');
		this.$log.debug('ON');

		this.obtenerServicios();
		this.obtenerRecursos();
	}
	// #endregion
}