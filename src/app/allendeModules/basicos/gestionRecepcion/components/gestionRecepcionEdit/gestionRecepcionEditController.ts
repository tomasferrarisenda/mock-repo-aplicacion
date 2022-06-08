/**
* @author: crusso
* @description: gestionRecepcion Edit Controller
* @type: Controller
**/
import * as angular from 'angular';
import { ISupportDataService } from "../../../../support/basic/services";
import { IGestionRecepcionDataService, GestionRecepcionDataService } from "../../services/gestionRecepcionDataService";
import { IGestionRecepcionLogicService } from "../../services/gestionRecepcionLogicService";
import { filtroGestionRecepcionDto } from "../../model/filtroGestionRecepcionDto";
import { gestionRecepcionListDto } from "../../model/gestionRecepcionListDto";
import { gestionRecepcionEditDto } from "../../model/gestionRecepcionEditDto";
import { ISucursalDataService } from "../../../../support/basic/services/SucursalDataService";
import { IPisoDelEdificioDataService, } from "../../../../support/basic/services/PisoDelEdificioDataService";
import { servicioRecepcionDto } from "../../model/servicioRecepcionDto"; //Se crea una EntidadDto porque llama a los Servicios del Edit en Agregar Servicio de Recepcion


import Row from 'core/component/table/row/Row';

export class gestionRecepcionEditController implements angular.IController {

    // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
    title = {
        name: 'Nueva Gestión Recepción', // Desde la vista (HTML) se accede con vm.title.name
        icon: 'NEW' // Desde la vista (HTML) se accede con vm.title.icon
    };

    resolve: any;
    dismiss: any;
    close: any;
    edit: boolean = false;

    // mas propiedades ..
    sucursalLista: IEntidadDto[] = [];
    sucursalElegida: IEntidadDto = {};

    edificioLista: IEntidadDto[] = [];
    edificioElegido: IEntidadDto = {};

    pisoLista: IEntidadDto[] = [];
    pisoElegido: IEntidadDto = {};

    recepcion: string = "";
    recepcionLista: string = "";
    recepcionElegido: string = "";

    filtroDto: filtroGestionRecepcionDto = {};

    gestionRecepcionEdit: gestionRecepcionEditDto = {};//Edit
    currentPage = 0;
    tipoGestionRecepcion: IEntidadDto = {};

    listadoServicio: IEntidadDto[] = [];// Listado de Servicios del Combo 
    servicioElegido: IEntidadDto = {};

    //Variable para mostras o No un nuevo Servicio
    mostrarNuevoGestionRecepcion: boolean = false;
    // #endregion

    // ID
    static $inject: Array<string> = ['Logger', 'SupportDataService', '$state', 'GestionRecepcionDataService', 'GestionRecepcionLogicService', 'ModalService', 'AlertaService', 'SucursalDataService', 'PisoDelEdificioDataService', '$stateParams', '$q'];
    /**
    * @class gestionRecepcionEditController
    * @constructor
    */
    constructor(
        private $log: ILogger,
        private SupportDataService: ISupportDataService,
        private $state,
        private GestionRecepcionDataService: IGestionRecepcionDataService,
        private GestionRecepcionLogicService: IGestionRecepcionLogicService,
        private ModalService: IModalService,
        private AlertaService: IAlertaService,
        private SucursalDataService: ISucursalDataService,
        private PisoDelEdificioDataService: IPisoDelEdificioDataService,
        private $stateParams,
        private $q: angular.IQService,
    ) {
    }

    // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

    /**
    * @class gestionRecepcionEditController
    * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
    * @event
    */
    $onInit() {
        this.$log = this.$log.getInstance('gestionRecepcionEditController');
        this.$log.debug('ON');
        this.activate();
    }

    //Funcion que se utiliza en Agregar los servicios
    agregarServicio() {
        //En Agregar un Servicio se pone el .Id para que de manera obligada el usuario tenga que cargar un Usuario.
        if (!this.servicioElegido.Id) return;

        //Esta accion obliga al usuario a NO agregar 2 Servicios iguales 
        //gestionRecepcionEdit.Servicios (Filtro del Servicio) | find (es un array buscar del filtro) | x => Servicio === ( "===" igual) this
        if (this.gestionRecepcionEdit.Servicios.find(x => x.IdServicio === this.servicioElegido.Id)) {

            //Ventana de alerta para mostrar al Usuario
            this.AlertaService.NewWarning("Este servicio ya se encuentra asignado.");

        } else {

            var servicioRecepcion: servicioRecepcionDto = { Id: 0 };
            servicioRecepcion.IdServicio = this.servicioElegido.Id
            servicioRecepcion.Servicio = this.servicioElegido.Nombre
            this.gestionRecepcionEdit.Servicios.push(servicioRecepcion);
            this.borrarServicio();
        }
    }

