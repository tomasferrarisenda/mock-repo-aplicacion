/**
* @author: ppautasso
* @description: controller para contenedor de new/edit receso individual
* @type: Controller
**/
import * as angular from 'angular';
import { ITurnoParaRecesoIndividualDataService } from '../../services';
import { IRecesoIndividualProcesarDto } from '../../models';

export class RecesoIndividualContainerController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	loading: boolean = false;
	idReceso: number = 0;
	sucursal: any;
	servicio: any;
	recurso: any;
	fechaDesde = new Date();
	fechaHasta = new Date();
	fechadesdeMin = new Date();
	listaTurnos: any;
	sucursales;
	tiposEstadoTurno;

	paginacion = {
		currentPage: 0,
		pageSize: 0,
		totalItems: 0,
	};

	dataFilter;
	seleccionarTodos: boolean = false;

	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', '$stateParams', 'StateHelperService', 'moment', '$q',
		'TurnoParaRecesoIndividualDataService',
		'SucursalDataService',
		'TurnoDataService'];
	/**
	* @class RecesoIndividualContainerController
	* @constructor
	*/
	constructor(private $log: ILogger, private $stateParams, private StateHelperService, private moment, private $q,
		private TurnoParaRecesoIndividualDataService: ITurnoParaRecesoIndividualDataService,
		private SucursalDataService,
		private TurnoDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	cancel() {
		this.StateHelperService.goToPrevState();
	}

	buscarTurnos() {
		this.loading = true;

		var _fechaDesde = angular.copy(this.moment(this.fechaDesde).format('MM-DD-YYYY'));
		var _fechaHasta = angular.copy(this.moment(this.fechaHasta).format('MM-DD-YYYY'));

		this.TurnoParaRecesoIndividualDataService.obtenerTurnosParaRecesoIndividuales(this.recurso.Id, this.recurso.IdTipoRecurso,
			this.servicio.Id, 0, _fechaDesde, _fechaHasta)
			.then((pResult) => {
				this.$log.debug('pResultTurnosParaRecesosIndividuales', pResult);

				pResult.forEach((turno,key) => {

					turno.IdRow = key;

					this.sucursales.forEach(sucursal => {
						if (turno.IdSucursal === sucursal.Id) {
							turno.NombreSucursal = angular.copy(sucursal.Nombre);
							turno.ColorSucursal = angular.copy(sucursal.Color);
						}
					});

					this.tiposEstadoTurno.forEach(estadoTurno => {
						if (turno.IdEstado === estadoTurno.Id) {
							turno.NombreEstado = angular.copy(estadoTurno.Nombre);
							turno.ColorEstado = angular.copy(estadoTurno.Color);
							turno['es' + estadoTurno.Nombre] = true;
						}
					});

				});

				this.listaTurnos = angular.copy(pResult);
				this.pageChanged();
				this.loading = false;
			}, (pError) => {
				this.$log.error('pErrorTurnosParaRecesosIndividuales', pError);
				this.loading = false;
			});
	}


	pageChanged() {
		var begin = ((this.paginacion.currentPage - 1) * this.paginacion.pageSize);
		var end = begin + this.paginacion.pageSize;
		this.dataFilter = angular.copy(this.listaTurnos);

		this.paginacion.totalItems = this.listaTurnos.length;
		this.dataFilter = this.dataFilter.slice(begin, end);
	}


	save(){
		this.loading = true;
		
		var recesoIndividual: IRecesoIndividualProcesarDto = {};

		recesoIndividual.FechaDesde = angular.copy(this.moment(this.fechaDesde).format('MM-DD-YYYY'));
		recesoIndividual.FechaHasta = angular.copy(this.moment(this.fechaHasta).format('MM-DD-YYYY'));
		recesoIndividual.IdSucursal = 0;
		recesoIndividual.IdServicio = this.servicio.Id;
		recesoIndividual.IdRecurso = this.recurso.Id;
		recesoIndividual.IdTipoRecurso = this.recurso.IdTipoRecurso;

		recesoIndividual.TurnosParaAplicar = angular.copy(this.listaTurnos);

		this.TurnoParaRecesoIndividualDataService.aplicarRecesosIndividuales(recesoIndividual)
		.then( (pResult) => {
			this.$log.debug('pResult',pResult);
			this.loading = false;
			if(pResult.IsOk){
				this.cancel();
			}
		}, (pError) => {
			this.$log.error('pError',pError);
			this.loading = false;
		});
	}
	// #endregion

	// #region SUPPORT
	changeFechaDesde() {
		this.fechadesdeMin.setDate(this.fechaDesde.getDate() - 1);
	}

	seleccionarTodosChange(){
		this.listaTurnos.forEach(turno => {
			turno.ConRecesoIndividual = angular.copy(this.seleccionarTodos);
		});

		this.pageChanged();
	}

	checkRow(turno){
		if(this.listaTurnos.find(x => x.IdRow == turno.IdRow))
		this.listaTurnos.find(x => x.IdRow == turno.IdRow).ConRecesoIndividual = angular.copy(turno.ConRecesoIndividual);
	}

	getTurnosSelected(){
		let ret = '';
		let turnos;
		if(this.listaTurnos){

			turnos = this.listaTurnos.filter(x => x.ConRecesoIndividual);
		}

		return turnos.length + " Turnos Seleccionados";
	}
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class RecesoIndividualContainerController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('RecesoIndividualContainerController');
		this.$log.debug('ON');

		this.loading = true;
		// seteamos 7 dias en adelante
		this.fechaHasta.setDate(this.fechaDesde.getDate() + 7);
		this.fechadesdeMin.setDate(this.fechaDesde.getDate() - 1);
		// obteniendo datos
		this.$log.debug('obteniendo datoa de receso individual.-', this.$stateParams.idReceso, this.$stateParams.servicio, this.$stateParams.recurso);
		this.servicio = this.$stateParams.servicio;
		this.recurso = this.$stateParams.recurso;

		if (this.$stateParams.edit === 0) {
			// tengo nuevo receso individual
			this.title.name = "Nuevo Receso Individual";
			this.title.icon = "NEW";
		} else {
			// tengo id de receso individual para editar
			this.title.name = "Editar Receso Individual";
			this.title.icon = "EDIT";

			this.fechaDesde =
						new Date(this.$stateParams.fechaDesde);
			this.fechaHasta =
						new Date(this.$stateParams.fechaHasta);

		}

		this.paginacion.currentPage = 1;
		this.paginacion.pageSize = 8;
		this.paginacion.totalItems = 0;

		var _sucursalesConColor = this.SucursalDataService.obtenerTodasSinExcepciones();
		var _tiposDeEstadoTurno = this.TurnoDataService.obtenerTiposEstadoTurnos();

		this.$q.all([
			_sucursalesConColor,
			_tiposDeEstadoTurno
		])
			.then((pResult) => {
				this.$log.debug('pResult', pResult);
				this.sucursales = pResult[0];
				this.tiposEstadoTurno = pResult[1];
				this.loading = false;
				//busco turnos
				this.buscarTurnos();
			}, (pError) => {
				this.$log.error('pError', pError);
				this.loading = false;
			});



	}
	// #endregion
}