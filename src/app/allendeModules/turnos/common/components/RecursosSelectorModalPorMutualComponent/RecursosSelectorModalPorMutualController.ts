/**
* @author: ppautasso
* @description: controller para el componente tipo modal para seleccionar recursos para turnos
* @type: Controller
**/
import * as angular from 'angular';

export class RecursosSelectorModalPorMutualController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: 'Recursos', // Desde la vista (HTML) se accede con vm.title.name
		icon: 'LIST' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	resolve;
	dismiss;
	recursos;
	close;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger'];
	/**
	* @class RecursosSelectorModalPorMutualController
	* @constructor
	*/
	constructor(private $log: ILogger) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	selectRow(recurso) {
		if (recurso.Atiende)
			this.close({ $value: recurso });
	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class RecursosSelectorModalPorMutualController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('RecursosSelectorModalPorMutualController');
		this.$log.debug('ON');
		if (this.resolve.Recursos) {
			this.recursos = angular.copy(this.resolve.Recursos);
			this.$log.debug('Recursos obtenidos...', this.recursos);
			angular.forEach(this.recursos, (recurso) => {

				recurso.classRow = recurso.Atiende ? '' : 'td-disabled';
				recurso.AtiendeSiNo = recurso.Atiende ? "SI" : "NO";
			});
		}

	}
	// #endregion
}