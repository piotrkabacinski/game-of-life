describe('Game of life unit tests', function() {

    beforeEach( module('gol') );

    var $controller;

    beforeEach(inject(function(_$controller_){

     $controller = _$controller_;
   
  }));

 describe('$scope & service tests', function() {

   it('This value should be true when env ins ready', function() {

     var $scope = {};
     var controller = $controller('mainController', { $scope: $scope });

     $scope.select( 1 , 2 );

     expect( $scope.statuses.ready ).toBe( true );

   });

   it('Should breed dead cells to init an app', function() {

     var $scope = {};
     var controller = $controller('mainController', { $scope: $scope });

     expect( Object.keys( $scope.cells ).length ).toBe( 900 );

   });

   it('Should add a Cell to Society', function() {

     var $scope = {};
     var controller = $controller('mainController', { $scope: $scope });

     $scope.select( 1 , 2 );

     expect( Object.keys($scope.society).length ).toBe( 1 );

   });


   it('Should step a one cycle', function() {

     var $scope = {};
     var controller = $controller('mainController', { $scope: $scope });

     $scope.go();

     expect( $scope.statuses.cycle ).toBe( 1 );

   });

   it('Should homicide all active cells', function() {

     var $scope = {};
     var controller = $controller('mainController', { $scope: $scope });

     $scope.select( 1 , 2 );
     $scope.homicide();

     expect( Object.keys($scope.society).length ).toBe( 0 );

   });


 });

});