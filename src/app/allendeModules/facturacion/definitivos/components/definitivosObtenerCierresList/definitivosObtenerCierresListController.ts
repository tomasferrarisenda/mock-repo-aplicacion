/**
* @author: rbassi
* @description: obtener cierres para generar definitivo
* @type: Controller
**/
import * as angular from 'angular';
import { IDefinitivosDataService } from '../../services/definitivosDataService'
import { IDefinitivosLogicService } from '../../services/definitivosLogicService'
import { ISucursalDataService } from '../../../../support/basic/services/SucursalDataService'
import { generarDefinitivoDTO } from '../../models';
import { ICredentialsDataService } from 'core/security';

export class definitivosObtenerCierresListController implements angular.IController {


	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..

	cierresParaDefinitivos: any;
	cierresParaDefinitivosDTO: generarDefinitivoDTO = {};
	usuarioElegido: IEntidadDto = {}
	usuarioActual: IEntidadDto[] = [];
	valor: number = 0
	mostrarBotonGenerar: boolean = false
	close: any;
	dismiss: any;
	seleccionarTodos: boolean = false;
	jerarquia: any[] = [];
	tildeDefinitivo: boolean = false;
	busquedaUsuario: any;



	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'DefinitivosDataService', 'DateUtils', 'SucursalDataService', 
	'CredentialsDataService', 'AlertaService','UsuarioGestionDataService','ModalService','DefinitivosLogicService'];
	/**
	* @class definitivosObtenerCierresListController
	* @constructor
	*/
	constructor(private $log: ILogger,
		private definitivoDataService: IDefinitivosDataService,
		private DateUtils: IDateUtils,
		private SucursalDataService: ISucursalDataService,
		private CredentialsDataService: ICredentialsDataService,
		private AlertaService: IAlertaService,
		private UsuarioGestionDataService,
		private ModalService : IModalService,
		private definitivoLogicService: IDefinitivosLogicService,
	) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class definitivosObtenerCierresListController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('definitivosObtenerCierresListController');
		this.$log.debug('ON');
		this.activate();


	}


	seleccionaCierreParaDefinitivo(row: any, index: number, incluir: number) {

		if (incluir === 1) {
			this.cierresParaDefinitivos.Rows[index].Seleccionado = true
		}
		else {
			this.cierresParaDefinitivos.Rows[index].Seleccionado = false
		}

		this.mostrarBotonGenerar = false;
		this.cierresParaDefinitivos.Rows.forEach(element => {
			if (element.Seleccionado === true) {
				this.mostrarBotonGenerar = true;
			}
		});


	};

	tieneSeleccionado() {
		let ret = true;
		if (this.cierresParaDefinitivos && this.cierresParaDefinitivos.Rows) {
			if (this.cierresParaDefinitivos.Rows.find(x => x.Seleccionado)) ret = false;
		}
		return ret;
	}


	esVisibleSegunEstado(row: any, seleccionado: number) {
		this.valor = 1
		if (row.Seleccionado === false) {
			this.valor = 0
		}

		return (this.valor !== seleccionado)
	}

	buscarCierres() {
		let nombreUsuario = this.busquedaUsuario && this.busquedaUsuario.Nombre? this.busquedaUsuario.Nombre : this.usuarioElegido.Nombre
		let idusuario = this.busquedaUsuario && this.busquedaUsuario.Id? this.busquedaUsuario.Id : this.usuarioElegido.Id
	
		this.definitivoDataService.obtenerCierresParaDefinitivo(idusuario).then((cierresParaDefinitivo) => {
			this.cierresParaDefinitivos = cierresParaDefinitivo
		})
	}

	generarDefinitivo() {
		if (this.tildeDefinitivo === true){
			this.ModalService.confirm('¿Generar Definitivo de los Cierres Seleccionados?', (pResult) => {
				if (pResult){
					let listaAEnviar = {
						Lista: this.cierresParaDefinitivos.Rows
					}
			
					this.definitivoDataService.generarDefinitivoAPartirDeCierres(listaAEnviar).then((result) => {
						if (result && result.RowCount) {
							this.AlertaService.NewSuccess("Se ha generó " + result.RowCount + " número/s de definitivo/s");
						}
						else {
							this.AlertaService.NewWarning("No hay registros para procesar, controlar filtros");
						}
			
						this.close({ $value: 'true' });
					})
				}
			})
	
		}
		else {
			this.ModalService.confirm('¿Generar un CONTROL de definitivo de los Cierres Seleccionados?', (pResult) => {
				if (pResult){
					let listaAEnviar = {
						Lista: this.cierresParaDefinitivos.Rows
					}

					this.definitivoDataService.generaControlDeDefinitivo(listaAEnviar).then((result) => {
						 if (result && result.Definitivos.length) {
							 this.definitivoLogicService.imprimirDefinitivosControl(result).then((resultadoModal)=>{
							 })
							 
						 }
						 else {
						 	this.AlertaService.NewWarning("No hay registros para procesar, controlar filtros");
						 }
			
						this.close({ $value: 'true' });
					})

				}
			})
		}


	}


	cancelar() {
		this.dismiss({ $value: 'cancel' });
	}

	seleccionarTodosChange(data) {

		data.forEach(cierre => {
			cierre.Seleccionado = this.seleccionarTodos;
		});
	
	}

	seleccionarCierre(){
		if(!this.cierresParaDefinitivos.Rows.find(x => x.Seleccionado)) this.seleccionarTodos = false;
	}



	obtenerJerarquia(usuario){

			this.UsuarioGestionDataService.ObtenerUsuarioConColaboradores(usuario.Id) // 465 para pruebas (Edgardo de La Mata) usuario.Id
				.then( (pResult) => {
					// seteo los colaboradores si es que tiene
					if(pResult && pResult.length){
						pResult.forEach(colaborador => {
							this.jerarquia.push({
								Nombre: colaborador.Id + " - " + colaborador.Nombre,
								Id: colaborador.Id
							});
						});
					}
					
			}, (pError) => {
				this.$log.error('pError',pError);
			});

	}
	

	activate() {
		let usuarioActual = this.CredentialsDataService.GetForce();
		this.usuarioElegido.Id = usuarioActual.id
		this.usuarioElegido.Nombre = usuarioActual.name

		this.obtenerJerarquia(this.usuarioElegido);


		this.buscarCierres();
	}



	// #endregion
}