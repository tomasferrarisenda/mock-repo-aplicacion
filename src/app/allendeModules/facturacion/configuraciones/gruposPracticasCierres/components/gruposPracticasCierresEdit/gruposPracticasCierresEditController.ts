/**
* @author: rbassi
* @description: controller de grupos de practicas para cierres
* @type: Controller
**/
import * as angular from 'angular';
import { IGruposPracticasCierresDataService } from '../../services/gruposPracticasCierresDataService';
import { ISupportDataService } from '../../../../../../allendeModules/support/basic/services';
import { ISucursalDataService } from "../../../../../support/basic/services/SucursalDataService";
import { PrefacturableDto } from '../../../../../../allendeModules/support/models';
import { grupoPracticasCierreDTO, itemGrupoPracticaCierreDTO} from '../../models';


export class gruposPracticasCierresEditController implements angular.IController {

 // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
 title = {
 name : 'Configurar Grupo para Cierres', // Desde la vista (HTML) se accede con vm.title.name
 icon : 'LIST' // Desde la vista (HTML) se accede con vm.title.icon
 };
 // mas propiedades ..
 resolve: any;
 dismiss: any;
 close: any;
 sucursalLista: IEntidadDto[] = [];
 sucursalElegida: IEntidadDto = {};
 servicioLista: IEntidadDto[] = [];
 servicioMedicoElegido: IEntidadDto = {};
 prefacturableElegido: PrefacturableDto = {};
 grupoPracticasEdit : grupoPracticasCierreDTO = {};
 itemGrupoPracticasCierre: itemGrupoPracticaCierreDTO = {};
 estadosLista: IEntidadDto[] = [];
 estadoElegido: IEntidadDto = {};


 // #endregion

 // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
 // ID
	static $inject: Array<string> = ['Logger', 'GruposPracticasCierresDataService', '$q', 'ModalService', 'SupportDataService', 'AlertaService', 'SucursalDataService'];
	/**
	* @class itemListasFacturacionEditController
	* @constructor
	*/
	constructor(private $log: ILogger,
		private GrupoPracticasCierresDataService: IGruposPracticasCierresDataService,
		private $q: angular.IQService,
		private ModalService: IModalService,
		private SupportDataService: ISupportDataService,
		private AlertaService: IAlertaService,
		private SucursalDataService: ISucursalDataService,
	) { }


 // #endregion

 // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

 // #endregion

 // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

 /**
 * @class gruposPracticasCierresEditController
 * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
 * @event
 */
 $onInit() {
 this.$log = this.$log.getInstance('gruposPracticasCierresEditController');
 this.$log.debug('ON');
 this.activate();
 }