    Guardar() {

        if (this.$stateParams.gestionEdit.Id !== 0){
            //estoy editando una recepcion, no controlo
            this.save();
        }else {
            
            var mensaje = "";
            if (!this.pisoElegido.Id) {
                mensaje += " -Debe elegir un piso.";
            }
            if (!this.edificioElegido.Id) {
                mensaje += " -Debe elegir un edificio.";
            }
            if (!this.sucursalElegida.Id) {
                mensaje += " -Debe elegir una sucursal.";
            }
            if (!this.gestionRecepcionEdit.Nombre) {
                mensaje += " -Debe escribir un nombre para la recepción.";
            }
            if (this.gestionRecepcionEdit.Servicios.length === 0) {
                mensaje += " -No hay servicios cargados.";
            }
            //Cuando se guarda se debe cargar Piso, Recepcion y Servicio (ver este ultimo si es necesario) sino se informa advertencia.
            if (mensaje) {
                this.ModalService.warning("Verifique por favor." + mensaje);
                return;
            }
    
            this.gestionRecepcionEdit.IdSucursal = this.sucursalElegida.Id;
            this.gestionRecepcionEdit.IdEdificio = this.edificioElegido.Id;
            this.gestionRecepcionEdit.IdPiso = this.pisoElegido.Id;
            
            this.save();
            
        }

    }

    save(){
        this.$log.debug('gestion recepcion edit dto:', this.gestionRecepcionEdit);
        this.GestionRecepcionDataService.guardar(this.gestionRecepcionEdit).then((result) => {
            if (result.IsOk) {
                this.ModalService.success("Se ha guardado el Servicio correspondiente.")
                this.$state.go('basicos.gestionRecepcion.list');
            }
            else {
                this.ModalService.warning("Verifique por favor." + result.Message);
            }
        });
    }

    borrarServicio() {
        this.servicioElegido = {};
    }

    eliminarItem(index) {
        this.gestionRecepcionEdit.Servicios.splice(index, 1);
    }

    cambioSucursal() {
        console.log('');
        if (this.sucursalElegida && this.sucursalElegida.Id) {// Al elegir el Usuario la Sucursal 
            this.PisoDelEdificioDataService.obtenerPorEdificioDeSucursal(this.sucursalElegida.Id).then((edificio) => {
                this.edificioLista = edificio; //Se activa el Edificio al que pertenece
            });
        }

        else {
            this.edificioLista = [];
            this.edificioElegido = {};
            this.cambioEdificio();
        }
    }

    cambioEdificio() {
        if (this.edificioElegido && this.edificioElegido.Id) {// Al elegir el Usuario el Edificio
            this.PisoDelEdificioDataService.obtenerPorEdificioId(this.edificioElegido.Id).then((piso) => {
                this.pisoLista = piso;//Se activa el Piso al que pertenece
            });
        }

        else {
            this.pisoLista = [];
            this.pisoElegido = {};
        }
    } // No se realiza mas busquedas por el Piso debido a que termina los combos.

    activate() {

        //Esta condicion determina que al actualizar derive directamente al List!
        if (this.$stateParams.gestionEdit.Id === undefined){
			this.$state.go('basicos.gestionRecepcion.list');
		}

        this.title.name = this.$stateParams.gestionEdit.Id ? 'Modificar Gestión de Recepción' : 'Agregar Gestión de Recepción';
        this.title.icon = this.$stateParams.gestionEdit.Id ? 'EDIT' : 'NEW';
        this.edit = this.$stateParams.gestionEdit.Id ? true : false;

        this.SucursalDataService.getAllSucursalesCombo().then((sucursales) => {
            this.sucursalLista = sucursales; //Se para aparecer Sucursales ya que al Elegir la Sucursal brinda las Opciones de Edificio y Piso
        });

        this.gestionRecepcionEdit = this.$stateParams.gestionEdit;
        //Obtiene los Datos de la Sucursales
        this.SucursalDataService.getAllSucursalesCombo().then((sucursales) => {
            this.sucursalLista = sucursales;
            for (let i = 0; i < this.sucursalLista.length; i++) {
                if (this.sucursalLista[i].Id === this.gestionRecepcionEdit.IdSucursal) {
                    this.sucursalElegida = this.sucursalLista[i];

                    //Buscamos dentro de la Sucursal Elegida los datos del Edificio
                    this.PisoDelEdificioDataService.obtenerPorEdificioDeSucursal(this.sucursalElegida && this.sucursalElegida.Id ? this.sucursalElegida.Id : 0).then((edificios) => {
                        this.edificioLista = edificios; //Se activa el Edificio al que pertenece
                        for (let i = 0; i < this.edificioLista.length; i++) {
                            if (this.edificioLista[i].Id === this.gestionRecepcionEdit.IdEdificio) {
                                this.edificioElegido = this.edificioLista[i];
                            }

                            //Buscamos dentro de la Sucursal Elegida y el Edificio Elegido el Piso
                            this.PisoDelEdificioDataService.obtenerPorEdificioId(this.edificioElegido && this.edificioElegido.Id ? this.edificioElegido.Id : 0).then((piso) => {
                                this.pisoLista = piso; //Se activa El Piso al que pertenece      
                                for (let i = 0; i < this.pisoLista.length; i++) {
                                    if (this.pisoLista[i].Id === this.gestionRecepcionEdit.IdPiso) {
                                        this.pisoElegido = this.pisoLista[i];
                                    }
                                }
                            }); //Fin de Pisos

                        }
                    });//Fin de Edificio
                }
            }
        });//Fin de Sucrusales
    }

    volver() {
        this.$state.go('basicos.gestionRecepcion.list');
        //Al estar situado en Edit deberia volver al List (Pagina Anterior).
    }
}


