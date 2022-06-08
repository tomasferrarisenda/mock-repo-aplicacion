/**
 * @author:			Ezequiel Mansilla
 * @description:	Servicio de modal
 * @type:			Service
 **/
import modalConfirmTemplate = require("./modal-confirm.tpl.html");
import modalConfirmSaveTemplate = require("./modal-confirm-save.tpl.html");
import modalLoading = require('./modal-loading.tpl.html');
import modalSelectOptionTemplate = require("./modal-select-option.tpl.html");
import modalValidarWarningTemplate = require("./modal-validar-warning.tpl.html");
import modalTextAreaTemplate = require("./modal-text-area.html"); 
import modalMediaComponent = require("./modalMediaComponent.html"); 

class ModalService implements IModalService {

	modalLoading: any;

	constructor(private $log, private $q, private MODAL_TYPE, private $uibModal, private $injector: angular.auto.IInjectorService) {
		this.$log = $log.getInstance('ModalService');
		this.$log.debug('ON.-');
	}

	private openModalByType(pModalType, pMessage, pSize?, pValue?) {
		var options = (pValue && (pValue.ok || pValue.cancel || pValue.classHeader || pValue.classButton)) ? pValue : '';
		var value = (options) ? '' : pValue;

		return this.$uibModal.open({
			template: modalConfirmTemplate,
			controller: 'ModalController',
			controllerAs: 'vm',
			size: pSize || 'md',
			backdrop: 'static',
			resolve: {
				Message: function () {
					return pMessage;
				},
				Value: function () {
					return value;
				},
				TypeModal: function () {
					return pModalType;
				},
				Options: function () {
					return options;
				}
			}
		}).result;
	}

	public loadingOpen() {
		if (!this.modalLoading) {

			this.modalLoading = this.$uibModal.open({
				template: modalLoading,
				size: 'sm',
				backdrop: 'static'
			});
		};

	}

	public media() {
		return this.$uibModal.open({
			template: modalMediaComponent,
			controller: 'ModalController',
			controllerAs: 'vm',
			size: 'lg',
			resolve: {
				Message: function () {
					return 'pMessage';
				},
				Value: function () {
					return 'value';
				},
				TypeModal: function () {
					return 'pModalType';
				},
				Options: function () {
					return 'options';
				}
			}
		}).result;
	}

	public loadingClose() {
		if (!this.modalLoading) return;
		this.modalLoading.dismiss('close');
		this.modalLoading = null;
	}

	public warning(pMessage) {
		this.$log.warn('Warning: Deprecado');
		this.openModalByType(this.MODAL_TYPE.WARNING, pMessage);
	}

	public warn(pMessage) {
		this.warning(pMessage);
	}


	public error(pMessage, pDetail) {
		this.$log.warn('Error: Deprecado');
		this.openModalByType(this.MODAL_TYPE.ERROR, pMessage, '', pDetail);
	}


	public info(pMessage, pSize) {
		this.$log.warn('Info: Deprecado');
		this.openModalByType(this.MODAL_TYPE.INFO, pMessage, pSize);
	}

	public confirmSave(text) {

		return this.$uibModal.open({
			template: modalConfirmSaveTemplate,
			controller: 'ModalConfirmSaveController',
			controllerAs: 'vm',
			size: 'md',
			keyboard: true,
			resolve: {
				TextoPregunta: function () {
					return text;
				}
			}
		}).result;
	}

	public success(pMessage, pSize) {
		this.$log.warn('Success: Deprecado');
		this.openModalByType(this.MODAL_TYPE.SUCCESS, pMessage, pSize);
	}

	public confirm(pMessage, pFunction, pSize, pOptions) {
		this.openModalByType(this.MODAL_TYPE.CONFIRM, pMessage, pSize, pOptions)
			.then(pFunction);
	}

	public prompt(pTitle, pValue, pFunction, pSize) {

		this.openModalByType(this.MODAL_TYPE.PROMPT, pTitle, pSize, pValue)
			.then(pFunction);
	}


	//model del _validarResponse, para usarlo con front tambien
	/**
	 * let _warnings = {
					IsOk: true,
					HasWarnings: true,
					WarningMessage: ""
				};
	 */

