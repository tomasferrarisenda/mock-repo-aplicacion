/**
* @author: crusso
* @description: Bateria Estudios Controllers Edit
* @type: Controller
**/
import * as angular from 'angular';
import { filtroBateriaEstudiosDto } from "../../model/filtroBateriaEstudiosDto";
import { bateriaEstudiosEditDto, bateriaEstudiosListDto, itemBateriaEstudiosEditDto } from '../../model';
import { IBateriaEstudiosDataService, IBateriaEstudiosLogicService } from "../../services";
import Row from 'core/component/table/row/Row';

export class bateriaEstudiosEditController implements angular.IController {

    // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
    title = {
        name: '', // Desde la vista (HTML) se accede con vm.title.name
        icon: '' // Desde la vista (HTML) se accede con vm.title.icon
    };

    currentPage = 0;
    bateriaEdit: bateriaEstudiosEditDto = {};
    itemBateriaEdit: itemBateriaEstudiosEditDto = {};

    nombre = "";
    servicioElegido: IEntidadDto = {};
    profesionalElegido: any
    listadoBateriaEstudios: bateriaEstudiosListDto[] = [];
    servicios: any; //Se colocan estas Variables, a la cual se le asigna los valores que se obtinen para mostrarlo en el HTML
    resolve: any;
    columnasTabla = [
        {
            label: "Prestación",
            field: "NombrePrestacionMedica",
            order: 1,
        },
        {
            label: "Servicio efector",
            field: "NombreServicioEfector",
            order: 2,
        }];

    // mas propiedades ..

    // #endregion

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
    // ID
    static $inject: Array<string> = ['Logger', '$state', '$stateParams', 'ModalService', 'AlertaService', 'bateriaEstudiosDataService', 'bateriaEstudiosLogicService', '$q', 'ProfesionalesDataService'];
    /**
    * @class bateriaEstudiosEditController
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
        private $q,
        private ProfesionalesDataService
    ) {
    }

    // #endregion

    // #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */


    borrarItemBateriaEstudios(row: any, index: number) {
        if (this.bateriaEdit.Items) {// Realizo la COnsulta para ver si tiene Valores...
            this.bateriaEdit.Items.splice(index, 1);
        }

    }

    cancelar() {
        this.$state.go('basicos.bateriaEstudios.list');
    }

    buscarPagina(pPaginacion) {
    }

    buscar() {
        if (!this.servicios) {
            this.AlertaService.NewWarning("Debe elegir un servicio.");
            return;
        }

        if (!this.currentPage) this.currentPage = 1;
        this.buscarPagina({ currentPage: this.currentPage });
    }

    // #endregion

    // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

    /**
    * @class bateriaEstudiosEditController
    * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
    * @event
    */
    $onInit() {
        this.$log = this.$log.getInstance('bateriaEstudiosEditController');
        this.$log.debug('ON');
        this.activate();
    }

    Guardar() {

        //Para que no se repita Prestación y Servicio Efector en los Row. ver si va bateriaEdit
        if (this.bateriaEdit.Items) {
            for (let i = 0; i < this.bateriaEdit.Items.length; i++) {
                for (let j = i+1; j < this.bateriaEdit.Items.length; j++){
                    if(this.bateriaEdit.Items[i].IdPrestacionMedica === this.bateriaEdit.Items[j].IdPrestacionMedica){
                        this.AlertaService.NewWarning ("Verifique por favor hay Prestaciones repetidas.");
                        return
                    }
                }
            }
        }

        //Para Cargar Bateria Estudios Edit se necesita tener algo cargado!            
        this.bateriaEdit.NombreServicioPropietario = (this.servicioElegido && this.servicioElegido.Nombre) ? this.servicioElegido.Nombre : "";

        this.bateriaEdit.IdServicioPropietario = (this.servicioElegido && this.servicioElegido.Id) ? this.servicioElegido.Id : 0;

        this.bateriaEdit.NombreProfesionalPropietario = (this.profesionalElegido && this.profesionalElegido.Nombre) ? this.profesionalElegido.Nombre : "";
        this.bateriaEdit.IdProfesionalPropietario = (this.profesionalElegido && this.profesionalElegido.Id) ? this.profesionalElegido.Id : 0;

        this.bateriaEstudiosDataService.guardar(this.bateriaEdit).then((result) => {
            if (result.IsOk) {
                this.ModalService.success("Se ha guardado la Bateria.")
                this.$state.go('basicos.bateriaEstudios.list');
            }

            else {
                this.ModalService.warning("Verifique por favor." + result.Message);
            }
        });

    }

