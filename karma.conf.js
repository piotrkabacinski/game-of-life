module.exports = function(config) {

	config.set({

		basePath: '',
		frameworks: ['jasmine'],
		files: [
		  "node_modules/angular/angular.min.js",
		  "node_modules/angular-mocks/angular-mocks.js",
		  "src/app/gol.js",
			"src/app/gol.spec.js"
		],
		browsers: [ 'Chrome' , 'Firefox' ],
		customLaunchers: {
				Chrome_travis_ci: {
				base: 'Chrome',
				flags: ['--no-sandbox']
			}
		}

	});

	if(process.env.TRAVIS){

      config.browsers = ['Chrome_travis_ci'];

    }

};