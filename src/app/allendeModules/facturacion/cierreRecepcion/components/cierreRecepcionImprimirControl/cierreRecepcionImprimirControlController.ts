/**
* @author: rbassi
* @description: controller cierre recepcion impresion control
* @type: Controller
**/
import * as angular from 'angular';

export class cierreRecepcionImprimirControlController implements angular.IController {

 // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
 title = {
 name : 'CONTROL DE RECEPCION', // Desde la vista (HTML) se accede con vm.title.name
 icon : '' // Desde la vista (HTML) se accede con vm.title.icon
 };
 // mas propiedades ..
 resolve: any;
 close: any;
 dismiss: any;
 listaCierre:IPracticasPorTipoDeCierre[] = [];
 //listaCierre:IItemCierrePorServicio[] = [];
 
 totalParticular: number = 0
 totalMutual: number = 0
 fechaCierre: Date = new Date();
 nombreUsuario: string = "";


 // #endregion

 // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
 // ID
 static $inject : Array<string> = ['Logger'];
 /**
 * @class cierreRecepcionImprimirControlController
 * @constructor
 */
 constructor(private $log: ILogger){
 }

 // #endregion

 // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

  // #endregion

 // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

 /**
 * @class cierreRecepcionImprimirControlController
 * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
 * @event
 */
 $onInit() {
 this.$log = this.$log.getInstance('cierreRecepcionImprimirControlController');
 this.$log.debug('ON');
 this.activate();

 }


