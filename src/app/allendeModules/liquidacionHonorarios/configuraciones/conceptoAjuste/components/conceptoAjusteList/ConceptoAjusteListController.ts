/**
* @author:         emansilla
* @description:    Lista de conceptos de ajustes para contratos internos
* @type:           Controller
**/
import * as angular from 'angular';
import { IConceptoAjusteDataService} from '../../services/ConceptoAjusteDataService';
import { IConceptoAjusteLogicService } from "../../services/ConceptoAjusteLogicService";
import { filtroConceptoAjustesDTO, ConceptoAjusteDto } from "../../modal/"
import Row from 'core/component/table/row/Row';

export class ConceptoAjusteListController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: 'Concepto de Ajuste',
		icon: 'LIST',
	};
	resolve: any;
	dismiss: any;
	close: any;

	nombre = "";
	codigo: any;
	cuenta: any;
	matricula: any;
	coeficiente: any;
	filtroDto: filtroConceptoAjustesDTO = {};
	listadoConceptoAjuste: GridViewDto<ConceptoAjusteDto> = {};
	currentPage = 1;
	listadoServicio = [];
	tiposConceptoAjuste : IEntidadDto[] = [];
	tipoElegido: IEntidadDto = {};
	
	// data = {
	// 	conceptos: {}
	// };

	// resultsConceptoAjuste : any;

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', '$state', 'ModalService', 'AlertaService', 'ConceptoAjusteDataService', 'ConceptoAjusteLogicService'];

	// Constructor
	constructor(
		private $log: ILogger,
		private $state,
		private ModalService: IModalService,
		private AlertaService: IAlertaService,
		private ConceptoAjusteDataService: IConceptoAjusteDataService,
		private ConceptoAjusteLogicService: IConceptoAjusteLogicService,
		){
	}

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	public method(param1: string): void { // Desde la vista (HTML) se accede con vm.method(algo)
	}

	private method2(param1: string): void { // No se puede llamar desde la vista (HTML) por que es privada
	}

	volver() {
		this.$state.go('homesistemas');
	}

	// Boton Limpiar
	limpiarFiltros() { 
		this.nombre = "";
		this.cuenta = 0;
		this.matricula = 0;
		this.tipoElegido = {};
	}

	editarConceptoAjuste(IdConceptoAjuste, index) {
		this.ConceptoAjusteLogicService.editarConceptoAjuste(IdConceptoAjuste).then((conceptoGuardado) => {
			this.listadoConceptoAjuste[index] = conceptoGuardado;
			this.activate();
		});
	}
	
	eliminarConceptoAjuste(fila, index) {
		this.ModalService.confirm('¿Desea eliminar el siguiente concepto ' + fila.Nombre + '?',
		(pResult) => {
			if (pResult) {
				this.ConceptoAjusteDataService.eliminarConceptoAjuste(fila.Id)
				.then((result) => {
					if (result.IsOk == false) {
						this.AlertaService.NewWarning("Por favor verifique: " + result.Message);
					}
					else {
						this.listadoConceptoAjuste.Rows ? this.listadoConceptoAjuste.Rows.splice(index, 1) : null;
						this.AlertaService.NewSuccess("El Concepto de ajuste ha sido eliminado.");
					}
				})
				.catch((pError) => {
					this.AlertaService.NewError("Error en el servidor.", pError.message);
					return;
				});
			}
		});
	}
	
	//Buscar Pagina
	buscar() {
		if (!this.currentPage) this.currentPage = 1;
		this.buscarPagina({ currentPage: this.currentPage });
	}

	buscarPagina(pPagination){
		this.currentPage = pPagination.currentPage;
		var currentPage = pPagination.currentPage;
		var pageSize = pPagination.pageSize || 10;

		this.filtroDto.Cuenta = this.cuenta;
		this.filtroDto.Nombre = this.nombre.toUpperCase();

		this.filtroDto.IdTipoConcepto = this.tipoElegido ? this.tipoElegido.Id : 0;

		this.filtroDto.CurrentPage = currentPage;
		this.filtroDto.PageSize = pageSize;
		
		this.ConceptoAjusteDataService.obtenerConceptosPorFiltro(this.filtroDto).then(
			(listado) => {
				this.listadoConceptoAjuste = listado;
		});
	}

	$onInit() {
		this.$log = this.$log.getInstance('conceptosAjustesListController');
		this.$log.debug('ON');
		this.activate();
	}

	activate() {
		//Cargar Filtro Tipo
		this.ConceptoAjusteDataService.obtenerTodosTiposConcepto().then((listaTiposConcepto) => {
			this.tiposConceptoAjuste = listaTiposConcepto;
		});

		//Cargar Planilla 
		this.ConceptoAjusteDataService.obtenerFiltroConceptoAjuste().then((filtroDto) => {
			this.filtroDto = filtroDto;
			this.buscar()
		});

	
	}
}



