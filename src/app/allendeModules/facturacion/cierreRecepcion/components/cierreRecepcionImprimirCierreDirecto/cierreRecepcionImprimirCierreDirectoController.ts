/**
* @author: rbassi
* @description: Controller Imprimir Cierre Directo
* @type: Controller
**/
import * as angular from 'angular';
import { ICierreRecepcionDataService } from './../../services/cierreRecepcionDataService';

export class cierreRecepcionImprimirCierreDirectoController implements angular.IController {

 // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
 title = {
 name : 'Impresión Cierre Directo', // Desde la vista (HTML) se accede con vm.title.name
 icon : '' // Desde la vista (HTML) se accede con vm.title.icon
 };
 // mas propiedades ..
 resolve: any;
 close: any;
 dismiss: any;
 imprimirCierre: any;
 imprimirDefintivo: any;
 imprimirLote: any;
 nroCierreLegacy: number = 0;
 fechaCierre: Date = new Date();
 nombreUsuarioCierre: string = "";
 totalParticular: number = 0
 totalMutual: number = 0
 listaCierre: IItemCierrePorServicio[] = [];
 listaDefinitivo : INumeroDefinitivo[] = [];
 definitivosDelLote : IDefinitivosDelLotePorServicio[] = [];
 totalGeneralDefinitivo: number = 0;
 totalGeneralAfiliadoDefinitivo: number = 0 ;
 sucursalLote: string = ""
 operadorLote: string = "" 
 fechaImpresionLote: Date = new Date();
 nroLoteLegacy: number = 0

 
 // #endregion

 // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
 // ID
 static $inject : Array<string> = ['Logger','CierreRecepcionDataService','CierreRecepcionLogicService'];
 /**
 * @class cierreRecepcionImprimirCierreDirectoController
 * @constructor
 */
 constructor(
	 private $log: ILogger,
	 private cierreRecepcionDataService: ICierreRecepcionDataService,
	){
 }

 // #endregion

 // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */


 // #endregion

 // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

