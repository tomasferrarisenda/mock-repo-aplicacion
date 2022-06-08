/**
* @author: aminoldo
* @description: Plantilla de Texto
* @type: Controller
**/
import * as angular from 'angular';
import { IPlantillaTextoDataService } from '../../services';
import { IPlantillaTextoLogicService, PlantillaTextoLogicService } from '../../services/PlantillaTextoLogicService';
import { FiltroPlantillaTextoDto } from '../../model';
import { plantillaTextoDto } from '../../model/plantillaTextoDto';
import ModalService from 'core/notification/modal/ModalService';

export class PlantillaTextoListController implements angular.IController {

    // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
    title = {
        name: 'Plantilla de Texto', // Desde la vista (HTML) se accede con vm.title.name
        icon: 'LIST' // Desde la vista (HTML) se accede con vm.title.icon
    };


    currentPage = 1;
    nombre: string = "";
    filtroPlantillaTexto: FiltroPlantillaTextoDto = {};
    tipoProposito: IEntidadDto = {};
    plantillaTexto: GridViewDto<plantillaTextoDto> = {};
    tipoPropositoTexto: IEntidadDto[] = [];

    //tipoProposito

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
    // ID
    static $inject: Array<string> = ['Logger', 'PlantillaTextoDataService',
        'PlantillaTextoLogicService', '$state', 'ModalService', 'AlertaService', '$q'];
    /**
    * @class NameController
    * @constructor
    */
    constructor(private $log: ILogger,
        private plantillaTextoDataService: IPlantillaTextoDataService,
        private plantillaTextoLogicService: IPlantillaTextoLogicService,
        private $state,
        private ModalService: IModalService,
        private AlertaService: IAlertaService,
        private $q
    ) {
    }

    /* ------------------------------------------ EVENTOS ------------------------------------------ */

    limpiarFiltros() {
        this.nombre = "";
        this.tipoProposito = {};
    }

    buscar() {
        if (!this.currentPage) this.currentPage = 1;
        this.buscarPagina({ currentPage: this.currentPage });
    }

    buscarPagina(pPaginacion) {
        this.currentPage = pPaginacion.currentPage;
        var currentPage = pPaginacion.currentPage;
        var pageSize = pPaginacion.pageSize || 10;

        this.filtroPlantillaTexto.IdTipoProposito = this.tipoProposito ? this.tipoProposito.Id : 0;
        this.filtroPlantillaTexto.Nombre = this.nombre.toUpperCase();
        this.filtroPlantillaTexto.CurrentPage = this.currentPage;
        this.filtroPlantillaTexto.PageSize = pageSize;

        this.plantillaTextoDataService.ObtenerPorFiltros(this.filtroPlantillaTexto).then((listaPlantillaTxt) => {
            this.plantillaTexto = listaPlantillaTxt;
        })

    }

    editarPlanillaTexto(idProposito: number, index: number) {
        this.obtenerPlantillaDTO(idProposito).then((propositoEdit)=>{
            this.$state.go('basicos.plantillaTexto.edit', {
                propositoEdit: propositoEdit
            });
        })
    }

    obtenerPlantillaDTO(idProposito) {
		var def = this.$q.defer();
		if (idProposito) {
			this.plantillaTextoDataService.getOne(idProposito).then((plantillaDTO) => {
				def.resolve(plantillaDTO);
			})
		}
		else {
			this.plantillaTextoDataService.NuevaPlantillaTexto().then((plantillaDTO) => {
				def.resolve(plantillaDTO);
			});
		}
		return def.promise;
	};


    eliminar(proposito) {
        this.ModalService.confirm('¿Dedea eliminar la plantilla ' + proposito.Nombre + '?', (pResult) => {
            if (pResult) {
                this.plantillaTextoDataService.Eliminar(proposito.Id).then((result) => {
                    if (result.IsOk === false) {
                        this.AlertaService.NewWarning("Por favor verifique: " + result);
                    }
                    else {
                        if (this.plantillaTexto.Rows) {
                            for (let i = 0; i < this.plantillaTexto.Rows.length; i++) {
                                if (this.plantillaTexto.Rows[i].Id === proposito.Id) {
                                    this.plantillaTexto.Rows ? this.plantillaTexto.Rows.splice(i, 1) : null;
                                    this.AlertaService.NewSuccess("La plantilla " + proposito.Nombre + " ha sido eliminada.");
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
        })
    }

    volver() {
        this.$state.go('homesistemas');
    }

    $onInit() {
        this.$log = this.$log.getInstance('PlantillaTextoListController');
        this.activate()
    }

    activate() {
        this.plantillaTextoDataService.TiposDeProposito().then((TipoProposito) => {
            this.tipoPropositoTexto = TipoProposito;
        });

        //metodo para llenar la grilla principal(list)
        this.plantillaTextoDataService.ObtenerFiltroBusqueda().then((FiltroPlantilla) => {
            this.filtroPlantillaTexto = FiltroPlantilla;
            this.buscar();
        });
    }
}