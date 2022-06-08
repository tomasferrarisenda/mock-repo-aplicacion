/**
* @author: ppautasso
* @description: controller para reporte de recesos
* @type: Controller
**/
import * as angular from 'angular';
import MantenimientoAgendaDataService from '../../../mantenimientoagenda/services/MantenimientoAgendaDataService';

export class ReporteRecesosController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	tipoFecha: any;
	fechaDesde = new Date();
	fechaHasta = new Date();

	servicioMedico;
	sucursal;
	sucursales;
	recurso;
	data;
	loading: boolean = false;
	// #endregion

	tiposDeFecha: any = [{
        Id: 1,
        Nombre: 'Período Receso'
    },
    {
        Id: 2,
        Nombre: 'Fecha Aplicación'
    }];

	columnasTabla: Array<any> = [
		{
			label: "Fecha Desde",
			field: "FechaDesde",
			order: 1,
			format: 'date',
		},
		{
			label: "Fecha Hasta",
			field: "FechaHasta",
			order: 2,
			format: 'date',
		},
		{
			label: "Servicio",
			field: "Servicio",
			order: 3
		},
		{
			label: "Recurso",
			field: "Recurso",
			order: 4,
		},
		{
			label: "Tipo Recurso",
			field: "TipoRecurso",
			order: 5,
		},
		{
			label: "Sucursal",
			field: "Sucursal",
			order: 6
		},
		{
			label: "Motivo",
			field: "Motivo",
			order: 7
		},
		{
			label: "Caracteristicas",
			field: "Caracteristicas",
			order: 8
		},
		{
			label: "Turnos Ocupados Afectados",
			field: "TurnosOcupadosAfectados",
			order: 9
		},
		{
			label: "Turnos Libres Afectados",
			field: "TurnosLibresAfectados",
			order: 10
		},
		{
			label: "Observacion",
			field: "Observacion",
			order: 11
		}];

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'moment', 'MantenimientoAgendaDataService', 'SucursalDataService', 'AlertaService'];
	/**
	* @class ReporteRecesosController
	* @constructor
	*/
	constructor(private $log: ILogger, private moment, private MantenimientoAgendaDataService, private SucursalDataService, private AlertaService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	buscar(){

		if (!this.tipoFecha || this.tipoFecha.Id == 0) {
			this.AlertaService.NewWarning("Debe seleccionar un Tipo de Fecha para buscar");
			return;
		}

		this.loading = true;

		let idServicio = (this.servicioMedico) ? this.servicioMedico.Id : 0;
		let idRecurso =  (this.recurso) ? this.recurso.Id : 0;
		let idTipoRecurso = (this.recurso) ? this.recurso.IdTipoRecurso : 0;
		let idSucursal = (this.sucursal) ? this.sucursal.Id : 0;
		
		let _tipoFecha = (this.tipoFecha) ? this.tipoFecha.Id : 0;
		let _fechaDesde = this.moment(this.fechaDesde).format("MM-DD-YYYY");
		let _fechaHasta = this.moment(this.fechaHasta).format("MM-DD-YYYY");

		this.MantenimientoAgendaDataService.obtenerReporteDeRecesosAplicados(_tipoFecha, _fechaDesde, _fechaHasta, idServicio, idTipoRecurso, idRecurso, idSucursal)
		.then( (pResult) => {
			this.$log.debug('pResult',pResult);
			this.loading = false;
			this.data = angular.copy(pResult);
		}, (pError) => {
			this.$log.error('pError',pError);
			this.loading = false;
		});
	}


	limpiar(){
		delete this.servicioMedico;
		delete this.sucursal;
		this.recurso;
	}

	cargarSucursalesXServicio(servicioMedico) {
		if (servicioMedico) {
			this.loading = true
			this.SucursalDataService.obtenerSucursalesXServicio(servicioMedico.Id)
				.then(pResults => {
					this.loading = false
					//agrego opcion de TODAS
					let _todasSucursal = {
						Nombre: "TODAS",
						Id: 0
					}
					pResults.unshift(_todasSucursal);
					this.sucursales = angular.copy(pResults);
				}, pError => {
					this.loading = false
					this.$log.error('Error al obtener sucursales x servicio', pError);
				});
		}
	}
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class ReporteRecesosController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('ReporteRecesosController');
		this.$log.debug('ON');

		this.fechaHasta.setDate(this.fechaDesde.getDate() + 31);
	}
	// #endregion
}