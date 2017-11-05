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
		$scope.positionInArray=0;
    $scope.count = 0;
		$scope.setDrawingsActive = function() {
      $scope.slides.active = $scope.imagesObj[$scope.positionInArray].drawings;
		};
		$scope.setImagesActive = function() {
      $scope.slides.active = 0;
		};
    $scope.setDescriptionActive = function() {
      let index = $scope.imagesObj[$scope.positionInArray].src.length -1;
      $scope.slides.active = index;
    };
    $scope.hasDescription = function() {
      let index = $scope.imagesObj[$scope.positionInArray].src.length -1;
      return !!$scope.imagesObj[$scope.positionInArray].src[index].text;
    };
    $scope.swipeNext = function(index) {
      const lastIndex = $scope.imagesObj[$scope.positionInArray].src.length -1;
      if (lastIndex === $scope.slides.active) {
        $scope.slides.active = -1;
      }
      $scope.slides.active = $scope.slides.active +1;
    }
    $scope.swipePrevious = function(index) {
      const lastIndex = $scope.imagesObj[$scope.positionInArray].src.length -1;
      if ($scope.slides.active === 0) {
        $scope.slides.active = lastIndex + 1;
      }
      $scope.slides.active = $scope.slides.active -1;
    }
    $scope.$watch('active', function(newIndex, oldIndex) {
    if (Number.isFinite(newIndex) && newIndex!==oldIndex) {
    }
  });
    $scope.imagesObj = projectsService;
	  $scope.open=function(indx){
			$scope.positionInArray=$scope.imagesObj.indexOf(indx);
      console.log('indx', indx);
      console.log('$scope.positionInArray', $scope.positionInArray);
      $scope.slides = $scope.imagesObj[$scope.positionInArray].src;
      $scope.modalInstance=$modal.open({
        animation: true,
        templateUrl: 'angular/pic-modal.html',
        scope: $scope
      });
    };

	  $scope.ok = function () {
			$scope.modalInstance.close();
		};

    $scope.imagesObj.forEach(addIndexes);

    function addIndexes(element) {
      element.src.forEach(addID);
    }

    function addID(element, index) {
      element.id = index;
    }
}]);
