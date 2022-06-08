/**
* @author: ppautasso
* @description: controller para servicios en sucursal table
* @type: Controller
**/
import * as angular from 'angular';

export class ServiciosEnSucursalTableController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	loading: boolean = false;
	model;
	sucursal;
	serviciosEnSucursal;
	servicioSeleccionado;

	columnsServicios = {
		primera: 'Nombre Servicio',
		primeraBind: 'Servicio',
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
	static $inject: Array<string> = ['Logger', 'ServiciosGestionDataService', 'SelectorService', 'AlertaService', 'ModalService'];
	/**
	* @class ServiciosEnSucursalTableController
	* @constructor
	*/
	constructor(private $log: ILogger, private ServiciosGestionDataService, private SelectorService, private AlertaService, private ModalService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	changeSucursal(sucursal) {

		this.$log.debug('changeSucursal.-', sucursal);
		if (sucursal) {

			this.loading = true;
			this.ServiciosGestionDataService.getServiciosBySucursal(sucursal.Id)
				.then((pResult) => {
					this.$log.debug('pResult', pResult);
					this.serviciosEnSucursal = angular.copy(pResult);
					angular.forEach(this.serviciosEnSucursal, function (servicio, key) {
						servicio.IdElemento = angular.copy(servicio.IdServicio);
						servicio.IdRow = key;
						servicio.IdTabla = 1;
					})
					this.loading = false;
				}, (pError) => {
					this.$log.debug('changeSucursal.-', pError);
					this.loading = false;

				});
		} else delete this.serviciosEnSucursal;

	}

	addServicios() {

		this.$log.debug('addServicios ON.-');

		this.SelectorService.newSelector({
			sizeModal: "lg", nombreSelector: "Seleccione un Servicio Medico", dataService: "ServiciosGestionDataService",
			method: "getAll", columns: ["Nombre"], isTableBackEnd: false
		})
		.then( (servicioSelected) => {
			this.$log.debug('pResult',servicioSelected);
			if (servicioSelected.Id) {
				this.loading = true;
				this.ServiciosGestionDataService.ValidarAsignarASucursal(servicioSelected.Id, this.sucursal.Id)
					.then( (pResponse) => {
						this.$log.debug("ValidacionAsignacion response", pResponse);
						if (pResponse.IsOk === true) {
							this.loading = true;
							this.ServiciosGestionDataService.AsignarServicioASucursal(servicioSelected.Id, this.sucursal.Id)
								.then( (pResp) => {
									this.loading = false;
									this.AlertaService.NewSuccess("", "Servicio Agregado a Sucursal " + this.sucursal.Nombre);
									this.changeSucursal(this.sucursal);

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
		}, (pError) => {
			this.loading = false;
			this.$log.error('obtener servicios ON.-',pError);
		});

	}


	deleteServicio(pServicio) {
		this.$log.error('deleteServicio ON.-', pServicio);
		this.ModalService.confirm("Desea eliminar el servicio '" + pServicio.Servicio + "' de la sucursal '" + pServicio.Sucursal + "'?",
			 (pResponse) => {
				if (pResponse) {
					this.loading = true;
					this.ServiciosGestionDataService.validarEliminarServicioEnSucursal(pServicio.Id)
						.then( (pResponse) => {
							this.$log.debug("deleteServicio response", pResponse);
							if (pResponse.IsOk === true) {
								this.loading = true;
								this.ServiciosGestionDataService.eliminarServicioEnSucursal(pServicio.Id)
									.then( (pResp) => {
										this.loading = false;
										this.AlertaService.NewSuccess("", "Servicio eliminado de la sucursal " + this.sucursal.Nombre);
										// delete vm.data.servicioSeleccionado;
										this.changeSucursal(this.sucursal);

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

	changeActivoServicio(pServicio) {

		this.$log.error('changeActivoServicio ON.-', pServicio);

		if (!pServicio.Activo) {

			this.loading = true;
			this.ServiciosGestionDataService.validarDesactivarServicioEnSucursal(pServicio.Id)
				.then( (pResponse) => {
					this.$log.debug("desactivar Servicio response", pResponse);
					if (pResponse.IsOk === true) {
						this.loading = true;
						this.ServiciosGestionDataService.desactivarServicioEnSucursal(pServicio.Id)
							.then( (pResp) => {
								this.loading = false;
								this.AlertaService.NewSuccess("", "Servicio DESACTIVADO");

							},  (pErr) => {
								pServicio.Activo = true;
								this.loading = false;
								this.$log.error('ValidacionAsignacion .-', pErr);
							});
					} else {
						if (pResponse.Message != null)
							this.AlertaService.NewError("", pResponse.Message);
						else
							this.AlertaService.NewError("", "Error");
						this.loading = false;
						pServicio.Activo = true;
					}
				},  (pError) => {
					this.loading = false;
					pServicio.Activo = true;
					this.$log.error('deleteServicio ON.-');
				});

		} else {

			this.loading = true;
			this.ServiciosGestionDataService.validarActivarServicioEnSucursal(pServicio.Id)
				.then( (pResponse) => {
					this.$log.debug("desactivar Servicio response", pResponse);
					if (pResponse.IsOk === true) {
						this.loading = true;
						this.ServiciosGestionDataService.activarServicioEnSucursal(pServicio.Id)
							.then( (pResp) => {
								this.loading = false;
								this.AlertaService.NewSuccess("", "Servicio ACTIVADO");

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

	}

	changeVisiblePortalServicio(pServicio) {
		this.$log.error('changeVisiblePortalServicio ON.-', pServicio);

		if (!pServicio.VisiblePortalWeb) {

			this.loading = true;
			this.ServiciosGestionDataService.validarOcultarEnPortalWeb(pServicio.Id)
				.then( (pResponse) => {
					this.$log.debug("validarOcultarEnPortalWeb response", pResponse);
					if (pResponse.IsOk === true) {
						this.loading = true;
						this.ServiciosGestionDataService.ocultarEnPortalWeb(pServicio.Id)
							.then( (pResp) => {
								this.loading = false;
								this.AlertaService.NewSuccess("", "Servicio ocultado");

							},  (pErr) => {
								pServicio.VisiblePortalWeb = true;
								this.loading = false;
								this.$log.error('validarOcultarEnPortalWeb error .-', pErr);
							});
					} else {
						if (pResponse.Message != null)
							this.AlertaService.NewError("", pResponse.Message);
						else
							this.AlertaService.NewError("", "Error");
						this.loading = false;
						pServicio.VisiblePortalWeb = true;
					}
				},  (pError) => {
					this.loading = false;
					pServicio.VisiblePortalWeb = true;
					this.$log.error('ocultar servicio en Portal Web ON.-');
				});

		}
		else {
			this.loading = true;
			this.ServiciosGestionDataService.validarMostrarEnPortalWeb(pServicio.Id)
				.then( (pResponse) => {
					this.$log.debug("validarMostrarEnPortalWeb response", pResponse);
					if (pResponse.IsOk === true) {
						this.loading = true;
						this.ServiciosGestionDataService.mostrarEnPortalWeb(pServicio.Id)
							.then( (pResp) => {
								this.loading = false;
								this.AlertaService.NewSuccess("", "Servicio visible en el portal");

							},  (pErr) => {
								pServicio.VisiblePortalWeb = false;
								this.loading = false;
								this.$log.error('validarMostrarEnPortalWeb error .-', pErr);
							});
					} else {
						if (pResponse.Message != null)
							this.AlertaService.NewError("", pResponse.Message);
						else
							this.AlertaService.NewError("", "Error");
						this.loading = false;
						pServicio.VisiblePortalWeb = false;
					}
				},  (pError) => {
					this.loading = false;
					pServicio.VisiblePortalWeb = false;
					this.$log.error('mostrar servicio en portal ON.-');
				})

		}
	}

	clickServicio(row){
		this.servicioSeleccionado = row;
	}
	// #endregion

	// #region /* ----------------------------------------- ONCHANGES ----------------------------------------- */

	$onChanges(change) {

		console.log('change', change);
		if (change.sucursal) {

			if (!change.sucursal.isFirstChange()) {
				this.$log.debug('$onChangeSucursal', change);
				if (change.sucursal)
					this.changeSucursal(change.sucursal.currentValue);

			}
		}

	}
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class ServiciosEnSucursalTableController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('ServiciosEnSucursalTableController');
		this.$log.debug('ON');
	}
	// #endregion
}