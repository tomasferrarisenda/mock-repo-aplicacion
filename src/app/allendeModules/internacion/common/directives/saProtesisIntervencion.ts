/**
 * @author 			emansilla
 * @description 	description
 */
import protesisTetmplate = require('../templates/sa-intervencion-protesis.tpl.html');
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saProtesisIntervencion', saProtesisIntervencion);

		saProtesisIntervencion.$inject = [];
		function saProtesisIntervencion () {
			
			return {
				restrict : 'E',
				scope : {
					model : '=',
					title : '@?',

					changed : '=',
					required : '=?',
					user : '=',
					
					/* Deposito */
					full : '=?',
					depositoFarmacia : '=?',
					depositoEsterilizacion : '=?',
					depositoHuesos : '=?',

					/* Botones */

					btnNewDisabled : '=?',
					btnNewIf : '=?',

					btnEditDisabled : '=?',
					btnEditIf : '=?',

					btnDeleteDisabled : '=?',
					btnDeleteIf : '=?',

					btnRecepcionIf : '=?',
					btnRecepcionDisabled : '=?',

					btnVerificarIf : '=?',
					btnVerificarDisabled : '=?',

					btnEsterilizarIf : '=?',
					btnEsterilizarDisabled : '=?',

					btnEntregaIf : '=?',
					btnEntregaDisabled : '=?',

					btnObservacionesIf : '=?',
					btnObservacionesDisabled : '=?',

					/* Print */

					print : '=?'
				},
				template  : protesisTetmplate,
				controller : ProtesisIntervencion,
				controllerAs: 'vm',
				bindToController: true
			};
		}

		ProtesisIntervencion.$inject = ['$scope', 'Logger', 'ProtesisLogicService', 'ModalService'];
		function ProtesisIntervencion ($scope, $log, ProtesisLogicService, ModalService) {

			$log = $log.getInstance('ProtesisIntervencion');

			var vm = this;

			vm.sinDatos = 'Sin datos';
			vm.loading = false;
			vm.length = 0;
			vm.esVisible = esProtesisVisible;

			vm.btnNewClick = openNewProtesis;
			vm.btnEditClick = openEditProtesis;
			vm.btnDeleteClick = removeProtesis;
			vm.btnRecepcionClick = registrarRecepcion;
			vm.btnVerificarClick = registrarVerificacion;
			vm.btnEsterilizarClick = registrarEsterilizacion;
			vm.btnEntregaClick = registrarEntrega;
			vm.btnObservacionesClick = showObservaciones;

			function openNewProtesis () {
				vm.loading = true;
				ProtesisLogicService.newProtesis()
				.then(openNewProtesisOk, openNewProtesisError);

				function openNewProtesisOk (pProtesis) {
					vm.loading = false;
					var _maxProtesis = 10;
					
					if(vm.model.length < _maxProtesis) {
						vm.model.push(pProtesis);
						changeForm();
						$log.debug('FormProtesis: ', $scope.formProtesis);
					}
					else
						ModalService.info('No puedo agregar mas de ' + _maxProtesis + ' protesis');
				}

				function openNewProtesisError (pError) {
					vm.loading = false;
				}
			}

			function removeProtesis (pIndex) {
				ProtesisLogicService.removeProtesis(pIndex, vm.model)
				.then(removeProtesisOk);

				function removeProtesisOk () {
					changeForm();
				}
			}

			function openEditProtesis (pProtesis) {
				ProtesisLogicService.editProtesis(pProtesis, vm.user)
				.then(successCallback);
			}

			function registrarRecepcion (pProtesis) {
				ProtesisLogicService.registrarRecepcion(pProtesis, vm.user)
				.then(successCallback);
			}

			function registrarVerificacion (pProtesis) {
				ProtesisLogicService.registrarVerificacion(pProtesis, vm.user)
				.then(successCallback);
			}

			function registrarEsterilizacion (pProtesis) {
				ProtesisLogicService.registrarEsterilizacion(pProtesis, vm.user)
				.then(successCallback);
			}

			function registrarEntrega (pProtesis) {
				ProtesisLogicService.registrarEntregaBanco(pProtesis, vm.user)
				.then(successCallback);
			}

			function showObservaciones (pProtesis) {
				if (pProtesis.id_protesis_preadmision)
					ProtesisLogicService.showObservaciones(pProtesis, vm.user);
			}

			function successCallback (pProtesisList) {
				vm.model = pProtesisList;
				ModalService.success('Se guardaron los cambios exitosamente.');

				vm.changed = true;
			}

			function changeForm () {
				if ($scope.formProtesis) {
					$scope.formProtesis.$pristine = false;
					if ($scope.formProtesis.$$parentForm)
						$scope.formProtesis.$$parentForm.$pristine = false;
				}
			}

			function esProtesisVisible (pProtesis) {
				var flag = false,
					nombreDeposito;

				if (vm.full) {
					flag = true;
				} else {

					if (pProtesis.DepositoProtesisDestino) {
						nombreDeposito = pProtesis.DepositoProtesisDestino.nombre_deposito_protesis;
					} else if (ProtesisLogicService.esProveedorBancoInterno(pProtesis.ProveedorPreadmisionSugerido)) {
						nombreDeposito = 'HUESOS';
					}

					switch (nombreDeposito) {
						case 'ESTERILIZACIÓN':
							if (vm.depositoEsterilizacion) flag = true;
							break;
						case 'FARMACIA':
							if (vm.depositoFarmacia) flag = true;
							break;
						case 'HUESOS':
							if (vm.depositoHuesos)
								flag = true;
							else if (!vm.depositoEsterilizacion && !vm.depositoFarmacia)
								flag = true;
							break;
						default:
							// Si no es de ningún deposito => Recinén creadoa
							if (!vm.depositoEsterilizacion && !vm.depositoFarmacia && !vm.depositoHuesos)
								flag = true;
							break;
					}
				}

				return flag;
			}

			// Watch para cantidad de prótesis
			$scope.$watch(function () {
				if (vm.model && vm.model.length)
					return vm.model.length;
				else 
					return 0;
			}, function (newVal) {
				vm.length = newVal;
			});

			activate();
			function activate () {
				// vm.length = 0;
			}
		}
	}

	return module;

})();