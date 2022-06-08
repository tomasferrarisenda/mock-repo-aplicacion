/**
 * @author 			emansilla
 * @description 	main
 */
import * as angular from 'angular';
import { ConfigModule } from './config/app';
import { IntegrationModule } from './integration/app';
import { CommonModule } from './common/app';
import { CoreModule } from './core/app';
import { AllendeModule } from './allende/app';
import { AllendeModulesModule } from './allendeModules/app';

(function () {
	const modules = [
		ConfigModule,
		IntegrationModule,
		CommonModule,
		CoreModule,
		AllendeModule,
		AllendeModulesModule
	];

	var app = angular.module('app', modules.map(module => module.name));

	app.directive('check', check);

	function check() {
		return {
			restrict: 'A',
			link: function (scope, element, attributes) {
				element.on('click', function () {
					console.log('click');
				});
			}
		}
	}

	app.run(runMethod);

	runMethod.$inject = ['Logger'];
	function runMethod ($log) {
		$log = $log.getInstance('App');
		$log.info('ON.-');
	}
})();