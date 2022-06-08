/**
* @author: ppautasso
* @description: controller para el componente de indicaciones medicas table
* @type: Controller
**/
import * as angular from 'angular';
import { IIndicacionMedicaEnfermeriaDto } from '../../../models';
import { IEstadoEjecucionindicacionMedicaDataService, IEstadoIndicacionMedicaDataService, ITipoIndicacionMedicaDataService, ITipoAntibioticoDataDataService, IFarmaciaLogicService } from 'src/app/allendeModules/farmacia/services';
import { IEstadoEjecucionIndicacionMedica, IEstadoIndicacionMedica } from 'src/app/allendeModules/farmacia/models/dto';

export class IndicacionesMedicasEnfermeriaTableController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	data: Array<IIndicacionMedicaEnfermeriaDto> = [];;
	dataFilter;
	columnasList;
	loading;
	internado;

	//tienePendienteFiltro: boolean = true;

	estadosEjecucionIndicacionMedica: Array<IEstadoEjecucionIndicacionMedica> = [];
	estadosIndicacionMedica: Array<IEstadoIndicacionMedica> = [];
	tiposIndicacionMedica;
	tiposAntibioticos;
	
	// FILTERS
	
	private _mostrarFiltros : boolean = false;
	public get mostrarFiltros() : boolean {
		return this._mostrarFiltros;
	}
	public set mostrarFiltros(v : boolean) {
		this._mostrarFiltros = v;
		if (v == false) { 
			this.limpiarFiltros();
		}
	}
	
	
	filterProducto: string = "";
	filterTipoIndMed: string = "";
	filterDescripcion: string = "";
	// #endregion
	imprimirZebraClick;
	colocarSueroClick;
	suministrarClick;
	verSuerosCargadosClick;

	// #region pagination

	paginacion = {
		currentPage: 0,
		pageSize: 0,
		totalItems: 0,
	};

	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'EstadoEjecucionindicacionMedicaDataService',
		'EstadoIndicacionMedicaDataService', '$q',
		'TipoIndicacionMedicaDataService', 'TipoAntibioticoDataDataService', 'FarmaciaLogicService'];
	/**
	* @class IndicacionesMedicasEnfermeriaTableController
	* @constructor
	*/
	constructor(private $log: ILogger,
		private EstadoEjecucionindicacionMedicaDataService: IEstadoEjecucionindicacionMedicaDataService,
		private EstadoIndicacionMedicaDataService: IEstadoIndicacionMedicaDataService,
		private $q,
		private TipoIndicacionMedicaDataService: ITipoIndicacionMedicaDataService,
		private TipoAntibioticoDataDataService: ITipoAntibioticoDataDataService,
		private FarmaciaLogicService:IFarmaciaLogicService

	) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	setData() {

		this.loading = true;

		if (this.data) {
			for (let index = 0; index < this.data.length; index++) {

				this.data[index].showSubData = false;

				this.data[index].EstadoIndicacion = angular.copy(this.estadosIndicacionMedica.find(x => x.Id === this.data[index].IdEstado));

				// seteo los estados de ejecucion para cada indicacion
				this.data[index].EstadoEjecucion = angular.copy(this.estadosEjecucionIndicacionMedica.find(x => x.Id === this.data[index].IdEstadoEjecucion));

				// seteo el tipo de indicacion medica
				this.tiposIndicacionMedica.forEach(tipoIndicacion => {
					if (this.data[index].IdTipoConcepto === tipoIndicacion.Id)
						this.data[index].TipoIndicacion = tipoIndicacion;
				});

				// tenemos una infusion -> mostramos Descripcion || Producto
				if (this.data[index].IdTipoIndicacion == 2) {
					// seteo el codigo - nombreproducto - presentacion en un solo campo

					this.data[index].descripcionProducto = (this.data[index].Descripcion);
					if (this.data[index].Producto) {
						this.data[index].descripcionProducto = this.data[index].descripcionProducto + ' || ' +
							this.capitalizeFirstLetter(this.data[index].Producto.NombreStockeable.toLowerCase())
							+ ' - ' + this.data[index].Producto.PresentacionStockeable;
						
						
					}

					//seteo los datos de tipos de antibioticos
					// si es 0 no es antibiotico
					if (this.data[index].Agregados && this.data[index].Agregados.length) {
						this.data[index].Agregados.forEach(agregado => {
							if (agregado.Producto && agregado.Producto.IdTipoAntibiotico && agregado.Producto.IdTipoAntibiotico !== 0) {
								agregado.Producto.TipoAntibiotico = this.tiposAntibioticos.find(x => x.Id == agregado.Producto.IdTipoAntibiotico);
							}

						});
					}

				} else {
					// tenemos una dosificacion -> 
					// seteo el codigo - nombreproducto - presentacion en un solo campo
					if (this.data[index].Producto) {
						this.data[index].descripcionProducto =
							this.capitalizeFirstLetter(this.data[index].Producto.NombreStockeable.toLowerCase())
							+ ' - ' + this.data[index].Producto.PresentacionStockeable;
						this.data[index].monodroga = this.data[index].Producto.Droga;

					} else if (this.data[index].Descripcion) {
						this.data[index].descripcionProducto = (this.data[index].Descripcion);
					}

					//seteo los datos de tipos de antibioticos
					// si es 0 no es antibiotico
					if (this.data[index].Producto && this.data[index].Producto.IdTipoAntibiotico && this.data[index].Producto.IdTipoAntibiotico !== 0) {
						this.data[index].Producto.TipoAntibiotico = this.tiposAntibioticos.find(x => x.Id == this.data[index].Producto.IdTipoAntibiotico);
					}

					//voy a setear la monodroga de las dosificaciones
					
				}

				// seteo los datos de las ejecuciones
				if (this.data[index].Ejecuciones && this.data[index].Ejecuciones.length) {
					this.data[index].Ejecuciones.forEach(ejecucion => {
						// seteo fecha ejecucion en null o no
						if (this.esFechaInvalida(ejecucion.FechaEjecucion))
							ejecucion.FechaEjecucion = "-";

						// seteo estado ejecucion
						ejecucion.EstadoEjecucion = this.estadosEjecucionIndicacionMedica.find(x => x.Id === ejecucion.IdEstadoEjecucion)

					});
				}

			}
		}

		// this.data.sort( (a, b) => {
		// 	return ('' + b.TipoIndicacion.Nombre).localeCompare(a.TipoIndicacion.Nombre);
		// });

		this.pageChanged();
		this.loading = false;
	}

	// #region FILTRADO DATOS

	getItemsFiltered() {

		let estadosActivos = this.estadosIndicacionMedica.filter(x => x.Activado).map(e => {
			return e.Id;
		});

		let estadosEjecucion = this.estadosEjecucionIndicacionMedica.filter(x => x.Activado).map(e => {
			return e.Id;
		});

		this.dataFilter = angular.copy(this.data.filter(x =>
			// filtro tipo indicacion
			x.TipoIndicacion.Nombre.includes(this.capitalizeFirstLetter(this.filterTipoIndMed)) &&
			// filtro de descripcion del producto
			x.descripcionProducto.includes(this.capitalizeFirstLetter(this.filterProducto))
			
		));

		if (estadosActivos && estadosActivos.length) {

			this.dataFilter = angular.copy(this.dataFilter.filter(x =>
				// filtro estado de la indicacion medica
				estadosActivos.some(e => x.EstadoIndicacion && e === x.EstadoIndicacion.Id)
			));
		}

		if (estadosEjecucion && estadosEjecucion.length) {

			this.dataFilter = angular.copy(this.dataFilter.filter(x =>
				// filtro estado de la indicacion medica
				estadosEjecucion.some(e => x.EstadoEjecucion && e === x.EstadoEjecucion.Id)
			));
		}


		// if(this.tienePendienteFiltro){
		// 	this.dataFilter = angular.copy(this.dataFilter.filter(x => x.TienePendiente));
		// }
	}

	limpiarFiltros() {
		this.filterProducto = '';
		this.filterTipoIndMed = '';

		this.getItemsFiltered();
	}

	capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	pageChanged() {
		var begin = ((this.paginacion.currentPage - 1) * this.paginacion.pageSize);
		var end = begin + this.paginacion.pageSize;
		this.getItemsFiltered();

		this.paginacion.totalItems = this.data.length;
		this.dataFilter = this.dataFilter.slice(begin, end);
	}


	imprimirZebra(indicacionMedica) {
		this.imprimirZebraClick(indicacionMedica);
	}

	colocarSuero(indicacionMedica) {
		this.colocarSueroClick(indicacionMedica);
	}

	suministrar(ejecucion){
		this.suministrarClick(ejecucion);
	}

	verSueros(indicacionMedica){
		this.verSuerosCargadosClick(indicacionMedica);
	}
	// #endregion

	// #region /* ------------------------------------------ SUPPORT ------------------------------------------ */
	verSubDatosIndicacion(indicacionMedica) {

		// this.dataFilter.forEach(indicacion => {
		// 	indicacion.showSubData = false;
		// });

		indicacionMedica.showSubData = !indicacionMedica.showSubData;
		indicacionMedica.backgroundClass = !indicacionMedica.backgroundClass;
	}

	esFechaInvalida(fecha) {
		let ret = false;
		if (fecha) {
			if (fecha.includes("0001-01-01")) ret = true;
		}
		return ret;
	}

	verDetalle(indicacionMedica) {
		this.FarmaciaLogicService.openVerDetalleIndicacionMedicaFarmacia(indicacionMedica);
	}

	// #endregion
	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class IndicacionesMedicasEnfermeriaTableController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('IndicacionesMedicasEnfermeriaTableController');
		this.$log.debug('ON');


		this.loading = true;
		let _EstadoEjecucionindicacionMedicaDataService = this.EstadoEjecucionindicacionMedicaDataService.getAll();

		let _EstadoIndicacionMedicaDataService = this.EstadoIndicacionMedicaDataService.getAll();

		let _TipoIndicacionMedicaDataService = this.TipoIndicacionMedicaDataService.getAll();
		let _TipoAntibioticoDataService = this.TipoAntibioticoDataDataService.getAll();

		this.$q.all([
			_EstadoEjecucionindicacionMedicaDataService,
			_EstadoIndicacionMedicaDataService,
			_TipoIndicacionMedicaDataService,
			_TipoAntibioticoDataService
		])
			.then((activateResult) => {
				this.$log.debug('activateResult', activateResult);

				this.estadosEjecucionIndicacionMedica = angular.copy(activateResult[0]);

				this.estadosIndicacionMedica = angular.copy(activateResult[1]);

				this.tiposIndicacionMedica = angular.copy(activateResult[2]);
				this.tiposAntibioticos = angular.copy(activateResult[3]);

				this.paginacion.currentPage = 1;
				this.paginacion.pageSize = 300;
				this.paginacion.totalItems = 0;

				this.loading = false;
			}, (pError) => {
				this.$log.error('pError', pError);
				this.loading = false;
			});
	}

	$onChanges(change) {
		console.log('change', change);

		if (change.data) {
			if (change.data.currentValue) {
				this.setData();
			}
		}

	}
	// #endregion
}