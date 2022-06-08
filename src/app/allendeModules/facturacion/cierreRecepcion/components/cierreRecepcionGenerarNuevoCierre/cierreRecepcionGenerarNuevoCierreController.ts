/**
* @author: rbassi
* @description: controller generar nuevo cierre
* @type: Controller
**/
import * as angular from 'angular';
import { ICierreRecepcionDataService } from './../../services/cierreRecepcionDataService';
import { ICierreRecepcionLogicService } from './../../services/cierreRecepcionLogicService';
import { ISucursalDataService } from '../../../../support/basic/services';
import { IGruposPracticasCierresDataService } from '../../../configuraciones/gruposPracticasCierres/services';
import { ICredentialsDataService } from 'core/security';

export class cierreRecepcionGenerarNuevoCierreController implements angular.IController {

 // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
 title = {
 name : '', // Desde la vista (HTML) se accede con vm.title.name
 icon : '' // Desde la vista (HTML) se accede con vm.title.icon
 };
 // mas propiedades ..
 today = new Date();

 resolve: any;
 dismiss: any;
 close: any;
 sucursalLista: IEntidadDto[] = [];
 sucursalElegida: IEntidadDto = {};
 servicioLista: IEntidadDto[] = [];
 servicioMedicoElegido: IEntidadDto = {};
 tildeObrasSociales: boolean = true;
 tildeParticulares: boolean = true
 tildeDefinitivo: boolean = false
 tildeImprimirCierreDirecto: boolean = true
 usuariosDisponibles: IEntidadDto[] = [];
 usuarioElegido: IEntidadDto = {};
 fechaDesde = new Date();
 fechaHasta = new Date();
 fechaHoy = new Date()
 busquedaUsuario: any;
 otroColaborador: any;
 fechaDesdeMin = new Date()

 // #endregion

 // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
 // ID
 static $inject: Array<string> = ['Logger', '$state', 'CierreRecepcionDataService', 'SucursalDataService','ModalService','AlertaService','DateUtils',
 								  'GruposPracticasCierresDataService','CredentialsDataService','CierreRecepcionLogicService'];

 /**
  * @class gruposPracticasCierresListController
  * @constructor
  */
  constructor(
	 private $log: ILogger,
	 private $state,
	 private cierreRecepcionDataService: ICierreRecepcionDataService,
	 private SucursalDataService: ISucursalDataService,
	 private ModalService: IModalService,
	 private AlertaService: IAlertaService,
	 private DateUtils : IDateUtils,
	 private GruposPracticasCierresDataService : IGruposPracticasCierresDataService,
	 private CredentialsDataService: ICredentialsDataService,
	 private cierreRecepcionLogicService: ICierreRecepcionLogicService,
	 ){
  }
 
 // #endregion

 // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

 // #endregion

 // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

 /**
 * @class cierreRecepcionGenerarNuevoCierreController
 * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
 * @event
 */

cambioSucursal(){
	if (this.sucursalElegida && this.sucursalElegida.Id) {
		this.GruposPracticasCierresDataService.ObtenerServiciosPorSucursal(this.sucursalElegida.Id).then((resultado) => {
			this.servicioLista = resultado;
		});
	}
	else{
		this.GruposPracticasCierresDataService.ObtenerTodosLosServicios().then((resultado) => {
			this.servicioLista = resultado;
		}); 
	}
};

cambioServicioMedico(){
};


 $onInit() {
 this.$log = this.$log.getInstance('cierreRecepcionGenerarNuevoCierreController');
 this.$log.debug('ON');
 this.activate();
 }

 changeFechaDesde(){
	 setTimeout(() => {
		this.fechaDesdeMin = angular.copy(this.fechaDesde)
		this.fechaDesdeMin.setDate(this.fechaDesde.getDate() - 1)
	 });
 }

