/**
 * @author:			Pablo Pautasso
 * @description:	calendar implementando ui-calendar Dec 13 2016
 * @type:			Module
 **/

import * as angular from 'angular';
import './uiCalendar';
import 'fullcalendar';
import 'fullcalendar-scheduler';
import './fullcalendarmonth.scss';

(function () {
	'use strict';
	/* Integration.Calendar Module */
	const ngModule = angular.module('integration.calendar', [
			'ui.calendar'
		]);

	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Integration.Calendar');
		$log.info('ON.-');
	}
	
})();