/**
* @author: crusso
* @description: Gestion Recepcion List Controller
* @type: Controller
**/
import * as angular from 'angular';
import { IGestionRecepcionDataService, GestionRecepcionDataService } from "../../services/gestionRecepcionDataService";
import { IGestionRecepcionLogicService } from "../../services/gestionRecepcionLogicService";
import { filtroGestionRecepcionDto } from "../../model/filtroGestionRecepcionDto";
import { gestionRecepcionListDto } from "../../model/gestionRecepcionListDto";
import { ISucursalDataService } from "../../../../support/basic/services/SucursalDataService";
import { IPisoDelEdificioDataService, } from "../../../../support/basic/services/PisoDelEdificioDataService";

import Row from 'core/component/table/row/Row';

export class gestionRecepcionListController implements angular.IController {

    // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
    title = {
        name: 'Gestión Recepción', // Desde la vista (HTML) se accede con vm.title.name
        icon: 'LIST' // Desde la vista (HTML) se accede con vm.title.icon
    };
    // mas propiedades ..

    sucursalLista: IEntidadDto[] = [];
    sucursalElegida: IEntidadDto = {};

    edificioLista: IEntidadDto[] = [];
    edificioElegido: IEntidadDto = {};

    pisoLista: IEntidadDto[] = [];
    pisoElegido: IEntidadDto = {};

    recepcion: string = "";

    filtroDto: filtroGestionRecepcionDto = {};
    listadoGestionRecepcion: GridViewDto<gestionRecepcionListDto> = {};
    currentPage = 0;

    // #endregion

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
    // ID
    static $inject: Array<string> = ['Logger', '$state', 'GestionRecepcionDataService', 'GestionRecepcionLogicService',
        'SucursalDataService', 'PisoDelEdificioDataService', 'ModalService', 'AlertaService', '$q'];
    /**
    * @class gestionRecepcionListController
    * @constructor
    */
    constructor(
        private $log: ILogger,
        private $state,
        private GestionRecepcionDataService: IGestionRecepcionDataService,
        private GestionRecepcionLogicService: IGestionRecepcionLogicService,
        private SucursalDataService: ISucursalDataService,
        private PisoDelEdificioDataService: IPisoDelEdificioDataService,
        private ModalService: IModalService,
        private AlertaService: IAlertaService,
        private $q
    ) {
    }

    limpiarFiltros() {
        /*Para limpiar los Filtros de Busqueda */
        this.sucursalElegida = {};
        this.edificioElegido = {};
        this.pisoElegido = {};
        this.recepcion = "";
        this.cambioSucursal(); /*Se coloca Sucursal para que quede predeterminado*/
    }

    //Se coloca esta funcion debido a que los datos obtenidos se utilicen desde el List
    editarGestionRecepcion(gestionRecepcion, index) {

        if(gestionRecepcion && gestionRecepcion.Id){
            this.obtenerGestionRecepcioDto(gestionRecepcion.Id).then((gestionRecepcionEdit) => {
                gestionRecepcionEdit.Sucursal = gestionRecepcion.Sucursal;
                gestionRecepcionEdit.Edificio = gestionRecepcion.Edificio;
                this.$state.go('basicos.gestionRecepcion.edit', {
                    gestionEdit: gestionRecepcionEdit
                });
            })
        }else {
            this.obtenerGestionRecepcioDto(gestionRecepcion).then((gestionRecepcionEdit) => {
                this.$state.go('basicos.gestionRecepcion.edit', {
                    gestionEdit: gestionRecepcionEdit
                });
            })
        }
        
    }

    obtenerGestionRecepcioDto(idGestionRecepcion) {
        var def = this.$q.defer();
        if (idGestionRecepcion) {
            this.GestionRecepcionDataService.getOne(idGestionRecepcion).then((gestion) => {
                def.resolve(gestion);
            });
        }
        else {
            this.GestionRecepcionDataService.obtenerNuevo().then((gestion) => {
                def.resolve(gestion);
            });
        }
        return def.promise;
    }

    eliminar(fila: any, index: number) {
        this.ModalService.confirm('¿Desea eliminar la siguiente lista ' + fila.Nombre + '?', (pResult) => {
            if (pResult) {
                this.GestionRecepcionDataService.eliminar(fila.Id).then((result) => {
                    if (result.IsOk === false) {
                        this.AlertaService.NewWarning("Por favor verifique:" + result);
                    }
                    else {
                        if (this.listadoGestionRecepcion.Rows) {
                            for (let i = 0; i < this.listadoGestionRecepcion.Rows.length; i++) {
                                if (this.listadoGestionRecepcion.Rows[i].Id === fila.Id) {
                                    this.listadoGestionRecepcion.Rows ? this.listadoGestionRecepcion.Rows.splice(i, 1) : null;
                                    this.AlertaService.NewSuccess("La lista ha sido eliminada.");
                                    break;
                                }
                            }
                        }
                    }
                })
                    .catch((pError) => {
                        this.AlertaService.NewError("Error en el servidor.", pError.message);
                        return;
                    });
            }
        });
    }

    buscar() {
        if (!this.currentPage) this.currentPage = 1;
        this.buscarPagina({ currentPage: this.currentPage });
    }

    buscarPagina(pPaginacion) {
        this.currentPage = pPaginacion.currentPage;
        var pageSize = pPaginacion.pageSize || 10;
        this.filtroDto.CurrentPage = this.currentPage;
        this.filtroDto.PageSize = pageSize;

        this.GestionRecepcionDataService.obtenerPorSucursalEdificioPisoDescripcion(
            this.sucursalElegida && this.sucursalElegida.Id ? this.sucursalElegida.Id : 0,
            this.edificioElegido && this.edificioElegido.Id ? this.edificioElegido.Id : 0,
            this.pisoElegido && this.pisoElegido.Id ? this.pisoElegido.Id : 0,
            this.currentPage,
            pageSize,
            this.recepcion).then((listaRecepcion) => {
                this.listadoGestionRecepcion = listaRecepcion;
            });

    }

    cambioSucursal() {
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

    // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

    /**
    * @class gestionRecepcionListController
    * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
    * @event
    */

    volver() {
        this.$state.go('homesistemas');
    }

    $onInit() {
        this.$log = this.$log.getInstance('gestionRecepcionListController');
        this.$log.debug('ON');
        this.activate();
        this.buscar();
    }

    activate() {
        //Combo Obtener Sucursal
        this.SucursalDataService.getAllSucursalesCombo().then((sucursales) => {
            this.sucursalLista = sucursales; //Se para aparecer Sucursales ya que al Elegir la Sucursal brinda las Opciones de Edificio y Piso
        });

    }
}
// #endregion

