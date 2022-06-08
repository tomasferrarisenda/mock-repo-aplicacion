/**
* @author: ppautasso
* @description: controller para el reporte de profesionales y prestadores
* @type: Controller
**/
import * as angular from 'angular';
import { IRecursoPrestadoDataService } from '../../services';

export class ReporteProfesionalesPrestadoresController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	fechaDesde = new Date();
	fechaHasta = new Date();

	servicioMedico;
	sucursal;
	mutual;
	planMutual;
	recurso;
	data;
	loading: boolean = false;
	soloConAgenda: boolean = false;
	soloHabilitados: boolean = false;
	
	columnasTabla: Array<any> = [
		{
			label: "Recurso",
			field: "Recurso",
			order: 1,
		},
		{
			label: "Matricula",
			field: "Matricula",
			order: 2
		},
		{
			label: "Tipo Recurso",
			field: "TipoRecurso",
			order: 3,
		},
		{
			label: "Servicio",
			field: "Servicio",
			order: 4
		},
		{
			label: "Prestacion",
			field: "Prestacion",
			order: 5
		},
		{
			label: "Tipo Turno",
			field: "TipoTurno",
			order: 6
		},
		{
			label: "Atiende",
			field: "AtiendeSiNo",
			order: 7
		},
		{
			label: "Con Agenda",
			field: "ConAgendaSiNo",
			order: 8
		}];
	
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'RecursoPrestadoDataService', 'moment', 'AlertaService'];
	/**
	* @class ReporteProfesionalesPrestadoresController
	* @constructor
	*/
	constructor(private $log: ILogger, private RecursoPrestadoDataService:IRecursoPrestadoDataService, 
		private moment, private AlertaService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	buscar(){
		
		if(!this.sucursal) {
			
			this.AlertaService.NewWarning("Debe seleccionar la sucursal");
			return;
		}

		if(!this.mutual) {
			
			this.AlertaService.NewWarning("Debe seleccionar la mutual");
			return;
		}

		if(!this.planMutual) {
			
			this.AlertaService.NewWarning("Debe seleccionar el plan de la mutual");
			return;
		}
			
		this.loading = true;
		delete this.data;

		let _fechaDesde = this.moment(this.fechaDesde).format("MM-DD-YYYY");
		let _fechaHasta = this.moment(this.fechaHasta).format("MM-DD-YYYY");

		let _planMutual = (this.planMutual) ? this.planMutual.Id : 0;

		this.RecursoPrestadoDataService.obtenerRecursosPrestadores(_fechaDesde, _fechaHasta, this.sucursal.Id, this.mutual.Id, _planMutual, 
			this.soloConAgenda, this.soloHabilitados)
		.then( (pResult) => {
			this.$log.debug('pResult',pResult);
			pResult.forEach(dato => {
				dato.AtiendeSiNo = (dato.Atiende) ? "SI" : "NO";
				dato.ConAgendaSiNo = (dato.ConAgenda) ? "SI" : "NO";
			});
			this.data = pResult;
			this.loading = false;
		}, (pError) => {
			this.$log.error('pError',pError);
			this.loading = false;
		});
	}


	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class ReporteProfesionalesPrestadoresController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('ReporteProfesionalesPrestadoresController');
		this.$log.debug('ON');

		this.fechaHasta.setDate(this.fechaDesde.getDate() + 31);

	}
	// #endregion
}