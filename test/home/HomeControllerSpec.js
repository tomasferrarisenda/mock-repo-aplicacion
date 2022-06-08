// 'use strict';

// define(['dist/app/core/app', 'dist/app/support/app', 'angularMocks'],
// 	function() {
		
// 		describe('HomeController', function() {
			
// 			var $controller, HomeController, $rootScope;

// 			beforeEach(module('core'));
// 			beforeEach(module('support'));

// 			beforeEach(inject(function($injector){

// 				$rootScope = $injector.get('$rootScope');
// 				$controller = $injector.get('$controller'); // es lo mismo que usar inject(function(_$controller){ ..body })
// 				$rootScope.globals = {
// 					currentUser: {
// 						userName: 'pUserName',
// 						authData: 'authData',
// 						role: 'prueba1, prueba2'
// 					}
// 				};
// 			}))

// 			beforeEach(function() {
// 				HomeController = $controller('HomeController');
// 			});

// 			describe('Nombre pagina:', function() {

// 				it('Debe estar definido', function() {
// 					dump(HomeController.nombrePagina);
// 					expect(HomeController.nombrePagina).toBeDefined();
// 				});
				
// 				it('Debe ser HOME', function() {
// 					expect(HomeController.nombrePagina).toEqual('HOME');
// 				});
// 			});
// 		});
// 	}
// );