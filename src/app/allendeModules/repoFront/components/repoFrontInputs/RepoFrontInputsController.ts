/**
* @author: ppautasso
* @description: repo para mostrar los inputs del sistema controller
* @type: Controller
**/
import * as angular from 'angular';

export class RepoFrontInputsController implements angular.IController {

	// #region /* --------------------------------------- PROPIEDADES --------------------------------------- */
	title = {
		name: '', // Desde la vista (HTML) se accede con vm.title.name
		icon: '' // Desde la vista (HTML) se accede con vm.title.icon
	};
	// mas propiedades ..
	codeHtml;
	fecha1 = new Date();
	fecha2 = new Date();
	
	dropdownOptions;
	// #endregion

	// #region /* --------------------------------------- CONSTRUCTOR --------------------------------------- */
	// ID
	static $inject: Array<string> = ['Logger'];
	/**
	* @class RepoFrontInputsController
	* @constructor
	*/
	constructor(private $log: ILogger) {
	}

	// #endregion

	// #region /* ----------------------------------------- MÉTODOS ----------------------------------------- */
	clickElement(event) {
	
		switch (event) {
			case 1:
				this.codeHtml = angular.copy('<sa-sucursal-combo id="" ng-model="vm.sucursal" ng-click=""></sa-sucursal-combo>');
				break;
			case 2:
				this.codeHtml = angular.copy('<sa-sucursal-combo-filtrado if-h3="true" ng-model="vm.sucursal" todas="true"></sa-sucursal-combo-filtrado>');
				break;
			case 3:
				this.codeHtml = angular.copy('<sa-selector-servicio-medico ng-model="vm.servicioMedico" if-label="true"></sa-selector-servicio-medico>');
				break;
			case 4:
				this.codeHtml = angular.copy('<sa-selector-recurso ng-model="vm.recurso" if-label="true" ></sa-selector-recurso>');
				break;
			case 5:
				this.codeHtml = angular.copy('<sa-buscador-paciente ng-model="vm.data.paciente" buscador-nombre-apellido-if="true" ></sa-buscador-paciente>');
				break;
			case 6:
				this.codeHtml = angular.copy('<label for="fechaName">Fecha DatePicker</label>'+
				'<sa-date-picker name="fechaName" model="vm.fecha" >'+
				'</sa-date-picker>');
				break;
			case 7:
				this.codeHtml = angular.copy('<label for="datePickerDesde ">Fecha Datetimepicker</label>'+
				'<sa-date-time-picker ng-model="vm.fechaDesde " id="1" type="date">'+
				'</sa-date-time-picker>');
				break;
			case 8:
				this.codeHtml = angular.copy('<sa-new-mutual-selector model="vm.mutualElegida" labelCodigo="Código Mutual" labelNombre="NombreMutual"></sa-new-mutual-selector>');
				break;
			case 9:
				this.codeHtml = angular.copy("<fw-drop-down-container icon='MENU' label='Dropdown de opciones' >" +
				"<fw-drop-down-set>" +
				"	<fw-drop-down-item" +
				"		ng-repeat='item in vm.dropdownOptions'" +
				"		color='green' "+
				"		item='item'" +
				"		label-attribute='Nombre'" +
				"		status-attribute='Activado'" +
				"		action='vm.changeItem(item)'>" +
				"	</fw-drop-down-item>" +
				"</fw-drop-down-set>" +
				"<fw-drop-down></fw-drop-down>" +
			"</fw-drop-down-container>");
				break;
		
		}
	}

	changeItem(item) {
		
	}

	// #endregion

	// #region /* ------------------------------------------ EVENTOS ------------------------------------------ */

	/**
	* @class RepoFrontInputsController
	* @description Se ejecuta automáticamente al cargar el controller en la vista (Después del constructor)
	* @event
	*/
	$onInit() {
		this.$log = this.$log.getInstance('RepoFrontInputsController');
		this.$log.debug('ON');

		this.dropdownOptions = [{
			Id : 1,
			Nombre: 'Item 1',
			Activado: false
		},
		{
			Id : 2,
			Nombre: 'Item 2',
			Activado: true
		},
		{
			Id : 3,
			Nombre: 'Item 3',
			Activado: false
		}]
	}
	// #endregion
}