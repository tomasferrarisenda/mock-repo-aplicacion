/**
* @author: pfe
* @description: lala
* @type: Controller
**/
import * as angular from 'angular';
import { IAdministradorDocumentoDataService } from '../../../services/AdministradorDocumentoDataService';
import { IAdministradorDocumentoLogicService } from '../../../services/AdministradorDocumentoLogicService';
import { DocumentoAsociado } from '../../../model/documentoAsociado';
import AlertaDataService from 'core/notification/alerta/services/AlertaDataService';

export class ListadoDocumentosAvanzadoController implements angular.IController {

    static $inject: Array<string> = ['Logger', 'ModalService',
        '$scope', 'AdministradorDocumentoDataService', 'AdministradorDocumentoLogicService', 'AlertaService'];

    constructor(private $log: ILogger, private ModalService: IModalService,
        private $scope, private AdministradorDocumentoDataService: IAdministradorDocumentoDataService,
        private AdministradorDocumentoLogicService: IAdministradorDocumentoLogicService,
        private AlertaService: IAlertaService) {
    }

    entidadGlobal: any;
    entidadLocal: any;

    buscarPagina: any;

    modelValue?: any;
    set model(listado: any) {
        this.modelValue = listado;
    }
    get model(): any {
        return this.modelValue;
    }

    /* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

    nuevo() {
        if (!this.entidadGlobal) return this.AlertaService.NewWarning("Debe elegir una entidad.");
        if (!this.entidadLocal || (this.entidadLocal.IdTipo === 0 || this.entidadLocal.Id === 0)) return this.AlertaService.NewWarning("Debe elegir una entidad del listado.");
        this.AdministradorDocumentoLogicService.editarDocumentoAsociado(0, this.entidadLocal.IdTipo, this.entidadLocal.Id).then((documento) => {
            this.$scope.$emit('refrescarBusquedaDocumentos');
        });
    }

    editarDocumento(idDocumento, index) {
        this.AdministradorDocumentoLogicService.editarDocumentoAsociado(idDocumento, this.entidadLocal.IdTipo, this.entidadLocal.Id).then((documento) => {
            this.$scope.$emit('refrescarBusquedaDocumentos');
        })
    }

    borrarDocumento(fila) {
        this.ModalService.confirm('¿Desea eliminar el documento "' + fila.NombreArchivo + '"?',
            (pResult) => {
                if (pResult) {
                    this.AdministradorDocumentoDataService.EliminarDocumento(fila.Id).then((result) => {
                        if (result.IsOk === false) {
                            this.ModalService.warning("Verifique por favor. " + result.Message);
                        }
                        else {
                            for (var i = this.model.Rows.length - 1; i >= 0; i--) {
                                if (this.model.Rows[i].Id == fila.Id) {
                                    this.model.Rows.splice(i, 1);
                                    this.ModalService.success("El documento ha sido eliminado.");
                                    break;
                                }
                            }
                        }
                    })
                    .catch((pError) => {
                        this.ModalService.error("Error en el servidor.", pError.message);
                        return;
                    });
                }
            });
    }

    descargarDocumento(idDocumento, NombreArchivo) {
        this.AdministradorDocumentoDataService.DescargarDocumentoAsociadoPorId(idDocumento, NombreArchivo);
    }

    descargarTodo() {
        var idListadoArchivos: number[] = [];
        if (this.model.Rows && this.model.Rows.length > 0) {
            for (let i = 0; i < this.model.Rows.length; i++) {
                idListadoArchivos.push(this.model.Rows[i].Id);
            }
            this.AdministradorDocumentoDataService.DescargarZip(idListadoArchivos).then((listadoDocumentos) => {

            });
        }
        else {
            return this.AlertaService.NewWarning("No hay documentos en el listado.");
        }
    }

    imprimir() {
        if (this.model.Rows && this.model.Rows.length > 0) {
            this.AdministradorDocumentoLogicService.imprimirListado(this.entidadGlobal, this.entidadLocal, this.model).then(()=>{})
        }
        else {
            return this.AlertaService.NewWarning("No hay documentos en el listado.");
        }
    }

    searchPagina(pagination) {
        this.buscarPagina({pagination:pagination});
    }

    /* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

    $onInit() {
        this.$log = this.$log.getInstance('ListadoDocumentosAvanzadoController');
        this.$log.debug('ON');
    }

    // #endregion
}