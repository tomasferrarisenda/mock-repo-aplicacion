/**
 * @author:			Ezequiel Mansilla
 * @description:	Renderizacion de ABMC
 * @type:			Module
 **/
import * as angular from 'angular';
import fwAbmcRenderDirective from "./fwAbmcRenderDirective";

(function () {
	'use strict';
		/* Core.Component.Abmc.Render Module */
		const ngModule = angular.module('core.component.abmc.render',[]);

		fwAbmcRenderDirective.init(ngModule);
		ngModule.run(run);

		run.$inject = ['Logger'];

		function run ($log) {
			$log = $log.getInstance('Core.Component.Abmc.Render');
			$log.debug('ON.-');
		}

})();