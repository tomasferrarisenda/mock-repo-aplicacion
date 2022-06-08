/**
* @author: ppautasso
* @description: componente para seleccionar profesinal que atiende
* @type: Controller
**/
import * as angular from 'angular';
import { IRecursosDataService } from '../../../../basicos/recursos/gestion/services/RecursosDataService';
import { IProfesionalesDataService } from '../../../profesionales';

export class SelectorProfesionalAtiendeController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	loading: boolean = false;
	aparato;
	model;
	ifLabel;
	profesionalesAtienden = [];
	servicio;
	recurso;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'RecursosDataService', 'ProfesionalesDataService'];
	/**
	* @class SelectorProfesionalAtiendeController
	* @constructor
	*/
	constructor(private $log: ILogger, private RecursosDataService:IRecursosDataService, private ProfesionalesDataService:IProfesionalesDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	buscar(){
		this.loading = true;

		console.log('change',this.recurso);
		
		this.ProfesionalesDataService.obtenerQueAtiendenAlRecurso(this.recurso.Id, this.aparato)
		.then( (pResult) => {
			this.loading = false;
			this.$log.debug('pResult',pResult);
			this.profesionalesAtienden = angular.copy(pResult);
		}, (pError) => {
			this.loading = false;
			this.$log.error('pError',pError);
		});
	}

	limpiar(){
		delete this.model;
		delete this.profesionalesAtienden;
	}
	// #endregion

	// #region /* ----------------------------------------- ONCHANGES ----------------------------------------- */

	$onChanges(change) {
		console.log('change',change);
		if (!angular.isUndefined(change.aparato)) {
			if (change.aparato.currentValue) {
				this.buscar();
			}
		}
		if (!angular.isUndefined(change.servicio)) {
			if (change.servicio.currentValue) {
				this.limpiar();
			}
		}
		
	}
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class SelectorProfesionalAtiendeController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('SelectorProfesionalAtiendeController');
		this.$log.debug('ON');
	}
	// #endregion
}