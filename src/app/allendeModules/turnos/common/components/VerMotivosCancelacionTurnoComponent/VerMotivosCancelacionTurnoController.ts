/**
* @author: Pablo Pautasso
* @description: Controller para motivos de cancelacion
* @type: Controller
**/
import * as angular from 'angular';

export class VerMotivosCancelacionTurnoController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: 'Motivos Cancelación Turno', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	resolve;
	dismiss;
	loading: boolean = false;;
	turnoInfo: any;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'moment', 'AlertaService' ,'TurnoDataService'];
	/**
	* @class VerMotivosCancelacionTurnoController
	* @constructor
	*/
	constructor(private $log: ILogger, private moment, private AlertaService:IAlertaService, private TurnoDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class VerMotivosCancelacionTurnoController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('VerMotivosCancelacionTurnoController');
		this.$log.debug('ON');
		var vm = this;
		this.loading = true;

		this.TurnoDataService.obtenerMotivosDeCancelacionDeUnTurno(this.resolve.IdTurno)
		.then(pResponse  => {

			this.$log.debug('obtenerMotivosCancelacionDeUnTurnoOK', pResponse);
			this.turnoInfo = angular.copy(pResponse);

			if (!this.turnoInfo.MotivosDeCancelacion){
				this.AlertaService.NewWarning("Atención", "No existen motivos de cancelacion de este turno");
				this.cancel();
			}

			this.title.name = 'Motivos Cancelación Turno - ' + this.moment(this.turnoInfo.Fecha).format("dddd DD [de] MMMM [de] YYYY") + ' - ' + this.turnoInfo.Hora;
			this.loading = false;
		}, pError => {
			this.$log.error('obtenerMotivosCancelacionDeUnTurnoError ',pError);
			this.loading = false;
			this.cancel();
		})
	}
	// #endregion
}