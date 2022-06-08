/**
* @author: crusso
* @description: Edit de Modal de Bateria Estudios
* @type: Controller
**/
import * as angular from 'angular';
import { filtroBateriaEstudiosDto } from "../../model/filtroBateriaEstudiosDto";
import { bateriaEstudiosEditDto, bateriaEstudiosListDto, itemBateriaEstudiosEditDto } from '../../model';
import { IBateriaEstudiosDataService, IBateriaEstudiosLogicService } from "../../services";


export class itemBateriaEstudiosEditController implements angular.IController {

    // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
    title = {
        name: '', // Desde la vista (HTML) se accede con vm.title.name
        icon: '' // Desde la vista (HTML) se accede con vm.title.icon
    };

    nombre : string = '';
    profesionalPropietario: string = '';

    itemBateriaEdit: itemBateriaEstudiosEditDto = {};
    bateriaEstudiosEdit: bateriaEstudiosEditDto = {};
   

    //En el Plugin de Editar Bateria Existen 2 (dos) tipos de Servicios
    servicioElegidoPropietario: IEntidadDto = {}; //Se obtienen Servicios Propietario
    serviciosPropietario: Array<IEntidadDto> = []; 

    servicioElegidoEfector: IEntidadDto = {}; //Se obtienen Servicios Efector El invonveniente es que no lo estoy llamando
    serviciosEfector: Array<IEntidadDto> = []; 

    nombreElegido: IEntidadDto = {}; //Nombre de Bateria Elegido

    prestacionElegida: IEntidadDto = {}; // Es importante ver Prestación Elegida que valores tiene para cargarlo Entidad DTO
    
    resolve: any;
    dismiss: any; // lo usamos para Cancelar el Plugin
    close: any;

    getPage: any;
    

    // #endregion

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
    // ID
    static $inject: Array<string> = ['Logger', '$state', '$stateParams', 'ModalService', 'AlertaService', 'bateriaEstudiosDataService', 'bateriaEstudiosLogicService'];
    /**
    * @class itemBateriaEstudiosEditController
    * @constructor
    */
    constructor(
        private $log: ILogger,
        private $state,
        private $stateParams,
        private ModalService: IModalService,
        private AlertaService: IAlertaService,
        private bateriaEstudiosDataService: IBateriaEstudiosDataService,
        private bateriaEstudiosLogicService: IBateriaEstudiosLogicService,
        
    ) {
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

    cancel() {
        this.dismiss({ $value: 'cancel' });
    }

    // #endregion

    // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

    /**
    * @class itemBateriaEstudiosEditController
    * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
    * @event
    */
    $onInit() {
        this.$log = this.$log.getInstance('itemBateriaEstudiosEditController');
        this.$log.debug('ON');
        this.activate();
    }

    changeServicioEfector() {
        this.prestacionElegida = {}; // Change Service lo usamos para que al hacer click del Servicio Efector el Codigo Prestación / Nombre Prestación .
    }

    $onChanges(change) {
        console.log('change', change);
        if (change.data) {
            if (!change.data.isFirstChange() && change.data.currentValue) {
                
            }
        }

        if (change.dataSelected){
            if (!change.dataSelected.isFirstChange() && change.dataSelected.currentValue) {
               this.$log.debug('data selected change',change.dataSelected.currentValue);                
            }
        }
    }

    guardar(){

        //Para Guardar la Modal es necesario que este cargado el Codigo de Prestación
        if (!this.prestacionElegida.Id){
            return this.AlertaService.NewWarning("Debe cargar una prestación.");
        }

        // Se solicita al DTO Edit
        this.itemBateriaEdit.IdServicioEfector = this.servicioElegidoEfector.Id;
        this.itemBateriaEdit.IdPrestacionMedica = this.prestacionElegida.Id;

        this.itemBateriaEdit.NombreServicioEfector = this.servicioElegidoEfector.Nombre;
        this.itemBateriaEdit.NombrePrestacionMedica = this.prestacionElegida.Nombre

        this.close({ $value: this.itemBateriaEdit });
        
	}

    activate() {

        this.title.icon = this.resolve.itemBateriaEstudioEdit.Id === 0 ? 'NEW' : 'EDIT';
        this.title.name = this.resolve.itemBateriaEstudioEdit.Id === 0 ? 'Nuevo Item Batería' : 'Editar Item Batería';

        this.itemBateriaEdit = this.resolve.itemBateriaEstudioEdit;
        
        this.nombre = this.resolve.nombreBateria;
        this.profesionalPropietario = this.resolve.nombreProfesionalPropietario
        
        //Servicio Model al Hacer click en Editar Lista copiar información de Servicio.
        this.bateriaEstudiosDataService.ObtenerTodosServicios().then((servicios) => {
            
            this.serviciosPropietario = servicios;//Servicio Destinado al Propietario
            for (let i = 0; i < this.serviciosPropietario.length; i++) {
                if (this.serviciosPropietario[i].Id === this.resolve.idServicioPropietario) {
                    this.servicioElegidoPropietario = this.serviciosPropietario[i];
                    break;
                }
            }

            this.serviciosEfector = servicios;//Servicio Destinado al Propietario
            
            this.servicioElegidoEfector = this.serviciosEfector[0]; //Se coloca el Valor a Servicio Efector para que aparezca por defecto el listado de los Servicios Efector el primero.

            //
            for (let i = 0; i < this.serviciosEfector.length; i++) {
                if (this.serviciosEfector[i].Id === this.itemBateriaEdit.IdServicioEfector) {
                    this.servicioElegidoEfector = this.serviciosEfector[i];
                    break;
                }           
            }
        });
    }
    // #endregion
}