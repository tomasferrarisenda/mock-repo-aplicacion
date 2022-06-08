/**
 * @author:			Ezequiel Mansilla
 * @description:	Componentes
 * @type:			Module
 **/
import * as angular from 'angular';
import "./abmc/app";
import "./body/app";
import { CoreCarouselModule } from './carousel';
import "./content/app";
import "./dropdown/app";
import "./footer/app";
import "./header/app";
import "./icon/app";
import "./image/app";
import "./inputFileUpload/app";
import "./loading/app";
import "./menu/app";
import "./panel/app";
import "./section/app";
import "./sidebar/app";
import {CoreSuccessAnimationModule} from "./successAnimation";
import "./systemInfo/app";
import "./table/app";
import "./tabs/app";
import "./title/app";
import "./userData/app";

(function () {
	'use strict';
	
	/* Core.Component Module */
	const ngModule = angular.module('core.component',[
			'core.component.abmc',
			'core.component.body',
			CoreCarouselModule.name,
			'core.component.content',
			'core.component.dropdown',
			'core.component.footer',
			'core.component.header',
			'core.component.icon',
			'core.component.image',
			'core.component.fileUpload',
			'core.component.loading',
			'core.component.menu',
			'core.component.panel',
			'core.component.section',
			'core.component.sidebar',
			CoreSuccessAnimationModule.name,
			'core.component.systemInfo',
			'core.component.table',
			'core.component.tabs',
			'core.component.title',
			'core.component.userData'
		]);

	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Component');
		$log.debug('ON.-');
	}
})();