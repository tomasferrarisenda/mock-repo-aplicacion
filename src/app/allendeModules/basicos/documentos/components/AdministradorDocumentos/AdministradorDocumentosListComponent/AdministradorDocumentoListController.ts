/**
* @author:         pferrer
* @description:    Lista de Documentos
* @type:           Controller
**/
import * as angular from 'angular';
import { IAdministradorDocumentoDataService } from '../../../services';
import { IAdministradorDocumentoLogicService } from '../../../services';
import { ISupportDataService } from '../../../../../support/basic/services';
import { FiltroDocumentoAsociadoDto, EntidadDocumentacion, DocumentoAsociado } from '../../../model';
import AlertaDataService from 'core/notification/alerta/services/AlertaDataService';

export class AdministradorDocumentoListController implements angular.IController {

	static $inject: Array<string> = ['Logger', 'AdministradorDocumentoDataService', 'AdministradorDocumentoLogicService', '$state',
		'SupportDataService', 'DateUtils', 'AlertaService', 'ModalService', '$scope', 'DateUtils'];
	// Constructor
	constructor(private $log: ILogger, private AdministradorDocumentoDataService: IAdministradorDocumentoDataService, private AdministradorDocumentoLogicService: IAdministradorDocumentoLogicService, private $state,
		private SupportDataService: ISupportDataService, private DateUtils: IDateUtils, private AlertaService: IAlertaService, private ModalService: IModalService, private $scope: angular.IScope) {
		this.$scope.$watch(() => this.IdTipoEntidad,
			(nuevoValor, viejoValor) => {
				if((nuevoValor && !viejoValor) || (nuevoValor !== viejoValor)){
					this.AdministradorDocumentoDataService.ObtenerPorTipoEntidadYEntidadesRelacionadas(nuevoValor).then((tiposDocumento) => {
						this.tiposDocumento = tiposDocumento;
						this.tiposDocumentoCompleta = tiposDocumento;
						this.cambioAmbito();
					});
				}
			});
	}

	title = {
		name: 'Administrador de Documentos',
		icon: 'LIST'
	};

	IdTipoEntidad: any;

	NombreDocumento = '';
	fechaDesde: Date = new Date();
	fechaHasta: Date = new Date();

	tiposDocumento: any[] = [];
	tiposDocumentoCompleta: any[] = [];
	tiposAmbito: any[] = [];

	tipoDocumentoElegido: any = {};
	tipoAmbitoElegido: any = {};

	currentPage: any;
	filtroDto: FiltroDocumentoAsociadoDto = {};

	listaDocumentos: GridViewDto<DocumentoAsociado> = {};
	arbolDocumentos: any[] = [];
	abrirFiltro: boolean = false;
	nodoElegido: any;

	entidadValue?: EntidadDocumentacion = { Id: 0, IdTipoEntidad: 0 };
	set entidad(value: EntidadDocumentacion | undefined) {

		this.entidadValue = value;
		if (this.entidadValue) {
			this.AdministradorDocumentoDataService.ObtenerJerarquiaEntidades(this.entidadValue.IdTipoEntidad, this.entidadValue.Id).then((arbol) => {
				this.arbolDocumentos = [];
				this.arbolDocumentos.push(arbol);
			})
		}
		else {
			this.vaciarArbol();
			this.seleccionArbol(null);
		}
	}

	get entidad(): EntidadDocumentacion | undefined {
		return this.entidadValue;
	}

	cambioAmbito() {
		if (this.tipoAmbitoElegido && this.tipoAmbitoElegido.Id) {
			var tiposDocumentosAux: any[] = [];
			for (let i = 0; i < this.tiposDocumentoCompleta.length; i++) {
				if (this.tiposDocumentoCompleta[i].IdAmbitoUso === this.tipoAmbitoElegido.Id) {
					tiposDocumentosAux.push(this.tiposDocumentoCompleta[i]);
				}
			}
			this.tiposDocumento = tiposDocumentosAux;
		}
		else {
			this.tiposDocumento = this.tiposDocumentoCompleta;
		}
		this.tipoDocumentoElegido = null;		
	}

	volver() {
		this.$state.go('homesistemas');
	}

	buscar() {
		if (!this.currentPage) this.currentPage = 1;
		this.buscarPagina({ currentPage: this.currentPage });
	}

	buscarPagina(pPagination) {
		if (!this.entidad) return this.AlertaService.NewWarning("Debe elegir una entidad.");
		if (!this.nodoElegido || !(this.nodoElegido.hasOwnProperty("Id") || this.nodoElegido.hasOwnProperty("IdTipo"))) return this.AlertaService.NewWarning("Debe elegir una entidad del listado.");

		this.currentPage = pPagination.currentPage;
		var currentPage = pPagination.currentPage;
		var pageSize = pPagination.pageSize || 30;

		this.filtroDto.IdTipoEntidad = this.nodoElegido.IdTipo;
		this.filtroDto.IdEntidad = this.nodoElegido.Id;
		this.filtroDto.fechaDesde = this.DateUtils.parseToBe(this.fechaDesde);
		this.filtroDto.fechaHasta = this.DateUtils.parseToBe(this.fechaHasta);
		this.filtroDto.idAmbitoUso = this.tipoAmbitoElegido && this.tipoAmbitoElegido.Id ? this.tipoAmbitoElegido.Id : 0;
		this.filtroDto.idTipoDocumento = this.tipoDocumentoElegido && this.tipoDocumentoElegido.Id ? this.tipoDocumentoElegido.Id : 0;
		this.filtroDto.Nombre = this.NombreDocumento;
		this.filtroDto.CurrentPage = currentPage;
		this.filtroDto.PageSize = pageSize;

		this.AdministradorDocumentoDataService.ObtenerDocumentosPorFiltro(this.filtroDto).then(
			(documentos) => {
				this.listaDocumentos = documentos;
			});
	}

	seleccionArbol(nodo) {
		this.listaDocumentos.Rows = [];
		this.abrirFiltro = false;
		this.nodoElegido = nodo;
		if ((this.entidad) && (this.nodoElegido && (this.nodoElegido.Id && this.nodoElegido.IdTipo)))
			this.buscar();
	}

	vaciarArbol() {
		this.arbolDocumentos = [];
		this.arbolDocumentos.push({ Nombre: "No hay documentos", children: [] })
	}

	limpiarFiltros() {
		this.tipoDocumentoElegido = null;
		this.tipoAmbitoElegido = null;
		this.tiposDocumento = this.tiposDocumentoCompleta;
		this.fechaDesde = this.DateUtils.removeYears(new Date(), 1);
		this.fechaHasta = new Date();
		this.NombreDocumento = '';
		this.listaDocumentos.Rows = [];
		if ((this.entidad) && (this.nodoElegido && (this.nodoElegido.Id && this.nodoElegido.IdTipo)))
			this.buscar();
	}

	$onInit() {
		this.$log = this.$log.getInstance('AdministradorDocumentoListController ON');
		this.activate();
		this.registrarEscucha();
	}

	activate() {
		this.AdministradorDocumentoDataService.AmbitoDocumentoObtenerTodos().then((tiposAmbito) => {
			this.tiposAmbito = tiposAmbito;
		});

		this.AdministradorDocumentoDataService.ObtenerNuevoFiltroDto().then((filtroDto) => {
			this.filtroDto = filtroDto;
		})

		this.fechaDesde = this.DateUtils.removeYears(this.fechaDesde, 1);
		this.entidad = undefined;
		this.vaciarArbol();
	}

	registrarEscucha() {
		this.$scope.$on('refrescarBusquedaDocumentos', () => {
			this.buscar();
		});
	}
}