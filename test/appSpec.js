'use strict';

define(['../src/app', 'angular-mocks'],
	function(app) {

		describe('App', function() {
			
			it('Deberia estar definido', function() {
				expect(app).toBeDefined();
			});
		});
	}
);