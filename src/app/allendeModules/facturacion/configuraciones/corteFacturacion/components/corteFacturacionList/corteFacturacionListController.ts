/**
* @author: crusso
* @description: Corte de Facturación Controller
* @type: Controller
**/
import * as angular from 'angular';
import { ICorteFacturacionDataService } from "../../services/corteFacturacionDataService";
import { ICorteFacturacionLogicService } from "../../services/corteFacturacionLogicServices";
import { filtroCorteFacturacionDTO } from '../../model';
import { corteFacturacionDTO } from '../../model';
import { Meses } from '../../config/mesesConstant';
import Row from 'core/component/table/row/Row';
export class corteFacturacionListController implements angular.IController {

    // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
    title = {
        name: 'Fechas de Corte Facturación', // Desde la vista (HTML) se accede con vm.title.name
        icon: 'DATE' // Desde la vista (HTML) se accede con vm.title.icon
    };

    currentPage = 1;
    mes: any;
    meses = Meses;
    anio: number = 0;
    //FechaCorte: string = "";
    filtroDto: filtroCorteFacturacionDTO = {};
    listadoCorteFacturacion: filtroCorteFacturacionDTO[] = [];

    // mas propiedades ..

    // #endregion

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
    // ID
    static $inject: Array<string> = ['Logger', '$state', '$filter', 'ModalService', 'AlertaService', 'CorteFacturacionDataService', 'CorteFacturacionLogicService', 'DateUtils'];
    /**
    * @class corteFacturacionListController
    * @constructor
    */
    constructor(
        private $log: ILogger,
        private $state,
        private $filter: angular.IFilterService, //Se utiliza para acomodar usar la Fecha en formato legible Dia/Mes/Año
        private ModalService: IModalService,
        private AlertaService: IAlertaService,
        private CorteFacturacionDataService: ICorteFacturacionDataService,
        private CorteFacturacionLogicService: ICorteFacturacionLogicService,
        private dateUtils: IDateUtils
    ) {
    }

    // #endregion

    // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

    buscar() {
        if (!this.currentPage) this.currentPage = 1;
        this.buscarPagina({ currentPage: this.currentPage });
    }

    buscarPagina(pPagination) {
        this.currentPage = pPagination.currentPage;
        var currentPage = pPagination.currentPage;
        var pageSize = pPagination.pageSize || 10;

        this.filtroDto.IdMes = this.mes ? this.mes.Id : 0;
        this.filtroDto.Anio = this.anio;

        this.filtroDto.CurrentPage = currentPage;
        this.filtroDto.PageSize = pageSize;

        this.CorteFacturacionDataService.ObtenerListadoPorFiltro(this.filtroDto).then((listaCorte) => {
            this.listadoCorteFacturacion = listaCorte;
        });

    }

    limpiarFiltros() {
        this.mes = {};
        this.anio = new Date().getFullYear();
    }

    editarCorteFacturacion(idCorteFacturacion, index) {
        this.CorteFacturacionLogicService.editarCorteFacturacion(idCorteFacturacion).then(() => {
            this.buscar();
        });
    }

    eliminarCorteFacturacion(corteFacturacion:corteFacturacionDTO , index: number) { 
        this.$log.debug('corteFacturacion valor',corteFacturacion); 

        let fechaCorteFront = this.dateUtils.parseToFe(corteFacturacion.Fecha); //Como Primer Instancia se debe llamar la fecha y pasarla de Back a Front.
        let fechaCorteLegible = this.$filter("date") (fechaCorteFront,"dd/MM/yyyy"); //Luego de pasarla debemos editarla para que "date" lo mostremos al cliente.

        this.ModalService.confirm('¿Desea eliminar el Corte de Facturación con Fecha de ' + fechaCorteLegible + '?' , (pResult) => {
            if (pResult) {
                this.CorteFacturacionDataService.eliminarCorteFacturacion(corteFacturacion.Id || 0)
                    .then((result) => {
                        if (result.IsOk == false) {
                            this.AlertaService.NewWarning("Por favor verifique: " + result.Message);
                        }
                        else {
                            this.AlertaService.NewSuccess("Se elimina Corte de Facturación.");
                            this.buscar(); //Refrescar Eliminar en el Index.

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

    /**
    * @class corteFacturacionListController
    * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
    * @event
    */
    $onInit() {
        this.$log = this.$log.getInstance('corteFacturacionListController');
        this.$log.debug('ON');
        this.anio = new Date().getFullYear();
        this.buscar();
    }

}