 /**
 * @class cierreRecepcionImprimirCierreDirectoController
 * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
 * @event
 */
 $onInit() {
 this.$log = this.$log.getInstance('cierreRecepcionImprimirCierreDirectoController');
 this.$log.debug('ON');
 this.activate();
 
 }

activate(){
	this.$log.debug('this.resolve.imprimirCierreDiercto...',this.resolve.imprimirCierreDiercto)

	let idsCierres: IidsCierresImprimir = {
		Ids:[]
	}
	let idsDefinitivos: IidsDefinitivosImprimir = {
		Ids:[]
	}
	let idsLotes: IidsLotesImprimir = {
		Ids:[]
	}

	idsCierres.Ids = this.resolve.imprimirCierreDiercto.IdsCierres
	idsDefinitivos.Ids = this.resolve.imprimirCierreDiercto.IdsDefinitivos
	idsLotes.Ids = this.resolve.imprimirCierreDiercto.IdsLotes
 
	this.cierreRecepcionDataService.obtenerCierresPorIdsParaImpresion(idsCierres).then((resultadoCierres)=>{
		this.imprimirCierre = resultadoCierres;
	
		this.cierreRecepcionDataService.obtenerDefinitivosPorIdsParaImpresion(idsDefinitivos).then((resultadoDefinitivos)=>{
			this.imprimirDefintivo = resultadoDefinitivos;

			this.cierreRecepcionDataService.obtenerLotesPorIdsParaImpresion(idsLotes).then((resultadoLotes)=>{
				this.imprimirLote = resultadoLotes;
				
				this.llenarCierrePorServicio();
				this.llenarDefinitivosPorServicio();
				this.llenarLoteDefinitivosPorServicio();

			})
		})
	});
}

llenarCierrePorServicio(){

	for  (let i = 0; i < this.imprimirCierre.length; i++){

		this.nombreUsuarioCierre = this.imprimirCierre[i].NombreUsuarioCierre
		this.fechaCierre =  this.imprimirCierre[i].FechaCierre
		this.nroCierreLegacy = this.imprimirCierre[i].NroCierreLegacy
	
		if (this.imprimirCierre[i].Items.Rows) {
			let servicio = "";
			let financiador = "";
	
			let cierres: any[] = this.imprimirCierre[i].Items.Rows;
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

}

llenarDefinitivosPorServicio(){

	if (this.imprimirDefintivo) {


		for (let i = 0; i < this.imprimirDefintivo.length; i++) {

			let definitivoCabecera : INumeroDefinitivo = {
				numeroDefinitivoLegacy : this.imprimirDefintivo[i].NroDefinitivoLegacy,
				nombreMutual: this.imprimirDefintivo[i].NombreMutual,
				planMutual: this.imprimirDefintivo[i].NombrePlanMutual,
				sucursal: this.imprimirDefintivo[i].NombreSucursal,
				tipoAfiliado: this.imprimirDefintivo[i].NombreTipoAfiliado,
				ambito: this.imprimirDefintivo[i].NombreAmbitoAtencion,
				mesFacturacion: this.imprimirDefintivo[i].NombreMesFacturacion,
				servicio: this.imprimirDefintivo[i].NombreServicio,
				idServicio: this.imprimirDefintivo[i].IdServicio,
				defintivoPorCorteDeControl: []
			}
			this.listaDefinitivo.push(definitivoCabecera);

			 let corteDeControl = "";
			 let importeAfiliadoCorteControl: number = 0;
			 let importeTotalCorteControl: number = 0;
	
			 let definitivos: any[] = this.imprimirDefintivo[i].Items.Rows;
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
					 
					let indexListaControl = this.listaDefinitivo.length -1;
                    this.listaDefinitivo[indexListaControl].defintivoPorCorteDeControl.push(itemPracticasPorCorteControl);
	
			 	}
			 	// acumulo total por corte de control	
			 	importeTotalCorteControl = (importeTotalCorteControl + definitivosOrdenado[i].ImporteFinanciador)
			 	importeAfiliadoCorteControl = (importeAfiliadoCorteControl + definitivosOrdenado[i].ImporteParticular)
	
			 	 this.totalGeneralAfiliadoDefinitivo = this.totalGeneralAfiliadoDefinitivo + definitivosOrdenado[i].ImporteParticular
				 this.totalGeneralDefinitivo = this.totalGeneralDefinitivo + definitivosOrdenado[i].ImporteFinanciador
				 
				 let indexListaControl = this.listaDefinitivo.length -1;
				 let indexDefinitivoPorCorte = this.listaDefinitivo[indexListaControl].defintivoPorCorteDeControl.length -1;

				 this.listaDefinitivo[indexListaControl].defintivoPorCorteDeControl[indexDefinitivoPorCorte].practicas.push(definitivosOrdenado[i]);
				 this.listaDefinitivo[indexListaControl].defintivoPorCorteDeControl[indexDefinitivoPorCorte].totalImporte = importeTotalCorteControl;
				 this.listaDefinitivo[indexListaControl].defintivoPorCorteDeControl[indexDefinitivoPorCorte].totalImporteAfiliado = importeAfiliadoCorteControl ;	

			}
			
		}

	}	 

 }	

 llenarLoteDefinitivosPorServicio(){

	for  (let i = 0; i < this.imprimirLote.length; i++){

		this.sucursalLote = this.imprimirLote[i].NombreSucursal;
		this.operadorLote = this.imprimirLote[i].NombreOperador;
		this.nroLoteLegacy = this.imprimirLote[i].NroLoteLegacy;
		

		let servicioDelLote = "";

		let itemsDelLote: any[] = this.imprimirLote[i].Items.Rows; 
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


		setTimeout(function (){ window.print();}, 1000);	
 }


 // #endregion
}

interface IidsCierresImprimir {
	Ids : number[];
}

interface IidsDefinitivosImprimir {
	Ids : number[];
}

interface IidsLotesImprimir {
	Ids : number[];
}

interface IItemCierrePorServicio {
	nombreServicio : string;
	practicasPorFinanciador : IItemCierrePracticasPorFinanciador[];
}

interface IItemCierrePracticasPorFinanciador {
	financiador : string ;
	practicas : any[];
}

interface INumeroDefinitivo {
	numeroDefinitivoLegacy : number;
	nombreMutual: string;
	planMutual: string;
	sucursal: string;
	tipoAfiliado: string;
	ambito: string;
	mesFacturacion: string;
	servicio: string;
	idServicio: number;
	defintivoPorCorteDeControl : IDefinitivosPorCorteDeControl[];
}

interface IDefinitivosPorCorteDeControl {
	corteControl : string ;
	totalImporteAfiliado : number;
	totalImporte : number;
	practicas : any[];
}

interface IDefinitivosDelLotePorServicio {
	servicio : string ;
	definitivos : any[];
}
