/**
* @author: rbassi
* @description: lote imprimir
* @type: Controller
**/
import * as angular from 'angular';

export class loteImprimirController implements angular.IController {

 // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
 title = {
 name : 'Entrega de Lote', // Desde la vista (HTML) se accede con vm.title.name
 icon : '' // Desde la vista (HTML) se accede con vm.title.icon
 };
 // mas propiedades ..
 resolve: any;
 close: any;
 dismiss: any;
 loteImprime: any;
 fechaImpresion : Date = new Date;
 definitivosDelLote : IDefinitivosDelLotePorServicio[] = [];
 
 // #endregion

 // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
 // ID
 static $inject : Array<string> = ['Logger'];
 /**
 * @class loteImprimirController
 * @constructor
 */
 constructor(private $log: ILogger){
 }

 // #endregion

 // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

 // #endregion

 // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

 /**
 * @class loteImprimirController
 * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
 * @event
 */
 $onInit() {
 this.$log = this.$log.getInstance('loteImprimirController');
 this.$log.debug('ON');
 
 this.activate();
 }


 llenarDefinitivosPorServicio(){

	if (this.resolve.imprimeLote.Items.Rows) {
		let servicioDelLote = "";

		let itemsDelLote: any[] = this.resolve.imprimeLote.Items.Rows; 
		let itemsDelLoteOrdenado : any[] = itemsDelLote.sortBy("Servicio","NroDefinitivo");

		for (let i = 0; i < itemsDelLoteOrdenado.length; i++) {
		 	if (itemsDelLoteOrdenado[i].Servicio !== servicioDelLote) {
				servicioDelLote = itemsDelLoteOrdenado[i].Servicio
				let itemDefinitivosPorServicio: IDefinitivosDelLotePorServicio = {
					servicio: servicioDelLote,
					definitivos: [],
				};
				this.definitivosDelLote.push(itemDefinitivosPorServicio);

			}
			let indexLasDefinitivosDelLote = this.definitivosDelLote.length -1;
			this.definitivosDelLote[indexLasDefinitivosDelLote].definitivos.push(itemsDelLoteOrdenado[i]);
		}
	}	 



 }

activate(){
	this.llenarDefinitivosPorServicio();
	setTimeout(function (){ window.print();}, 1000);	 
}


 // #endregion
}

interface IDefinitivosDelLotePorServicio {
	servicio : string ;
	definitivos : any[];
}
