/**
* @author: ppautasso
* @description: controller para componente de asignaicon por accion table componente
* @type: Controller
**/
import * as angular from 'angular';

export class EnfermeriaAsignacionPorAccionTableController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	data;
	titleColumn;
	menuOptions: any;
	tipoAccion;

	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger'];
	/**
	* @class EnfermeriaAsignacionPorAccionTableController
	* @constructor
	*/
	constructor(private $log: ILogger) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	suma(item) {
		this.$log.debug('suma valor', item);
		// regla de suma de items:
		// si es una Reposicion (tipoAccion == 1) debemos dejar sumar items mas alla del stock actual
		// si es una Asignacion (tipoAccion == 3) solo podemos sumar items mientras sean menor que el stock actual
		// si es una Scrap 		(tipoAccion == 4) solo podemos sumar items mientras sean menor que el stock actual
		// si es una Devolucion	(tipoAccion == 10)solo podemos sumar items mientras sean menor que el stock actual
		// si es una AjusteStok (tipoAccion == 6) debemos dejar sumar items mas alla del stock actual
		if (this.tipoAccion === 1 || this.tipoAccion === 6) {
			this.$log.debug('sumando 1...', item.cantidadAgregar);
			item.cantidadAgregar = item.cantidadAgregar + 1
		}
		else if (this.tipoAccion === 3 || this.tipoAccion === 4 || this.tipoAccion === 10){

			if (item.cantidadAgregar < item.StockActual) {
				this.$log.debug('sumando 1...', item.cantidadAgregar);
				item.cantidadAgregar = item.cantidadAgregar + 1
			}
		}

	}

	resta(item) {
		this.$log.debug('resta valor', item);
		if (item.cantidadAgregar > 0)
			item.cantidadAgregar = item.cantidadAgregar - 1;
	}


	// #endregion

	// #region /* ----------------------------------------- MENU CONTEXTUAL ----------------------------------------- */

	inicializarMenuOptions() {
		this.menuOptions = [
			{
				text: 'Volver a 0',
				displayed: function (modelValue) {

					var ret = false;
					if (modelValue.row.cantidadAgregar !== 0) ret = true;
					return ret;

				},
				click: ($itemScope, $event, modelValue, text, $li) => {

					$itemScope.row.cantidadAgregar = 0;
				}
			},
			{
				text: 'Eliminar Producto',
				click: ($itemScope, $event, modelValue, text, $li) => {

					this.data = $.grep(this.data, (e: any) => {
						return e.IdStockeable != $itemScope.row.IdStockeable;
					});
				}
			}
		];
	}
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class EnfermeriaAsignacionPorAccionTableController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('EnfermeriaAsignacionPorAccionTableController');
		this.$log.debug('ON');

		this.inicializarMenuOptions();
	}

	$onChanges(change) {
		console.log('change', change);
		if (change.data) {
			if (!change.data.isFirstChange() && change.data.currentValue) {
				console.log("cambiaron los datos de la tabla por accion", change.data);
			}
		}
	}
	// #endregion
}