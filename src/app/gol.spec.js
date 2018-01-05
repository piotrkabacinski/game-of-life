describe('Game of life unit tests', function() {

    beforeEach(module('gol'));

    var $controller,
    	$scope;

    beforeEach(inject(function(_$controller_){
	    $scope = {};
	    $controller = _$controller_('mainController', { $scope: $scope });
  	}));

 describe('$scope & service tests', function() {

   it('This value should be true when env ins ready', function() {

     $scope.select(1 , 2);
     expect($scope.statuses.ready).toBe(true);

   });

   // To pass this test make sure that amount of "dead cells" is equal to value in config constant
   it('Should breed dead cells to init an app', function() {
     expect(Object.keys($scope.cells).length).toBe(2025);
   });

   it('Should add a Cell to Society', function() {
     $scope.select(1 , 2);
     expect(Object.keys($scope.society).length).toBe(1);
   });


   it('Should step a one cycle', function() {
     $scope.go();
     expect($scope.statuses.cycle).toBe(1);
   });

   it('Should homicide all active cells', function() {
     $scope.select(1 , 2);
     $scope.homicide();
     expect(Object.keys($scope.society).length).toBe(0);
   });

 });

});