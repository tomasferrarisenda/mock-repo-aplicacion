/**
* @author: ppautasso
* @description: controller para mostrar repo de modal service
* @type: Controller
**/
import * as angular from 'angular';

export class RepoFrontModalesController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	codeHtml;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger', 'ModalService'];
	/**
	* @class RepoFrontModalesController
	* @constructor
	*/
	constructor(private $log: ILogger, private ModalService) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	clickElemento(event) {

		switch (event) {
			case 1:
				this.codeHtml = angular.copy('ModalService.confirmSave("Desea guardar los cambios?")' +
					'.then(function (result) { ' +
					'if (result) {' +
					'});');
				break;
			case 2:
				this.codeHtml = angular.copy('let _warnings = {' +
					'IsOk: true,' +
					'HasWarnings: true,' +
					'WarningMessage: "ATENCIÓN, existen warnings"' +
					'};' +
					' ' +
					'ModalService.validarWarning(_warnings)' +
					'.then(function (pResult) {' +
					'}, function (pError) {' +
					'});');
				break;
			case 3:
				this.codeHtml = angular.copy('let options: Array<any> = [];' +
					'options.push({' +
					'id: 1,' +
					'label: "Opcion 1"' +
					'}, {' +
					'id: 2,' +
					'label: "Opcion 2"' +
					'});' +
					'this.ModalService.selectOptionModal(options).then((opcionElegida) => {' +
					'});');
				break;
			case 4:
				this.codeHtml = angular.copy('ModalService.textAreaModal({' +
					'tituloModal: "Observación",' +
					'icon: "VIEW",' +
					'guardarOption: false,' +
					'data: null,' +
					'readOnly: true,' +
					'sizeModal: "md"' +
					'});');
				break;
			case 5:
				this.codeHtml = angular.copy('let optionsConfig = [{' +
					'Id: 0,' +
					'Configuracion: "Configuracion 1",' +
					'Status: false' +
					'}];' +

					'this.ModalService.openOpcionesDeConfiguracion("Configurar Opciones", optionsConfig)' +
					'.then(function (pResult) {' +
					'}, function (pError) {' +
					'});');
				break;
			case 6:
				this.codeHtml = angular.copy('let optionsEdit: IInputEditModalOptions = {};' +
				'optionsEdit.tituloModal = "Editar Value";' +
				'optionsEdit.objetoAEditarLabel = "Value Actual";' +
				'optionsEdit.objetoAEditarValue = 5;' +
				'optionsEdit.objetoAEditarDisabled = true;' +
				'optionsEdit.labelNuevoInput = "Nueva Value";' +
				'optionsEdit.showObjetoAEditar = true;' +
		
				'this.ModalService.openEditInputGenerico(optionsEdit)'+
				'	.then((pResult) => {'+
				'		this.$log.debug("pResult", pResult);'+
				'	}, (pError) => {'+
				'		this.$log.error("pError", pError);'+
				'	});');
				break;
		}
	}

	openConfirmSave() {
		this.ModalService.confirmSave("Desea guardar los cambios?")
			.then(function (result) {
				if (result) {
				}
			});
	}

	openValidarWarning() {
		let _warnings = {
			IsOk: true,
			HasWarnings: true,
			WarningMessage: "ATENCIÓN, existen warnings"
		};
		this.ModalService.validarWarning(_warnings)
			.then(function (pResult) {

			}, function (pError) {

			});
	}


	openSelectoptionModal() {
		let options: Array<any> = [];
		options.push({
			id: 1,
			label: 'Opcion 1'
		}, {
				id: 2,
				label: 'Opcion 2'
			});
		this.ModalService.selectOptionModal(options).then((opcionElegida) => {
		});
	}

	openTextAreaModal() {
		this.ModalService.textAreaModal({
			tituloModal: "Observación",
			icon: "VIEW",
			guardarOption: false,
			data: null,
			readOnly: true,
			sizeModal: "md"
		});
	}


	openOpcionesDeConfiguracion() {
		let optionsConfig = [{
			Id: 0,
			Configuracion: "Configuracion 1",
			Status: false
		}];

		this.ModalService.openOpcionesDeConfiguracion("Configurar Opciones", optionsConfig)
			.then(function (pResult) {
			}, function (pError) {
			});
	}

	openEditInputGenerico() {
		let optionsEdit: IInputEditModalOptions = {};
		optionsEdit.tituloModal = "Editar Value";
		optionsEdit.objetoAEditarLabel = "Value Actual";
		optionsEdit.objetoAEditarValue = 5;
		optionsEdit.objetoAEditarDisabled = true;
		optionsEdit.labelNuevoInput = "Nueva Value";
		optionsEdit.showObjetoAEditar = true;

		this.ModalService.openEditInputGenerico(optionsEdit)
			.then((pResult) => {
				this.$log.debug('pResult', pResult);
			}, (pError) => {
				this.$log.error('pError', pError);
			});
	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class RepoFrontModalesController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('RepoFrontModalesController');
		this.$log.debug('ON');
	}
	// #endregion
}