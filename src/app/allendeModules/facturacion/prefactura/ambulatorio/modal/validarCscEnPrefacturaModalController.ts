/**
 * @author: rbassi
 * @description: editar codigo de practica de prefactura
 * @type: Controller
 **/
import * as angular from 'angular';



export class validarCscEnPrefacturaModalController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: 'Ingrese N° CSC o token virtual', // Desde la vista (HTML) se accede con vm.title.name
		icon: 'EDIT' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	resolve: any;
	dismiss: any;
	close: any;
	// #endregion
	csc: number = 0;
	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array < string > = ['Logger', 'AlertaService'];
	/**
	 * @class validarCscEnPrefacturaModalController
	 * @constructor
	 */
	constructor(private $log: ILogger,
		private AlertaService: IAlertaService

	) {}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	 * @class validarCscEnPrefacturaModalController
	 * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	 * @event
	 */
	$onInit() {
		this.$log = this.$log.getInstance('validarCscEnPrefacturaModalController');
		this.$log.debug('ON');

		this.$log.debug('recibo Item: ', this.resolve.item);

		this.activate()

	}

	cancel() {
		this.dismiss({
			$value: 'cancel'
		});
	}

	guardar() {
		// this.$log.debug('Devuelvo prefacturable Elegido', this.prefacturableElegido);
		// if (this.prefacturableElegido && this.prefacturableElegido.Id) {
		// 	this.itemPrefacturable = this.prefacturableElegido;
		// 	this.close({
		// 		$value: this.itemPrefacturable
		// 	});
		// } else {
		// 	this.AlertaService.NewWarning("Atención", "Debe seleccionar un item prefacturable");
		// }
		if(this.csc || this.csc === 0){
			this.close({
				$value: this.csc
			});
		}else {
			this.AlertaService.NewWarning("Atención", "Debe completar el campo CSC");
		}
		
	}

	activate() {

	
	}

	// #endregion
}