 llenarCierrePorTipoDeCierre() {
//this.resolve.imprimirCierre.Items.Rows

if (this.resolve.imprimirCierre.Cierres) {


	for (let i = 0; i < this.resolve.imprimirCierre.Cierres.length; i++) {

		let cierreCabecera : IPracticasPorTipoDeCierre = {
			tipoDeCierre: (this.resolve.imprimirCierre.Cierres[i].EsDeParticulares) ? "PARTICULAR" : 
						  (this.resolve.imprimirCierre.Cierres[i].EsConAutorizador) ?  "DIRECTO" : 
						  "OBRA SOCIAL",
			totalParticular: 0,
			totalMutual: 0,
			importe: 0,
			nombreUsuario: this.resolve.imprimirCierre.Cierres[i].NombreUsuarioCierre,
			fechaCierre: this.resolve.imprimirCierre.Cierres[i].FechaCierre,
			practicasPorFinanciador: []

		}
		
		this.fechaCierre = this.resolve.imprimirCierre.Cierres[i].FechaCierre
		this.nombreUsuario = this.resolve.imprimirCierre.Cierres[i].NombreUsuarioCierre

		this.listaCierre.push(cierreCabecera);

		 let importeAfiliadoCorte: number = 0;
		 let importeFinanciadorCorte: number = 0;

		 let cierres: any[] = this.resolve.imprimirCierre.Cierres[i].Items.Rows;
		 let cierresOrdenado : any[] = cierres.sortBy("Financiador");
		 let financiador = "";

		  for (let i = 0; i < cierresOrdenado.length; i++) {
			// nuevo rodrigo
			if (cierresOrdenado[i].Financiador !== financiador) {
				financiador = cierresOrdenado[i].Financiador
				let itemCierrePracticasPorFinanciador: IItemCierrePracticasPorFinanciador = {
					financiador: financiador,
					practicas: [],
				};
			  let indexLasCierre = this.listaCierre.length -1;
			  this.listaCierre[indexLasCierre].practicasPorFinanciador.push(itemCierrePracticasPorFinanciador);

			}

			let indexLasCierre = this.listaCierre.length -1;
			let indexLasCierrePracticas = this.listaCierre[indexLasCierre].practicasPorFinanciador.length -1;
			this.listaCierre[indexLasCierre].practicasPorFinanciador[indexLasCierrePracticas].practicas.push(cierresOrdenado[i]);
			// FIN nuevo rodrigo

			  importeFinanciadorCorte = importeFinanciadorCorte + cierresOrdenado[i].ImporteFinanciador
			  importeAfiliadoCorte = importeAfiliadoCorte + cierresOrdenado[i].ImporteParticular

		 	 let indexListaCierre = this.listaCierre.length -1;
//			 this.listaCierre[indexListaCierre].practicasPorFinanciador.push(cierresOrdenado[i]);
			 
//			 let indexLasCierre = this.listaCierre.length -1;
//			 let indexLasCierrePracticas = this.listaCierre[indexLasCierre].practicasPorFinanciador.length -1;
//			 this.listaCierre[indexLasCierre].practicasPorFinanciador[indexLasCierrePracticas].practicas.push(cierresOrdenado[i]);
			 
			 if (this.listaCierre[indexListaCierre].tipoDeCierre === "PARTICULAR"){
				this.listaCierre[indexListaCierre].totalParticular = importeAfiliadoCorte ;	
				this.listaCierre[indexListaCierre].totalMutual = 0;
				this.listaCierre[indexListaCierre].importe = importeAfiliadoCorte ;	
			 }
			 else{
					this.listaCierre[indexListaCierre].totalParticular = 0 ;	
					this.listaCierre[indexListaCierre].totalMutual = importeFinanciadorCorte;
					this.listaCierre[indexListaCierre].importe = importeFinanciadorCorte;	
			 }
			 
		 	 
		 	 
		 }
		
	}
}	 


console.log("this.listaCierre ",this.listaCierre)
}




// llenarCierrePorServicio() {
// 	if (this.resolve.imprimirCierre.Cierres) {
// 		let servicio = "";
// 		let financiador = "";

// 		let cierres: any[] = this.resolve.imprimirCierre.Items.Rows;
// 		let cierresOrdenado : any[] = cierres.sortBy("Servicio", "Financiador");

// 		for (let i = 0; i < cierresOrdenado.length; i++) {
// 			this.totalParticular += cierresOrdenado[i].ImporteParticular
// 			this.totalMutual += cierresOrdenado[i].ImporteFinanciador
// 		 	if (cierresOrdenado[i].Servicio !== servicio) {
// 				 servicio = cierresOrdenado[i].Servicio
// 				 let itemCierre: IItemCierrePorServicio = {
// 					 nombreServicio: servicio,
// 					 practicasPorFinanciador: []
// 				 };
// 		 		this.listaCierre.push(itemCierre);
// 			 }
// 		 	if (cierresOrdenado[i].Financiador !== financiador) {
// 				financiador = cierresOrdenado[i].Financiador
// 				let itemCierrePracticasPorServicio: IItemCierrePracticasPorFinanciador = {
// 					financiador: financiador,
// 					practicas: [],
// 				};
// 			  let indexLasCierre = this.listaCierre.length -1;
// 			  this.listaCierre[indexLasCierre].practicasPorFinanciador.push(itemCierrePracticasPorServicio);

// 			}

// 			  let indexLasCierre = this.listaCierre.length -1;
// 			  let indexLasCierrePracticas = this.listaCierre[indexLasCierre].practicasPorFinanciador.length -1;
// 			  this.listaCierre[indexLasCierre].practicasPorFinanciador[indexLasCierrePracticas].practicas.push(cierresOrdenado[i]);
// 		}

// 	}
//  }

activate(){
	console.log('this.resolve.imprimirCierre.Cierres',this.resolve.imprimirCierre.Cierres)
	this.llenarCierrePorTipoDeCierre();
	setTimeout(function (){ window.print();}, 1000);	 

}

 // #endregion
}	




interface IItemCierrePorServicio {
	nombreServicio : string;
	practicasPorFinanciador : IItemCierrePracticasPorFinanciador[];
}

interface IPracticasPorTipoDeCierre {
	tipoDeCierre : string ;
	totalParticular: number;
	totalMutual: number;
	importe:number;
	nombreUsuario: string;
	fechaCierre:Date;
	practicasPorFinanciador : IItemCierrePracticasPorFinanciador[];
}

interface IItemCierrePorServicio {
	nombreServicio : string;
	practicasPorFinanciador : IItemCierrePracticasPorFinanciador[];
}

interface IItemCierrePracticasPorFinanciador {
	financiador : string ;
	practicas : any[];
}