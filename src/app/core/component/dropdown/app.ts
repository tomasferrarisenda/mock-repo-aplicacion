/**
 * @author:			Ezequiel Mansilla
 * @description:	DropDown
 * @type:			Module
 **/
import * as angular from 'angular';
import DropDown from "./models/DropDown";
import DropDownItem from "./models/DropDownItem";
import fwDropDownContainerDirective from "./fwDropDownContainerDirective";
import fwDropDownSetDirective from "./fwDropDownSetDirective";
import fwDropDownItemDirective from "./fwDropDownItemDirective";
import fwDropDownDirective from "./fwDropDownDirective";
import fwInputDrowDownDirective from "./fwInputDrowDownDirective";

(function () {
	'use strict';
	/* Core.Component.Dropdown Module */
	const ngModule = angular.module('core.component.dropdown',[]);

	DropDown.init(ngModule);
	DropDownItem.init(ngModule);

	fwDropDownContainerDirective.init(ngModule);
	fwDropDownSetDirective.init(ngModule);
	fwDropDownItemDirective.init(ngModule);
	fwDropDownDirective.init(ngModule);
	fwInputDrowDownDirective.init(ngModule);

	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Component.Dropdown');
		$log.debug('ON.-');
	}

})();