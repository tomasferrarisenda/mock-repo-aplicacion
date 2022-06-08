/**
* @author: ppautasso
* @description: controller para el componente de list de logs de ejecuciones
* @type: Controller
**/
import * as angular from 'angular';
import { IEjecucionDeProgramacionDeConfirmacionDataService, IProgramacionDeConfirmacionDataService } from '../../services';
import { IFiltroGestionesPorEjecucionDTO } from '../../models';

export class ConfirmacionTurnosLogsEjecucionesListController implements angular.IController {

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

	logsEjecuciones;
	tipoProgramacion;
	tiposProgramacion:Array<any> = [];

	columnasEjecuciones;

	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'EjecucionDeProgramacionDeConfirmacionDataService', 'moment', 
	'ProgramacionDeConfirmacionDataService', 'SelectorService'];
	/**
	* @class ConfirmacionTurnosLogsEjecucionesListController
	* @constructor
	*/
	constructor(private $log: ILogger, 
		private EjecucionDeProgramacionDeConfirmacionDataService:IEjecucionDeProgramacionDeConfirmacionDataService,
		private moment, private ProgramacionDeConfirmacionDataService:IProgramacionDeConfirmacionDataService,
		private SelectorService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	buscar(){
		this.loading = true;
		let _fechaDesde = angular.copy(this.moment(this.fechaDesde).format("MM-DD-YYYY"));
		let _fechaHasta = angular.copy(this.moment(this.fechaHasta).format("MM-DD-YYYY"));

		let _tipoProgramacionId;
		if(this.tipoProgramacion && this.tipoProgramacion.Id){
			_tipoProgramacionId = this.tipoProgramacion.Id;
		}else _tipoProgramacionId = 0;

		this.EjecucionDeProgramacionDeConfirmacionDataService.obtenerPorFecha(_fechaDesde, _fechaHasta, _tipoProgramacionId)
		.then( (pResult) => {
			this.$log.debug('pResult',pResult);
			
			pResult.forEach(element => {

				
				if(element.FechaProcesada.includes("0001-01-01")){
					element.FechaProcesadaParsed = "-";	
				}else{
					element.FechaProcesadaParsed = this.moment(element.FechaProcesada).format("DD/MM/YY (ddd)")
				} 

				if(element.TurnosDesde == element.TurnosHasta){
					// tengo fecha unica entonces seteo uno solo
					if(element.TurnosDesde.includes("0001-01-01")){
						element.FechaTurnosParsed = "-";	
					}else
					element.FechaTurnosParsed = this.moment(element.TurnosDesde).format("DD/MM/YY (ddd)")
				}else {
					// tengo mas de una fecha para mostrar entonce seteo desde/hasta
					element.FechaTurnosParsed = "Del " + this.moment(element.TurnosDesde).format("DD/MM/YY (ddd)") + " hasta " + this.moment(element.TurnosHasta).format("DD/MM/YY (ddd)");
				}
			});

			this.logsEjecuciones = pResult;
			this.loading = false;
		}, (pError) => {
			this.$log.error('pError',pError);
			this.loading = false;
		});
	}

	changeFechaDesde() {
		this.fechadesdeMin.setDate(this.fechaDesde.getDate() - 1);
	}

	changeTipoProgramacion(){
		// cambie el tipo, limpio grilla
		delete this.logsEjecuciones;
	}

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

	inicializarColumnas(){
		this.columnasEjecuciones = [
			{
				label: "Id",
				field: "Id",
				order: 1,
			},
			{
				label: "Id Prog",
				field: "IdProgramacion",
				order: 2,
			},
			{
				label: "Programación",
				field: "Programacion",
				order: 3,
			},
			{
				label: "Fecha Procesada",
				field: "FechaProcesadaParsed",
				order: 4
			},{
				label: "Fecha De Turnos",
				field: "FechaTurnosParsed",
				order: 5
			},{
				label: "Fecha Ejecución",
				field: "FechaEjecucion",
				order: 6,
				format: 'datetime'
			},{
				label: "Turnos",
				field: "Turnos",
				order: 7
			},
			{
				label: "Excluidos",
				field: "Excluidos",
				order: 8
			},{
				label: "Sin Datos De Contacto",
				field: "SinDatosDeContacto",
				order: 9
			},{
				label: "Comunicaciones generadas",
				field: "ComunicacionesGeneradas",
				order: 10
			},{
				label: "Comunicaciones en Bandeja Salida",
				field: "ComunicacionesEnBandejaSalida",
				order: 11
			},
			{
				label: "Notificados",
				field: "Notificados",
				order: 12
			},
			{
				label: "Pendientes",
				field: "Pendientes",
				order: 13
			}
			,
			{
				label: "Finalizados / Vencidos",
				field: "FinalizadosVencidos",
				order: 14
			}
		];
	}

	verExcluidos(row){
		this.$log.debug('verExcluidos',row.row);
		  
		let filtroNuevo: IFiltroGestionesPorEjecucionDTO = {};
		filtroNuevo.IdEjecucionDeProgramacion = row.row.Id;
		filtroNuevo.CurrentPage = 1;
		filtroNuevo.PageSize = 10;

		this.SelectorService.newSelector({

			nombreSelector: "Turnos Excluidos de la Ejecución", dataService: "GestionDeConfirmacionDeTurnoDataService",
			method: "obtenerExcluidosPorEjecucion", isTableBackEnd: true, objCriterio: filtroNuevo, Columnas: []
		})

		//this.SelectorService.newSelector('lg',"asdadsa",'GestionDeConfirmacionDeTurnoDataService','obtenerExcluidosPorEjecucion',null,true,filtroNuevo)
	
	}

	verSinDatosContacto(row){
		this.$log.debug('verSinDatosContacto',row.row);

		let filtroNuevo: IFiltroGestionesPorEjecucionDTO = {};
		filtroNuevo.IdEjecucionDeProgramacion = row.row.Id;
		filtroNuevo.CurrentPage = 1;
		filtroNuevo.PageSize = 10;

		this.SelectorService.newSelector({

			nombreSelector: "Turnos Sin datos de contacto", dataService: "GestionDeConfirmacionDeTurnoDataService",
			method: "obtenerSinDatosDeContacto", isTableBackEnd: true, objCriterio: filtroNuevo, Columnas: []
		})
	}
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class ConfirmacionTurnosLogsEjecucionesListController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('ConfirmacionTurnosLogsEjecucionesListController');
		this.$log.debug('ON');
		this.inicializarColumnas();
		this.buscarTipoDeProgramaciones();
	}
	// #endregion
}