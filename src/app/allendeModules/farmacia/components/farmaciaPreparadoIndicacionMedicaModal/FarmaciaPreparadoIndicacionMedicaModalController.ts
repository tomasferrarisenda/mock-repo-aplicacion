/**
* @author: ppautasso
* @description: controller para preparar indicacion medica controller
* @type: Controller
**/
import * as angular from 'angular';
import { IValidacionIndicacionMedicaDataService, IEstadoIndicacionmedicaFarmaciaDataService, ICambiarEstadoFarmaciaIndicacionMedicaDataService, IEstadoEjecucionindicacionMedicaDataService, IEstadoFacturacionIndicacionMedicaDataService } from '../../services';
import { IInfusionEditDto } from '../../models/dto/InfusionEditDto';
import { IDosificacionEditDto } from '../../models/dto';

export class FarmaciaPreparadoIndicacionMedicaModalController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	loading: boolean = false;
	dismiss;
	close;
	resolve;
	// mas propiedades ..
	internado;
	indicacionMedica;
	sucursal;
	infusion: IInfusionEditDto = {};
	dosificacion: IDosificacionEditDto = {};
	entidad;
	estadosIndicacionMedicaFarmacia;
	estadosFarmaciaParaCambiar;
	estadosEjecucionIndicacionMedica
	estadosFacturacionIndicacionMedica
	stockeable;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', '$q', 'ValidacionIndicacionMedicaDataService', 
	'ModalService', 'AlertaService',
	'EstadoIndicacionmedicaFarmaciaDataService',
	'CambiarEstadoFarmaciaIndicacionMedicaDataService', 
	'EstadoEjecucionindicacionMedicaDataService',
	'EstadoFacturacionIndicacionMedicaDataService'];
	/**
	* @class FarmaciaPreparadoIndicacionMedicaModalController
	* @constructor
	*/
	constructor(private $log: ILogger,private $q, private ValidacionIndicacionMedicaDataService:IValidacionIndicacionMedicaDataService, 
		private ModalService:IModalService, private AlertaService:IAlertaService,
		private EstadoIndicacionmedicaFarmaciaDataService:IEstadoIndicacionmedicaFarmaciaDataService,
		private CambiarEstadoFarmaciaIndicacionMedicaDataService:ICambiarEstadoFarmaciaIndicacionMedicaDataService, 
		private EstadoEjecucionindicacionMedicaDataService:IEstadoEjecucionindicacionMedicaDataService,
		private EstadoFacturacionIndicacionMedicaDataService:IEstadoFacturacionIndicacionMedicaDataService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	activate(){

		this.loading = true;
		let entidadParaEditar;

		if(this.indicacionMedica.TipoIndicacion.Id == 1){ //es una dosificacion -> la obtengo para editar
			entidadParaEditar = this.ValidacionIndicacionMedicaDataService.obtenerDosificacionPorId(this.indicacionMedica.Id, this.sucursal.Id);

		}else if(this.indicacionMedica.TipoIndicacion.Id == 2){ //es una infusion - la obtengo para editar
			entidadParaEditar = this.ValidacionIndicacionMedicaDataService.obtenerInfusionPorId(this.indicacionMedica.Id, this.sucursal.Id);
		}

		let _EstadoIndicacionmedicaFarmaciaDataService = this.EstadoIndicacionmedicaFarmaciaDataService.getAll();
		let _estadosFarmaciaPosiblesParaCambiar = 
		this.CambiarEstadoFarmaciaIndicacionMedicaDataService.obtenerEstadosPosiblesParaCambiar(this.indicacionMedica.TipoIndicacion.Id, this.indicacionMedica.Id, this.sucursal.Id);
		let _EstadoEjecucionindicacionMedicaDataService = this.EstadoEjecucionindicacionMedicaDataService.getAll();
		let _EstadoFacturacionIndicacionMedicaDataService = this.EstadoFacturacionIndicacionMedicaDataService.getAll();

		this.$q.all([entidadParaEditar, _EstadoIndicacionmedicaFarmaciaDataService, _estadosFarmaciaPosiblesParaCambiar, 
			_EstadoEjecucionindicacionMedicaDataService, _EstadoFacturacionIndicacionMedicaDataService])
		.then( (pResult) => {

			this.$log.debug('pResult',pResult);
			this.entidad = Object.assign({}, pResult[0]);
			if(this.indicacionMedica.TipoIndicacion.Id == 1) this.dosificacion = Object.assign({}, pResult[0]);
			else if(this.indicacionMedica.TipoIndicacion.Id == 2) this.infusion = Object.assign({}, pResult[0]);

			// if(this.dosificacion && this.dosificacion.Ejecuciones){
			// 	this.dosificacion.Ejecuciones.forEach(ejecucion => {
			// 		ejecucion.Cantidad = 0;
			// 	});
			// }

			// if(this.infusion && this.infusion.Agregados){
			// 	this.infusion.Agregados.forEach(infu => {
			// 		infu.Cantidad = 0;
			// 	});
			// }

			// this.estadosIndicacionMedicaFarmacia = Object.assign({}, pResult[1]);
			this.estadosIndicacionMedicaFarmacia = angular.copy(pResult[1]) ;
			this.entidad.EstadoIndicacionFarmacia = this.estadosIndicacionMedicaFarmacia.find(x => x.Id === this.entidad.IdEstadoFarmacia);

			this.estadosFarmaciaParaCambiar = angular.copy(pResult[2]);
			
			this.estadosEjecucionIndicacionMedica = angular.copy(pResult[3]);
			this.entidad.EstadoEjecucion = this.estadosEjecucionIndicacionMedica.find(x => x.Id === this.entidad.IdEstadoEjecucion);

			this.estadosFacturacionIndicacionMedica = angular.copy(pResult[4]);
			this.entidad.EstadoFacturacion = this.estadosFacturacionIndicacionMedica.find(x => x.Id === this.entidad.IdEstadoFacturacion);

			this.setDataIdentidad();

			this.$log.debug('entidad detalle',this.entidad);

			this.loading = false;
		}, (pError) => {
			this.$log.error('pError',pError);
			this.loading = false;
		});

	}

	actualizarDatos(solicitud){

		this.loading = true;
		let entidadParaEditar;

		if(this.indicacionMedica.TipoIndicacion.Id == 1){ //es una dosificacion -> la obtengo para editar
			entidadParaEditar = this.ValidacionIndicacionMedicaDataService.obtenerDosificacionPorId(this.indicacionMedica.Id, this.sucursal.Id);

		}else if(this.indicacionMedica.TipoIndicacion.Id == 2){ //es una infusion - la obtengo para editar
			entidadParaEditar = this.ValidacionIndicacionMedicaDataService.obtenerInfusionPorId(this.indicacionMedica.Id, this.sucursal.Id);
		}

		entidadParaEditar
		.then( (pResult) => {
			this.$log.debug('pResult',pResult);

			if(solicitud === 1) // tengo solicitud para modificar el estado de indicacion
			{
				this.entidad.Agregados.forEach(agregado => {
					//agregado.EstadoIndicacionFarmacia = this.estadosIndicacionMedicaFarmacia.find(x => x.Id === pResult.IdEstadoFarmacia);	
					agregado.EstadoFarmacia = this.estadosIndicacionMedicaFarmacia.find(x => x.Id === pResult.Agregados.find(x => x.Id == agregado.Id).IdEstadoFarmacia)
				});
				//this.entidad.EstadoIndicacionFarmacia = this.estadosIndicacionMedicaFarmacia.find(x => x.Id === pResult.IdEstadoFarmacia);
			}
			else if(solicitud === 2) // tengo solicitud para agregar un producto
			{	
				
				if(this.dosificacion.Descartables && this.dosificacion.Descartables.length == 0){
					// tengo un solo meidcamento por ende lo agrego y listo
					this.dosificacion.Descartables = (pResult.Descartables);
				}else {
					// tengo varios medicamentos por ende tengo que guardarlos y agregar solo el nuevo

					if(this.dosificacion && this.dosificacion.Descartables) {


						let idsDescartablesExistentes: number[] = this.dosificacion.Descartables.map(d => d.Producto.IdStockeable);
						let idsDescatablesNuevos: number[] = pResult.Descartables.map(d => d.Producto.IdStockeable);

						let idsAAgregar = idsDescatablesNuevos.find(d => !idsDescartablesExistentes.some(de => de === d));
					
						if(idsAAgregar){

							this.dosificacion.Descartables.push(pResult.Descartables.find(x => x.Producto.IdStockeable == idsAAgregar));
						}
							
							
					}
				}

			}

			this.loading = false;

		}, (pError) => {
			this.$log.error('pError',pError);
			this.loading = false;
		});
	}

	
	suma(item) {
		this.$log.debug('sumando 1...', item);
		if(item.PuedeCargar){
			item.CantidadCargada = item.CantidadCargada + 1
		}
	}

	resta(item) {
		this.$log.debug('resta valor', item);
		if(item.PuedeCargar){
			if (item.CantidadCargada > 0)
				item.CantidadCargada = item.CantidadCargada - 1;
		}
	}

	restaTodas(items){
		items.forEach(item => {
			this.resta(item);
		});
	}

	sumaTodas(items){
		items.forEach(item => {
			this.suma(item);
		});
	}

	guardar(){
		
		let _editEntidad;
		this.loading = true;


		if(this.indicacionMedica.TipoIndicacion.Id == 1){ //es una dosificacion 
			this.dosificacion.ObservacionFarmacia = this.entidad.ObservacionFarmacia;
			_editEntidad = this.ValidacionIndicacionMedicaDataService.editarDosificacion(this.dosificacion);
			

		}else if(this.indicacionMedica.TipoIndicacion.Id == 2){ //es una infusion 
			this.infusion.ObservacionFarmacia = this.entidad.ObservacionFarmacia;
			this.infusion.CantidadCargada = this.entidad.CantidadCargada;
			_editEntidad = this.ValidacionIndicacionMedicaDataService.editarInfusion(this.infusion);
		}
		this.$q.all([_editEntidad])
		.then( (pResult) => {
			this.$log.debug('pResult',pResult);
			this.AlertaService.NewSuccess("Indicación Preparada con exito");
			this.cerrar(true);
			this.loading = false;
		}, (pError) => {
			this.$log.error('pError',pError);
			this.loading = false;
		});

	}

	// #endregion


	// #region SUPPORT
	cancel() {
        this.dismiss({ $value: 'cancel' });
	}

	cerrar(pClose){
		this.close({ $value: pClose });
	}
	
	changeEstadoFarmacia(){

		let options: Array<any> = [];

		this.estadosFarmaciaParaCambiar.forEach(estado => {
			options.push({
				id: estado.Id,
				label: estado.Nombre
			})
		});

		this.ModalService.selectOptionModal(options).then((opcionElegida) => {
			this.$log.debug('opcion elegida',opcionElegida);
			this.loading = true;
			this.CambiarEstadoFarmaciaIndicacionMedicaDataService.cambiarEstadoFarmaciaIndicacionMedica(this.indicacionMedica.TipoIndicacion.Id, this.indicacionMedica.Id, this.sucursal.Id, opcionElegida.id)
			.then( (pResultCambiarEstado) => {
				this.$log.debug('pResultCambiarEstado',pResultCambiarEstado);
				this.AlertaService.NewSuccess("Cambio de estado de Farmacia Correctamente");
				this.activate();
				this.loading = false;
			}, (pError) => {
				this.$log.error('pError',pError);
				this.loading = false;
			});
		});
	}

	cambiarEstadoAgregado(agregado){
		let options: Array<any> = [];

		this.loading = true;
		this.CambiarEstadoFarmaciaIndicacionMedicaDataService.obtenerEstadosPosiblesParaCambiar(agregado.IdTipoConcepto, agregado.Id, this.sucursal.Id)
		.then( (pResult) => {
			this.$log.debug('pResult',pResult);
			this.loading = false;
			if(pResult){
				pResult.forEach(estado => {
					options.push({
						id: estado.Id,
						label: estado.Nombre
					})
				});
		
				this.ModalService.selectOptionModal(options).then((opcionElegida) => {
					this.$log.debug('opcion elegida',opcionElegida);
					this.loading = true;
					this.CambiarEstadoFarmaciaIndicacionMedicaDataService.cambiarEstadoFarmaciaIndicacionMedica(agregado.IdTipoConcepto, agregado.Id, this.sucursal.Id, opcionElegida.id)
					.then( (pResultCambiarEstado) => {
						this.$log.debug('pResultCambiarEstado',pResultCambiarEstado);
						this.AlertaService.NewSuccess("Cambio de estado de Agregado Correctamente");
						this.actualizarDatos(1);
						this.loading = false;
					}, (pError) => {
						this.$log.error('pError',pError);
						this.loading = false;
					});
				});
			}else {
				this.AlertaService.NewWarning("No existen estados para cambiar");
			}


		}, (pError) => {
			this.$log.error('pError',pError);
			this.loading = false;
		});

		
	}
	
	nuevoProducto(){
		this.loading = true;
		this.ValidacionIndicacionMedicaDataService.agregarDescartableADosificacion(this.indicacionMedica.Id, this.sucursal.Id, this.stockeable.Id, this.stockeable.IdTipoStockeable)
		.then( (pResultAgregarDescartable) => {
			this.$log.debug('pResultAgregarDescartable',pResultAgregarDescartable);
			this.AlertaService.NewSuccess("Producto agregado con exito");
			delete this.stockeable;
			this.actualizarDatos(2);
			this.loading = false;
		}, (pError) => {
			this.$log.error('pError',pError);
			this.loading = false;
		});
	}


	setDataIdentidad(){

		if(this.entidad.Ejecuciones && this.entidad.Ejecuciones.length){
			this.entidad.Ejecuciones.forEach(ejecucion => {
				ejecucion.EstadoEjecucion = this.estadosEjecucionIndicacionMedica.find(x => x.Id ===ejecucion.IdEstadoEjecucion);
				ejecucion.EstadoFacturacion = this.estadosFacturacionIndicacionMedica.find(x => x.Id ===ejecucion.IdEstadoFacturacion);
			});
		}

		if(this.entidad.Descartables && this.entidad.Descartables.length){
			this.entidad.Descartables.forEach(descartable => {
				descartable.EstadoFacturacion = this.estadosFacturacionIndicacionMedica.find(x => x.Id === descartable.IdEstadoFacturacion);
			});
		}

		if(this.entidad.Agregados && this.entidad.Agregados.length){
			this.entidad.Agregados.forEach(agregado => {
				agregado.EstadoFarmacia = this.estadosIndicacionMedicaFarmacia.find(x => x.Id === agregado.IdEstadoFarmacia);
				agregado.EstadoFacturacion = this.estadosFacturacionIndicacionMedica.find(x => x.Id === agregado.IdEstadoFacturacion);
			});
		}

	}
	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class FarmaciaPreparadoIndicacionMedicaModalController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('FarmaciaPreparadoIndicacionMedicaModalController');
		this.$log.debug('ON', this.resolve);

		this.internado = Object.assign({},this.resolve.Internado);
		this.indicacionMedica = Object.assign({},this.resolve.Indicacion);
		this.sucursal = Object.assign({}, this.resolve.Sucursal);
		this.activate();
		
		if(this.indicacionMedica.TipoIndicacion.Id == 1){
			this.title.name = "Dosificación de: " + this.internado.NumeroInternado + " || " + this.internado.Paciente + " || Hab: " + this.internado.Habitacion +  " Cama: " +
			this.internado.Cama;
		}else if(this.indicacionMedica.TipoIndicacion.Id == 2){
			this.title.name = "Infusión de: " + this.internado.NumeroInternado + " || " + this.internado.Paciente + " || " + "Hab: " + this.internado.Habitacion + " Cama: " + 
			this.internado.Cama;
		}

	}


	// #endregion
}