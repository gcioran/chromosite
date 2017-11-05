// var app = angular.module('picdemo.lightbox', ['ngTouch', 'ui.bootstrap', 'ngAnimate','pascalprecht.translate','ngSanitize'])
var app = angular.module('picdemoLightbox', ['ui.bootstrap', 'ngTouch','ngAnimate','pascalprecht.translate','ngSanitize'])

app.config(['$translateProvider', function ($translateProvider) {
  $translateProvider.useStaticFilesLoader({
    prefix: 'l10n/',
    suffix: '.json'
});

  $translateProvider.preferredLanguage('RO');
	$translateProvider.useSanitizeValueStrategy('sce');
}]);
app.controller('PicModalCtrl', ['$scope', '$uibModal', '$translate', 'projectsService',
	function ($scope, $modal, $translate, projectsService) {
		$scope.showRomanian =true;
		$scope.key = 'EN';
		$scope.changeLanguage = function () {
    	$translate.use($scope.key);
			$scope.showRomanian = ('RO' === $scope.key ) ? true : false;
			$scope.key = (($scope.key) === "EN") ? "RO" : "EN";
  	};
    $scope.active = 0;
		$scope.positionInArray=0;
    $scope.count = 0;
		$scope.setDrawingsActive = function() {
      console.log('$scope.imagesObj[$scope.positionInArray].drawings', $scope);
      $scope.active = $scope.imagesObj[$scope.positionInArray].drawings;
		};
		$scope.setImagesActive = function() {
      $scope.active = 0;
		};
    $scope.setDescriptionActive = function() {
      console.log('setDescriptionActive', $scope.active);
      let index = $scope.imagesObj[$scope.positionInArray].src.length -1;
      $scope.active = index;
      console.log('setDescriptionActive', $scope.active);
    };
    $scope.hasDescription = function() {
      let index = $scope.imagesObj[$scope.positionInArray].src.length -1;
      return !!$scope.imagesObj[$scope.positionInArray].src[index].text;
    };
    $scope.test = function(index) {
      lastIndex = $scope.imagesObj[$scope.positionInArray].src.length -1;
      console.log('11', index, $scope);
    }
    $scope.$watch('active', function(newIndex, oldIndex) {
    if (Number.isFinite(newIndex) && newIndex!==oldIndex) {
        console.log('newIndex', newIndex);
    }
  });
    $scope.imagesObj = projectsService;
	  $scope.open=function(indx){
	    // indx.src.active=true; ??? no need
			$scope.positionInArray=$scope.imagesObj.indexOf(indx);
      $scope.slides = $scope.imagesObj[$scope.positionInArray].src;
      $scope.modalInstance=$modal.open({
        animation: true,
        templateUrl: 'angular/pic-modal.html',
        scope: $scope
      });
    };

	  $scope.ok = function () {
			$scope.modalInstance.close();
      $scope.active = 0;
		};

    $scope.imagesObj.forEach(addIndexes);

    function addIndexes(element) {
      element.src.forEach(addID);
    }

    function addID(element, index) {
      element.id = index;
    }
    console.log('$scope.imagesObj', $scope.imagesObj);
}]);
