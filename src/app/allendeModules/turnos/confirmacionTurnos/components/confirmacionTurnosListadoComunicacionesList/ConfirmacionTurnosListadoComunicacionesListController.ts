/**
* @author: ppautasso
* @description: controller para confirmacion turnos listado comunicaciones 
* @type: Controller
**/
import * as angular from 'angular';
import { IProgramacionDeConfirmacionDataService, IEstadoDeConfirmacionDataService, IComunicacionPorConfirmacionDeTurnoDataService } from '../../services';
import { IFiltroListaComunicacionesDTO } from '../../models';

export class ConfirmacionTurnosListadoComunicacionesListController implements angular.IController {

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

	tiposProgramacion:Array<any> = [];
	tipoProgramacion;
	estadoProgramacion;
	estadosDeConfirmacion:Array<any> = [];
	data;

	tableOption = {
		CurrentPage: 1,
		PageSize: 10
	};
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'ProgramacionDeConfirmacionDataService', 'EstadoDeConfirmacionDataService',
	'ComunicacionPorConfirmacionDeTurnoDataService', 'moment'];
	/**
	* @class ConfirmacionTurnosListadoComunicacionesListController
	* @constructor
	*/
	constructor(private $log: ILogger, private ProgramacionDeConfirmacionDataService:IProgramacionDeConfirmacionDataService,
			private EstadoDeConfirmacionDataService:IEstadoDeConfirmacionDataService, 
			private ComunicacionPorConfirmacionDeTurnoDataService:IComunicacionPorConfirmacionDeTurnoDataService,
			private moment) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	buscarTipoDeProgramaciones(){
		this.loading = true;
		this.ProgramacionDeConfirmacionDataService.getAll()
		.then( (pResult) => {
			this.$log.debug('pResult',pResult);
			if(pResult && pResult.length){
				// tengo tipos de programaciones => las asigno al combo
				pResult.forEach(element => {
					this.tiposProgramacion.push({
						Id: element.Id,
						Nombre: element.TipoDeComunicacion
					})
				});
			}
			this.loading = false
		}, (pError) => {
			this.$log.error('pError',pError);
			this.loading = false
		});
	}

	buscarEstadosDeProgramacion(){
		this.loading = true;
		this.EstadoDeConfirmacionDataService.getAll()
		.then( (pResult) => {
			this.$log.debug('pResult',pResult);
			if(pResult && pResult.length){
				// tengo tipos de programaciones => las asigno al combo
				pResult.forEach(element => {
					this.estadosDeConfirmacion.push({
						Id: element.Id,
						Nombre: element.Nombre
					})
				});
			}
			this.loading = false
		}, (pError) => {
			this.$log.error('pError',pError);
			this.loading = false
		});
	}

	buscar(){

		let _filtro: IFiltroListaComunicacionesDTO = {};
		_filtro.IdProgramacion = (this.tipoProgramacion) ? this.tipoProgramacion.Id : 0;
		_filtro.IdEstadoConfirmacion = (this.estadoProgramacion) ? this.estadoProgramacion.Id : 0;
		_filtro.FechaDesde = angular.copy(this.moment(this.fechaDesde).format("MM-DD-YYYY"));
		_filtro.FechaHasta = angular.copy(this.moment(this.fechaHasta).format("MM-DD-YYYY"));
		_filtro.CurrentPage = this.tableOption.CurrentPage;
		_filtro.PageSize = this.tableOption.PageSize;

		this.loading = true;

		this.ComunicacionPorConfirmacionDeTurnoDataService.obtenerPorLista(_filtro)
		.then( (pResult) => {
			this.$log.debug('pResultComunicacionesList',pResult);
			if(pResult.Rows && pResult.Rows.length){
				pResult.Rows.forEach(row => {
					if(row.FechaActualizacion.includes("0001-01-01")){
						row.FechaActualizacion = "-"
					}
				});
			}
			this.data = pResult;
			this.loading = false;
		}, (pError) => {
			this.$log.error('pError',pError);
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

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class ConfirmacionTurnosListadoComunicacionesListController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('ConfirmacionTurnosListadoComunicacionesListController');
		this.$log.debug('ON');

		this.buscarTipoDeProgramaciones();
		this.buscarEstadosDeProgramacion();
	}
	// #endregion
}