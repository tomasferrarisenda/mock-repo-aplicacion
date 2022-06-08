/**
* @author: ppautasso
* @description: controller para mostrar grupo de prestaciones del recurso en servicio en sucursal table
* @type: Controller
**/
import * as angular from 'angular';
import { IGrupoPrestacionMedicaDataService, IGrupoDePrestacionesDeRecursoServicioSucursalDataService } from '../../../../../turnos/configuraciones/grupoPrestacionMedica/services';
import { FiltroGrupoDePrestacionMedica } from '../../../../prestaciones/common/models';

export class GrupoPrestacionesDelRecursoEnServicioEnSucursalTableController implements angular.IController {

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
	grupoDePrestaciones;
	menuOptions: any;
	filtroGrupoDePrestacionMedica: FiltroGrupoDePrestacionMedica = {};
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'GrupoPrestacionMedicaDataService', 'SelectorService', 'AlertaService',
		'GrupoDePrestacionesDeRecursoServicioSucursalDataService'];
	/**
	* @class GrupoPrestacionesDelRecursoEnServicioEnSucursalTableController
	* @constructor
	*/
	constructor(private $log: ILogger, private GrupoPrestacionMedicaDataService:IGrupoPrestacionMedicaDataService, private SelectorService,
				private AlertaService:IAlertaService, private GrupoDePrestacionesDeRecursoServicioSucursalDataService:IGrupoDePrestacionesDeRecursoServicioSucursalDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	changeRecurso(recurso) {

		this.$log.debug('recurso selected ON.-', recurso);
		if(recurso){

			this.loading = true;
	
			this.filtroGrupoDePrestacionMedica.IdSucursal = angular.copy(this.sucursal.Id);
			this.filtroGrupoDePrestacionMedica.IdServicio = angular.copy(this.servicio.IdServicio);
			this.filtroGrupoDePrestacionMedica.IdRecurso = angular.copy(this.recurso.IdRecurso);
			this.filtroGrupoDePrestacionMedica.IdTipoRecurso = angular.copy(this.recurso.IdTipoRecurso);
	
			this.GrupoPrestacionMedicaDataService.obtenerRelacionadosPorRecursoServicioSucursal(this.filtroGrupoDePrestacionMedica)
				.then((pResult) => {
					this.$log.debug('pResult', pResult);
					this.grupoDePrestaciones = angular.copy(pResult);
					this.loading = false;
				}, (pError) => {
					this.$log.error('obtenerPorServicioError-', pError);
					this.loading = false;
				});
		}

	}

	agregarGrupoPrestacionARecursoEnServicio(){
		this.$log.debug('agregarGrupoPrestacionARecursoEnServicio ON.-');

		var _relacion: any = {};
		_relacion.pIdServicio = angular.copy(this.servicio.IdServicio);
		_relacion.pIdSucursal = angular.copy(this.sucursal.Id);

		this.SelectorService.newSelector({
			nombreSelector: "Seleccione una Grupo De Prestaciones",
			dataService: "GrupoPrestacionMedicaDataService",
			method: "obtenerPorServicioSucursalConFiltro",
			isTableBackEnd: false,
			columns: ["Nombre"],
			objCriterio: _relacion
		})
		.then((grupoPrestacionSelected) => {
				this.$log.debug('grupoPrestacionSelected ON.-', grupoPrestacionSelected);
				if (grupoPrestacionSelected.Id) {
					this.loading = true;
					this.GrupoDePrestacionesDeRecursoServicioSucursalDataService.validarAsignarARecurso(grupoPrestacionSelected.Id, this.recurso.IdRecurso, 
						this.recurso.IdTipoRecurso, this.servicio.IdServicio, this.sucursal.Id)
						.then( (pResponse) => {
							this.$log.debug("ValidacionAsignacion response", pResponse);
							if (pResponse.IsOk === true) {
								this.loading = true;
								this.GrupoDePrestacionesDeRecursoServicioSucursalDataService.asignarARecurso(grupoPrestacionSelected.Id, this.recurso.IdRecurso, 
									this.recurso.IdTipoRecurso, this.servicio.IdServicio, this.sucursal.Id)
									.then( (pResp) => {
										this.loading = false;
										this.AlertaService.NewSuccess("", "Grupo de Prestaciones Asignada a Recurso " + this.recurso.Nombre);
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

	changeSucursal(sucursal){
		delete this.grupoDePrestaciones;
	}

	
	// #endregion

	// #region /* ----------------------------------------- MENU CONTEXTUAL ----------------------------------------- */

	inicializarMenuOptions() {
		this.menuOptions = [
		{
				text: 'Eliminar Grupo De Prestaciones del Recurso',
				click: ($itemScope, $event, modelValue, text, $li) => {
				
					this.$log.debug('itemscope',$itemScope);
					this.GrupoDePrestacionesDeRecursoServicioSucursalDataService.obtenerRelacionadosPorRecursoServicioSucursalGrupo(this.recurso.IdRecurso, this.recurso.IdTipoRecurso, this.servicio.IdServicio,
					this.sucursal.Id, $itemScope.row.Id)
					.then( (pResult) => {
						this.$log.debug('pResult',pResult);
						// obtube el id para eliminar
						if(pResult.Id){
							this.GrupoDePrestacionesDeRecursoServicioSucursalDataService.eliminar(pResult.Id)
							.then( (pResultEliminar) => {
								this.$log.debug('pResultEliminar',pResultEliminar);
								this.AlertaService.NewSuccess("Grupo De Prestaciones eliminado");
								this.changeRecurso(this.recurso);
							}, (pError) => {
								this.$log.error('pError',pError);
							});
						}else {
							this.AlertaService.NewWarning("Este grupo de prestaciones es propio del recurso, y no puede eliminarse desde aqui");
						}
					}, (pError) => {
						this.$log.error('pError',pError);
					});
				}
			},
			{
				text: 'Ver Prestaciones que pertenecen al Grupo de Prestaciones',
				click: ($itemScope, $event, modelValue, text, $li) => {

					this.$log.debug('itemscope', $itemScope);
					var _relacion: any = {};
					_relacion.listaIdsGrupos = $itemScope.row.Id;

					this.SelectorService.newSelector({
						nombreSelector: "Ver Prestaciones que pertenecen al grupo " + $itemScope.row.Nombre, dataService: "PrestacionGestionDataService",
						method: "obtenerPorGrupoDePrestaciones", columns: ["Nombre"], isTableBackEnd: false,
						objCriterio: _relacion
					})
						.then((pResponseSelector) => {
							this.$log.debug('pResponseSelector ON.-', pResponseSelector);
							if (pResponseSelector === false) {
								this.AlertaService.NewWarning("El grupo no tiene prestaciones");
							}

						}, (pError) => {
							this.loading = false;
							this.$log.error('obtener prestaciones ON.-');
						});



				}

			}
		];
	}
	// #endregion

	// #region /* ----------------------------------------- ONCHANGES ----------------------------------------- */

	$onChanges(change) {

		console.log('change', change);
		if (change.recurso) {

			if (!change.recurso.isFirstChange()) {
				this.$log.debug('$onChangerecurso', change);
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
	* @class GrupoPrestacionesDelRecursoEnServicioEnSucursalTableController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('GrupoPrestacionesDelRecursoEnServicioEnSucursalTableController');
		this.$log.debug('ON');
		this.inicializarMenuOptions();
	}
	// #endregion
}