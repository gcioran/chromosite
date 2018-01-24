var app = angular.module('picdemoLightbox', ['ui.bootstrap', 'ngTouch','ngAnimate','pascalprecht.translate','ngSanitize', 'ngRoute', 'ui.router']);

app.controller('PicModalCtrl', ['$scope', '$uibModal', '$translate', 'projectsService', '$route', '$routeParams', '$location',
function ($scope, $modal, $translate, projectsService) {
    $scope.showRomanian =true;
    $scope.key = 'EN';
    $scope.changeLanguage = function () {
			$translate.use($scope.key);
			$scope.showRomanian = 'RO' === $scope.key  ? true : false;
			$scope.key = $scope.key === 'EN' ? 'RO' : 'EN';
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
  //   $scope.$watch('active', function(newIndex, oldIndex) {
  //   if (Number.isFinite(newIndex) && newIndex!==oldIndex) {
  //   }
  // });
    $scope.imagesObj = projectsService;

  $scope.open=function(indx){
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
		};

    $scope.imagesObj.forEach(addIndexes);

    function addIndexes(element) {
      element.src.forEach(addID);
    }

    function addID(element, index) {
      element.id = index;
    }
}]);

app.config(['$stateProvider','$translateProvider', '$routeProvider', '$locationProvider',
  function ($stateProvider,$translateProvider, $routeProvider, $locationProvider) {
  $translateProvider.useStaticFilesLoader({
    prefix: 'l10n/',
    suffix: '.json'
});

  $translateProvider.preferredLanguage('RO');
	$translateProvider.useSanitizeValueStrategy('sce');

  $routeProvider
    .when('/', {
        templateUrl : 'pages/home.html'
    })
    .when('/contact', {
        templateUrl : 'pages/contact.html',
        controller : 'PicModalCtrl'
    })
    .when('/projects', {
        templateUrl : 'pages/projects.html'
    })
    .otherwise({
        redirectTo: '/'
});

$stateProvider

   // define home route "/"
   .state('home', {
     url: '/'
   })

   // define modal route "/modal"
   .state('modal', {
     url: '/modal',

     // trigger the modal to open when this route is active
     onEnter: ['$stateParams', '$state', '$modal',
       function($stateParams, $state, $modal) {
         $modal

           // handle modal open
           .open({
             animation: true,
             templateUrl: 'angular/pic-modal.html',
             controller: ['$scope',
               function($scope) {
                 // handle after clicking Cancel button
                 $scope.cancel = function() {
                   $scope.$dismiss();
                 };
                 // close modal after clicking OK button
                 $scope.ok = function() {
                   $scope.$close(true);
                 };
               }
             ]
           })

           // change route after modal result
           .result.then(function() {
             // change route after clicking OK button
             $state.transitionTo('home');
           }, function() {
             // change route after clicking Cancel button or clicking background
             $state.transitionTo('home');
           });

       }
     ]

   });

// use the HTML5 History API
    $locationProvider.html5Mode(true);
}]);
