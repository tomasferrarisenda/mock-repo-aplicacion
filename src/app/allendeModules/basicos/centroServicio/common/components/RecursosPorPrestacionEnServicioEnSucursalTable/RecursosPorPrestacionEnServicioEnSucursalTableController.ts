/**
* @author: ppautasso
* @description: controller para componente para mostrar recursos por prestacion en servicio en sucursal table
* @type: Controller
**/
import * as angular from 'angular';

export class RecursosPorPrestacionEnServicioEnSucursalTableController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	sucursal;
	servicio;
	prestacion;
	loading;
	recursosXPrestacion;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'RecursosDataService'];
	/**
	* @class RecursosPorPrestacionEnServicioEnSucursalTableController
	* @constructor
	*/
	constructor(private $log: ILogger, private RecursosDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	changePrestacion(prestacion) {
		//vamos a obtener los recursos que hacen ciertas prestaciones
		this.loading = true;

		if(prestacion && prestacion.IdPrestacion){
			this.RecursosDataService.obtenerTodosDeUnservicioEnSucursalConPrestacion(this.servicio.IdServicio, this.sucursal.Id, prestacion.IdPrestacion, true)
				.then( (pResult) => {
	
					this.$log.debug('obtenerRecursosseUnservicioEnSucursalConPrestacionOK', pResult);
					angular.forEach(pResult,  (item) => {
						item.IdElemento = item.Id;
						item.Nombre
					})
					this.recursosXPrestacion = angular.copy(pResult);
					this.loading = false;
	
				},  (pError) => {
	
					this.$log.error('obtenerRecursosseUnservicioEnSucursalConPrestacionERROR', pError);
					this.loading = false;
				});
		}
	}

	// #endregion

	// #region /* ----------------------------------------- ONCHANGES ----------------------------------------- */

	$onChanges(change) {

		console.log('change', change);
		if (change.prestacion) {

			if (!change.prestacion.isFirstChange()) {
				this.$log.debug('$onCHangePrestacion', change);
				if (change.prestacion)
					this.changePrestacion(change.prestacion.currentValue);
			}
		}

	}
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class RecursosPorPrestacionEnServicioEnSucursalTableController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('RecursosPorPrestacionEnServicioEnSucursalTableController');
		this.$log.debug('ON');
	}
	// #endregion
}