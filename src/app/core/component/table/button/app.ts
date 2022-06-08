/**
 * @author:			Ezequiel Mansilla
 * @description:	Boton en tabla generica
 * @type:			Module
 **/
import * as angular from 'angular';
import Button from "./Button";
import ButtonSet from "./ButtonSet";
import fwTableButtonSetDirective from "./fwTableButtonSetDirective";
import fwTableButtonDirective from "./fwTableButtonDirective";
import fwButtonsInitializerDirective from "./fwButtonsInitializerDirective";

(function () {
	'use strict';
	/* Core.Component.Table.TableButton Module */
	const ngModule = angular.module('core.component.table.tableButton',[]);

	Button.init(ngModule);
	ButtonSet.init(ngModule);
	fwTableButtonSetDirective.init(ngModule);
	fwTableButtonDirective.init(ngModule);
	fwButtonsInitializerDirective.init(ngModule);
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Component.Table.TableButton');
		// $log.debug('ON.-');
	}

})();