    editarItemBateriaEstudios(itemBateriaEstudioEdit, index) {
        
        if (!itemBateriaEstudioEdit) {
            itemBateriaEstudioEdit = angular.copy(this.itemBateriaEdit);
            //Angular.Copy se usa para guardar en Memoria y empezar a
        }

        var mensaje = "";
        if (!this.bateriaEdit.Nombre) {//Mensaje de Atención! Ingresar Nombre de Bateria
            mensaje += " - Debe ingresar Nombre de Bateria.";
        }
        if (!this.profesionalElegido) {//Mensaje de Atención! Ingresar Servicio Propietario
            mensaje += " - Debe seleccionar Profesional.";
        }
        
        if (mensaje) {//Cuando se guarda se debe cargar Nombre y Profesional.
            this.ModalService.warning("Verifique por favor." + mensaje);
            return;
        }
        
        this.bateriaEstudiosLogicService.editarItemBateriaEstudios(itemBateriaEstudioEdit,
            this.bateriaEdit && this.bateriaEdit.Nombre ? this.bateriaEdit.Nombre : '',
            this.servicioElegido && this.servicioElegido.Id ? this.servicioElegido.Id : 0, //Se coloca Servicio Elegido para que al Editar se realice la modificacion correspondiente
            this.profesionalElegido && this.profesionalElegido.Nombre ? this.profesionalElegido.Nombre : '', // Si Es Usuario modifica el Nombre del Dr el mismo se modifica en la Modal.

        ).then((itemBateriaEdit) => {
            if (index === null) {
                if (this.bateriaEdit && this.bateriaEdit.Items) {
                    this.bateriaEdit.Items.push(itemBateriaEdit);
                }
            }

        });
    }

    ObtenerNuevoItemEdit(idBateria) {
        var def = this.$q.defer();
        if (idBateria) {
            this.bateriaEstudiosDataService.ObtenerBateriaPorIdParaEdicion(idBateria).then((bateria) => {
                def.resolve(bateria);
            });
        }
        else {
            this.bateriaEstudiosDataService.ObtenerNuevaBateria().then((bateria) => {
                def.resolve(bateria);
            });
        }
        return def.promise;
    }

    activate() {
        /*
        Sirve para ver que información trae desde el Back
        this.$log.debug('this.$stateParams.bateriaEdit', this.$stateParams.bateriaEdit);
        */
        if (this.$stateParams.bateriaEdit.Id === undefined) {
            this.$state.go('basicos.bateriaEstudios.list');
        }

        this.title.name = this.$stateParams.bateriaEdit.Id !== 0 ? 'Modificar Batería de Estudios' : 'Agregar Batería de Estudios';
        this.title.icon = this.$stateParams.bateriaEdit.Id !== 0 ? 'EDIT' : 'NEW';
        this.bateriaEdit = this.$stateParams.bateriaEdit;

        /*Si Bateria Edit y Matricula Profesional de la Bateria Edit -*/
        if (this.bateriaEdit && this.bateriaEdit.MatriculaProfesional) {
            this.ProfesionalesDataService.getProfesionalPorMatricula(this.bateriaEdit.MatriculaProfesional).then((profesional) => {
                this.profesionalElegido = profesional;
            })
        }

        //Servicio Model al Hacer click en Editar Lista copiar información de Servicio.
        this.bateriaEstudiosDataService.ObtenerTodosServicios().then((servicios) => {
            this.servicios = servicios;
            this.servicioElegido = this.servicios[0];
            for (let i = 0; i < this.servicios.length; i++) {
                if (this.servicios[i].Id === this.bateriaEdit.IdServicioPropietario) {
                    this.servicioElegido = this.servicios[i];
                    break;
                }
            }
        });
    }

    // #endregion

}