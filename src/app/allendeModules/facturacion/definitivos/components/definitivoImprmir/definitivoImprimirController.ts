/**
* @author: rbassi
* @description: controller imprimir definitivo
* @type: Controller
**/
import * as angular from 'angular';
import {IDefinitivosDataService} from '../../services/definitivosDataService'

export class definitivoImprimirController implements angular.IController {

 // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
 title = {
 name : '', // Desde la vista (HTML) se accede con vm.title.name
 icon : '' // Desde la vista (HTML) se accede con vm.title.icon
 };
 // mas propiedades ..
 resolve: any;
 close: any;
 dismiss: any;
 definitivoImprime: any;
 fechaImpresion : Date = new Date;
 definitivosPorCorteDeControl : IDefinitivosPorCorteDeControl[] = [];
 totalGeneralDefinitivo: number = 0;
 totalGeneralAfiliadoDefinitivo: number = 0 ;
 // #endregion

 // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
 // ID
 static $inject : Array<string> = ['Logger','DefinitivosDataService'];
 /**
 * @class definitivoImprimirController
 * @constructor
 */
 constructor(
	 private $log: ILogger,
	 private definitivoDataService : IDefinitivosDataService
){
 }

 // #endregion

 // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

 // #endregion

 // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

 /**
 * @class definitivoImprimirController
 * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
 * @event
 */
 $onInit() {
 this.$log = this.$log.getInstance('definitivoImprimirController');
 this.$log.debug('ON');
  this.title.name = 'IMPRESION DE DEFINITIVO '//+this.resolve.imprimeDefinitivo.NroDefinitivoLegacy

 this.activate();

 }
 
 llenarDefinitivosPorServicio(){

	if (this.resolve.imprimeDefinitivo.Items) {
		let corteDeControl = "";

		let importeAfiliadoCorteControl: number = 0;
		let importeTotalCorteControl: number = 0;

		let definitivos: any[] = this.resolve.imprimeDefinitivo.Items;
		let definitivosOrdenado : any[] = definitivos.sortBy("CampoCorteControl");

		for (let i = 0; i < definitivosOrdenado.length; i++) {
		 	if (definitivosOrdenado[i].CampoCorteControl !== corteDeControl) {

				importeTotalCorteControl =  0;
				importeAfiliadoCorteControl = 0;

				corteDeControl = definitivosOrdenado[i].CampoCorteControl
				let itemPracticasPorCorteControl: IDefinitivosPorCorteDeControl = {
					corteControl: corteDeControl,
					totalImporte: 0,
					totalImporteAfiliado: 0,
					practicas: [],
				};
				this.definitivosPorCorteDeControl.push(itemPracticasPorCorteControl);

			}
			// acumulo total por corte de control	
			importeTotalCorteControl = (importeTotalCorteControl + definitivosOrdenado[i].ImporteTotal)
			importeAfiliadoCorteControl = (importeAfiliadoCorteControl + definitivosOrdenado[i].ImporteAfiliado)

			this.totalGeneralAfiliadoDefinitivo = this.totalGeneralAfiliadoDefinitivo + definitivosOrdenado[i].ImporteAfiliado
			this.totalGeneralDefinitivo = this.totalGeneralDefinitivo + definitivosOrdenado[i].ImporteTotal

			let indexLasDefinitivoPorCorte = this.definitivosPorCorteDeControl.length -1;
			this.definitivosPorCorteDeControl[indexLasDefinitivoPorCorte].practicas.push(definitivosOrdenado[i]);
			this.definitivosPorCorteDeControl[indexLasDefinitivoPorCorte].totalImporte = importeTotalCorteControl ;
			this.definitivosPorCorteDeControl[indexLasDefinitivoPorCorte].totalImporteAfiliado = importeAfiliadoCorteControl ;

			//   let indexLasDefinitivoPorCorte = this.definitivosPorCorteDeControl.length -1;
			//   let indexLasDefinitivoPracticas = this.definitivosPorCorteDeControl[indexLasDefinitivoPorCorte].practicas.length -1;
			//   this.definitivosPorCorteDeControl[indexLasDefinitivoPorCorte].practicas[indexLasDefinitivoPracticas].practicas.push(definitivosOrdenado[i]);
		}



	}	 

 }	


 activate(){
	this.llenarDefinitivosPorServicio();
	setTimeout(function (){ window.print();}, 1000);	 
 }
  // #endregion
}


interface IDefinitivosPorCorteDeControl {
	corteControl : string ;
	totalImporteAfiliado : number;
	totalImporte : number;
	practicas : any[];
}
