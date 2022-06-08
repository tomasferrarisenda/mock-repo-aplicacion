/**
 * @author:			Ezequiel Mansilla
 * @description:	Directiva para inputs
 * @type:			Directive
 **/
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saFormInputValidate', fwFormInputValidate);
		ngModule.directive('fwFormInputValidate', fwFormInputValidate);

		fwFormInputValidate.$inject = ['$log', '$compile', '$timeout'];
		function fwFormInputValidate ($log, $compile, $timeout) {
			return {
				restrict : 'A',
				require : '?^form',
				link: link
			};

			function link (scope, element, attrs, form) {
				// Seteo clases necesarias

				$timeout(function() {
					const name = setupDom(element[0]);
					// Inicializo mensajes de error
					scope.textErrorExist = {};
					
					if (!name) {
						$log.error('El atributo "name" es requerido', element);
						return;
					}
					if (!form) {
						$log.error('El elemento "' + name + '"" debe estar dentro de un "form".');
						return;
					}
					scope.$watch(watcherForModel(form, name), updateFor(name, element, form, scope));

				});
			}

			function watcherForModel(form, name) {
				return function () {
					if (name && form[name] && (form[name].$dirty || form.$submitted)) {
						return form[name].$invalid;
					}
				};
			}

			function updateFor(name, element, form, scope) {
				return function (hasError) {
					if (form[name].$dirty || form.$submitted) {
						addTextError(form, element, name, scope);
						if (hasError) {
							element.removeClass('has-success').addClass('has-error');
						} else {
							element.removeClass('has-error').addClass('has-success');
						}
					}
				};
			}

			/**
			 * Obtencion de los datos del elemento
			 * @param  {[type]} element [description]
			 * @return {[type]}         [description]
			 */
			function setupDom(element) {

				const label = element.querySelector('label');
				// Si hay label, le agrego la clase
				if (label) label.classList.add('control-label');
				
				const input = element.querySelector('input, textarea, select');
				var name;
				if (input) {
					const type = input.getAttribute('type');
					name = input.getAttribute('name');
					if (type !== 'checkbox' && type !== 'radio') {
						input.classList.add('form-control');
					}
				} else { // Si NO hay input
					const p = element.querySelector('p');
					if (p) p.classList.add('form-control-static');
				}

				element.classList.add('form-group');

				return name;
			}

			function addTextError(form, element, name, scope) {

				if (!scope.textErrorExist[name]) {
					scope.textErrorExist[name] = true;
					const errorElement = form.$name + '.' + name;
					$log.debug('elemento error', errorElement);
					const messages = '<sa-text-error model="' + errorElement + '" ></sa-text-error>';
					element.append($compile(messages)(scope));
				}
			}
		}

	};

	return module;

})();