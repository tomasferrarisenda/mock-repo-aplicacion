/**
* @author: pablo pautasso
* @description: Controller para selector de recursos, filtrados por mutual
* @type: Controller
**/
import * as angular from 'angular';
import { ICriterioBusquedaTurnoDataService } from '../../services/criterioBusqueda/criterioBusquedaTurnoDataService';

export class RecursosSelectorPorMutualController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */

	// mas propiedades ..
	model: any;
	modelGuardado: any;
	criterioBusqueda: any;
	criterioDTO: any;
	especialidad: any;
	sucursal: any;
	recursos: any;
	recursosFiltrados: any;
	recursoSelected: any;
	afiliaciones: any;
	prestaciones: any;
	loading: boolean = false;
	buscando: boolean = false;
	limpiar: any;
	disabled;
	onModelChange;
	buscadorRecursoEnServiciosIf;
	onBuscarRecursosOk;
	tipoRecurso;

	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', '$q', '$scope', 'CriterioBusquedaTurnoDataService', 'MantenimientoAgendaLogicService',
	'RecursosDataService', 'SelectorService', 'TurnosCommonLogicService', 'AlertaService'];
	/**
	* @class RecursosSelectorPorMutualController
	* @constructor
	*/
	constructor(private $log: ILogger, private $q, private scope, private CriterioBusquedaTurnoDataService: ICriterioBusquedaTurnoDataService, private MantenimientoAgendaLogicService,
		private RecursosDataService, private SelectorService: ISelectorService, private TurnosCommonLogicService, private AlertaService:IAlertaService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	armarConsultaRecursos() {

		if (this.criterioDTO) {

			this.$log.debug('Armando consulta de recursos...', this.criterioDTO);
			this.criterioDTO.IdServicio = angular.copy(this.criterioBusqueda.IdServicio);
			this.criterioDTO.IdSucursal = angular.copy(this.criterioBusqueda.IdSucursal);
			this.criterioDTO.IdEspecialidad = this.especialidad ? angular.copy(this.especialidad.Id) : 0;
			this.criterioDTO.CriterioBusquedaDTO = this.criterioBusqueda ? angular.copy(this.criterioBusqueda) : null;
		}

	}

	isCriterioListo() {
		var ret = true;
		if (this.criterioBusqueda.IdPaciente === 0
			|| this.criterioBusqueda.IdFinanciador === 0) ret = false;

		return ret;
	}

	abrirBuscador(){
		
		this.TurnosCommonLogicService.openSelectorRecursosModalPorMutual(this.recursos)
		.then(pResult => {
			this.updateModel(pResult);
		}, pError => {
			this.$log.error('openSelectorRecursosModalPorMutualERROR',pError);
		})
	}

	updateModel(model) {
		// this.recursoSelected = angular.copy(model);
		this.model = model;
		if(model)
			this.tipoRecurso = angular.copy(model.IdTipoRecurso);
		else this.tipoRecurso = 0;
		this.onModelChange({ value: this.model })
	}

	updateComponent(value) {
		if (value) {
			this.modelGuardado = angular.copy(value);
		}
		this.recursoSelected = value;
	}

	limpiarDatos(){
		
		this.updateModel(null)
		//this.modelGuardado = null;
	}

	limpiarGuardado () {
		this.modelGuardado = null;
		this.limpiar = false;
	}

	estadoBuscando(estado){
		this.loading = estado;
		this.buscando = estado;
	}

	limpiarInputBlur(){
		
		// if(this.recursoSelected.length > 1){

		// 	if (!this.recursoSelected.hasOwnProperty('Id')){
		// 		this.AlertaService.NewWarning("Atención", "Usted no selecciono ningun recurso");
		// 	}
		// }

	}

	buscarRecursoEnServicios() {
		this.MantenimientoAgendaLogicService.openConsultaRecursosEnServicios();
	}
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class RecursosSelectorPorMutualController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {

		this.buscadorRecursoEnServiciosIf = (this.buscadorRecursoEnServiciosIf) ? this.buscadorRecursoEnServiciosIf : false;
		this.$log = this.$log.getInstance('RecursosSelectorPorMutualController');
		
		this.$log.debug('ON');

		this.estadoBuscando(true);
		this.CriterioBusquedaTurnoDataService.obtenerNuevoCriterioBusquedaRecursosDelServicio()
			.then(pCriterio => {

				this.$log.debug('obtenerNuevoCriterioBusquedaRecursosDelServicioOK', pCriterio);
				this.criterioDTO = angular.copy(pCriterio);
				this.inicializarWatchs();
				this.estadoBuscando(false);


			}, pError => {
				this.$log.error('obtenerNuevoCriterioBusquedaRecursosDelServicioError', pError);
				this.estadoBuscando(false);

			})
	}

	$onChanges(change) {

		console.log('change',change);

		if (!angular.isUndefined(change.limpiar)) {
			if (change.limpiar.currentValue === true) {
				this.limpiarGuardado();
			}
		}

		if (change.sucursal) {

			if (!change.sucursal.isFirstChange()) {

				this.$log.debug('$onChangeSucursal', change);
				if (this.criterioBusqueda && this.isCriterioListo()) {
					this.limpiarDatos();
					this.armarConsultaRecursos();
					this.busqueda();
				}
			}
		}

		if(change.afiliaciones){
			if(!change.afiliaciones.isFirstChange()){
				this.$log.debug('$onChangeAfiliaciones', change);
				if (this.criterioBusqueda && this.isCriterioListo()) {
					this.limpiarDatos();
					this.armarConsultaRecursos();
					this.busqueda();
				}
			}
		}

		if (change.prestaciones) {
			if (!change.prestaciones.isFirstChange()) {
				this.$log.debug('$onChangePrestaciones', change);
				if (this.criterioBusqueda && this.isCriterioListo()) {
					this.limpiarDatos();
					this.armarConsultaRecursos();
					this.busqueda();
				}
			}
		}

		if (change.criterioBusqueda) {
			if (!change.criterioBusqueda.isFirstChange()) {
				this.$log.debug('$onChangePrestaciones', change);
				if (this.criterioBusqueda && this.isCriterioListo()) {
					this.limpiarDatos();
					this.armarConsultaRecursos();
					this.busqueda();
				}
			}
		}

		
	}
	// #endregion


	// #region /* ----------------------------------------- BUSQUEDA ----------------------------------------- */

	busqueda(){

		if (!this.disabled){

			this.estadoBuscando(true);
			var call;
	
			if (this.criterioDTO.IdSucursal === 0 && this.criterioDTO.IdEspecialidad === 0) {
				//todos los recursos SIN sucursal SIN especialidad
				this.$log.debug('buscando recursos SIN sucursal SIN especialidad ');
				call = this.RecursosDataService.obtenerTodosDeUnServicioConInfoDeAtencion(this.criterioDTO);
	
			} else if (this.criterioDTO.IdEspecialidad === 0) {
				//todos los recursos CON sucursal SIN especialidad
				this.$log.debug('buscando recursosCON sucursal SIN especialidad ');
				call = this.RecursosDataService.obtenerTodosDeUnServicioEnSucursalConInfoDeAtencion(this.criterioDTO);
	
			} else if (this.criterioDTO.IdSucursal === 0) {
				//todos los recursos SIN sucursal CON especialidad
				this.$log.debug('buscando recursos SIN sucursal CON especialidad ');
				call = this.RecursosDataService.obtenerTodosDeUnServicioConEspecialidadConInfoDeAtencion(this.criterioDTO);
	
			} else if (this.criterioDTO.IdSucursal !== 0 && this.criterioDTO.IdEspecialidad !== 0) {
				//todos los recursos CON sucursal CON especialidad
				this.$log.debug('buscando recursos CON sucursal CON especialidad ');
				call = this.RecursosDataService.obtenerTodosDeUnServicioPorSucursalPorEspecialidadConInfoDeAtencion(this.criterioDTO);
	
			}
	
			this.$q.all([call])
				.then(pRecursos => {
					this.$log.debug('recursos obtenidos..', pRecursos[0]);
					this.recursos = angular.copy(pRecursos[0]);
					this.recursosFiltrados = angular.copy(this.recursos.filter(x => x.Atiende === true));
					
					if (this.modelGuardado && this.modelGuardado.Id) {
						if(this.recursosFiltrados.find(x => x.Id === this.modelGuardado.Id)){
							//tengo un recurso
							this.updateModel(this.modelGuardado);
							
							if(this.onBuscarRecursosOk && typeof this.onBuscarRecursosOk === 'function'){
								this.onBuscarRecursosOk();
							}
							
						}
					}
					this.estadoBuscando(false);
				}, pError => {
					this.$log.error('recursos obtenidos ERROR', pError);
					this.estadoBuscando(false);
	
				})
		}
	}


	// #endregion

	// #region /* ----------------------------------------- WATCHS ----------------------------------------- */
	inicializarWatchs(){

		this.scope.$watch( () => this.model, (newValue) => {
			this.updateComponent(newValue);
		})

		this.scope.$watch( () => {
			return this.afiliaciones;
		}, (newValue, oldValue) => {
			
			if (this.criterioBusqueda &&  this.isCriterioListo()) {

				if(newValue){

					this.criterioBusqueda.IdFinanciador = newValue.find(x => x.PorDefecto === true).IdMutual;
					this.criterioBusqueda.IdPlan = newValue.find(x => x.PorDefecto === true).IdPlanMutual;
					this.limpiarDatos();
					this.armarConsultaRecursos();
					this.busqueda();
				}
			}
		}, true);

		this.scope.$watch(() => {
			return this.especialidad;
		}, (newValue, oldValue) => {
			
			if (this.criterioBusqueda && this.isCriterioListo()) {

					this.limpiarDatos();
					this.armarConsultaRecursos();
					this.busqueda();
				
			}
		}, true);

		this.scope.$watch(() => {
			return this.prestaciones;
		}, (newValue, oldValue) => {

			if (this.criterioBusqueda && this.isCriterioListo()) {

				if (newValue) {

					this.limpiarDatos();
					this.armarConsultaRecursos();
					this.busqueda();
				}
			}
		}, true);


		this.scope.$watch(() => {
			return this.limpiar;
		}, (newValue, oldValue) => {

			if(newValue){
				this.limpiarGuardado();
			}
		});

	}

	// #endregion

}