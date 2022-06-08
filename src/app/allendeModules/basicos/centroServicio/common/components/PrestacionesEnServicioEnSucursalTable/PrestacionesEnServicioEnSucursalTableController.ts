/**
* @author: ppautasso
* @description: controller para prestaciones en servicio en sucursal table
* @type: Controller
**/
import * as angular from 'angular';

export class PrestacionesEnServicioEnSucursalTableController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	loading: boolean = false;
	prestaciones;
	servicio;
	sucursal;
	prestacionSelected;
	onRecursoSelected;

	columnsPrestaciones = {

		primera: 'Nombre Prestación',
		primeraBind: 'Nombre',
		// segunda: 'Servicio',
		// segundaBind: 'Servicio',
		segunda: 'Visible Portal',
		segundaBind: 'VisiblePortalWeb',
		tercera: 'Estado',
		terceraBind: 'Activo',
	};

	optionsObj = {
		ok: 'Si',
		cancel: 'No'
	};
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'PrestacionGestionDataService', 'SelectorService', 
	'AlertaService', 'ModalService'];
	/**
	* @class PrestacionesEnServicioEnSucursalTableController
	* @constructor
	*/
	constructor(private $log: ILogger, private PrestacionGestionDataService,private SelectorService,
		 private AlertaService, private ModalService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	changeServicio(servicio) {

		this.$log.debug('servicio selected ON.-', servicio);

		this.loading = true;
		delete this.prestacionSelected;

		this.PrestacionGestionDataService.obtenerPorServicioEnSucursal(servicio.IdSucursal, servicio.IdServicio)
			.then((pResult) => {
				this.$log.debug('pResult', pResult);
				this.prestaciones = angular.copy(pResult);
				angular.forEach(this.prestaciones, function (prestacion, key) {
					prestacion.IdElemento = angular.copy(prestacion.IdPrestacion);
					prestacion.IdRow = key;
					prestacion.IdTabla = 3;
				})

				this.loading = false;
			}, (pError) => {
				this.$log.error('obtenerPorServicioError-', pError);
				this.loading = false;
			});

	}

	// #region add/delete Prestaciones
		
	addPrestacionAServicio() {

		this.$log.debug('addPrestacionAServicio ON.-');

		this.SelectorService.newSelector({
			nombreSelector: "Seleccione una Prestacion", dataService: "PrestacionGestionDataService",
			method: "getAll", columns: ["Nombre"], isTableBackEnd: false
		})
		.then( (prestacionSelected) => {
				this.$log.debug('prestacionSelected ON.-', prestacionSelected);
				if (prestacionSelected.Id) {
					this.loading = true;
					this.PrestacionGestionDataService.validarAsignarAServicio(this.servicio.IdServicio, this.sucursal.Id, prestacionSelected.Id)
						.then( (pResponse) => {
							this.$log.debug("ValidacionAsignacion response", pResponse);
							if (pResponse.IsOk === true) {
								this.loading = true;
								this.PrestacionGestionDataService.asignarAServicio(this.servicio.IdServicio, this.sucursal.Id, prestacionSelected.Id)
									.then( (pResp) => {
										this.loading = false;
										this.AlertaService.NewSuccess("", "Prestacion Asignada a Servicio " + this.servicio.Servicio);
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
				this.$log.error('obtener prestaciones ON.-');
			});
	}

	deletePrestacionXServicio(pPrestacionServicio) {
		this.$log.error('deletePrestacionXServicio ON.-', pPrestacionServicio);

		this.ModalService.confirm("Desea eliminar la prestación '" + pPrestacionServicio.Nombre + "' del servicio '" + pPrestacionServicio.Servicio + "'?",
			 (pResponse) => {

				if (pResponse) {

					this.loading = true;
					this.PrestacionGestionDataService.validarEliminarDelServicio(pPrestacionServicio.Id)
						.then( (pResponse) => {
							this.$log.debug("deleteRecurso response", pResponse);
							if (pResponse.IsOk === true) {
								this.loading = true;
								this.PrestacionGestionDataService.eliminarDelServicio(pPrestacionServicio.Id)
									.then( (pResp) => {
										this.loading = false;
										this.AlertaService.NewSuccess("", "Prestación eliminada del servicio " + this.servicio.Servicio);
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

	// #region change status Prestaciones
	 
	changeActivoPrestacionXServicio(pPrestacionServicio) {
		
		this.$log.error('changeActivoPrestacionXServicio ON.-', pPrestacionServicio);
		if (!pPrestacionServicio.Activo) {

			this.loading = true;
			this.PrestacionGestionDataService.validarDesactivarDelServicio(pPrestacionServicio.Id)
				.then( (pResponse) => {
					this.$log.debug("desactivar Recurso response", pResponse);
					if (pResponse.IsOk === true) {
						this.loading = true;
						this.PrestacionGestionDataService.desactivarDelServicio(pPrestacionServicio.Id)
							.then( (pResp) => {
								this.loading = false;
								this.AlertaService.NewSuccess("", "Prestación '" + pPrestacionServicio.Nombre + "' DESACTIVADA");
								this.changeServicio(this.servicio);
							},  (pErr) => {
								pPrestacionServicio.Activo = true;
								this.loading = false;
								this.$log.error('ValidacionAsignacion .-', pErr);
							});
					} else {
						if (pResponse.Message != null)
							this.AlertaService.NewError("", pResponse.Message);
						else
							this.AlertaService.NewError("", "Error");
						this.loading = false;
						pPrestacionServicio.Activo = true;
					}
				},  (pError) => {
					this.loading = false;
					pPrestacionServicio.Activo = true;
					this.$log.error('desactivar prestacion servicio error.-');
				});

		} else {

			this.loading = true;
			this.PrestacionGestionDataService.validarActivarDelServicio(pPrestacionServicio.Id)
				.then( (pResponse) => {
					this.$log.debug("desactivar prestacion response", pResponse);
					if (pResponse.IsOk === true) {
						this.loading = true;
						this.PrestacionGestionDataService.activarDelServicio(pPrestacionServicio.Id)
							.then( (pResp) => {
								this.loading = false;
								this.AlertaService.NewSuccess("", "Prestación '" + pPrestacionServicio.Nombre + "' ACTIVADA");
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
					this.$log.error('recurso activar ERROR.-');
				})

		}

	}

	changeVisiblePortalPrestacionXServicio(pPrestacionServicio) {
		this.$log.error('changeVisiblePortalPrestacionXServicio ON.-', pPrestacionServicio);

		if (!pPrestacionServicio.VisiblePortalWeb) {

			this.loading = true;
			this.PrestacionGestionDataService.validarOcultarDelServicioEnPortalWeb(pPrestacionServicio.Id)
				.then( (pResponse) => {
					this.$log.debug("validarOcultarDelServicioEnPortalWeb response", pResponse);
					if (pResponse.IsOk === true) {
						this.loading = true;
						this.PrestacionGestionDataService.ocultarDelServicioEnPortalWeb(pPrestacionServicio.Id)
							.then( (pResp) => {
								this.loading = false;
								this.AlertaService.NewSuccess("", "Prestación '" + pPrestacionServicio.Nombre + "' ocultada en el portal");
								this.changeServicio(this.servicio);
							},  (pErr) => {
								pPrestacionServicio.VisiblePortalWeb = true;
								this.loading = false;
								this.$log.error('ocultarEnPortalWeb .-', pErr);
							});
					} else {
						if (pResponse.Message != null) {
							this.AlertaService.NewError("", pResponse.Message);
						}
						else {
							this.AlertaService.NewError("", "Error");
						}
						this.loading = false;
						pPrestacionServicio.VisiblePortalWeb = true;
					}
				},  (pError) => {
					this.loading = false;
					pPrestacionServicio.VisiblePortalWeb = true;
					this.$log.error('ocultarEnPortalWeb error.-');
				});

		} else {

			this.loading = true;
			this.PrestacionGestionDataService.validarMostrarDelServicioEnPortalWeb(pPrestacionServicio.Id)
				.then( (pResponse) => {
					this.$log.debug("validarMostrarDelServicioEnPortalWeb response", pResponse);
					if (pResponse.IsOk === true) {
						this.loading = true;
						this.PrestacionGestionDataService.mostrarDelServicioEnPortalWeb(pPrestacionServicio.Id)
							.then( (pResp) => {
								this.loading = false;
								this.AlertaService.NewSuccess("", "Prestación '" + pPrestacionServicio.Nombre + "' visible en el portal");
								this.changeServicio(this.servicio);
							},  (pErr) => {
								this.loading = false;
								pPrestacionServicio.VisiblePortalWeb = false;
								this.$log.error('MostrarDelServicioEnPortalWeb .-', pErr);
							});
					} else {
						if (pResponse.Message != null)
							this.AlertaService.NewError("", pResponse.Message);
						else
							this.AlertaService.NewError("", "Error");

						pPrestacionServicio.VisiblePortalWeb = false;
						this.loading = false;
					}
				},  (pError) => {
					this.loading = false;
					pPrestacionServicio.VisiblePortalWeb = false;
					this.$log.error('MostrarDelServicioEnPortalWeb ERROR.-');
				})

		}

	}
	
	// #endregion

	selectPrestacion(row){
		this.prestacionSelected = row;
	}


	changeSucursal(sucursal){
		delete this.prestaciones;
	}
	// #endregion

	// #region /* ----------------------------------------- ONCHANGES ----------------------------------------- */

	$onChanges(change) {

		console.log('change', change);
		if (change.servicio) {

			if (!change.servicio.isFirstChange()) {
				this.$log.debug('$onChangeServicio', change);
				if (change.servicio)
					this.changeServicio(change.servicio.currentValue);
			}
		}

		if (change.onRecursoSelected) {

			if (!change.onRecursoSelected.isFirstChange()) {
				this.$log.debug('$onChangeonRecursoSelected', change);
				// if (change.onRecursoSelected)
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
	* @class PrestacionesEnServicioEnSucursalTableController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('PrestacionesEnServicioEnSucursalTableController');
		this.$log.debug('ON');
	}
	// #endregion
}