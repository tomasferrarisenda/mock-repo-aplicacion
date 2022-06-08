/**
 * @author:			Ezequiel Mansilla
 * @description:	Modulo para validacion de formulario
 * @type:			Module
 **/
import * as angular from 'angular';
import fwCuilDirective from './directives/fwCuilDirective';
import fwDecimalDirective from './directives/fwDecimalDirective';
// import fwDateTime from './directives/fwDateTimeDirective';
import fwDniDirective from './directives/fwDniDirective';
import fwEmailDirective from './directives/fwEmailDirective';
import fwIntegerDirective from './directives/fwIntegerDirective';
import fwPercentageDirective from './directives/fwPercentageDirective';
import fwPhoneDirective from './directives/fwPhoneDirective';
import fwTextDirective from './directives/fwTextDirective';
import fwTextErrorDirective from './directives/fwTextErrorDirective';
import fwFormInputDirective from './directives/fwFormInputDirective';
import fwFormInputValidateDirective from './directives/fwFormInputValidateDirective';
import fwBtnBackDirective from './directives/fwBtnBackDirective';
import fwDateInputDirective from './directives/fwDateInputDirective';
import formDirective from './form/formDirective';
import ngFormDirective from './form/ngFormDirective';
import './refresh/app';
import 'angular-messages';

(function () {
	'use strict';
		
	/* Core.Validator Module */
	const ngModule = angular.module('core.validator', [
			'core.validator.refresh',
			'ngMessages'
		]);

	fwCuilDirective.init(ngModule);
	fwDecimalDirective.init(ngModule);
	// fwDateTime.init(ngModule);
	fwDniDirective.init(ngModule);
	fwEmailDirective.init(ngModule);
	fwIntegerDirective.init(ngModule);
	fwPercentageDirective.init(ngModule);
	fwPhoneDirective.init(ngModule);
	fwTextDirective.init(ngModule);
	fwTextErrorDirective.init(ngModule);
	fwDateInputDirective.init(ngModule);

	fwFormInputDirective.init(ngModule);
	fwFormInputValidateDirective.init(ngModule);

	fwBtnBackDirective.init(ngModule);

	formDirective.init(ngModule);
	ngFormDirective.init(ngModule);

	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Validator');
		$log.debug('ON.-');
	}

})();