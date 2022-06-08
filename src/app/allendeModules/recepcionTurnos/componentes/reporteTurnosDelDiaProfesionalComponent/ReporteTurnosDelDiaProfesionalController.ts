/**
* @author: ppautasso
* @description: controller para componente del reporte de turnos del dia por profesional
* @type: Controller
**/
import * as angular from 'angular';
import { IDisponibilidadDeTurnosDataService } from '../../../turnos/common/services/DisponibilidadDeTurnosDataService';
import { IRecepcionTurnosLogicService } from '../../../recepcionTurnos/services/RecepcionTurnosLogicService';

export class ReporteTurnosDelDiaProfesionalController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */

	resolve;
	dismiss;
	loading: boolean = false;
	fecha = this.resolve.Fecha || new Date();
	servicios: any;
	servicio: any;
	recursos: any;
	recurso: any;
	sucursal: any;
	recepcion: any;
	sucursalesXServicio: any;
	reporteCompleto : boolean = false;
	// mas propiedades ..

	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'moment', '$q', 'AlertaService', 'DisponibilidadDeTurnosDataService',
		'RecepcionTurnosLogicService', 'PlantillaDataService', 'SucursalDataService', 'ModalService', 'RecursosDataService'];
	/**
	* @class ReporteTurnosDelDiaProfesionalController
	* @constructor
	*/
	constructor(private $log: ILogger, private moment, private $q, private AlertaService: IAlertaService, private DisponibilidadDeTurnosDataService: IDisponibilidadDeTurnosDataService,
		private RecepcionTurnosLogicService: IRecepcionTurnosLogicService, private PlantillaDataService, private SucursalDataService, private ModalService: IModalService,
		private RecursosDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	imprimir() {

		if (this.getRazonBloqueante()) {

			let _fecha = this.moment(this.fecha).format("MM-DD-YYYY");
			var _reporte;
			//voy a consultar si es reporte simple o reporte completo
			var options = [{
				id: 1,
				label: "Reporte Simple"
			}, {
				id: 2,
				label: "Reporte Completo"
			},{
				id: 3,
				label: "Reporte de Recepción"
			}]

			this.ModalService.selectOptionModal(options)
				.then((pResultEleccion) => {

					this.$log.debug('result select option', pResultEleccion);
					if (pResultEleccion.id === 1) {
						_reporte = this.DisponibilidadDeTurnosDataService.obtenerReporteTurnosPorRecursoSimple(this.recurso.Id,
							this.recurso.IdTipoRecurso, this.servicio.Id, this.sucursal.Id, _fecha, _fecha);
						this.reporteCompleto = false;
					} else if(pResultEleccion.id === 2) {
						_reporte = this.DisponibilidadDeTurnosDataService.obtenerReporteTurnosPorRecursoCompleto(this.recurso.Id,
							this.recurso.IdTipoRecurso, this.servicio.Id, this.sucursal.Id, _fecha, _fecha);
						this.reporteCompleto = true;
					}else {
						_reporte = this.DisponibilidadDeTurnosDataService.obtenerReporteTurnosConPrefacturaPorRecurso(this.recurso, 
							this.recurso.IdTipoRecurso, this.servicio.Id, this.sucursal.Id, _fecha, _fecha);
					}

					var _obtenerObservacionesPlantilla = this.PlantillaDataService.obtenerPlantillasConObservacionesPorServicioRecurso(
						this.servicio.Id, this.recurso.IdTipoRecurso, this.recurso.Id, _fecha, _fecha);

					this.$q.all([_reporte, _obtenerObservacionesPlantilla])
						.then((pResult) => {

							this.$log.debug('obtenerReporteTurnosPorRecusosSimple OK ', pResult);
						
							if (pResult[0] && pResult[0].length > 0) {

								if(pResultEleccion.id === 3){
									// tengo reporte de prefactura, imprimo distinto componente
									// this.RecepcionTurnosLogicService.imprimirReporteTurnosPrefacturaPorFechaYProfesional(pResult[0], pResult[1], 
									// 	this.moment(this.fecha).format("DD/MM/YYYY"), this.recurso)
								}else {		
									//levanto modal de impresion
									this.RecepcionTurnosLogicService.imprimirReporteTurnosPorFechaYProfesional(pResult[0], pResult[1], 
										this.moment(this.fecha).format("DD/MM/YYYY"), this.recurso, this.reporteCompleto, this.sucursal);
								}
							} else {
								this.AlertaService.NewWarning("Atención", "No hay turnos disponibles para imprimir");
							}

						}, (pError) => {
							this.$log.error('obtenerReporteTurnosPorRecursosSimple ERROR', pError);
						});

				}, (pError) => {
					this.$log.error('pError', pError);
				});


		}

	}

	cargarSucursalesXServicio(servicio) {

		if (servicio) {
			this.loading = true;

			this.SucursalDataService.obtenerSucursalesXServicio(servicio.Id)
				.then((pResult) => {

					this.sucursalesXServicio = pResult;
					this.$log.debug('obtenerSucursalesXServicioOK', pResult);
					this.loading = false;

				}, (pError) => {

					this.$log.error('obtenerSucursalesXServicioError', pError);
					this.loading = false;
				});
		}
	}

	cargarRecursosXServicio(servicio){
		if (servicio) {
			this.loading = true;
			this.RecursosDataService.obtenerTodosDeUnServicio(servicio.Id)
				.then((pResult) => {

					this.recursos = pResult;
					this.$log.debug('cargarRecursosXServicioOK', pResult);
					this.loading = false;

				}, (pError) => {

					this.$log.error('cargarRecursosXServicioError', pError);
					this.loading = false;
				});
		}
	}

	getRazonBloqueante() {

		let strWarning = "Debe seleccionar ";
		let ret = true;
		if (!this.fecha) {
			ret = false;
			strWarning = strWarning + " -Fecha";
		}
		if (!this.servicio) {
			ret = false;
			strWarning = strWarning + " -Servicio";
		}
		if (!this.recurso) {
			ret = false;
			strWarning = strWarning + " -Recurso";
		}
		if (!this.sucursal) {
			ret = false;
			strWarning = strWarning + " -Sucursal";
		}

		if (!ret)
			this.AlertaService.NewWarning("Atención", strWarning);
		return ret;

	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class ReporteTurnosDelDiaProfesionalController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('ReporteTurnosDelDiaProfesionalController');
		this.$log.debug('ON');
		

		this.servicios = angular.copy(this.resolve.Servicios);

		this.servicio = this.servicios.find(x => x.Id === this.resolve.Servicio.Id);

		this.recepcion = angular.copy(this.resolve.Recepcion);
		this.cargarRecursosXServicio(this.servicio);
		this.cargarSucursalesXServicio(this.servicio);

	}
	// #endregion
}