/**
* @author: ppautasso
* @description: controller para componente de grupo de prestaciones en servicioensucursal table 
* @type: Controller
**/
import * as angular from 'angular';
import { IGrupoPrestacionMedicaDataService } from '../../../../../turnos/configuraciones/grupoPrestacionMedica/services';

export class GrupoPrestacionesEnServicioEnSucursalTableController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	loading: boolean = false;
	sucursal;
	servicio;
	grupoDePrestaciones;
	menuOptions;

	columnsPrestaciones = {

		primera: 'Nombre Grupo Prestación',
		primeraBind: 'Nombre',
		segunda: 'Visible Portal',
		segundaBind: 'VisiblePortalWeb',
		tercera: 'Estado',
		terceraBind: 'Activo',
	};
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'GrupoPrestacionMedicaDataService',
		'SelectorService', 'AlertaService'];
	/**
	* @class GrupoPrestacionesEnServicioEnSucursalTableController
	* @constructor
	*/
	constructor(private $log: ILogger, private GrupoPrestacionMedicaDataService: IGrupoPrestacionMedicaDataService,
		private SelectorService, private AlertaService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	changeServicio(servicio) {

		this.$log.debug('servicio selected ON.-', servicio);

		this.loading = true;

		this.GrupoPrestacionMedicaDataService.obtenerPorServicioSucursal(servicio.IdServicio, servicio.IdSucursal)
			.then((pResult) => {
				this.$log.debug('pResult', pResult);
				this.grupoDePrestaciones = angular.copy(pResult);
				// angular.forEach(this.grupoDePrestaciones, function (grupoPrestacion, key) {
				// 	grupoPrestacion.IdElemento = angular.copy(grupoPrestacion.IdGrupoPrestacion);
				// 	grupoPrestacion.IdRow = key;
				// 	grupoPrestacion.IdTabla = 5;
				// });

				this.loading = false;
			}, (pError) => {
				this.$log.error('obtenerPorServicioError-', pError);
				this.loading = false;
			});

	}

	addGrupoPrestacionAServicioYSucursal() {
		this.$log.debug('addPrestacionAServicio ON.-');

		this.SelectorService.newSelector({
			nombreSelector: "Seleccione una Prestacion", dataService: "GrupoPrestacionMedicaDataService",
			method: "getAll", columns: ["Nombre"], isTableBackEnd: false
		})
			.then((grupoPrestacionSelected) => {
				this.$log.debug('grupoPrestacionSelected ON.-', grupoPrestacionSelected);


			}, (pError) => {
				this.loading = false;
				this.$log.error('obtener prestaciones ON.-');
			});
	}

	changeSucursal(sucursal) {
		delete this.grupoDePrestaciones;
	}


	// #endregion

	// #region /* ----------------------------------------- MENU CONTEXTUAL ----------------------------------------- */

	inicializarMenuOptions() {
		this.menuOptions = [
			{
				text: 'Ver Recursos que realizan el Grupo de Prestaciones',
				click: ($itemScope, $event, modelValue, text, $li) => {

					this.$log.debug('itemscope', $itemScope);
					var _relacion: any = {};
					_relacion.pIdServicio = this.servicio.IdServicio;
					_relacion.pIdSucursal = this.sucursal.Id;
					_relacion.pIdGrupoDePrestaciones = $itemScope.row.Id;

					this.SelectorService.newSelector({
						nombreSelector: "Ver recursos que realiza el grupo " + $itemScope.row.Nombre, dataService: "RecursoDataService",
						method: "obtenerTodosDeUnServicioEnSucursalConGrupoDePrestaciones", columns: ["Nombre"], isTableBackEnd: false,
						objCriterio: _relacion
					})
						.then((grupoPrestacionSelected) => {
							this.$log.debug('grupoPrestacionSelected ON.-', grupoPrestacionSelected);
							if(grupoPrestacionSelected === false){
								this.AlertaService.NewWarning("No hay recursos disponibles para el grupo seleccionado");
							}

						}, (pError) => {
							this.loading = false;
							this.$log.error('obtener prestaciones ON.-');
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
		if (change.servicio) {

			if (!change.servicio.isFirstChange()) {
				this.$log.debug('$onChangeServicio', change);
				if (change.servicio)
					this.changeServicio(change.servicio.currentValue);
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
	* @class GrupoPrestacionesEnServicioEnSucursalTableController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('GrupoPrestacionesEnServicioEnSucursalTableController');
		this.$log.debug('ON');
		this.inicializarMenuOptions();
	}
	// #endregion

}