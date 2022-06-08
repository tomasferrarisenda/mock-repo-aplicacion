/**
* @author: ppautasso
* @description: Controller para modal componente para ver comunicaciones del turno modal component
* @type: Controller
**/
import * as angular from 'angular';
import { IComunicacionPorConfirmacionDeTurnoDataService } from '../../services';

export class VerComunicacionesDelTurnoModalController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	resolve;
	dismiss;
	close;
	loading: boolean = false;
	turno;
	data;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'ComunicacionPorConfirmacionDeTurnoDataService'];
	/**
	* @class VerComunicacionesDelTurnoModalController
	* @constructor
	*/
	constructor(private $log: ILogger, private ComunicacionPorConfirmacionDeTurnoDataService:IComunicacionPorConfirmacionDeTurnoDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	buscar(){
		this.loading = true;
		this.ComunicacionPorConfirmacionDeTurnoDataService.obtenerPorTurno(this.turno.Id)
		.then( (pResult) => {
			this.$log.debug('pResult',pResult);

			if(pResult && pResult.length){
				pResult.forEach(element => {
					if(element.FechaActualizacion.includes("0001-01-01")){
						element.FechaActualizacion = "-";
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

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class VerComunicacionesDelTurnoModalController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('VerComunicacionesDelTurnoModalController');
		this.$log.debug('ON');

		this.turno = angular.copy(this.resolve.Turno);
		this.buscar();
	}
	// #endregion
}