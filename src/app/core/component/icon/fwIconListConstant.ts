/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.constant('ICON_LIST', [
			{
				name: 'NONE',
				value : ''
			},
			{
				name: 'OK',
				value : 'glyphicon glyphicon-ok'
			},
			{
				name: 'CANCEL',
				value : 'glyphicon glyphicon-remove'
			},
			{
				name: 'NEW',
				value : 'glyphicon glyphicon-plus'
			},
			{
				name: 'NEW2',
				value : 'glyphicon glyphicon-plus-sign'
			},
			{
				name: 'EDIT',
				value : 'glyphicon glyphicon-pencil'
			},
			{
				name: 'EDIT2',
				value : 'glyphicon glyphicon-edit'
			},
			{
				name: 'DEL',
				value : 'glyphicon glyphicon-remove'
			},
			{
				name: 'TRASH',
				value : 'glyphicon glyphicon-trash'
			},
			{
				name: 'LIST',
				value : 'glyphicon glyphicon-list'
			},
			{
				name: 'LIST2',
				value : 'glyphicon glyphicon-list-alt'
			},
			{
				name: 'LIST3',
				value : 'glyphicon glyphicon-th-list'
			},
			{
				name : 'LIST4',
				value : 'fa fa-list-alt'
			},
			{
				name: 'PRINT',
				value : 'glyphicon glyphicon-print'
			},
			{
				name: 'PRINT2',
				value : 'fa fa-print'
			},
			{
				name: 'NEXT',
				value : 'glyphicon glyphicon-chevron-right'
			},
			{
				name: 'PREV',
				value : 'glyphicon glyphicon-chevron-left'
			},
			{
				name: 'UP',
				value : 'glyphicon glyphicon-chevron-up'
			},
			{
				name: 'UP2',
				value : 'glyphicon glyphicon-arrow-up'
			},
			{
				name: 'DOWN',
				value : 'glyphicon glyphicon-chevron-down'
			},
			{
				name: 'DOWN2',
				value : 'glyphicon glyphicon-arrow-down'
			},
			{
				name: 'DOWN3',
				value : 'fa fa-level-down'
			},
			{
				name: 'DOWN4',
				value : 'fa fa-share fa-rotate-90'
			},
			{
				name: 'SORT',
				value : 'fa fa-sort'
			},
			{
				name: 'SORT_ASC',
				value : 'fa fa-sort-asc'
			},
			{
				name: 'SORT_DESC',
				value : 'fa fa-sort-desc'
			},
			{
				name : 'DOWNLOAD',
				value : 'glyphicon glyphicon-cloud-download'
			},
			{
				name: 'LEFT',
				value : 'glyphicon glyphicon-arrow-left'
			},
			{
				name : 'LEFT_DOUBLE',
				value : 'fa fa-angle-double-left fa-lg'
			},
			{
				name: 'RIGHT',
				value : 'glyphicon glyphicon-arrow-right'
			},
			{
				name: 'ERASER',
				value : 'fa fa-eraser'
			},
			{
				name: 'CLEAN',
				value : 'fa fa-eraser'
			},
			{
				name: 'CLEAR',
				value : 'fa fa-eraser'
			},
			{
				name: 'USER',
				value : 'glyphicon glyphicon-user'
			},
			{
				name: 'SHARE',
				value : 'glyphicon glyphicon-share'
			},
			{
				name: 'REPEAT',
				value : 'glyphicon glyphicon-repeat'
			},
			{
				name: 'RELOAD',
				value : 'glyphicon glyphicon-repeat'
			},
			{
				name: 'REFRESH',
				value : 'glyphicon glyphicon-refresh'
			},
			{
				name: 'BACKWARD',
				value: 'glyphicon glyphicon-backward'
			},
			{
				name: 'CALENDAR',
				value : 'glyphicon glyphicon-calendar'
			},
			{
				name: 'WARNING',
				value : 'glyphicon glyphicon-warning-sign'
			},
			{
				name: 'INFO',
				value : 'glyphicon glyphicon-info-sign'
			},
			{
				name: 'ERROR',
				value : 'glyphicon glyphicon-remove-sign'
			},
			{
				name: 'SUCCESS',
				value : 'glyphicon glyphicon-ok-sign'
			},
			{
				name: 'QUESTION',
				value : 'glyphicon glyphicon-question-sign'
			},
			{
				name: 'EXCLAMACION',
				value : 'glyphicon glyphicon-exclamation-sign'
			},
			{
				name: 'HOME',
				value : 'glyphicon glyphicon-home'
			},
			{
				name: 'HOME2',
				value : 'fa fa-home'
			},
			{
				name: 'PESOS',
				value : 'glyphicon glyphicon-usd'
			},
			{
				name: 'SEARCH',
				value : 'glyphicon glyphicon-search'
			},
			{
				name: 'OFF',
				value : 'glyphicon glyphicon-off salir'
			},
			{
				name: 'OFF2',
				value : 'glyphicon glyphicon-off'
			},
			{
				name: 'LOCK',
				value : 'glyphicon glyphicon-lock'
			},
			{
				name: 'CAMA',
				value : 'fa fa-bed'
			},
			{
				name: 'CHECK',
				value : 'glyphicon glyphicon-check'
			},
			{
				name: 'BED',
				value : 'glyphicon glyphicon-bed'
			},
			{
				name: 'PACIENTES',
				value : 'glyphicon glyphicon-user'
			},
			{
				name: 'SEGURIDAD',
				value : 'glyphicon glyphicon-lock'
			},
			{
				name: 'PREADMISION',
				value : 'glyphicon glyphicon-folder-open'
			},
			{
				name: 'ABOUT',
				value : 'glyphicon glyphicon-cog'
			},
			{
				name: 'CONF',
				value : 'glyphicon glyphicon-cog'
			},
			{
				name: 'MENU',
				value : 'glyphicon glyphicon-menu-hamburger'
			},
			{
				name: 'MENU_LEFT',
				value : 'glyphicon glyphicon-menu-left'
			},
			{
				name: 'MENU_RIGHT',
				value : 'glyphicon glyphicon-menu-right'
			},
			{
				name: 'SAVE',
				value : 'glyphicon glyphicon-save'
			},
			{
				name: 'OPEN',
				value : 'glyphicon glyphicon-open'
			},
			{
				name: 'VIEW', // Alias de EYE_OPEN
				value : 'glyphicon glyphicon-eye-open'
			},
			{
				name: 'EYE_OPEN',
				value : 'glyphicon glyphicon-eye-open'
			},
			{
				name: 'EYE_CLOSE',
				value : 'glyphicon glyphicon-eye-close'
			},
			{
				name: 'TRANSFER',
				value : 'glyphicon glyphicon-transfer'
			},
			{
				name: 'CART',
				value : 'glyphicon glyphicon-shopping-cart'
			},
			{
				name: 'ALERT',
				value : 'glyphicon glyphicon-alert'
			},
			{
				name: 'STATS',
				value : 'glyphicon glyphicon-stats'
			},
			{
				name: 'MINUS',
				value : 'glyphicon glyphicon-minus'
			},
			{
				name: 'MEDIKIT',
				value : 'fa fa-medkit'
			},
			{
				name: 'QUESTION-CIRCLE-O-LG',
				value : 'fa fa-question-circle-o fa-lg'
			},
			{
				name: 'INTERNADO',
				value : 'fa fa-wheelchair-alt fa-2x'
			},
			{
				name: 'REPLY',
				value : 'fa fa-reply'
			},
			{
				name: 'PLUS-SQUARE',
				value : 'fa fa-plus-square-o fa-2x'
			},{
				name: 'PLUS-SQUARE-2',
				value : 'fa fa-plus-square'
			},
			{
				name: 'CHECK-SQUARE',
				value : 'fa fa-check-square-o fa-2x'
			},
			{
				name: 'CHECK-FA',
				value: 'fa fa-check'
			},
			{
				name: 'MINUS-SQUARE',
				value : 'fa fa-minus-square-o fa-2x'
			},
			{
				name: 'PLUS',
				value : 'fa fa-plus'
			},
			{
				name: 'BELL',
				value : 'fa fa-bell-o'
			},
			{
				name: 'TRIANGLE',
				value : 'glyphicon glyphicon-triangle-top'
			},
			{
				name : 'TRIANGLE_LEF',
				value : 'glyphicon glyphicon-triangle-left'
			},
			{
				name : 'TRIANGLE_DOWN',
				value : 'glyphicon glyphicon-triangle-bottom'
			},
			{
				name : 'CALCULATOR',
				value : 'fa fa-calculator'
			},
			{
				name : 'BOOK',
				value : 'fa fa-book'
			},
			{
				name : 'HANDSHAKE',
				value : 'fa fa-handshake-o'
			},
			{
				name : 'COGS',
				value : 'fa fa-cogs'
			},
			{
				name : 'BALANZA',
				value : 'fa fa-balance-scale'
			},
			{
				name : 'COPY',
				value : 'fa fa-files-o'
			},
			{
				name : 'EXCHANGE',
				value : 'fa fa-exchange'
			},
			{
				name: 'OPTION-HORIZONTAL',
				value: 'glyphicon glyphicon-option-horizontal'
			},
			{
				name: 'EXTERNAL',
				value: 'fa fa-address-book'
			},
			{
				name: 'CIRCLE',
				value: 'fa fa-circle'
			},
			{
				name: 'WPFORM',
				value: 'fa fa-wpforms'
			},
			{
				name: 'CARPETA',
				value: 'fa fa-folder-open-o'
			},
			{
				name: 'ANULAR',
				value: 'fa fa-ban'
			},
			{
				name: 'PAUSE',
				value: 'fa fa-pause'
			},
			{
				name: 'PAUSE-CIRCLE',
				value: 'fa fa-pause-circle-o'
			},
			{
				name: 'CLOCK',
				value: 'fa fa-clock-o'
			},
			{
				name: 'CIRCLE_OK',
				value: 'fa fa-check-circle'
			},
			{
				name: 'FILE',
				value: 'fa fa-file'
			},
			{
				name: 'HAND_DOWN',
				value: 'fa fa-thumbs-down'
			},
			{
				name: 'PLUS_CIRCLE',
				value: 'fa fa-plus-circle'
			},
			{
				name: 'MINUS_CIRCLE',
				value: 'fa fa-minus-circle'
			},
			{
				name: 'COPYRIGHT',
				value: 'fa fa-copyright'
			},
			{
				name: 'REGISTERED',
				value: 'fa fa-registered'
			},
			{
				name: 'COMMENTING',
				value: 'fa fa-commenting-o'
			},
			{
				name: 'S',
				value: 'fa fa-scribd'
			},{
				name: 'CAM',
				value: 'fa fa-camera'
			},{
				name: 'EXCEL',
				value: 'fa fa-file-excel-o'
			}
			,{
				name: 'USER-CIRCLE',
				value: 'fa fa-user-circle '
			},{
				name: 'PHONE',
				value: 'fa fa-phone'
			}
		]);

	};
	return module;

})();