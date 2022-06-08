/**
* @author: aminoldo
* @description: Lista de Requisitos Administrativos
* @type: Controller
**/
import * as angular from 'angular';
import { IRequisitoAdministrativoDataService } from '../../services';
import { FiltroRequisitoAdministrativoDto } from '../../model';
import { requisitoAdministrativoDto } from '../../model/requisitoAdministrativoDto';
import ModalService from 'core/notification/modal/ModalService';
import { IRequisitoAdministrativoLogicService, RequisitoAdministrativoLogicService } from '../../services/RequisitoAdministrativoLogicService';

export class RequisitosAdministrativosListController implements angular.IController {

    // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
    // Desde la vista (HTML) se accede con vm.title.name
    // Desde la vista (HTML) se accede con vm.title.icon
    title = {
        name: 'Listado de Requisitos Administrativos',
        icon: 'LIST'
    };


    requisitoAdministrativo: GridViewDto<requisitoAdministrativoDto> = {};
    currentPage = 1;
    filtroRequisitoAdministrativo: FiltroRequisitoAdministrativoDto = {};
    tipoRequisito: IEntidadDto = {};
    tipoRequisitoAdministrativo: IEntidadDto[] = [];
    nombre: string = "";
    // mas propiedades ..

    // #endregion

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
    // ID
    static $inject: Array<string> = ['Logger', '$state', 'RequisitoAdministrativoDataService',
        'ModalService', 'AlertaService', 'RequisitoAdministrativoLogicService'];
    /**
    * @class NameController
    * @constructor
    */
    constructor(private $log: ILogger,
        private $state,
        private requisitoAdministrativoDataService: IRequisitoAdministrativoDataService,
        private ModalService: IModalService,
        private AlertaService: IAlertaService,
        private requisitoAdministrativoLogicService: IRequisitoAdministrativoLogicService
    ) {
    }

    // #endregion

    // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

    /**
    * @class NameController
    * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
    * @event
    */


    limpiarFiltros() {
        this.nombre = "";
        this.tipoRequisito = {};
    }

    buscar() {
        if (!this.currentPage) this.currentPage = 1;
        this.buscarPagina({ currentPage: this.currentPage });

    }

    buscarPagina(pPaginacion) {
        this.currentPage = pPaginacion.currentPage;
        var currentPage = pPaginacion.currentPage;
        var pageSize = pPaginacion.pageSize || 10;

        this.filtroRequisitoAdministrativo.IdTipoRequisitoAdministrativo = this.tipoRequisito ? this.tipoRequisito.Id : 0;
        this.filtroRequisitoAdministrativo.Nombre = this.nombre.toUpperCase();
        this.filtroRequisitoAdministrativo.CurrentPage = this.currentPage;
        this.filtroRequisitoAdministrativo.PageSize = pageSize;

        this.requisitoAdministrativoDataService.ObtenerRequisitoPorFiltro(this.filtroRequisitoAdministrativo).then((listaRequisitoAdm) => {
            this.requisitoAdministrativo = listaRequisitoAdm;
            //requisitoAdministrativo var q llevo hacia afuera -> html y lleno la grilla
        });
    }

    editarRequisitoAdministrativo(idRequisito: number, index: number) {
        this.requisitoAdministrativoLogicService.editRequisitoAdministrativo(idRequisito).then((unidadGuardada: requisitoAdministrativoDto) => {
            if (idRequisito) {
                this.requisitoAdministrativo.Rows ? this.requisitoAdministrativo.Rows[index] = unidadGuardada : null;
            } else {
                this.requisitoAdministrativo.Rows ? this.requisitoAdministrativo.Rows.push(unidadGuardada) : null;
            }
            this.buscar();
        });
    }


    eliminar(requisito) {
        this.ModalService.confirm('¿Desea eliminar el requisito ' + requisito.Nombre + '?',(pResult) => {
            if (pResult) {
                this.requisitoAdministrativoDataService.eliminar(requisito.Id).then((result) => {
                    if (result.IsOk === false) {
                        this.AlertaService.NewWarning("Por favor verifique:" + result.Message);
                    }
                    else {
                        if (this.requisitoAdministrativo.Rows) {
                            for (let i = 0; i < this.requisitoAdministrativo.Rows.length; i++) {
                                if (this.requisitoAdministrativo.Rows[i].Id === requisito.Id) {
                                    this.requisitoAdministrativo.Rows ? this.requisitoAdministrativo.Rows.splice(i, 1) : null;
                                    this.AlertaService.NewSuccess("El requisito administrativo " + requisito.Nombre + " ha sido eliminado.");
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



    volver() {
        this.$state.go('homesistemas');
    }

    $onInit() {
        this.$log = this.$log.getInstance('RequisitosAdministrativosListController');
        this.$log.debug('ON');

        this.activate()
    }
    // #endregion


    activate() {
        this.requisitoAdministrativoDataService.TiposDeRequisitos().then((TipoRequisitoAdm) => {
            this.tipoRequisitoAdministrativo = TipoRequisitoAdm;
        });

        this.requisitoAdministrativoDataService.ObtenerFiltroRequisitos().then((FiltroRequisitoAdm) => {
            this.filtroRequisitoAdministrativo = FiltroRequisitoAdm;
            this.buscar();
        });

    }


}