/**
* @author: ppautasso
* @description: controller para recursos en servicio en sucursal table component
* @type: Controller
**/
import * as angular from 'angular';
import { IServiciosGestionDataService } from 'src/app/allendeModules/basicos/servicios/gestion/services/ServiciosGestionDataService';

export class RecursosEnServicioEnSucursalTableController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	loading: boolean = false;
	servicio;
	recursos;
	sucursal;
	idJefeServicio;

	onPrestacionSelected;

	columnsRecursos = {
		primera: 'Nombre Recurso',
		primeraBind: 'Nombre',
		segunda: 'Visible Portal',
		segundaBind: 'VisiblePortalWeb',
		tercera: 'Estado',
		terceraBind: 'Activo',
	};

	optionsObj = {
		ok: 'Si',
		cancel: 'No'
	};

	recursoSeleccionado;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'RecursosDataService', 'SelectorService', 'AlertaService', 'ModalService', 'ServiciosGestionDataService'];
	/**
	* @class RecursosEnServicioEnSucursalTableController
	* @constructor
	*/
	constructor(private $log: ILogger, private RecursosDataService, private SelectorService, private AlertaService, private ModalService,
	private ServiciosGestionDataService: IServiciosGestionDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	changeServicio(servicio){
		
		this.$log.debug('servicio selected ON.-', servicio);

		this.loading = true;
		delete this.recursoSeleccionado;

		this.RecursosDataService.obtenerPorServicioEnSucursal(servicio)
		.then( (pResult) => {
			this.$log.debug('pResult',pResult);
			this.recursos = angular.copy(pResult);
			angular.forEach(this.recursos, function (recurso, key) {
				recurso.IdElemento = angular.copy(recurso.IdRecurso);
				recurso.IdRow = key;
				recurso.IdTabla = 2;
				recurso.esJefeServicio = false;
			});

			if(this.recursos.find(x => x.IdElemento == this.idJefeServicio))
			this.recursos.find(x => x.IdElemento == this.idJefeServicio).esJefeServicio = true;

			this.$log.debug('jefe servicio id', this.idJefeServicio);
			
			this.loading = false;
		}, (pError) => {
			this.$log.error('obtenerPorServicioError-', pError);
			this.loading = false;
		});
	}

	// #region add/delete recursos
	
	addRecursos() {

		this.$log.debug('addRecursos ON.-');
		//agrego un recurso para un serivicio en sucursal

		this.SelectorService.newSelector({
			sizeModal: "lg", nombreSelector: "Seleccione un Recurso", dataService: "RecursosDataService",
			method: "getAll", columns: ["ActivoTexto","TipoRecurso", "Matricula",  "Nombre"], isTableBackEnd: false
		})
			// SelectorService.newSelector('lg', "Seleccione un Recurso", 'RecursosDataService', 'getAll', 'Nombre', false)
			.then( (recursoSelected) => {
				
				if (recursoSelected.Id) {
					this.loading = true;
					this.RecursosDataService.validarAsignarAServicio(this.servicio.IdServicio, this.sucursal.Id, recursoSelected.Id, recursoSelected.IdTipoRecurso)
						.then( (pResponse) => {
							this.$log.debug("ValidacionAsignacion response", pResponse);
							if (pResponse.IsOk === true) {
								this.loading = true;
								this.RecursosDataService.asignarAServicio(this.servicio.IdServicio, this.sucursal.Id, recursoSelected.Id, recursoSelected.IdTipoRecurso)
									.then( (pResp) => {
										this.loading = false;
										this.AlertaService.NewSuccess("", "Recurso Agregado a Servicio " + this.servicio.Servicio);
										this.changeServicio(this.servicio);
									},  (pErr) => {
										this.loading = false;
										this.$log.error('ValidacionAsignacion .-', pErr);
									});
							} else {
								if (pResponse.Message != null)
									this.AlertaService.NewError("", pResponse.Message);
								else
									this.AlertaService.NewError("", "Error");
								this.loading = false;
							}
						})
				}

			},  (pError) => {
				this.loading = false;
				this.$log.error('obtener recursos ON.-');
			});

	}

	deleteRecurso(pRecurso) {
		this.$log.error('deleteRecurso ON.-', pRecurso);

		this.ModalService.confirm("Desea eliminar el recurso '" + pRecurso.Nombre + "' del servicio '" + pRecurso.Servicio + "'?",
			 (pResponse) => {

				if (pResponse) {

					this.loading = true;
					this.RecursosDataService.validarEliminarXServicio(pRecurso.Id)
						.then( (pResponse) => {
							this.$log.debug("deleteRecurso response", pResponse);
							if (pResponse.IsOk === true) {
								this.loading = true;
								this.RecursosDataService.eliminarXServicio(pRecurso.Id)
									.then( (pResp) => {
										this.loading = false;
										this.AlertaService.NewSuccess("", "Recurso eliminado del servicio " + this.servicio.Servicio);
										this.changeServicio(this.servicio);

									},  (pErr) => {
										this.loading = false;
										this.$log.error('ValidacionAsignacion .-', pErr);
									});
							} else {
								if (pResponse.Message != null)
									this.AlertaService.NewError("", pResponse.Message);
								else
									this.AlertaService.NewError("", "Error");
								this.loading = false;
							}
						},  (pError) => {
							this.loading = false;

							this.$log.error('deleteServicio ON.-');
						})
				}

			}, undefined, this.optionsObj);

	}
	// #endregion

	// #region change status recursos
	 
	changeActivoRecurso(pRecurso) {
		this.$log.error('changeActivoRecurso ON.-', pRecurso);

		if (!pRecurso.Activo) {
			this.loading = true;
			this.RecursosDataService.validarDesactivar(pRecurso.Id)
				.then( (pResponse) => {
					this.$log.debug("desactivar Recurso response", pResponse);
					if (pResponse.IsOk === true) {
						this.loading = true;
						this.RecursosDataService.desactivar(pRecurso.Id)
							.then( (pResp) => {
								this.loading = false;
								this.AlertaService.NewSuccess("", "Recurso '" + pRecurso.Nombre + "' DESACTIVADO");

							},  (pErr) => {
								pRecurso.Activo = true;
								this.loading = false;
								this.$log.error('ValidacionAsignacion .-', pErr);
							});
					} else {
						if (pResponse.Message != null)
							this.AlertaService.NewError("", pResponse.Message);
						else
							this.AlertaService.NewError("", "Error");
						this.loading = false;
						pRecurso.Activo = true;
					}
				},  (pError) => {
					this.loading = false;
					pRecurso.Activo = true;
					this.$log.error('desactivar recurso error.-');
				});

		} else {
			this.loading = true;
			this.RecursosDataService.validarActivar(pRecurso.Id)
				.then( (pResponse) => {
					this.$log.debug("desactivar recurso response", pResponse);
					if (pResponse.IsOk === true) {
						this.loading = true;
						this.RecursosDataService.activar(pRecurso.Id)
							.then( (pResp) => {
								this.loading = false;
								this.AlertaService.NewSuccess("", "Recuso '" + pRecurso.Nombre + "' ACTIVADO");

							},  (pErr) => {
								this.loading = false;
								this.$log.error('ValidacionAsignacion .-', pErr);
							});
					} else {
						if (pResponse.Message != null)
							this.AlertaService.NewError("", pResponse.Message);
						else
							this.AlertaService.NewError("", "Error");
						this.loading = false;
					}
				},  (pError) => {
					this.loading = false;
					this.$log.error('recurso activar ERROR.-');
				})

		}

	}

	changeVisiblePortalRecurso(pRecurso) {
		this.$log.error('changeVisiblePortalRecurso ON.-', pRecurso);

		if (!pRecurso.VisiblePortalWeb) {

			this.loading = true;
			this.RecursosDataService.validarOcultarEnPortalWeb(pRecurso.Id)
				.then( (pResponse) => {
					this.$log.debug("validarOcultarEnPortalWeb response", pResponse);
					if (pResponse.IsOk === true) {
						this.loading = true;
						this.RecursosDataService.ocultarEnPortalWeb(pRecurso.Id)
							.then( (pResp) => {
								this.loading = false;
								this.AlertaService.NewSuccess("", "Recurso '" + pRecurso.Nombre + "' Ocultado en el portal");

							},  (pErr) => {
								pRecurso.VisiblePortalWeb = true;
								this.loading = false;
								this.$log.error('ocultarEnPortalWeb .-', pErr);
							});
					} else {
						if (pResponse.Message != null)
							this.AlertaService.NewError("", pResponse.Message);
						else
							this.AlertaService.NewError("", "Error");
						this.loading = false;
						pRecurso.VisiblePortalWeb = true;
					}
				},  (pError) => {
					this.loading = false;
					pRecurso.VisiblePortalWeb = true;
					this.$log.error('ocultarEnPortalWeb error.-');
				});

		} else {


			this.loading = true;
			this.RecursosDataService.validarMostrarEnPortalWeb(pRecurso.Id)
				.then( (pResponse) => {
					this.$log.debug("validarMostrarEnPortalWeb response", pResponse);
					if (pResponse.IsOk === true) {
						this.loading = true;
						this.RecursosDataService.mostrarEnPortalWeb(pRecurso.Id)
							.then( (pResp) => {
								this.loading = false;
								this.AlertaService.NewSuccess("", "Recuso '" + pRecurso.Nombre + "' visible en el portal");

							},  (pErr) => {
								this.loading = false;
								pRecurso.VisiblePortalWeb = false;
								this.$log.error('mostrarEnPortalWeb .-', pErr);
							});
					} else {
						if (pResponse.Message != null)
							this.AlertaService.NewError("", pResponse.Message);
						else
							this.AlertaService.NewError("", "Error");
						this.loading = false;
						pRecurso.VisiblePortalWeb = false;
					}
				},  (pError) => {
					this.loading = false;
					pRecurso.VisiblePortalWeb = false;
					this.$log.error('recurso activar ERROR.-');
				})

		}
	}

	seleccionarComoJefeServicio(pRecurso) { 
		this.$log.debug('seleccionarComoJefeServicio ON.-', pRecurso);
		this.loading = true;
		this.ServiciosGestionDataService.definirJefeServicio(this.servicio.IdElemento, this.sucursal.Id, pRecurso.IdElemento)
		.then( (pResp) => {
			
			this.$log.debug('seleccionarComoJefeServicioOk',pResp);
			this.loading = false;
			this.AlertaService.NewSuccess("", "Recurso '" + pRecurso.Nombre + "' establecido como jefe de servicio " + this.servicio.Servicio);
			angular.forEach(this.recursos, function (recurso, key) {
				recurso.esJefeServicio = false;
			});

			//if(this.recursos.find(x => x.IdElemento == pRecurso.IdElemento))
			//this.recursos.find(x => x.IdElemento == pRecurso.IdElemento).esJefeServicio = true;
			this.servicio.IdProfesionalJefeServicio = pRecurso.IdElemento;
			this.changeServicio(this.servicio);

		},  (pErr) => {
			this.loading = false;
			
			this.$log.error('seleccionarComoJefeServicio .-', pErr);
		});
	}
	
	// #endregion

	selectRecurso(row){
		this.recursoSeleccionado = row;
	}


	changeSucursal(sucursal){

		delete this.recursos;

	}
	// #endregion

	// #region /* ----------------------------------------- ONCHANGES ----------------------------------------- */

	$onChanges(change) {

		console.log('change', change);
		if (change.servicio) {

			if (!change.servicio.isFirstChange()) {
				this.$log.debug('$onChangeservicio', change);
				if (change.servicio)
					this.changeServicio(change.servicio.currentValue);
			}
		}

		if (change.onPrestacionSelected) {

			if (!change.onPrestacionSelected.isFirstChange()) {
				this.$log.debug('$onChangeonPrestacionSelected', change);
				// limpio seleccionados
				this.changeServicio(this.servicio);
			}
		}

		if (change.sucursal) {

			if (!change.sucursal.isFirstChange()) {
				this.$log.debug('$onChangeSucursal', change.sucursal);
				// limpio seleccionados
				this.changeSucursal(this.sucursal);
			}
		}
		
	}
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class RecursosEnServicioEnSucursalTableController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('RecursosEnServicioEnSucursalTableController');
		this.$log.debug('ON');
	}
	// #endregion
}