/**
 * @author:			Ezequiel Mansilla
 * @description:	Estilo para botones
 * @type:			Module
 **/
import * as angular from 'angular';
import fwButtonOkDirective from "./fwButtonOkDirective";
import fwButtonSaveDirective from "./fwButtonSaveDirective";
import fwButtonCancelDirective from "./fwButtonCancelDirective";
import fwButtonCleanDirective from "./fwButtonCleanDirective";
import fwButtonSearchDirective from "./fwButtonSearchDirective";
import fwButtonPrintDirective from "./fwButtonPrintDirective";
import fwButtonAddDirective from './fwButtonAddDirective';


(function () {
	'use strict';
	/* Core.Styling.Button Module */
	const ngModule = angular.module('core.styling.button', []);

	fwButtonOkDirective.init(ngModule);
	fwButtonSaveDirective.init(ngModule);
	fwButtonCancelDirective.init(ngModule);
	fwButtonCleanDirective.init(ngModule);
	fwButtonSearchDirective.init(ngModule);
	fwButtonPrintDirective.init(ngModule);
	fwButtonAddDirective.init(ngModule);
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Styling.Button');
		$log.debug('ON.-');
	}
})();