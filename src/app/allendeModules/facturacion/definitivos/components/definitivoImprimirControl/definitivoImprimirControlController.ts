/**
* @author: rbassi
* @description: Controller definitivo Impresin Control
* @type: Controller
**/
import * as angular from 'angular';

export class definitivoImprimirControlController implements angular.IController {

// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
title = {
	name : 'CONTROL de definitivos', // Desde la vista (HTML) se accede con vm.title.name
	icon : '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	resolve: any;
	close: any;
	dismiss: any;
	definitivosImprime: any;
	fechaImpresion : Date = new Date;
	listaDefinitivo : INumeroDefinitivo[] = [];
	totalGeneralDefinitivo: number = 0;
	totalGeneralAfiliadoDefinitivo: number = 0 ;
   
	// #endregion
   
	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject : Array<string> = ['Logger','DefinitivosLogicService'];
	/**
	* @class definitivoImprimirSeleccionController
	* @constructor
	*/
	constructor(
	   private $log: ILogger,
	   ){
	}
   
	// #endregion
   
	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
   
	// #endregion
   
	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */
   
	/**
	* @class definitivoImprimirSeleccionController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
	this.$log = this.$log.getInstance('definitivoImprimirControlController');
	this.$log.debug('ON');
	this.activate();
	}
   
   activate(){
		   this.llenarDefinitivosPorServicio(this.resolve.listaDefinitivos);
		   setTimeout(function (){ window.print();}, 1000);
   }
   
   
   llenarDefinitivosPorServicio(controlDefinitivos){

	   this.definitivosImprime = controlDefinitivos

	   if (this.definitivosImprime.Definitivos) {
   
   
		   for (let i = 0; i < this.definitivosImprime.Definitivos.length; i++) {
   
			   let definitivoCabecera : INumeroDefinitivo = {
				   numeroDefinitivoLegacy : this.definitivosImprime.Definitivos[i].NroDefinitivoLegacy,
				   nombreMutual: this.definitivosImprime.Definitivos[i].NombreMutual,
				   planMutual: this.definitivosImprime.Definitivos[i].NombrePlanMutual,
				   sucursal: this.definitivosImprime.Definitivos[i].NombreSucursal,
				   tipoAfiliado: this.definitivosImprime.Definitivos[i].NombreTipoAfiliado,
				   ambito: this.definitivosImprime.Definitivos[i].NombreAmbitoAtencion,
				   mesFacturacion: this.definitivosImprime.Definitivos[i].NombreMesFacturacion,
				   servicio: this.definitivosImprime.Definitivos[i].NombreServicio,
				   codigoMutual: this.definitivosImprime.Definitivos[i].CodigoMutual,
				   idServicio: this.definitivosImprime.Definitivos[i].IdServicio,
				   defintivoPorCorteDeControl: []
			   }
			   this.listaDefinitivo.push(definitivoCabecera);
   
				let corteDeControl = "";
				let importeAfiliadoCorteControl: number = 0;
				let importeTotalCorteControl: number = 0;
	   
				let definitivos: any[] = this.definitivosImprime.Definitivos[i].Items.Rows;
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
	   
					this.totalGeneralAfiliadoDefinitivo = this.totalGeneralAfiliadoDefinitivo + definitivosOrdenado[i].ImporteFinanciador
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
   
   }
   
   
	// #endregion
   
   interface INumeroDefinitivo {
	   numeroDefinitivoLegacy : number;
	   nombreMutual: string;
	   planMutual: string;
	   sucursal: string;
	   tipoAfiliado: string;
	   ambito: string;
	   mesFacturacion: string;
	   servicio: string;
	   codigoMutual: number;
	   idServicio: number;
	   defintivoPorCorteDeControl : IDefinitivosPorCorteDeControl[];
   }
   
   interface IDefinitivosPorCorteDeControl {
	   corteControl : string ;
	   totalImporteAfiliado : number;
	   totalImporte : number;
	   practicas : any[];
   }
   