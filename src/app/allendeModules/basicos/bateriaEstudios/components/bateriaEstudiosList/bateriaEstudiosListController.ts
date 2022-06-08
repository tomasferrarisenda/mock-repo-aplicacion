/**
* @author: crusso
* @description: Bateria Estudios List Controller
* @type: Controller
**/
import * as angular from 'angular';
import { filtroBateriaEstudiosDto } from "../../model/filtroBateriaEstudiosDto";
import { bateriaEstudiosEditDto, bateriaEstudiosListDto } from '../../model';
import { IBateriaEstudiosDataService, IBateriaEstudiosLogicService } from "../../services";


import Row from 'core/component/table/row/Row';
import { IGetDataService } from 'core/http';

export class bateriaEstudiosListController implements angular.IController {
    

    // #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
    title = {
        name: 'Batería de Estudios', // Desde la vista (HTML) se accede con vm.title.name
        icon: 'LIST' // Desde la vista (HTML) se accede con vm.title.icon
    };
    // mas propiedades ..

    nombre = "";
    filtroDto: filtroBateriaEstudiosDto = {};
    currentPage = 0;
    listadoBateriaEstudios : bateriaEstudiosListDto[] = [];
    servicioElegido: IEntidadDto = {};
    profesionalElegido: IEntidadDto = {};
    nombreElegido: IEntidadDto = {}; //Nombre de Bateria Elegido

    formControl = {
		borrarBateriaEstudios: this.borrarBateriaEstudios,
	};

    // #endregion

    // #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
    // ID
    static $inject: Array<string> = ['Logger', 'bateriaEstudiosDataService', 'bateriaEstudiosLogicService', 'ModalService', 'AlertaService', '$q', '$state'];
    /**
    * @class bateriaEstudiosListController
    * @constructor
    */
    constructor (
        private $log: ILogger,
        private bateriaEstudiosDataService: IBateriaEstudiosDataService,
        private bateriaEstudiosLogicService: IBateriaEstudiosLogicService,
        private ModalService: IModalService,
        private AlertaService: IAlertaService,
        private $q,
        private $state,
        ) {
    }

    borrarBateriaEstudios(row: any, index: number) {
		this.ModalService.confirm('¿Desea eliminar la batería ' + row.Nombre + '?',
			(pResult) => {
				if (pResult) {
					this.bateriaEstudiosDataService.eliminarBateriaEstudios(row.Id)
						.then((result) => {
							if (result.IsOk == false) {
								this.AlertaService.NewWarning("Por favor corroborar: " + result.Message);
							}
							else {
                                console.log("Verrrrrrr", row);
                                this.buscar();
                                
								this.AlertaService.NewSuccess("La batería ha sido eliminado.");
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
        this.filtroDto.Nombre = this.nombre; // Filtro Nombre
        
        this.filtroDto.IdServicioPropietario = this.servicioElegido ? this.servicioElegido.Id : 0;
        this.filtroDto.IdProfesionalPropietario = this.profesionalElegido ? this.profesionalElegido.Id : 0;

        this.bateriaEstudiosDataService.ObtenerBateriasPorFiltro(this.filtroDto).then(
			(listaBateria) => {
				this.listadoBateriaEstudios = listaBateria;
			});
    }
    
    limpiarFiltros() { // Boton Limpiar
		this.nombre = "";
		this.servicioElegido = {};
		this.profesionalElegido = {};
    }
    
    //Para Editar una Bateria / Para Agregar una nueva Bateria
    editarBateriaEstudios(Id, index) {
        this.$log.debug("Prueba", Id)
        this.ObtenerNuevaBateriaEdit(Id).then((bateriaEstudiosEditDto) => {
            this.$state.go('basicos.bateriaEstudios.edit', {
                bateriaEdit: bateriaEstudiosEditDto // parámetro que esta declarado en el STATE 
            });
        })
    }


    //Determina los datos que necesitamos obtener del listado del List de Baterias
    

    ObtenerNuevaBateriaEdit(IdBateria) {
        var def = this.$q.defer();
        if (IdBateria) {
            this.bateriaEstudiosDataService.ObtenerBateriaPorIdParaEdicion(IdBateria).then((bateria) => {
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

    // #endregion

    // #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

    /**
    * @class bateriaEstudiosListController
    * @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
    * @event
    */
    volver() {
        this.$state.go('homesistemas');
    }

    $onInit() {
        this.$log = this.$log.getInstance('bateriaEstudiosListController');
        this.$log.debug('ON');
        this.activate();
    }

    activate(){
        this.bateriaEstudiosDataService.crearFiltroBateria().then((filtroDto) => { //cambiar crearFiltroBateria x getAll para ver todo el contenido
			this.filtroDto = filtroDto;
			this.buscar();
        });
	} 
    // #endregion
}