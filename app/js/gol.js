angular.module("gol" , [])

// Config

.constant( 'config' , {
     cellsAmount : 2025,
     timeout : 300,
     logs: false
})

// Controller

.controller( 'mainController' , [
	'$scope' ,
	'$log' ,
	'$timeout' ,
	'$q' ,
	'cells' ,
	'config' , function( $scope , $log , $timeout , $q , cells , config ) {

	"use strict";

	$log.info('Game of life initiated');

	$scope.statuses = {
		ready: false,
		timeout : true,
		pause : false,
		cycle: 0
	};

  	// List of cells that are used in calucations
	$scope.society = {};

	$scope.statuses.cycle = 0;

	// Visible world
	$scope.cells = cells.breed( config.cellsAmount );

	$scope.select = function( x , y ) {

		var selection = cells.select( x , y );

    	// If there's no cell in society - add it
		if( $scope.society[ selection.selectId ] === undefined && $scope.statuses.pause == false ) {

			$scope.society[ selection.selectId ] = selection.selectedCell;

    	// Unselect and remove cell from society
		} else {

			config.logs && $log.info( "Cell "+selection.selectId+" unselected" );

			delete $scope.society[ selection.selectId ];

		}

   		// Control buttons visibility
		$scope.statuses.ready = ( Object.keys($scope.society).length > 0 ) ? true : false;

		return;

	};

	$scope.go = function() {

		$scope.society = cells.digest( $scope.society );

		if( Object.keys( $scope.society) .length == 0 ) {

			$scope.statuses.ready = false;
			alert("No cells alive");


		}

		$scope.statuses.cycle +=1;

		return;

	};

	$scope.homicide = function() {

		$scope.society = cells.homicide();

		$scope.statuses.ready = false;
		$scope.statuses.cycle = 0;

		return;

	};

	$scope.run = function() {

			$scope.statuses.timeout = true;
			$scope.statuses.pause = true;

			var go = function() {

				if( $scope.statuses.timeout === false ) {

					$timeout.cancel( timer );

				} else if( Object.keys($scope.society).length == 0 ) {

					$timeout.cancel( timer );
					$scope.statuses.timeout = false;
					$scope.statuses.pause = false;
					$scope.statuses.ready = false;

					alert("No cells alive");

				}

				var deferred = $q.defer(),
			   		timer = $timeout(function() {

			    	$scope.society = cells.digest( $scope.society );
			    	$scope.statuses.cycle += 1;

			    	deferred.resolve("It's done!");

			    }, config.timeout );

				return deferred.promise;

			};

			go().then(function() {

				if( $scope.statuses.timeout === true ) {

					$scope.run();

				}

			});

	};

	$scope.pause = function() {

		$scope.statuses.timeout = false;
		$scope.statuses.pause = false;

		return;

	};

	$scope.logSociety = function() {

		$log.log( $scope.society );

		return;

	};


}])

// Directives
.directive( "gol" , [ function() {

  "use strict";

  return {

    restrict: "E",
    template: '<section class="container-fluid" ng-include="\'app/views/gol.html\'"></section>'

  };

}])

.directive( 'map' , [ '$log' , 'config' , function( $log , config ) {

  "use strict";

  return {

    restrict: "E",
    transclude: true,
    template: '<div id="world" ng-transclude></div>',

    link: function( scope , element ) {

    	var cellsAmount = Math.round( Math.sqrt( config.cellsAmount ) , 0 );

    	element[0].children[0].style.width = cellsAmount * 10 + cellsAmount + "px";

    	return;

    }

  };

}])

.directive( "cell" , [ function() {

  "use strict";

  return {

    restrict: "E",
    template: '<div class="cell"></div>'

  };

}])

// Services

.service( "cells" , [ "$log" , 'config' , function( $log , config ) {

  "use strict";

	var cells = {},

		breed = function( cellsAmount ) {

			var row = Math.round( Math.sqrt( cellsAmount ) , 0 ),
				allCells = row * row,
				x,
				y,
				collumn = 1,
				element = 0;

			for( var i = 0; i < allCells; i++ ) {

				x = collumn;
				y = element = element + 1;

				cells[i] = {
					id: x+"-"+y,
					x : x,
					y : y,
				};

				if( element == row ) {

					element = 0;
					collumn += 1;

				}

			}

			return cells;

		},

		select = function( x , y ) {

			var selectId = "x"+x+"y"+y,
				cell = document.getElementById( selectId );
				// cell.children[0].classList.add("alive");

			config.logs && $log.info( "Cell " + selectId +" selected" );

			return {

				selectId : selectId,
				selectedCell : {
					x: x,
					y: y,
					id : selectId,
					status : "alive",
					neighbours : 0
				}

			};


		},

		digest = function( society ) {

			var checkNeighbours = function( society ) {

				angular.forEach( society , function( cell , key ) {

					var neighboursXYcoordinates = [ [ -1 , -1 ] , [ 0 , -1 ] , [ 1 , -1 ] , [ -1 , 0 ] , [ 1 , 0 ] , [ -1 , 1 ] , [ 0 , 1 ] , [ 1 , 1 ] ],
						selectId = "x"+cell.x+"y"+cell.y,
						coordinates,
						nId,
						nX,
						nY;

					for( var i = 0; i < 8; i++ ) {

						nX = cell.x + neighboursXYcoordinates[i][0];
						nY = cell.y + neighboursXYcoordinates[i][1];
						nId = "x"+nX.toString()+"y"+nY.toString();

							if( society[nId] === undefined ) {

								society[nId] = {
									x: nX,
									y: nY,
									id: "x"+nX+"y"+nY,
									status : "fresh",
									neighbours : 1
								};

							} else {

								society[nId].neighbours += 1;
							}

						}					

					});

					return society;

				};

				var lifeOrDeath = function( society ) {

					var element,
						cell;

					angular.forEach( society , function( cell , key ) {

						if( cell.status == "alive" && cell.neighbours > 1 && cell.neighbours < 4 ) {

							cell.status = "alive";
							config.logs && $log.log( cell.id +" is still alive" );

						} else if ( cell.status == "fresh" && cell.neighbours == 3 ) {

							cell.status = "alive";
							config.logs && $log.log( cell.id +" became alive" );

						} else {
							
							cell.status = "dead";							

						}

						cell.neighbours = 0;

						if( cell.status == "dead" ) {

							config.logs && $log.log( cell.id +" has been killed" );
							delete society[cell.id];

						}

					});

					return society;

				};


				society = checkNeighbours( society );
				society = lifeOrDeath( society );

				return society;

			},

			homicide = function() {

				return {};

			};

		return {

			breed: breed,
			select: select,
			digest : digest,
			homicide : homicide

		};

}]);