/**
* @author: pferrer
* @description: Listado de grupo de prestacion medica
* @type: Controller
**/
import * as angular from 'angular';
import ModalService from 'core/notification/modal/ModalService';
import { GrupoPrestacionMedicaEditDto, FiltroGrupoPrestacionMedicaDto } from '../../model';
import { IGrupoPrestacionMedicaDataService, IGrupoPrestacionMedicaLogicService } from '../../services';

export class GrupoPrestacionMedicaListController implements angular.IController {

    title = {
        name: 'Listado de Grupo de Prestaciones Médicas',
        icon: 'LIST'
    };

    grupoPrestacion: GridViewDto<GrupoPrestacionMedicaEditDto> = {};
    filtroGrupoPrestacion: FiltroGrupoPrestacionMedicaDto = {};
    currentPage = 1;
    nombre: string = "";
    servicio: any;
    sucursal: any;
    recurso: any;

    static $inject: Array<string> = ['Logger', '$state', 'GrupoPrestacionMedicaDataService',
        'ModalService', 'AlertaService', 'GrupoPrestacionMedicaLogicService'];
    /**
    * @class NameController
    * @constructor
    */
    constructor(private $log: ILogger,
        private $state,
        private grupoPrestacionMedicaDataService: IGrupoPrestacionMedicaDataService,
        private ModalService: IModalService,
        private AlertaService: IAlertaService,
        private grupoPrestacionMedicaLogicService: IGrupoPrestacionMedicaLogicService
    ) {
    }

    limpiarFiltros() {
        this.nombre = "";
        this.sucursal = null;
        this.recurso = null;
    }

    buscar() {
        if (!this.servicio) {
            this.AlertaService.NewWarning("Debe elegir un servicio.");
            return;
        }

        if (!this.currentPage) this.currentPage = 1;
        this.buscarPagina({ currentPage: this.currentPage });
    }

    buscarPagina(pPaginacion) {
        this.filtroGrupoPrestacion.IdServicio = this.servicio ? this.servicio.Id : 0;
        this.filtroGrupoPrestacion.IdSucursal = this.sucursal ? this.sucursal.id_sucursal : 0;
        this.filtroGrupoPrestacion.IdTipoRecurso = this.recurso ? this.recurso.IdTipoRecurso : 0;
        this.filtroGrupoPrestacion.IdRecurso = this.recurso ? this.recurso.Id : 0;
        this.filtroGrupoPrestacion.Nombre = this.nombre.toUpperCase();

        this.filtroGrupoPrestacion.CurrentPage = pPaginacion.currentPage;
        this.filtroGrupoPrestacion.PageSize = pPaginacion.pageSize || 10;

        this.grupoPrestacionMedicaDataService.obtenerPorServicio(this.filtroGrupoPrestacion).then((gruposPrestacion) => {
            this.grupoPrestacion = gruposPrestacion;
        });
    }

    editarGrupoPrestacion(idGrupo: number, index: number) {
        this.grupoPrestacionMedicaLogicService.editGrupoPrestacion(idGrupo, this.servicio ? this.servicio.Id : 0).then((grupoGuardado: GrupoPrestacionMedicaEditDto) => {
            if (idGrupo) {
                this.grupoPrestacion.Rows ? this.grupoPrestacion.Rows[index] = grupoGuardado : null;
            } else {
                this.grupoPrestacion.Rows ? this.grupoPrestacion.Rows.push(grupoGuardado) : null;
            }
            this.buscar();
        });
    }

    eliminar(grupo) {
        this.ModalService.confirm('¿Desea eliminar el grupo ' + grupo.Nombre + '?', (pResult) => {
            if (pResult) {
                this.grupoPrestacionMedicaDataService.eliminar(grupo.Id).then((result) => {
                    if (result.IsOk === false) {
                        this.AlertaService.NewWarning("Por favor verifique:" + result);
                    }
                    else {
                        if (this.grupoPrestacion.Rows) {
                            for (let i = 0; i < this.grupoPrestacion.Rows.length; i++) {
                                if (this.grupoPrestacion.Rows[i].Id === grupo.Id) {
                                    this.grupoPrestacion.Rows ? this.grupoPrestacion.Rows.splice(i, 1) : null;
                                    this.AlertaService.NewSuccess("El grupo de prestaciones " + grupo.Nombre + " ha sido eliminado.");
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
        this.$log = this.$log.getInstance('GrupoPrestacionMedicaListController');
        this.$log.debug('ON');

        this.activate()
    }
    // #endregion

    activate() {
        this.grupoPrestacionMedicaDataService.crearFiltroGrupo().then((filtroGrupoPrestacion) => {
            this.filtroGrupoPrestacion = filtroGrupoPrestacion;
        });
    }


}