var modalController = function ($scope, $modal, $translate, projectsService) {
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
    $scope.swipeNext = function() {
      const lastIndex = $scope.imagesObj[$scope.positionInArray].src.length -1;
      if (lastIndex === $scope.slides.active) {
        $scope.slides.active = -1;
      }
      $scope.slides.active = $scope.slides.active +1;
    };
    $scope.swipePrevious = function() {
      const lastIndex = $scope.imagesObj[$scope.positionInArray].src.length -1;
      if ($scope.slides.active === 0) {
        $scope.slides.active = lastIndex + 1;
      }
      $scope.slides.active = $scope.slides.active -1;
    };
    $scope.imagesObj = projectsService;

  $scope.open=function(indx){
      $scope.slides = $scope.imagesObj[indx].src;
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
};
