/**
* @author: rbassi
* @description: impresion de cierre controller
* @type: Controller
**/
import * as angular from 'angular';

export class cierreRecepcionImprimirCierreController implements angular.IController {

 // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
 title = {
 name : '', // Desde la vista (HTML) se accede con vm.title.name
 icon : 'LIST' // Desde la vista (HTML) se accede con vm.title.icon
 };
 // mas propiedades ..
 resolve: any;
 close: any;
 dismiss: any;
 listaCierre: IItemCierrePorServicio[] = [];
 totalParticular: number = 0
 totalMutual: number = 0
 
 

 // #endregion

 // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
 // ID
 static $inject : Array<string> = ['Logger'];
 /**
 * @class cierreRecepcionImprimirCierreController
 * @constructor
 */
 constructor(private $log: ILogger){
 }

 // #endregion

 // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */


 // #endregion

 // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

 /**
 * @class cierreRecepcionImprimirCierreController
 * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
 * @event
 */
 $onInit() {
 this.$log = this.$log.getInstance('cierreRecepcionImprimirCierreController');
 this.$log.debug('ON');
 this.title.name = 'Cierre de recepcion' //+this.resolve.imprimirCierre.NroCierreLegacy 

this.activate();
 
 }

 llenarCierrePorServicio() {
	if (this.resolve.imprimirCierre.Items.Rows) {
		let servicio = "";
		let financiador = "";

		let cierres: any[] = this.resolve.imprimirCierre.Items.Rows;
		let cierresOrdenado : any[] = cierres.sortBy("Servicio", "Financiador");

		for (let i = 0; i < cierresOrdenado.length; i++) {
			this.totalParticular += cierresOrdenado[i].ImporteParticular
			this.totalMutual += cierresOrdenado[i].ImporteFinanciador
		 	if (cierresOrdenado[i].Servicio !== servicio) {
				 servicio = cierresOrdenado[i].Servicio
				 let itemCierre: IItemCierrePorServicio = {
					 nombreServicio: servicio,
					 practicasPorFinanciador: []
				 };
		 		this.listaCierre.push(itemCierre);
			 }
		 	if (cierresOrdenado[i].Financiador !== financiador) {
				financiador = cierresOrdenado[i].Financiador
				let itemCierrePracticasPorServicio: IItemCierrePracticasPorFinanciador = {
					financiador: financiador,
					practicas: [],
				};
			  let indexLasCierre = this.listaCierre.length -1;
			  this.listaCierre[indexLasCierre].practicasPorFinanciador.push(itemCierrePracticasPorServicio);

			}

			  let indexLasCierre = this.listaCierre.length -1;
			  let indexLasCierrePracticas = this.listaCierre[indexLasCierre].practicasPorFinanciador.length -1;
			  this.listaCierre[indexLasCierre].practicasPorFinanciador[indexLasCierrePracticas].practicas.push(cierresOrdenado[i]);
		}

	}
 }

 activate() {
	this.llenarCierrePorServicio();
	setTimeout(function (){ window.print();}, 1000);	 
}
 

 // #endregion
}

interface IItemCierrePorServicio {
	nombreServicio : string;
	practicasPorFinanciador : IItemCierrePracticasPorFinanciador[];
}

interface IItemCierrePracticasPorFinanciador {
	financiador : string ;
	practicas : any[];
}