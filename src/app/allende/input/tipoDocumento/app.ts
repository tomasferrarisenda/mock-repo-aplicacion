/**
 * @author:			Ezequiel Mansilla
 * @description:	Tipo documento
 * @type:			Module
 **/
import * as angular from 'angular';
import saTipoDocumentoComboDirective from "./saTipoDocumentoComboDirective";
import saTipoDocumentoComboOldDirective from "./saTipoDocumentoComboOldDirective";

(function () {
	'use strict';
	/* Allende.Input.TipoDocumento Module */
		const ngModule = angular.module('allende.input.tipoDocumento',[]);

		saTipoDocumentoComboDirective.init(ngModule);
		saTipoDocumentoComboOldDirective.init(ngModule);
		
		ngModule.run(run);

		run.$inject = ['Logger'];

		function run ($log) {
			$log = $log.getInstance('Allende.Input.TipoDocumento');
			$log.debug('ON.-');
		}
})();