 cancel() {
	this.dismiss({ $value: 'cancel' });
}

guardar(){

	this.grupoPracticasEdit.IdSucursal = this.sucursalElegida.Id;
	this.grupoPracticasEdit.NombreSucursal = this.sucursalElegida.Nombre;
	this.grupoPracticasEdit.IdServicio = this.servicioMedicoElegido.Id;
	this.grupoPracticasEdit.NombreServicio = this.servicioMedicoElegido.Nombre;
	this.grupoPracticasEdit.IdEstadoCierre = this.estadoElegido.Id;
	this.grupoPracticasEdit.NombreEstadoCierre = this.estadoElegido.Nombre;
		this.GrupoPracticasCierresDataService.guardar(this.grupoPracticasEdit).then((result) => {
			if (result.IsOk) {
				this.ModalService.success("Se ha guardado Configuración.")
				this.close();
			}
			else {
				this.ModalService.warning("Verifique por favor." + result.Message);
			}
		})	
}

eliminarItem(fila: any, index: number) {
	this.ModalService.confirm('¿Desea eliminar la práctica ' +fila.Codigo+' '+ fila.Descripcion	+ '?', (pResult) => {
		if (pResult) {
			this.grupoPracticasEdit.Items && this.grupoPracticasEdit.Items.Rows ? this.grupoPracticasEdit.Items.Rows.splice(index, 1) : null;
			//this.AlertaService.NewSuccess("La práctica ha sido eliminada.");
		}
	});
}


cargarItem(){
// agregar nuevo registro item

let senial : boolean = false;

if (this.grupoPracticasEdit.Items && this.grupoPracticasEdit.Items.Rows) {
	for (let i=0; i < this.grupoPracticasEdit.Items.Rows.length; i++){
		if (this.grupoPracticasEdit.Items.Rows[i].Codigo == this.prefacturableElegido.Codigo){
			senial = true;
			break
		}

	}
}

	if (senial === false ){
		
		this.itemGrupoPracticasCierre = {};

		this.itemGrupoPracticasCierre.Codigo = this.prefacturableElegido.Codigo;
		this.itemGrupoPracticasCierre.Descripcion = this.prefacturableElegido.Nombre;
		this.itemGrupoPracticasCierre.Id = 0;
		if (this.grupoPracticasEdit.Items && this.grupoPracticasEdit.Items.Rows) {
			this.grupoPracticasEdit.Items.Rows.push(this.itemGrupoPracticasCierre);
		}
		this.prefacturableElegido = {};
		this.prefacturableElegido.IdTipo = 1;
	}
	else {
		this.AlertaService.NewError("La práctica ya existe, ingrese Otra.");
	}
};

cancelarItem(){
	this.prefacturableElegido = {};
	this.prefacturableElegido.IdTipo = 1;
};

cambioServicioMedico(){
	this.$log.debug('Parametro ',this.servicioMedicoElegido)
};

cambioEstado(){
	this.$log.debug('EstadoElegido ',this.estadoElegido)
};

obtenerGrupoPracticasPoriD(IdGrupoPracticas){

		this.GrupoPracticasCierresDataService.ObtenerGrupoPracticasPorId(IdGrupoPracticas).then((GrupoPracticas) => {
			   this.grupoPracticasEdit = GrupoPracticas;

			   for (let i = 0; i < this.sucursalLista.length; i++) {
				if (this.sucursalLista[i].Id === this.grupoPracticasEdit.IdSucursal){
					this.sucursalElegida =  this.sucursalLista[i];
					}
				}
				this.servicioMedicoElegido = { 
					Id: GrupoPracticas.IdServicio,
					Nombre: GrupoPracticas.NombreServicio
				};
				
				this.obtenerEstadosCierres();

			   this.$log.debug('GRUPO A EDITAR ',this.grupoPracticasEdit);

			   this.servicioMedicoElegido.Id = this.grupoPracticasEdit.IdServicio;
			   this.servicioMedicoElegido.Nombre = this.grupoPracticasEdit.NombreServicio;

			})
};

obtenerEstadosCierres(){
	this.GrupoPracticasCierresDataService.ObtenerEstados().then((estados) => {
		this.estadosLista = estados;
		for (let i = 0; i < this.estadosLista.length; i++) {
			if (this.estadosLista[i].Id === this.grupoPracticasEdit.IdEstadoCierre){
				this.estadoElegido =  this.estadosLista[i];
				}
			}
		this.$log.debug('ESTADOS ',estados);
	});
};


obtenerNuevo(){
	this.GrupoPracticasCierresDataService.ObtenerNuevo().then((result) => {
		this.grupoPracticasEdit = result
		this.$log.debug('OBTENER NUEVO ',this.grupoPracticasEdit);
	});
};



cambioSucursal(){
	this.$log.debug('sucursalElegida', this.sucursalElegida);
	if (this.sucursalElegida && this.sucursalElegida.Id) {
		this.GrupoPracticasCierresDataService.ObtenerServiciosPorSucursal(this.sucursalElegida.Id).then((resultado) => {
			this.servicioLista = resultado;
			this.$log.debug('servicio Lista Por Sucursal', this.servicioLista);
		});
	}
	else{
		this.GrupoPracticasCierresDataService.ObtenerTodosLosServicios().then((resultado) => {
			this.$log.debug('Traer todos los servicios', resultado);
			this.servicioLista = resultado;
			this.$log.debug('servicio Lista TODOS', this.servicioLista);
		}); 
	}
};


 activate(){
	 let IdGrupoPracticas = this.resolve.IdGrupoPracticas? this.resolve.IdGrupoPracticas : 0;
	 this.$log.debug('Parametro ',IdGrupoPracticas)

	// traigo todas las sucursales
	this.SucursalDataService.getAllSucursalesCombo().then((sucursales) => {
		this.sucursalLista = sucursales

		if (IdGrupoPracticas){
			this.obtenerGrupoPracticasPoriD(IdGrupoPracticas);
		}
		else{
			this.obtenerNuevo();
			this.obtenerEstadosCierres();
		}
		this.cambioSucursal();

	});

 };









 // #endregion
}