	public validarWarning(_validarResponse) {

		var def = this.$q.defer();

		if (_validarResponse.IsOk && _validarResponse.HasWarnings) {

			return this.$uibModal.open({
				template: modalValidarWarningTemplate,
				controller: 'ModalValidarWarningController',
				controllerAs: 'vm',
				size: 'md',
				backdrop: 'static',
				resolve: {
					ValidarResponse: function () {
						return _validarResponse;
					}
				}
			}).result;
		} else if (_validarResponse.IsOk && !_validarResponse.HasWarnings)
			def.resolve(true);
		else {

			var ret = {
				status: false,
				msjError: _validarResponse.Message
			};
			def.reject(ret);
		}

		return def.promise;
	}

	public infoWithCallback(titulo, mensaje) {

	
		return this.$uibModal.open({
			component: 'saModalInfoWithCallback',
			size: 'md',
			keyboard: false,
			backdrop: 'static',
			resolve: {
				Titulo: () => {
					return titulo;
				},
				Mensaje: () => { 
					return mensaje;
				}
			}
		}).result;
		
	}

	public selectOptionModal(_options, title?) {
		var def = this.$q.defer();
		if (_options) {
			return this.$uibModal.open({
				template: modalSelectOptionTemplate,
				controller: 'ModalSelectOptionController',
				controllerAs: 'vm',
				size: 'md',
				backdrop: 'static',
				resolve: {
					Options: function () {
						return _options;
					},
					Title: function () {
						return title || null;
					}
				}
			}).result;
		}
		else {

			var ret = {
				status: false,
				msjError: 'Error, no hay opciones para seleccionar'
			};
			def.reject(ret);
		}
		return def.promise;
	}

	public textAreaModal(_options: ITextAreaModalOptions) {
		var def = this.$q.defer();
		if (_options) {
			return this.$uibModal.open({
				template: modalTextAreaTemplate,
				controller: 'ModalTextAreaController',
				controllerAs: 'vm',
				size: _options.sizeModal || 'lg',
				keyboard: true,
				resolve: {
					Options: function () {
						return _options;
					}
				}
			}).result;
		}
		else {
			var ret = {
				status: false,
				msjError: 'Error, no hay opciones para seleccionar'
			};
			def.reject(ret);
		}
		return def.promise;
	}



	public openOpcionesDeConfiguracion(title ,options) {

		var def = this.$q.defer();
		if (options) {
			return this.$uibModal.open({
				component: 'saModalConfigOptions',
				size: 'lg',
				keyboard: true,
				resolve: {
					Title: function () {
						return title;
					},
					Options: function () {
						return options;
					}
				}
			}).result;
		}
		else {
			var ret = {
				status: false,
				msjError: 'Error, no hay opciones para seleccionar'
			};
			def.reject(ret);
		}
		return def.promise;
	}

	public openEditInputGenerico(_options: IInputEditModalOptions) {
		var def = this.$q.defer();
		if (_options) {
			return this.$uibModal.open({
				component: 'saModalEditInputGenerico',
				size: _options.sizeModal || 'md',
				keyboard: true,
				resolve: {
					Options: function () {
						return _options;
					}
				}
			}).result;
		}
		else {
			var ret = {
				status: false,
				msjError: 'Error de open editor'
			};
			def.reject(ret);
		}
		return def.promise;
	}

	public openAuditoriaElementoPorId(_options: IAuditoriaPorIdModalOptions) {
		var def = this.$q.defer();
		let _dataService = this.$injector.get(_options.dataService);
		if (_options) {
			return this.$uibModal.open({
				component: 'saModalOpenAuditoriaPorElemento',
				size: _options.sizeModal || 'lg',
				keyboard: true,
				resolve: {
					Options: function () {
						return _options;
					},
					DataService: function () {
						return _dataService;
					},
				}
			}).result;
		}
		else {
			var ret = {
				status: false,
				msjError: 'Error de open auditoria'
			};
			def.reject(ret);
		}
		return def.promise;
	}

	openSuccessAnimationModal(pTitulo){
		return this.$uibModal.open({
			component: 'saModalSuccessAnimation',
			size: 'md',
			keyboard: true,
			resolve: {
				Titulo: () => {
					return pTitulo;
				}
			}
		}).result;
	}

	static serviceFactory($log, $q, MODAL_TYPE, $uibModal, $injector) {
		return new ModalService($log, $q, MODAL_TYPE, $uibModal, $injector);
	}
}
ModalService.serviceFactory.$inject = ['Logger', '$q', 'MODAL_TYPE', '$uibModal', '$injector'];
export default class {
	public static init(ngModule: angular.IModule) {
		ngModule.factory('ModalService', ModalService.serviceFactory);
	}
}