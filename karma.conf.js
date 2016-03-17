module.exports = function(config) {

	config.set({
		
		basePath: '',
		frameworks: ['jasmine'],
		files: [
		  "node_modules/angular/angular.min.js",
		  "node_modules/angular-mocks/angular-mocks.js",
		  "app/js/gol.js",
		  "app/js/unit-tests.js"
		],
		browsers: [ 'Chrome' , 'Firefox' ]
		
	});

};