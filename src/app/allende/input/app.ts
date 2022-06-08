/**
 * @author:			Ezequiel Mansilla
 * @description:	Componentes inputs
 * @type:			Module
 **/
import * as angular from 'angular';
import saDatePicker from "./directives/saDatePicker";
import saTimePicker from "./directives/saTimePicker";
import saDateTimePicker from "./dateTimePicker/saDateTimePicker";
import saFirmaMedico from "./directives/saFirmaMedico";
import saTiposDocumentos from "./directives/saTiposDocumentos";
import saSucursalCombo from "./directives/saSucursalCombo";
import saSucursalComboFiltrado from "./directives/saSucursalComboFiltrado";
import saCheckBox from "./directives/saCheckBox";
import {SucursalSelectComponent} from './components'
// import DateTimePickerComponent from "./components/DateTimePickerComponent";

import "./numeroDocumento/app";
import "./tipoDocumento/app";

(function () {
	'use strict';
	/* Allende.Input Module */
	const ngModule = angular.module('allende.input',[
			'allende.input.numeroDocumento',
			'allende.input.tipoDocumento'
		]);

	saDatePicker.init(ngModule);
	saTimePicker.init(ngModule);
	saDateTimePicker.init(ngModule);
	saFirmaMedico.init(ngModule);
	saTiposDocumentos.init(ngModule);
	saSucursalCombo.init(ngModule);
	saSucursalComboFiltrado.init(ngModule);
	saCheckBox.init(ngModule);
	SucursalSelectComponent.init(ngModule);
	// DateTimePickerComponent.init(ngModule);

	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Allende.Input');
		$log.debug('ON.-');
	}
})();