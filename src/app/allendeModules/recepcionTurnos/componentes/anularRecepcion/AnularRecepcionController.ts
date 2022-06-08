/**
* @author: rbassi
* @description: anular Recepcion Controller
* @type: Controller
**/
import * as angular from 'angular';
import { IRecepcionTurnosDataService } from '../../../recepcionTurnos/services/RecepcionTurnosDataService';

export class AnularRecepcionController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	close: any;	
	motivoAnulacion: any;
	dismiss: any;
	resolve: any;
	deshabilitarBoton: boolean = false ;
	tieneCierreParticular: boolean = false;
	
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger','RecepcionTurnosDataService'];

	/**
	* @class AnularRecepcionController
	* @constructor
	*/
	constructor(
		private $log: ILogger,
		private RecepcionTurnosDataService: IRecepcionTurnosDataService,
	) { }

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class AnularRecepcionController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('AnularRecepcionController');
		this.$log.debug('ON');
		this.$log.debug('PARAMETROS MODAL  ', this.resolve.Turno.IdEstadoCobranzaCaja);
		this.activate();
	}

	habilitarBotonGuardar(){
		if (this.resolve.Turno.IdEstadoCobranzaCaja === 5 || this.tieneCierreParticular){ // pesos AZUL o tiene cierre part
			if (this.motivoAnulacion){
				this.deshabilitarBoton = false;
			}
			else { 
				this.deshabilitarBoton = true
			}
		};
	}

	guardar(){
		this.close({ $value: this.motivoAnulacion });
	}

	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	activate(){
		this.RecepcionTurnosDataService.elTurnoTieneCierreParticular(this.resolve.Turno.Id)
		.then((pResults) => {
			this.$log.debug('elTurnoTieneCierreParticular OK', pResults);
			this.tieneCierreParticular = pResults.TieneCierreParticularGenerado;
			this.habilitarBotonGuardar();
		},
			(pError) => {
				this.$log.error('Error elTurnoTieneCierreParticular', pError);
			});
	}
	// #endregion
}	