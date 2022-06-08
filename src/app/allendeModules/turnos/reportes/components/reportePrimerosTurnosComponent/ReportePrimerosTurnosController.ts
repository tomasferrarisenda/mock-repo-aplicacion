/**
* @author: pablo pautasso
* @description: Controller para el reporte de los primeros turnos
* @type: Controller
**/
import * as angular from 'angular';
import { IDisponibilidadDeTurnosDataService } from '../../../common/services/DisponibilidadDeTurnosDataService';
import { ITurnoReportesLogicService } from '../../services';

export class ReportePrimerosTurnosController implements angular.IController {

	// #region /* -------------------------------------- PROPIEDADES --------------------------------------- */

	fechaDesde: Date = new Date();
	controlEdad: boolean = false;
	tiposDeTurno;
	criterioBusqueda;
	sucursales;
	prestaciones;
	mutual;
	codigoMutual;
	mutualesSeleccionadas: Array<any> = [];
	recurso;
	servicioMedico;
	sucursal;
	tipoTurno;
	edadCriterio;
	data;
	columnasTabla: Array<any> = [
		{
			label: "Recurso",
			field: "Recurso"
		}];

	loading: boolean = false;

	// #endregion

	// #region /* -------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', '$q', 'ModalService', '$scope', 'moment', '$timeout', 'DateUtils',
		'PlantillaDataService', 'TurnoDataService', 'SucursalDataService', 'TurnoReportesLogicService',
		'PrestacionGestionDataService', 'AsignacionTurnoLogicService', 'MutualDataService', 'AlertaService',
		'DisponibilidadDeTurnosDataService'];
	/**
	* @class ReportePrimerosTurnosController
	* @constructor
	*/
	constructor(private $log: ILogger, private $q, private ModalService: IModalService, private scope, private moment, timeout, private DateUtils,
		private PlantillaDataService, private TurnoDataService, private SucursalDataService, private TurnoReporteLogicService: ITurnoReportesLogicService,
		private PrestacionGestionDataService, private AsignacionTurnoLogicService, private MutualDataService, private AlertaService: IAlertaService,
		private DisponibilidadDeTurnosDataService: IDisponibilidadDeTurnosDataService) {

	}

	// #endregion

	// #region /* --------------------------------- ----- MÉTODOS ------------------------------------------ */

	cargarDatosPrestacion(pServicio) {

		//cargo las prestaciones para el servicio
		if (pServicio !== null) {
			this.ModalService.loadingOpen();
			this.PrestacionGestionDataService.getTodasPrestacionesXServicio(pServicio.Id)
				.then(pResults => {
					this.$log.debug("getPrestacionesXServicioOk", pResults);
					if (pResults.length !== 0) {
						this.prestaciones = pResults;

						var _ifConsulta = this.prestaciones.find(x => x.Nombre == "CONSULTA");
						if (_ifConsulta) {

							this.prestaciones.find(x => x.Id === _ifConsulta.Id).status = true;

						} else {
							this.prestaciones[0].status = true;
						}
					} else {
						//no tengo prestaciones, por ende no cargo ninguna o borro las que estaban ya puestas
						this.prestaciones = {};
					}
					this.ModalService.loadingClose();
				}, pError => {
					this.$log.error("getPrestacionesXServicioError", pError);
					this.ModalService.loadingClose();
				});
		}
	}

	cargarSucursalesXServicio(servicioMedico) {
		if (servicioMedico) {
			this.ModalService.loadingOpen();
			this.SucursalDataService.obtenerSucursalesXServicio(servicioMedico.Id)
				.then(pResults => {
					this.ModalService.loadingClose();
					//agrego opcion de TODAS
					let _todasSucursal = {
						Nombre: "TODAS",
						Id: 0
					}
					pResults.unshift(_todasSucursal);
					this.sucursales = angular.copy(pResults);
				}, pError => {
					this.ModalService.loadingClose();
					this.$log.error('Error al obtener sucursales x servicio', pError);
				});
		}
	}

	// #endregion

	// #region /* --------------------------------------- EVENTOS ------------------------------------------ */

	/**
	* @class ReportePrimerosTurnosController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('ReportePrimerosTurnosController');
		this.$log.debug('ON');

		var _tiposDeTurnos = this.PlantillaDataService.obtenerTiposDeTurnos();
		var _criterioBusqueda = this.TurnoDataService.obtenerNuevoCriterioBusqueda();

		this.$q.all([_tiposDeTurnos, _criterioBusqueda
		]).then(pResponse => {

			this.$log.debug('Inicializar datos y consulta...OK', pResponse);
			this.tiposDeTurno = pResponse[0];
			this.criterioBusqueda = pResponse[1];

		}, pError => {
			this.$log.error('Inicializar Datos y consulta... ERROR', pError);
		});

	}
	// #endregion

	// #region /* ----------------------------- --------- BUSQUEDA ----------------------------------------- */
	buscar() {

		if (this.isBuscarHabilitado()) {

			let listaCriterioBusquedaDTO = this.obtenerConsultaCriterioArmada();
			//obtenemos la lista...
			if (listaCriterioBusquedaDTO.Criterios.length > 0) {

				this.$log.debug('listaCriterioBusqueda Obtenido...', listaCriterioBusquedaDTO);
				delete this.columnasTabla;
				delete this.data;
				this.ModalService.loadingOpen();
				this.DisponibilidadDeTurnosDataService.obtenerReporteProximoTurnoDisponible(listaCriterioBusquedaDTO)
					.then(pResults => {
						this.$log.debug('obtenerReporteProximoTurnoDisponible OK', pResults);

						// seteo busqued para casos donde la mutual no tenga nombre
						angular.forEach(pResults.Resultados, (resultado) => {
							this.$log.debug('resultado', resultado);
							angular.forEach(resultado.ProximosTurnos, (proximoTurno, key) => {
								if (!proximoTurno.Mutual) {
									proximoTurno.Mutual = this.mutualesSeleccionadas.find(x => x.Id === proximoTurno.IdMutual).Nombre;
								}
							})
						});

						this.ModalService.loadingClose();
						this.setResultados(pResults);

					}, pError => {
						this.$log.error('obtenerReporteProximoTurnoDisponible ERROR', pError);
						this.ModalService.loadingClose();
					})
			}
		}

	}

	// #endregion

	// #region /* --------------------------------------- SUPPORT ------------------------------------------ */

	loadPrestacionesBtn() {
		return this.AsignacionTurnoLogicService.loadPrestacionesButton(this.prestaciones);
	}

	handleEventProp() {
		$(".dropdown-menu").click(function (e) {
			e.stopPropagation();
		});
	}

	agregarMutual() {
		if (this.mutual) {
			if (!this.mutualesSeleccionadas.find(x => x.Id === this.mutual.Id)) {

				// voy a agregar la mutual => pero tengo que seleccionarle el plan
				// busco los planes
				this.loading = true;
				this.MutualDataService.ObtenerTodosPorMutual(this.mutual.Id)
					.then((planesResult) => {
						this.$log.debug('planesResult', planesResult);
						this.loading = false;

						//abro seleccionardor de plan mutual
						let options: Array<any> = [];
						if (planesResult && planesResult.length) {
							planesResult.forEach(plan => {
								options.push(
									{
										id: plan.Id,
										label: "PLAN: " + plan.Nombre
									}
								);
							});
						}

						if(options && options.length){

							this.ModalService.selectOptionModal(options, "Seleccione un plan de " + this.mutual.Nombre).then((opcionElegida) => {
	
								this.$log.debug('agregando mutual a la lista..', this.mutual);
								let _planElegido = planesResult.find(x => x.Id == opcionElegida.id);
								this.$log.debug('agregando plan seleccionado a la mutual..', _planElegido);
								this.mutual.Plan = angular.copy(_planElegido);
								this.mutualesSeleccionadas.push(this.mutual);
								delete this.mutual;
	
							});
						}


					}, (pError) => {
						this.$log.error('pError', pError);
						this.loading = false;
					});
			}
		}
	}

	quitarMutual(mutual) {
		if (mutual) {
			this.mutualesSeleccionadas = angular.copy(this.mutualesSeleccionadas.filter(x => x.Id !== mutual.Id));
		}
	}


	obtenerConsultaCriterioArmada() {
		let listaCriterioBusquedaDTO = {
			FechaDesde: new Date(),
			Criterios: Array<any>()
		}

		if (this.mutualesSeleccionadas && this.mutualesSeleccionadas.length > 0) {

			angular.forEach(this.mutualesSeleccionadas, (mutual) => {

				let criterio = this.obtenerCriterioArmado(mutual);
				listaCriterioBusquedaDTO.Criterios.push(criterio);
			});

			let fecha = angular.copy(this.moment(this.fechaDesde).format('MM-DD-YYYY'));
			listaCriterioBusquedaDTO.FechaDesde = angular.copy(fecha);
		}

		return listaCriterioBusquedaDTO;
	}

	obtenerCriterioArmado(mutual) {
		let criterio = angular.copy(this.criterioBusqueda);
		//
		if (criterio != "") {

			if (this.prestaciones && this.prestaciones.length > 0) {

				criterio.Prestaciones.length = 0;
				angular.forEach(this.prestaciones, function (prestacion) {
					if (prestacion.status === true) {
						criterio.Prestaciones.push({IdPrestacion: prestacion.Id, IdItemSolicitudEstudios: null});
					}
				});
			}

			criterio.IdRecurso = this.recurso ? angular.copy(this.recurso.Id) : 0;
			criterio.IdTipoRecurso = this.recurso ? angular.copy(this.recurso.IdTipoRecurso) : 0;
			criterio.IdServicio = this.servicioMedico ? angular.copy(this.servicioMedico.Id) : 0;
			criterio.IdSucursal = this.sucursal ? angular.copy(this.sucursal.Id) : 0;
			criterio.IdTipoDeTurno = this.tipoTurno ? angular.copy(this.tipoTurno.Id) : 0;

			criterio.IdFinanciador = angular.copy(mutual.Id);
			criterio.IdPlan = angular.copy(mutual.Plan.Id);

			//check control edad
			criterio.ControlarEdad = angular.copy(this.controlEdad);
			criterio.EdadPaciente = this.edadCriterio;

		}
		//
		return criterio;
	}

	isBuscarHabilitado() {
		return this.TurnoReporteLogicService.getBuscarStatus(this.servicioMedico, this.tipoTurno,
			this.prestaciones, this.mutualesSeleccionadas, this.sucursal)
	}


	setResultados(result) {

		this.setColumnaBase();
		angular.forEach(result.Resultados, (resultado) => {
			this.$log.debug('resultado', resultado);
			angular.forEach(resultado.ProximosTurnos, (proximoTurno, key) => {

				if (!this.columnasTabla.find(x => x.label === proximoTurno.Mutual)) {
					this.columnasTabla.push(this.crearColumna(proximoTurno, this.columnasTabla.length + 1, key));
				}
				resultado["fecha" + key] = angular.copy(this.parseFecha(proximoTurno))
			})
		});

		this.data = angular.copy(result.Resultados);

	}

	crearColumna(dato, orderKey, key) {

		// if(!dato.Mutual){

		// }

		let columna = {
			label: dato.Mutual,
			field: "fecha" + key,
			order: orderKey
		};
		return columna;
	}

	setColumnaBase() {
		let columns: Array<any> = [
			{
				label: "Recurso",
				field: "Recurso",
				order: 1
			}];
		this.columnasTabla = angular.copy(columns);
	}

	parseFecha(proximoTurno) {

		let fecha = angular.copy(proximoTurno.Fecha);

		if (fecha) {

			if (!fecha.includes("0001-")) {
				fecha = this.moment(fecha).format("DD-MM-YYYY")
			} else {

				if (proximoTurno.Atiende == false) fecha = "No atiende esta OOSS";
				else fecha = "Recurso Sin Turnos";
			}
		} else fecha = "Recurso Sin Turno";
		return fecha;
	}

	limpiarCriterio() {
		delete this.recurso;
		delete this.sucursal;
		delete this.edadCriterio;
		this.controlEdad = false;
	}

	limpiar() {
		// limpio tabla de datos
		delete this.data;
		// limpio tabla de mutuales agregadas
		this.mutualesSeleccionadas.length = 0;
		// borro servicio
		delete this.servicioMedico;
		// borro tipo de turno
		delete this.tipoTurno;
		// borro recurso
		delete this.recurso;
		// borro sucursal
		delete this.sucursal;
		// borro filtro edad
		delete this.edadCriterio;
		// borro prestaciones
		delete this.prestaciones;
	}

	// #endregion


}