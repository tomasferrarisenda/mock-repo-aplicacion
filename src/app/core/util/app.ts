/**
 * @author:			Ezequiel Mansilla
 * @description:	Modulo de utilidades
 * @type:			Module
 **/
import * as angular from 'angular';
import constants from './config/constants';
import DateUtils from './services/DateUtils';

import fwCeroNotDirective from './directives/fwCeroNotDirective';
import fwEnterDirective from './directives/fwEnterDirective';
import fwEscapeDirective from './directives/fwEscapeDirective';
import fwEnterClickDirective from './directives/fwEnterClickDirective';
import fwPuntoClickDirective from './directives/fwPuntoClickDirective';
import fwInputImporte from './directives/fwImporteDirective';
import fwPreventRightClickDirective from './directives/fwPreventRightClickDirective';
import fwInitBindDirective from './directives/fwInitBindDirective';
import fwTextLimitToDirective from './directives/fwTextLimitToDirectve';

import ageFilter from './filters/ageFilter';
import saToHtmlFilter from './filters/saToHtmlFilter';
import saToPlainTextFilter from './filters/saToPlainTextFilter';
import saCapitalizeFilter from './filters/saCapitalizeFilter';
import fwPickerFilter from './filters/fwPickerFilter';
import { TextAreaVisualizable, DynamicHtml } from './directives';
import './services/ArrayUtils';

(function () {
	'use strict';

	/* Core.Util Module */
	const ngModule = angular.module('core.util', []);

	constants.init(ngModule);

	/* Services */
	DateUtils.init(ngModule);

	/* Directives */
	fwCeroNotDirective.init(ngModule);
	fwEnterDirective.init(ngModule);
	fwEscapeDirective.init(ngModule);
	fwEnterClickDirective.init(ngModule);
	fwPuntoClickDirective.init(ngModule);
	fwInputImporte.init(ngModule);
	fwPreventRightClickDirective.init(ngModule);
	fwInitBindDirective.init(ngModule);
	TextAreaVisualizable.init(ngModule);

	fwTextLimitToDirective.init(ngModule);
	DynamicHtml.init(ngModule);

	/* Filters */
	ageFilter.init(ngModule);
	saToHtmlFilter.init(ngModule);
	saToPlainTextFilter.init(ngModule);
	saCapitalizeFilter.init(ngModule);
	fwPickerFilter.init(ngModule);

	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Util');
		$log.debug('ON.-');
	}
})();