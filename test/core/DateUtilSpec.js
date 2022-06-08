'use strict';

define(['dist/app/config/app', 'dist/app/core/app','dist/app/integration/app', 'angularMocks'],
	function() {

		describe('DateUtil', function() {
			beforeEach(module('config'));
			beforeEach(module('integration'));
			beforeEach(module('core'));

			var DateUtil;

			beforeEach(inject(function($injector){
				DateUtil = $injector.get('DateUtils');
			}));

			describe('getDateFromBE', function () {
				var valor;

				beforeEach(function () {
					valor = DateUtil.parseFromBE('2016-05-20T10:54:00');
				});

				it('Deberia retornar el anio correcto', function() {
					expect(valor.getFullYear()).toEqual(2016);
				});

				it('Deberia retornar el mes (posición) correcto', function() {
					expect(valor.getMonth()).toEqual(4);
				});

				it('Deberia retornar el dia correcto', function() {;
					expect(valor.getDate()).toEqual(20);
				});

				it('Deberia retornar la hora correcto', function() {
					expect(valor.getHours()).toEqual(10);
				});

				it('Deberia retornar los minutos correctos', function() {
					expect(valor.getMinutes()).toEqual(54);
				});				
				
			});

			describe('getDateForBE', function () {
				var valor;

				beforeEach(function () {
					var fecha = new Date(2016,5,20,10,54);
					valor = DateUtil.parseToBe(fecha);
				});

				it('Deberia retornar el el string correcto para el backend', function() {
					expect(valor).toEqual('06/20/2016 10:54');
				});				
			});
		});
	}
);