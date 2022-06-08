/**
* @author: ppautasso
* @description: controller para el componente de historial de prestamo de enfermera
* @type: Controller
**/
import * as angular from 'angular';
import { IAsignacionTemporalEnfermeraDataService } from '../../services';

export class EnfermeriaVerHistorialPrestamoEnfermeraController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	resolve;
	dismiss;
	loading: boolean = false;
	enfermera;
	historial;
	fechaDesde = new Date();
	fechaHasta = new Date();
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'moment','AsignacionTemporalEnfermeraDataService', 
	'AlertaService'];
	/**
	* @class EnfermeriaVerHistorialPrestamoEnfermeraController
	* @constructor
	*/
	constructor(private $log: ILogger, private moment,private AsignacionTemporalEnfermeraDataService:IAsignacionTemporalEnfermeraDataService, 
		private AlertaService:IAlertaService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	cancel() {
		this.dismiss({ $value: 'cancel' });
	}
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class EnfermeriaVerHistorialPrestamoEnfermeraController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('EnfermeriaVerHistorialPrestamoEnfermeraController');
		this.$log.debug('ON');
		this.loading = true;
		this.fechaDesde.setDate(this.fechaHasta.getDate() - 7);

		this.enfermera = angular.copy(this.resolve.Enfermera);
		this.AsignacionTemporalEnfermeraDataService.obtenerPorFechasYEnfermera(
			this.enfermera.Id,
			this.moment(this.fechaDesde).format("MM-DD-YYYY"),
			this.moment(this.fechaHasta).format("MM-DD-YYYY"))
			.then( (pResult) => {
				this.$log.debug('pResult',pResult);
				this.historial = angular.copy(pResult);
				if(this.historial.Rows && this.historial.Rows.length == 0) {
					this.cancel();
					this.AlertaService.NewWarning("No existen datos para la enfermera");
				}
				this.loading = false;
			}, (pError) => {
				this.$log.error('pError',pError);
				this.loading = false;
			});
	}
	// #endregion
}