/**
* @author: ppautasso
* @description: controller para componente de indicaciones medicas para farmacia table
* @type: Controller
**/
import * as angular from 'angular';
import {
	IEstadoEjecucionindicacionMedicaDataService, IEstadoFacturacionIndicacionMedicaDataService,
	IEstadoIndicacionMedicaDataService, IEstadoIndicacionmedicaFarmaciaDataService, ITipoIndicacionMedicaDataService, IFarmaciaLogicService, ITipoAntibioticoDataDataService
} from '../../../services';
import { IEstadoEjecucionIndicacionMedica, IEstadoFacturacionIndicacionMedica, IEstadoIndicacionMedica, IEstadoIndicacionMedicaFarmacia } from '../../../models/dto';

export class IndicacionesMedicasFarmaciaTableController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	data;
	dataFilter;
	columnasList;
	loading;
	internado;
	facturarDevolverIf;
	// estadosData
	estadosEjecucionIndicacionMedica: Array<IEstadoEjecucionIndicacionMedica> = [];
	estadosFacturacionIndicacionMedica: Array<IEstadoFacturacionIndicacionMedica> = [];
	estadosIndicacionMedica: Array<IEstadoIndicacionMedica> = [];
	estadosIndicacionMedicaFarmacia: Array<IEstadoIndicacionMedicaFarmacia> = [];
	tiposIndicacionMedica;
	tiposAntibioticos;

	// FILTERS
	mostrarFiltros: boolean = true;
	filterProducto: string = "";
	filterTipoIndMed: string = "";
	filterDescripcion: string = "";
	filterFarmacia: string = "";

	// segunda tabla
	verAgregados: boolean = false;

	prepararIndicacionClick;
	cambiarProductoClick;
	cambiarProductoAgregadoClick;
	eliminarDescartableClick;
	asignarProductoClick;
	desasignarProductoClick;
	// #endregion

	// #region pagination

	paginacion = {
		currentPage: 0,
		pageSize: 0,
		totalItems: 0,
	};

	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', '$q',
		'EstadoEjecucionindicacionMedicaDataService',
		'EstadoFacturacionIndicacionMedicaDataService',
		'EstadoIndicacionMedicaDataService',
		'EstadoIndicacionmedicaFarmaciaDataService',
		'TipoIndicacionMedicaDataService',
		'FarmaciaLogicService',
		'TipoAntibioticoDataDataService'];
	/**
	* @class IndicacionesMedicasFarmaciaTableController
	* @constructor
	*/
	constructor(private $log: ILogger, private $q,
		private EstadoEjecucionindicacionMedicaDataService: IEstadoEjecucionindicacionMedicaDataService,
		private EstadoFacturacionIndicacionMedicaDataService: IEstadoFacturacionIndicacionMedicaDataService,
		private EstadoIndicacionMedicaDataService: IEstadoIndicacionMedicaDataService,
		private EstadoIndicacionmedicaFarmaciaDataService: IEstadoIndicacionmedicaFarmaciaDataService,
		private TipoIndicacionMedicaDataService: ITipoIndicacionMedicaDataService,
		private FarmaciaLogicService: IFarmaciaLogicService,
		private TipoAntibioticoDataDataService: ITipoAntibioticoDataDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	setData() {

		this.loading = true;

		if (this.data) {
			for (let index = 0; index < this.data.length; index++) {

				this.data[index].showSubData = false;

				this.data[index].EstadoIndicacion = angular.copy(this.estadosIndicacionMedica.find(x => x.Id === this.data[index].IdEstado));
				// this.estadosIndicacionMedica.forEach(estadoIndicacion => {

				// seteo los estados de indicacion medica farmacia para cada indicacion
				this.data[index].EstadoIndicacionFarmacia = angular.copy(this.estadosIndicacionMedicaFarmacia.find(x => x.Id === this.data[index].IdEstadoFarmacia));
				if (!this.data[index].EstadoIndicacionFarmacia) {
					this.data[index].EstadoIndicacionFarmacia = {};
					this.data[index].EstadoIndicacionFarmacia.Nombre = "";
					this.data[index].EstadoIndicacionFarmacia.Id = 0;
				}

				// seteo los estados de ejecucion para cada indicacion
				this.data[index].EstadoEjecucion = angular.copy(this.estadosEjecucionIndicacionMedica.find(x => x.Id === this.data[index].IdEstadoEjecucion));

				// seteo los estados de facturacion para cada indicacion
				this.data[index].EstadoFacturacion = angular.copy(this.estadosFacturacionIndicacionMedica.find(x => x.Id === this.data[index].IdEstadoFacturacion));

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
							this.data[index].Producto.CodigoStockeable + ' - ' + this.capitalizeFirstLetter(this.data[index].Producto.NombreStockeable.toLowerCase())
							+ ' - ' + this.data[index].Producto.PresentacionStockeable;
					}
					
					//seteo los datos de tipos de antibioticos
					// si es 0 no es antibiotico
					if(this.data[index].Agregados && this.data[index].Agregados.length){
						this.data[index].Agregados.forEach(agregado => {
							if (agregado.Producto && agregado.Producto.IdTipoAntibiotico && agregado.Producto.IdTipoAntibiotico !== 0) {
								agregado.Producto.TipoAntibiotico = this.tiposAntibioticos.find(x => x.Id == agregado.Producto.IdTipoAntibiotico);
							}
						});
					}

				} else {

					// seteo el codigo - nombreproducto - presentacion en un solo campo
					if (this.data[index].Producto) {
						this.data[index].descripcionProducto =
							this.data[index].Producto.CodigoStockeable + ' - ' + this.capitalizeFirstLetter(this.data[index].Producto.NombreStockeable.toLowerCase())
							+ ' - ' + this.data[index].Producto.PresentacionStockeable;

					} else if (this.data[index].Descripcion) {
						this.data[index].descripcionProducto = (this.data[index].Descripcion);
					}

					//seteo los datos de tipos de antibioticos
					// si es 0 no es antibiotico
					if (this.data[index].Producto && this.data[index].Producto.IdTipoAntibiotico && this.data[index].Producto.IdTipoAntibiotico !== 0) {
						this.data[index].Producto.TipoAntibiotico = this.tiposAntibioticos.find(x => x.Id == this.data[index].Producto.IdTipoAntibiotico);
					}
				}

				// seteo los datos de las ejecuciones
				if (this.data[index].Ejecuciones && this.data[index].Ejecuciones.length) {
					this.data[index].Ejecuciones.forEach(ejecucion => {
						// seteo fecha ejecucion en null o no
						if (this.esFechaInvalida(ejecucion.FechaEjecucion))
							ejecucion.FechaEjecucion = "-";
						// seteo estado de facturacion
						ejecucion.EstadoFacturacion = this.estadosFacturacionIndicacionMedica.find(x => x.Id === ejecucion.IdEstadoFacturacion);
						// seteo estado ejecucion
						ejecucion.EstadoEjecucion = this.estadosEjecucionIndicacionMedica.find(x => x.Id === ejecucion.IdEstadoEjecucion)

					});
				}


				// seteo los datos de los agregados
				if (this.data[index].Agregados && this.data[index].Agregados.length) {
					this.data[index].Agregados.forEach(agregado => {
						// seteo estado de farmacia
						agregado.EstadoFarmacia = this.estadosIndicacionMedicaFarmacia.find(x => x.Id === agregado.IdEstadoFarmacia);
						// seteo estado de facturacion
						agregado.EstadoFacturacion = this.estadosFacturacionIndicacionMedica.find(x => x.Id === agregado.IdEstadoFacturacion);

					});
				}


				// seteo los datos de los descartables
				if (this.data[index].Descartables && this.data[index].Descartables.length) {
					this.data[index].Descartables.forEach(descartable => {
						descartable.EstadoFacturacion = this.estadosFacturacionIndicacionMedica.find(x => x.Id === descartable.IdEstadoFacturacion);
					});
				}


			}
		}

		this.pageChanged();
		this.loading = false;
	}
	// #endregion

	// #region FILTRADO DATOS

	getItemsFiltered() {

		let estadosActivos = this.estadosIndicacionMedica.filter(x => x.Activado).map(e => {
			return e.Id;
		});

		let estadosEjecucion = this.estadosEjecucionIndicacionMedica.filter(x => x.Activado).map(e => {
			return e.Id;
		});

		let estadosFacturacion = this.estadosFacturacionIndicacionMedica.filter(x => x.Activado).map(e => {
			return e.Id;
		});

		this.dataFilter = angular.copy(this.data.filter(x =>
			// filtro tipo indicacion
			x.TipoIndicacion.Nombre.includes(this.capitalizeFirstLetter(this.filterTipoIndMed)) &&
			// filtro de descripcion del producto
			x.descripcionProducto.includes(this.capitalizeFirstLetter(this.filterProducto)) &&
			// filtro de estao indicacion farmacia
			x.EstadoIndicacionFarmacia.Nombre.includes(this.capitalizeFirstLetter(this.filterFarmacia))
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

		if (estadosFacturacion && estadosFacturacion.length) {

			this.dataFilter = angular.copy(this.dataFilter.filter(x =>
				// filtro estado de la indicacion medica
				estadosFacturacion.some(e => x.EstadoFacturacion && e === x.EstadoFacturacion.Id)
			));
		}

	}

	limpiarFiltros() {
		this.filterProducto = '';
		this.filterTipoIndMed = '';
		this.filterFarmacia = '';
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

	changeCheckAccion(indicacion, item, facturarODevolver, tipo) {
		if (facturarODevolver == 1) {
			// voy a facturar => limpio el devolver
			item.Devolver = false;
		}
		if (facturarODevolver == 2) {
			// voy a Devolver => limpio el devolver
			item.Facturar = false;
		}

		// le tengo que asignar al data
		// consulto que tipo de TipoIndicacion es 
		if (tipo == 1) //es una EJECUCION
		{
			if (this.data.find(x => x.Id === indicacion.Id).Ejecuciones) {
				this.data.find(x => x.Id === indicacion.Id).Ejecuciones.find(e => e.Id === item.Id).Devolver = angular.copy(item.Devolver);
				this.data.find(x => x.Id === indicacion.Id).Ejecuciones.find(e => e.Id === item.Id).Facturar = angular.copy(item.Facturar);
			}
		}

		if (tipo == 2) //es un DESCARTABLE
		{
			if (this.data.find(x => x.Id === indicacion.Id).Descartables) {
				this.data.find(x => x.Id === indicacion.Id).Descartables.find(e => e.Id === item.Id).Devolver = angular.copy(item.Devolver);
				this.data.find(x => x.Id === indicacion.Id).Descartables.find(e => e.Id === item.Id).Facturar = angular.copy(item.Facturar);
			}
		}

		if (tipo == 3) //es un AGREGADO
		{
			if (this.data.find(x => x.Id === indicacion.Id).Agregados) {
				this.data.find(x => x.Id === indicacion.Id).Agregados.find(e => e.Id === item.Id).Devolver = angular.copy(item.Devolver);
				this.data.find(x => x.Id === indicacion.Id).Agregados.find(e => e.Id === item.Id).Facturar = angular.copy(item.Facturar);
			}
		}
	}


	// #endregion

	// #region /* ------------------------------------------ BOTONERA ------------------------------------------ */
	verDetalle(indicacionMedica) {

		this.FarmaciaLogicService.openVerDetalleIndicacionMedicaFarmacia(indicacionMedica);
	}

	prepararIndicacion(indicacionMedica) {
		this.prepararIndicacionClick(indicacionMedica);
	}

	cambiarProductoIndicacion(indicacionMedica) {
		this.cambiarProductoClick(indicacionMedica);
	}

	cambiarProductoAgregado(agregado) {
		this.cambiarProductoAgregadoClick(agregado);
	}

	eliminarDescartable(descartable) {
		this.eliminarDescartableClick(descartable);
	}

	asignarProductoIndicacion(indicacionMedica) {
		this.asignarProductoClick(indicacionMedica);
	}

	desasignarProductoIndicacion(indicacionMedica) {
		this.desasignarProductoClick(indicacionMedica);
	}
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class IndicacionesMedicasFarmaciaTableController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('IndicacionesMedicasFarmaciaTableController');
		this.$log.debug('ON');


		this.loading = true;
		let _EstadoEjecucionindicacionMedicaDataService = this.EstadoEjecucionindicacionMedicaDataService.getAll();
		let _EstadoFacturacionIndicacionMedicaDataService = this.EstadoFacturacionIndicacionMedicaDataService.getAll();
		let _EstadoIndicacionMedicaDataService = this.EstadoIndicacionMedicaDataService.getAll();
		let _EstadoIndicacionmedicaFarmaciaDataService = this.EstadoIndicacionmedicaFarmaciaDataService.getAll();
		let _TipoIndicacionMedicaDataService = this.TipoIndicacionMedicaDataService.getAll();
		let _TipoAntibioticoDataService = this.TipoAntibioticoDataDataService.getAll();

		this.$q.all([
			_EstadoEjecucionindicacionMedicaDataService,
			_EstadoFacturacionIndicacionMedicaDataService,
			_EstadoIndicacionMedicaDataService,
			_EstadoIndicacionmedicaFarmaciaDataService,
			_TipoIndicacionMedicaDataService,
			_TipoAntibioticoDataService
		])
			.then((activateResult) => {
				this.$log.debug('activateResult', activateResult);
				this.estadosEjecucionIndicacionMedica = angular.copy(activateResult[0]);
				this.estadosFacturacionIndicacionMedica = angular.copy(activateResult[1]);
				this.estadosIndicacionMedica = angular.copy(activateResult[2]);
				this.estadosIndicacionMedicaFarmacia = angular.copy(activateResult[3]);
				this.tiposIndicacionMedica = angular.copy(activateResult[4]);
				this.tiposAntibioticos = angular.copy(activateResult[5]);

				this.paginacion.currentPage = 1;
				this.paginacion.pageSize = 200;
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