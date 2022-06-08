/**
* @author: pferrer
* @description: Edit Administrador Documentos
* @type: Controller
**/
import * as angular from 'angular';
import { IAdministradorDocumentoDataService } from '../../../services/AdministradorDocumentoDataService';
import { EntidadDocumentacion, DocumentoAsociado } from '../../../model';

export class AdministradorDocumentoEditController implements angular.IController {
	static $inject: Array<string> = ['Logger', 'AdministradorDocumentoDataService', 'ModalService', '$q', 'DateUtils', 'DotService', 'AlertaService'];
	/**
	* @class tecnicosDelServicioController
	* @constructor
	*/
	constructor(
		private $log: ILogger,
		private AdministradorDocumentoDataService: IAdministradorDocumentoDataService,
		private ModalService: IModalService,
		private $q: angular.IQService,
		private DateUtils : IDateUtils,
		private DotService, private AlertaService
	) { }

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '',
		icon: ''
	};

	resolve;
	dismiss;
	close;

	entidad : EntidadDocumentacion = {Id : 0, IdTipoEntidad : 0};
	documentoEdicion : any = {}
	docAsociado : any;

	tiposDocumento : any[] = [];
	tiposDocumentoCompleta: any[] = [];
	tiposAmbito : any[] = [];

	tipoDocumentoElegido : any = {};
	tipoAmbitoElegido : any = {};

	fechaReferencia = new Date();
	NombreDocumento : string = '';
	entidadEditable : boolean = false;
	mostrarCargaDocumento : boolean = false;

	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */

	cancel() {
		this.dismiss({ $value: 'cancel' });
	}

	guardar() {
		var mensaje = '';
		if(!this.fechaReferencia)
			mensaje += '-La fecha de referencia es requerida. ';
		if(!this.NombreDocumento)
			mensaje += '-El nombre del documento es requerido. ';
		if(!this.resolve.idDocumento && !this.docAsociado)
			mensaje += '-No hay documento cargado.';
		if (this.tipoDocumentoElegido.Id == 37 || this.tipoDocumentoElegido.Id == 34 || this.tipoDocumentoElegido.Id == 13) { 
			//tengo imagen seleccionada => el nombre del archivo debe contener .jpg o .jpeg o .png
			if (this.docAsociado && this.docAsociado.type.includes("image") && (this.docAsociado.name.includes(".jpg") || this.docAsociado.name.includes(".jpeg") || this.docAsociado.name.includes(".png"))) { 
				//tengo doc ok
			}else mensaje += '-La extension del documento no coincide con la requerida (.jpg .jpeg .png)';
		}
		if(mensaje !== '')
			return this.AlertaService.NewWarning("Verifique por favor. "+mensaje);

		this.documentoEdicion.IdEntidad = this.entidad.Id;
		this.documentoEdicion.IdTipoEntidad = this.entidad.IdTipoEntidad;
		this.documentoEdicion.Nombre = this.NombreDocumento;
		this.documentoEdicion.Fecha = this.DateUtils.parseToBe(this.fechaReferencia);
		this.documentoEdicion.IdTipo = (this.tipoDocumentoElegido && this.tipoDocumentoElegido.Id) ? this.tipoDocumentoElegido.Id : 0;
		
		if(this.resolve.idDocumento){
			this.AdministradorDocumentoDataService.Guardar(this.documentoEdicion).then((result) => {
				if (result.IsOk) {
					console.log('result.IsOk', result);
					this.ModalService.success("Se ha guardado documento.");
					this.close({ $value: this.documentoEdicion });
				}
				else {
					this.ModalService.warning("Verifique por favor. " + result.Message);
				}
			});
		}
		else{
			this.documentoEdicion.FileName = this.resolve.idDocumento ? '' : this.docAsociado.name;
			this.documentoEdicion.NombreArchivo = this.resolve.idDocumento ? '' : this.docAsociado.name;

			this.DotService.UploadFile('DocumentoAsociado/UploadDocument', this.docAsociado, this.documentoEdicion).then((result) => {
				if (result.IsOk) {
					this.ModalService.success("Se ha guardado documento.");
					this.close({ $value: this.documentoEdicion });
				}
				else {
					this.ModalService.warning("Verifique por favor. " + result.Message);
				}
			});
		}
	}
	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */

	cambioAmbito(){
		if(this.tipoAmbitoElegido)
		{
			var tiposDocumentosAux: any[] = [];
			for (let i = 0; i < this.tiposDocumentoCompleta.length; i++) {
				if(this.tiposDocumentoCompleta[i].IdAmbitoUso === this.tipoAmbitoElegido.Id)
				{
					tiposDocumentosAux.push(this.tiposDocumentoCompleta[i]);
				}
			}
			this.tiposDocumento = tiposDocumentosAux;
			this.tipoDocumentoElegido = this.tiposDocumento[0];
		}
		else{
			this.tiposDocumento = this.tiposDocumentoCompleta;
			this.tipoDocumentoElegido = null;
		}
	}

	cambioEntidad() {
		if(this.entidad != null){
			this.AdministradorDocumentoDataService.TiposDocumentosAsociadosObtenerTodosPorTipoEntidad(this.entidad.Id).then((tiposDocumento) => {
				this.tiposDocumento = tiposDocumento;
				this.tiposDocumentoCompleta = tiposDocumento;
			});	
		}		
	}

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class AdministradorDocumentoEditController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('AdministradorDocumentoEditController');
		this.$log.debug('ON');
		this.activate();
	}

	activate() {
		this.title.name = this.resolve.idDocumento ? 'Edición de Documento' : 'Nuevo Documento';
		this.title.icon = this.resolve.idDocumento ? 'EDIT' : 'NEW';
		this.mostrarCargaDocumento = this.resolve.idDocumento ? false : true;

		this.entidadEditable = true;

		this.AdministradorDocumentoDataService.ObtenerPorIdEntidadConDocumentacion(this.resolve.idTipoEntidad, this.resolve.idEntidad).then((entidad) => {
			this.entidad = entidad;

			this.AdministradorDocumentoDataService.AmbitoDocumentoObtenerTodos().then((tiposAmbito) => {
				this.tiposAmbito = tiposAmbito;
				this.tipoAmbitoElegido = this.tiposAmbito[0];
	
				//this.AdministradorDocumentoDataService.TiposDocumentosAsociadosObtenerTodos().then((tiposDocumento) => {
					this.AdministradorDocumentoDataService.TiposDocumentosAsociadosObtenerTodosPorTipoEntidad(this.resolve.idTipoEntidad).then((tiposDocumento) => {	
					this.tiposDocumento = tiposDocumento;
					this.tiposDocumentoCompleta = tiposDocumento;
					this.cambioAmbito();
					this.obtenerDocumentoDto().then((documentoEdicion)=>{
						this.documentoEdicion = documentoEdicion;
						this.NombreDocumento = this.documentoEdicion.Nombre;
						this.fechaReferencia = this.resolve.idDocumento ? this.DateUtils.parseToFe(this.documentoEdicion.Fecha) : this.fechaReferencia;
	
						for (let i = 0; i < this.tiposDocumentoCompleta.length; i++) {
							if(this.tiposDocumentoCompleta[i].Id === this.documentoEdicion.IdTipo){
								this.tipoDocumentoElegido = this.tiposDocumentoCompleta[i];
								
								for (let j = 0; j < this.tiposAmbito.length; j++) {
									if(this.tiposAmbito[j].Id === this.tipoDocumentoElegido.IdAmbitoUso){
										this.tipoAmbitoElegido = this.tiposAmbito[j];
										this.cambioAmbito();
										this.tipoDocumentoElegido = this.tiposDocumentoCompleta[i];
										break;
									}
								}
								break;
							}
						}
					});
				});
			});

		});

	}

	obtenerDocumentoDto() {
		var def = this.$q.defer();
		if (this.resolve.idDocumento) {
			this.AdministradorDocumentoDataService.ObtenerPorId(this.resolve.idDocumento).then((documento) => {
				def.resolve(documento);
			});
		}
		else {
			this.AdministradorDocumentoDataService.ObtenerNuevoDto().then((documento) => {
				def.resolve(documento);
			});
		}
		return def.promise;
	}
	// #endregion
}