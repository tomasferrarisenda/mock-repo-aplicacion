/**
* @author: rbassi
* @description: editar codigo de practica de prefactura
* @type: Controller
**/
import * as angular from 'angular';
import { PrefacturableDto } from 'src/app/allendeModules/support/models/prefacturableDto';
import { ISupportDataService } from '../../../../../allendeModules/support/basic/services';


export class prefacturaEditarItemController implements angular.IController {

 // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
 title = {
 name : 'Editar item prefacturable', // Desde la vista (HTML) se accede con vm.title.name
 icon : 'EDIT' // Desde la vista (HTML) se accede con vm.title.icon
 };
 // mas propiedades ..
 resolve: any;
 dismiss: any;
 close: any;
 // #endregion
 prefacturableElegido: PrefacturableDto = {};
 initTipo: { Id? : number } = {};
 itemPrefacturable: any;
 // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
 // ID
 static $inject : Array<string> = ['Logger','SupportDataService','AlertaService'];
 /**
 * @class prefacturaEditarItemController
 * @constructor
 */
 constructor(private $log: ILogger,
	private SupportDataService: ISupportDataService,
	private AlertaService: IAlertaService
	){
 }

 // #endregion

 // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

 // #endregion

 // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

 /**
 * @class prefacturaEditarItemController
 * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
 * @event
 */
 $onInit() {
 this.$log = this.$log.getInstance('prefacturaEditarItemController');
 this.$log.debug('ON');

 this.$log.debug('recibo Item: ', this.resolve.item);

 this.activate()

 }

 cancel() {
	this.dismiss({ $value: 'cancel' });
}

guardar(){
	this.$log.debug('Devuelvo prefacturable Elegido', this.prefacturableElegido);
	if(this.prefacturableElegido && this.prefacturableElegido.Id){
		this.itemPrefacturable = this.prefacturableElegido;
		this.close({ $value: this.itemPrefacturable });
	}else {
		this.AlertaService.NewWarning("Atención", "Debe seleccionar un item prefacturable");
	}
}

activate(){

	this.SupportDataService.ObtenerPrefacturablePorId(this.resolve.item.IdTipoPrefacturable ? this.resolve.item.IdTipoPrefacturable : 0 , this.resolve.item.IdPrefacturable? this.resolve.item.IdPrefacturable : 0)
	.then((prefacturableElegido) => {
		this.prefacturableElegido = prefacturableElegido;
		//this.itemListaFacturacion = this.resolve.item;
	})
   
}

 // #endregion
}	