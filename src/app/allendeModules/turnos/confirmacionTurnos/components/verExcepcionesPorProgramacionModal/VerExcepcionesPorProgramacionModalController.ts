/**
* @author: ppautasso
* @description: controller para modal de ver excecpiones por programacion
* @type: Controller
**/
import * as angular from 'angular';
import { IExcepcionDeConfirmacionDataService } from '../../services';

export class VerExcepcionesPorProgramacionModalController implements angular.IController {

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

	idProgramacion;
	excepciones;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'ExcepcionDeConfirmacionDataService', 'AlertaService'];
	/**
	* @class VerExcepcionesPorProgramacionModalController
	* @constructor
	*/
	constructor(private $log: ILogger, private ExcepcionDeConfirmacionDataService:IExcepcionDeConfirmacionDataService,
		private AlertaService:IAlertaService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	buscar(){
		this.loading = true;
		this.ExcepcionDeConfirmacionDataService.obtenerPorReprogramacion(this.idProgramacion)
		.then( (pResult) => {
			this.$log.debug('pResult',pResult);
			this.excepciones = pResult;
			if(this.excepciones && this.excepciones.length){
				this.loading = false;
			}else {
				this.AlertaService.NewWarning("No existen excepciones cargadas para la programación");
				this.cancel();

			}
		}, (pError) => {
			this.$log.error('pError',pError);
			this.loading = false;
		});
	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class VerExcepcionesPorProgramacionModalController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('VerExcepcionesPorProgramacionModalController');
		this.$log.debug('ON');

		this.idProgramacion = this.resolve.IdProgramacion;
		this.buscar();
	}
	// #endregion
}