/**
* @author: ppautasso
* @description: controller para modal de ver calendario de ocupacion de turnos
* @type: Controller
**/
import * as angular from 'angular';
import { IDisponibilidadDeTurnosDataService } from '../../services/DisponibilidadDeTurnosDataService';
import { FiltroObtenerTurnosPorRecursoDto } from '../..';

export class CalendarioOcupacionTurnosModalController implements angular.IController {

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

	recurso;
	servicio;
	sucursales;
	today = new Date();
	infoCalendario: any;
	uiConfig: any;

	tiposDeTurno;
	coloresEstadoTurno;

	dateSeleccionadoCalendar;
	turnosDisponiblesDelDia;
	diaElegidoText;
	tiposEstadoTurno;

	filtroObtenerTurnosPorRecurso: FiltroObtenerTurnosPorRecursoDto = {};

	seleccionarDiaEstado: boolean = false;

	private _soloAgendaActiva: boolean = true;
	public get soloAgendaActiva(): boolean {
		return this._soloAgendaActiva;
	}
	public set soloAgendaActiva(v: boolean) {
		this._soloAgendaActiva = v;
		if (v) {
			this.limpiar();
			this.obtenerInfoCalendario();
		} else {
			this.limpiar();
		}
	}


	private _sucursal: any;
	public get sucursal(): any {
		return this._sucursal;
	}
	public set sucursal(v: any) {
		this._sucursal = v;
		if (v && v.Id) {
			this.limpiar();
			this.obtenerInfoCalendario();
		} else {
			this.limpiar();
		}
	}

	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'moment', '$timeout', 'SucursalDataService', 'DisponibilidadDeTurnosDataService',
		'uiCalendarConfig', 'PlantillaDataService', '$q', 'AsignacionTurnoLogicService', 'AsignacionTurnoDataService',
		'TurnoDataService'];
	/**
	* @class CalendarioOcupacionTurnosModalController
	* @constructor
	*/
	constructor(private $log: ILogger, private moment, private $timeout: angular.ITimeoutService,
		private SucursalDataService,
		private DisponibilidadDeTurnosDataService: IDisponibilidadDeTurnosDataService,
		private uiCalendarConfig,
		private PlantillaDataService,
		private $q,
		private AsignacionTurnoLogicService,
		private AsignacionTurnoDataService,
		private TurnoDataService,
	) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	obtenerInfoCalendario() {

		this.loading = true;

		var _fechaDesde = angular.copy(this.moment(this.today).format("MM-DD-YYYY"));
		var _fechaHasta = angular.copy(this.moment(this.today).add(4, "M").format("MM-DD-YYYY"));

		this.DisponibilidadDeTurnosDataService.obtenerCalendarioDisponibilidadGeneral(this.recurso.Id, this.recurso.IdTipoRecurso,
			this.servicio.Id, this.sucursal.Id, _fechaDesde, _fechaHasta, this.soloAgendaActiva)
			.then((pResultCalendario) => {
				this.$log.debug('pResultCalendario', pResultCalendario);
				this.infoCalendario = pResultCalendario;
				this.loading = false;
				this.calendarPrevNext();
				this.calendarRender();

			}, (pError) => {
				this.$log.error('pError', pError);
				this.loading = false;
			});
	}

	limpiar() {
		delete this.infoCalendario;
		delete this.turnosDisponiblesDelDia;
	}

	obtenerTurnosPorDia(fecha) {
		this.loading = true;

		var _fechaDesde = angular.copy(fecha.format('MM-DD-YYYY'));
		var _fechaHasta = angular.copy(fecha.format('MM-DD-YYYY'));

		this.filtroObtenerTurnosPorRecurso.FechaDesde = _fechaDesde;
		this.filtroObtenerTurnosPorRecurso.FechaHasta = _fechaHasta;
		this.filtroObtenerTurnosPorRecurso.IdRecurso = this.recurso.Id;
		this.filtroObtenerTurnosPorRecurso.IdTipoRecurso = this.recurso.IdTipoRecurso;
		this.filtroObtenerTurnosPorRecurso.IdServicio = this.servicio.Id;
		this.filtroObtenerTurnosPorRecurso.IdSucursal = this.sucursal.Id;
		this.filtroObtenerTurnosPorRecurso.SoloAgendaActiva = this.soloAgendaActiva;

		this.DisponibilidadDeTurnosDataService.obtenerTurnosPorRecurso(this.filtroObtenerTurnosPorRecurso)
			.then((pResults) => {

				this.$log.debug('pResult', pResults);
				this.turnosDisponiblesDelDia = pResults;
				this.setData();
				this.loading = false;

			}, (pError) => {
				this.$log.error('pError', pError);
				this.loading = false;
			});
	}

	setData() {
		this.turnosDisponiblesDelDia.forEach(turno => {

			angular.forEach(this.sucursales, (sucursal) => {

				if (turno.IdSucursal === sucursal.Id) {
					turno.Sucursal = angular.copy(sucursal.Nombre);
					turno.ColorSucursal = angular.copy(sucursal.Color);
				}
			});

			angular.forEach(this.tiposEstadoTurno, (estadoTurno) => {
				if (turno.IdEstado === estadoTurno.Id) {
					turno.NombreEstado = angular.copy(estadoTurno.Nombre);
					turno.ColorEstado = angular.copy(estadoTurno.Color);
				}
			});

		});
	}


	seleccionarDia() {
		this.close({ $value: this.moment(this.dateSeleccionadoCalendar.format('MM-DD-YYYY'), "MM-DD-YYYY") });
	}

	// #endregion

	/* ---------------------------------------------- CALENDAR ---------------------------------------------- */
	//region CALENDAR

	inicializarCalendario() {

		this.uiConfig = {
			calendarOcupacionTurnos: {
				schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
				height: "auto",
				defaultView: "month",
				timezone: false,
				firstDay: 1,
				editable: true,
				eventOverlap: false,
				selectable: true,
				header: {
					left: "title",
					center: "colorButton",
					right: "prev,next"
				},
				eventClick: (calEvent, jsEvent, view) => {
					this.$log.debug("eventClick", calEvent, jsEvent, view);
				},
				events: [],
				dayRender: (date, cell) => {
					if (this.infoCalendario) {
						angular.forEach(this.infoCalendario.SituacionesPorDia, (value) => {
							if (date.format("MM/DD/YYYY") === this.moment(new Date(value.Fecha)).format("MM/DD/YYYY")) {
								cell.addClass(value.Color);
							}
						});
					}
					//if (date.date() === 16) vm.data.fechaSelectedCalendario = angular.copy(date);
				},
				dayClick: (date, jsEvent, view) => {
					//aplico funcion de seleccionar dia
					this.seleccionarDiaCalendario(date);
				}
			}
		};
	}


	calendarPrevNext() {

		this.loading = true;
		this.$timeout(() => {
			this.uiCalendarConfig.calendars.calendarOcupacionTurnos.fullCalendar("prev");
			this.uiCalendarConfig.calendars.calendarOcupacionTurnos.fullCalendar("next");
			this.loading = false;
		}, 300);
	}

	calendarRender() {
		this.loading = true;
		this.$timeout(() => {
			this.uiCalendarConfig.calendars.calendarOcupacionTurnos.fullCalendar("render");
			this.goToDate();
			this.loading = false;
		}, 500);
	}

	goToDate() {
		this.uiCalendarConfig.calendars.calendarOcupacionTurnos.fullCalendar("gotoDate", this.moment());
		this.seleccionarDiaCalendario(this.moment());
	}

	//funcion que llamamos al seleccionar un dia del caalendario tipo mes
	seleccionarDiaCalendario(date) {

		this.$log.debug('date seleccionada', date);
		this.dateSeleccionadoCalendar = angular.copy(date);

		if (this.infoCalendario.length !== 0) {
			var dateExist = false;

			angular.forEach(this.infoCalendario.SituacionesPorDia, (dia) => {
				if (!dateExist) {
					if (date.isSame(this.moment(new Date(dia.Fecha)), 'day')) {

						this.$log.debug('dia', dia);
						this.obtenerTurnosPorDia(date);
					} else {
						this.turnosDisponiblesDelDia = [];
					}
				}
			});
		}


		if (date.isUtc())
			this.diaElegidoText = date.utc().format("dddd, D [de] MMMM [de] YYYY");
		else
			this.diaElegidoText = date.format("dddd, D [de] MMMM [de] YYYY");
	}
	//endregion CALENDAR

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class CalendarioOcupacionTurnosModalController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('CalendarioOcupacionTurnosModalController');
		this.$log.debug('ON');

		this.inicializarCalendario();

		this.recurso = angular.copy(this.resolve.Recurso);
		this.servicio = angular.copy(this.resolve.Servicio);
		this.sucursal = angular.copy(this.resolve.Sucursal);

		//seteo seleccion de dia
		this.seleccionarDiaEstado = angular.copy(this.resolve.SeleccionarDia);

		var _tiposDeTurnos = this.PlantillaDataService.obtenerTiposDeTurnos();
		// var _sucursales = this.SucursalDataService.getAllSucursalesCombo();
		var _sucursales = this.SucursalDataService.obtenerSucursalXRecursoXServicio(this.recurso.Id,
			this.recurso.IdTipoRecurso, this.servicio.Id);
		var _tiposDeEstadoTurno = this.TurnoDataService.obtenerTiposEstadoTurnos();

		this.$q.all([_tiposDeTurnos, _sucursales, _tiposDeEstadoTurno
		]).then((pResult) => {

			this.$log.debug('pResult', pResult);
			this.tiposDeTurno = this.AsignacionTurnoLogicService.obtenerTiposDeTurnoFiltrado(pResult[0]);
			this.coloresEstadoTurno = this.AsignacionTurnoLogicService.getcoloresEstadoTurno();
			this.sucursales = pResult[1];

			this.tiposEstadoTurno = pResult[2];
			// si la sucursal es == 0 (Todas) elegimos la primera que viene cuando obtenemos
			if (this.sucursal.Id == 0) {
				this.sucursal = this.sucursales[0];
			}
			// voy a buscar los datos para completar el calendario
			this.obtenerInfoCalendario();


		}, (pError) => {
			this.$log.error('pError', pError);
		});

	}
	// #endregion
}