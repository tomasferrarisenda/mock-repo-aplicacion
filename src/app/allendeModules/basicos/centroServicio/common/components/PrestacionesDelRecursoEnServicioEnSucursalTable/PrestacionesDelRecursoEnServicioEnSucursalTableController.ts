/**
* @author: ppautasso
* @description: controller para prestaciones del recurso en servicio en sucursal table
* @type: Controller
**/
import * as angular from 'angular';

export class PrestacionesDelRecursoEnServicioEnSucursalTableController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	loading: boolean = false;
	sucursal;
	servicio;
	recurso;
	prestacionesDelRecurso;
	prestacionDelRecurso;
	
	columnsPrestacionesXRecurso = {

		primera: 'Nombre Prestación',
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

	contextOptions = [
		{
			text: 'Cambiar Visible Portal',
			displayed: function (modelValue) {
				return true;
			},
			click: ($itemScope, $event, modelValue, text, $li) => {

				this.$log.debug('itemsScopeClick', $itemScope.row);
				this.changeVisiblePortalPrestacionXRecurso($itemScope.row);
			}
		},
		{
			text: 'Cambiar Estado Activo',
			displayed: function (modelValue) {
				return true;
			},
			click: ($itemScope, $event, modelValue, text, $li) => {

				this.$log.debug('itemsScopeClick', $itemScope.row);
				this.changeActivoPrestacionXRecurso($itemScope.row)
			}
		},
		{
			text: 'Eliminar',
			displayed: function (modelValue) {
				return true;
			},
			click: ($itemScope, $event, modelValue, text, $li) => {

				this.$log.debug('itemsScopeClick', $itemScope.row);
				this.deletePrestacionXRecurso($itemScope.row);
			}
		}
	];
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'PrestacionGestionDataService', 'SelectorService', 'AlertaService', 'ModalService'
		];
	/**
	* @class PrestacionesDelRecursoEnServicioEnSucursalTableController
	* @constructor
	*/
	constructor(private $log: ILogger, private PrestacionGestionDataService, private SelectorService, private AlertaService, private ModalService
		) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	changeRecurso(recurso){
		this.$log.debug('recurso selected ON.-', recurso);
		this.loading = true;
		
		if(recurso && recurso.Id){
			this.PrestacionGestionDataService.obtenerPrestacionXRecurso(recurso.Id)
				.then((pResult) => {
	
					this.$log.debug('obtenerPrestacionesPorRecurso ON.-', pResult);
					this.prestacionesDelRecurso = angular.copy(pResult);
					angular.forEach(this.prestacionesDelRecurso, function (prestacion, key) {
						prestacion.IdElemento = angular.copy(prestacion.IdPrestacion);
						prestacion.IdRow = key;
						prestacion.IdTabla = 4;
					})
					this.loading = false;
				}, (pError) => {
	
					this.$log.error('obtenerPorServicioError-', pError);
					this.loading = false;
				});
		}
	}

	selectPrestacionRecurso(row){
		this.prestacionDelRecurso = row
	}

	// #region add/delete prestacion a servicio y recurso
		 
	addPrestacionAServicioYRecurso() {

		this.$log.debug('addPrestacionAServicioYRecurso ON.-');

		this.SelectorService.newSelector({
			nombreSelector: "Seleccione una Prestacion",
			dataService: "PrestacionGestionDataService",
			method: "getPrestacionXServicioId",
			isTableBackEnd: false,
			columns: ["Nombre"],
			objCriterio: this.servicio.Id
		})
			.then((prestacionSelected) => {
				this.$log.debug('prestacionSelected ON.-', prestacionSelected);
				if (prestacionSelected.Id) {
					this.loading = true;
					this.PrestacionGestionDataService.validarAsignarARecurso(prestacionSelected.Id, this.recurso.Id)
						.then( (pResponse) => {
							this.$log.debug("ValidacionAsignacion response", pResponse);
							if (pResponse.IsOk === true) {
								this.loading = true;
								this.PrestacionGestionDataService.asignarARecurso(prestacionSelected.Id, this.recurso.Id)
									.then( (pResp) => {
										this.loading = false;
										this.AlertaService.NewSuccess("", "Prestacion Asignada a Recurso " + this.recurso.Nombre);
										this.changeRecurso(this.recurso);
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



	deletePrestacionXRecurso(pPrestacionRecurso) {
		this.$log.error('deletePrestacionXRecurso ON.-', pPrestacionRecurso);

		this.ModalService.confirm("Desea eliminar la prestación '" + pPrestacionRecurso.Nombre + "' del recurso '" + pPrestacionRecurso.Recurso + "' en el servicio '" +
			pPrestacionRecurso.Servicio + "'?",
			 (pResponse) => {

				if (pResponse) {

					this.loading = true;
					this.PrestacionGestionDataService.validarEliminarDelRecurso(pPrestacionRecurso.Id)
						.then( (pResponse) => {
							this.$log.debug("deleteRecurso response", pResponse);
							if (pResponse.IsOk === true) {
								this.loading = true;
								this.PrestacionGestionDataService.eliminarDelRecurso(pPrestacionRecurso.Id)
									.then( (pResp) => {
										this.loading = false;
										this.AlertaService.NewSuccess("", "Prestación eliminada del recurso " + this.recurso.Nombre);
										this.changeRecurso(this.recurso);
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

	// #region change status prestaciones x recurso
	 
	changeActivoPrestacionXRecurso(pPrestacionRecurso) {
		this.$log.error('changeActivoPrestacionXRecurso ON.-', pPrestacionRecurso);

		if (!pPrestacionRecurso.Activo) {

			this.loading = true;
			this.PrestacionGestionDataService.validarDesactivarDelRecurso(pPrestacionRecurso.Id)
				.then( (pResponse) => {
					this.$log.debug("desactivar prestacion x recurso response", pResponse);
					if (pResponse.IsOk === true) {
						this.loading = true;
						this.PrestacionGestionDataService.desactivarDelRecurso(pPrestacionRecurso.Id)
							.then( (pResp) => {
								this.loading = false;
								this.AlertaService.NewSuccess("", "Prestación '" + pPrestacionRecurso.Nombre + "' DESACTIVADA");
								this.changeRecurso(this.recurso);
							},  (pErr) => {
								pPrestacionRecurso.Activo = true;
								this.loading = false;
								this.$log.error('ValidacionAsignacion .-', pErr);
							});
					} else {
						if (pResponse.Message != null)
							this.AlertaService.NewError("", pResponse.Message);
						else
							this.AlertaService.NewError("", "Error");
						this.loading = false;
						pPrestacionRecurso.Activo = true;
					}
				},  (pError) => {
					this.loading = false;
					pPrestacionRecurso.Activo = true;
					this.$log.error('desactivar prestacion servicio error.-');
				});

		} else {

			this.loading = true;
			this.PrestacionGestionDataService.validarActivarDelRecurso(pPrestacionRecurso.Id)
				.then( (pResponse) => {
					this.$log.debug("desactivar prestacion response", pResponse);
					if (pResponse.IsOk === true) {
						this.loading = true;
						this.PrestacionGestionDataService.activarDelRecurso(pPrestacionRecurso.Id)
							.then( (pResp) => {
								this.loading = false;
								this.AlertaService.NewSuccess("", "Prestación '" + pPrestacionRecurso.Nombre + "' ACTIVADA");
								this.changeRecurso(this.recurso);
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


	changeVisiblePortalPrestacionXRecurso(pPrestacionRecurso) {

		if (!pPrestacionRecurso.VisiblePortalWeb) {

			this.loading = true;
			this.PrestacionGestionDataService.validarOcultarDelRecursoEnPortalWeb(pPrestacionRecurso.Id)
				.then( (pResponse) => {
					this.$log.debug("validarOcultarDelRecursoEnPortalWeb response", pResponse);
					if (pResponse.IsOk === true) {
						this.loading = true;
						this.PrestacionGestionDataService.ocultarDelRecursoEnPortalWeb(pPrestacionRecurso.Id)
							.then( (pResp) => {
								this.loading = false;
								this.AlertaService.NewSuccess("", "Prestación '" + pPrestacionRecurso.Nombre + "' Ocultada en el portal");

							},  (pErr) => {
								this.loading = false;
								pPrestacionRecurso.VisiblePortalWeb = true;
								this.$log.error('ocultarDelRecursoEnPortalWeb .-', pErr);
							});
					} else {
						if (pResponse.Message != null) {
							this.AlertaService.NewError("", pResponse.Message);
						} else {
							this.AlertaService.NewError("", pResponse.Message);
						}

						this.loading = false;
						pPrestacionRecurso.VisiblePortalWeb = true;
					}
				},  (pError) => {
					this.loading = false;
					pPrestacionRecurso.VisiblePortalWeb = true;
					this.$log.error('ocultarDelRecursoEnPortalWeb error.-');
				});

		} else {


			this.loading = true;
			this.PrestacionGestionDataService.validarMostrarDelRecursoEnPortalWeb(pPrestacionRecurso.Id)
				.then( (pResponse) => {
					this.$log.debug("validarMostrarDelRecursoEnPortalWeb response", pResponse);
					if (pResponse.IsOk === true) {
						this.loading = true;
						this.PrestacionGestionDataService.mostrarDelRecursoEnPortalWeb(pPrestacionRecurso.Id)
							.then( (pResp) => {
								this.loading = false;
								this.AlertaService.NewSuccess("", "Prestación '" + pPrestacionRecurso.Nombre + "' visible en el portal");

							},  (pErr) => {
								this.loading = false;
								pPrestacionRecurso.VisiblePortalWeb = false;
								this.$log.error('mostrarDelRecursoEnPortalWeb .-', pErr);
							});
					} else {
						if (pResponse.Message != null) {
							this.AlertaService.NewError("", pResponse.Message);
						} else {
							this.AlertaService.NewError("", "Error");
						}
						this.loading = false;
						pPrestacionRecurso.VisiblePortalWeb = false;
					}
				},  (pError) => {
					this.loading = false;
					pPrestacionRecurso.VisiblePortalWeb = false;
					this.$log.error('mostrarDelRecursoEnPortalWeb ERROR.-');
				})

		}

	}

	agregarEspecialidadPrestacion(prestacion) { 

		this.$log.debug('agregarEspecialidadPrestacion ON.-', prestacion);
		this.$log.debug('agregarEspecialidadPrestacion ON.-', this.recurso);
		//voy a abrir modal de relacion prestacion-especialidad
		this.SelectorService.newSelector({
			nombreSelector: "Seleccione una Especialidad",
			dataService: "EspecialidadMedicaDataService",
			method: "obtenerEspecialidadesDelRecurso",
			isTableBackEnd: false,
			columns: ["Nombre"],
			objCriterio: this.recurso.Id
		}).then( (pResult) => {
			this.$log.debug('pResult', pResult);

			//tengo la especialidad
			this.PrestacionGestionDataService.asignarEspecialidadPrestacionDelRecurso(prestacion.Id, pResult.Id).then( (pResponse) => {
				
				if (pResponse.IsOk === true) {
					this.AlertaService.NewSuccess("", "Especialidad relacionada con la prestacion correctamente");
					this.changeRecurso(this.recurso);
				} else {
					if (pResponse.Message != null) {
						this.AlertaService.NewError("", pResponse.Message);
					} else {
						this.AlertaService.NewError("", "Error");
					}
					
				}

			}, (pError) => {
					this.$log.error('pError', pError);
					this.AlertaService.NewError("", "Error");
			});

		}, (pError) => {
				
		});
	}

	borrarEspecialidadDeLaPrestacion(prestacion) { 
		
		this.PrestacionGestionDataService.quitarEspecialidadPrestacionDelRecurso(prestacion.Id).then( (pResponse) => {
				
			if (pResponse.IsOk === true) {
				this.AlertaService.NewSuccess("", "Especialidad quitada de la prestación");
				this.changeRecurso(this.recurso);
			} else {
				if (pResponse.Message != null) {
					this.AlertaService.NewError("", pResponse.Message);
				} else {
					this.AlertaService.NewError("", "Error");
				}
				
			}
		}, (pError) => {
				this.$log.error('pError', pError);
				this.AlertaService.NewError("", "Error");
		});
	}
	

	changeSucursal(sucursal){
		delete this.prestacionesDelRecurso;
	}
	
	// #endregion
	
	// #endregion

	// #region /* ----------------------------------------- ONCHANGES ----------------------------------------- */

	$onChanges(change) {

		console.log('change', change);
		if (change.recurso) {

			if (!change.recurso.isFirstChange()) {
				this.$log.debug('$onChangeSucursal', change);
				if (change.recurso)
					this.changeRecurso(change.recurso.currentValue);
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
	* @class PrestacionesDelRecursoEnServicioEnSucursalTableController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('PrestacionesDelRecursoEnServicioEnSucursalTableController');
		this.$log.debug('ON');
	}
	// #endregion
}