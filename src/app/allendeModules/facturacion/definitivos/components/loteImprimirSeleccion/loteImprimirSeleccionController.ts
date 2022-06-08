/**
* @author: rbassi
* @description: impresion de seleccion de lotes
* @type: Controller
**/
import * as angular from 'angular';
import { IDefinitivosDataService } from '../../services';

export class loteImprimirSeleccionController implements angular.IController {

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
//definitivosDelLote : IDefinitivosDelLotePorServicio[] = [];

// #endregion

 // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
 // ID
 static $inject : Array<string> = ['Logger','DefinitivosDataService'];
 /**
 * @class loteImprimirSeleccionController
 * @constructor
 */
 constructor(
	 private $log: ILogger,
	private definitivoDataService : IDefinitivosDataService){
 }

 // #endregion

 // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

 // #endregion

 // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

 /**
 * @class loteImprimirSeleccionController
 * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
 * @event
 */
 $onInit() {
 this.$log = this.$log.getInstance('loteImprimirSeleccionController');
 this.$log.debug('ON');

 this.activate();
 }

 activate(){

	this.definitivoDataService.imprimirLotesSeleccionados(this.resolve.listaIdsLotes).then((result) => {
		this.loteImprime = result;
		console.log("this.loteImprime ",this.loteImprime)
		setTimeout(function (){ window.print();}, 1000);
	})
}


 // #endregion
}

// interface IDefinitivosDelLotePorServicio {
// 	Servicio : string ;
// 	NumeroLote: number;
// 	Operador: string;
// 	Sucursal: string;
// 	Definitivos : any[];
// }

// interface IDetalleDefinitivos {
// 	Id: number;
// 	NroDefinitivo: number;
// 	Fecha: Date;
// 	Financiador: string;
// 	TipoAfiliado: string;
// 	IdDefinitivo: number;
// 	Servicio: string;
// 	IdServicio: number;
// }