 generar(){
	let nombreUsuario = this.busquedaUsuario && this.busquedaUsuario.Nombre? this.busquedaUsuario.Nombre : this.usuarioElegido.Nombre
	let idusuario = this.busquedaUsuario && this.busquedaUsuario.Id? this.busquedaUsuario.Id : this.usuarioElegido.Id

	if (this.tildeDefinitivo === true){
		//this.busquedaUsuario && this.busquedaUsuario.Id? this.busquedaUsuario.Id : this.usuarioElegido.Nombre
		this.ModalService.confirm('¿Generar Cierre DEFINITIVO de Recepción de '+idusuario +' - '+ nombreUsuario+'?', (pResult) => {
			if (pResult){
		
				let FechaDesde = this.DateUtils.parseToBeParams(this.fechaDesde)? this.DateUtils.parseToBeParams(this.fechaDesde) :  this.DateUtils.parseToBeParams(new Date());
				let FechaHasta = this.DateUtils.parseToBeParams(this.fechaHasta)? this.DateUtils.parseToBeParams(this.fechaHasta) :  this.DateUtils.parseToBeParams(new Date());
				let IdServicio = this.servicioMedicoElegido && this.servicioMedicoElegido.Id ? this.servicioMedicoElegido.Id : 0;
				let IdSucursal = this.sucursalElegida && this.sucursalElegida.Id ? this.sucursalElegida.Id : 0;
				 this.cierreRecepcionDataService.generarCierrePorUsuario(idusuario,FechaDesde,FechaHasta,IdServicio,IdSucursal,this.tildeObrasSociales,this.tildeParticulares)
				 .then((resultado) => {

					if (resultado && resultado.Cierres.RowCount ) {
						this.AlertaService.NewSuccess("Se ha generaron "+resultado.Cierres.RowCount+" número/s de cierres");

						if (this.tildeImprimirCierreDirecto) {
							this.cierreRecepcionLogicService.imprimirCierreDirecto(resultado).then((resultadoModal) => {

							});
						}
						
					}
					else{
						this.AlertaService.NewWarning("No hay registros para procesar, controlar filtros");
					}
			
					this.close({ $value: 'true' });
					
				 });
			
			}
			});
	}
	else{

		

		this.ModalService.confirm('¿Emitir un CONTROL de Recepción de '+idusuario +' - '+ nombreUsuario+'?', (pResult) => {

			if (pResult){
		
				let FechaDesde = this.DateUtils.parseToBeParams(this.fechaDesde)? this.DateUtils.parseToBeParams(this.fechaDesde) :  this.DateUtils.parseToBeParams(new Date());
				let FechaHasta = this.DateUtils.parseToBeParams(this.fechaHasta)? this.DateUtils.parseToBeParams(this.fechaHasta) :  this.DateUtils.parseToBeParams(new Date());
				let IdServicio = this.servicioMedicoElegido && this.servicioMedicoElegido.Id ? this.servicioMedicoElegido.Id : 0;
				let IdSucursal = this.sucursalElegida && this.sucursalElegida.Id ? this.sucursalElegida.Id : 0;
				 this.cierreRecepcionDataService.generarCierrePorUsuarioParaControl(idusuario,FechaDesde,FechaHasta,IdServicio,IdSucursal,this.tildeObrasSociales,this.tildeParticulares)
				 .then((resultado) => {
					 console.log("Resultado generarCierrePorUsuarioParaControl", resultado)
					this.close({ $value: 'true' });

					this.cierreRecepcionLogicService.imprimirCierreRecepcionParaControl(resultado).then((resultModal)=>{

					})
					
				 });
			
			}
			});

	}

 }

cancelar(){
	this.dismiss({ $value: 'cancel' });
 }

 cambioUsuario(){
 }
 
 cambioTildeDefinitivo(){
	this.tildeImprimirCierreDirecto = this.tildeDefinitivo
 }

//  mostrarImprmirCierreDirecto(){
// 	//this.tildeImprimirCierreDirecto = this.tildeDefinitivo
// //	return !this.tildeDefinitivo;
//  }

activate(){

	this.today = new Date();
	delete this.fechaDesde;
	delete this.fechaHasta;
	setTimeout(() => {
		this.fechaDesde = new Date();
		this.fechaHasta = new Date();
	
		this.fechaDesdeMin = angular.copy(this.fechaDesde);
		this.fechaDesdeMin.setDate(this.fechaDesde.getDate() - 1);
			
	});
	this.tildeDefinitivo = false;
	this.tildeImprimirCierreDirecto = false;

	let usuarioActual = this.CredentialsDataService.GetForce();
	this.usuarioElegido.Id     = usuarioActual.id
	this.usuarioElegido.Nombre = usuarioActual.name


	this.usuariosDisponibles = this.resolve.usuariosDisponibles
	this.$log.debug("this.resolve.otroColaborador", this.resolve.otroColaborador);
	this.otroColaborador = this.resolve.otroColaborador;

	
	this.SucursalDataService.getAllSucursalesCombo().then((sucursales) => {
		this.sucursalLista = sucursales
		this.cambioSucursal(); 
	});


}



 // #endregion
}