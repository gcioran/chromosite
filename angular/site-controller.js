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
    $scope.imagesObj = projectsService;

  $scope.open=function(indx){;
      location.href = '/projects/'+ indx.text;
    };

    $scope.imagesObj.forEach(addIndexes);

    function addIndexes(element) {
      element.src.forEach(addID);
    }

    function addID(element, index) {
      element.id = index;
    }
}]);

app.config(['$stateProvider','$translateProvider', '$routeProvider', '$locationProvider', '$urlRouterProvider',
  function ($stateProvider,$translateProvider, $routeProvider, $locationProvider, $urlRouterProvider) {
  $translateProvider.useStaticFilesLoader({
    prefix: 'l10n/',
    suffix: '.json'
});

  $translateProvider.preferredLanguage('RO');
	$translateProvider.useSanitizeValueStrategy('sce');

  function getProjectIndex(projectName, projectObj) {
    project = projectObj.filter(function(element) {
      return element.text === projectName;
    });
    return projectObj.indexOf(project[0]);
  }

$stateProvider
   .state('home', {
     url: '/',
     templateUrl: 'pages/home.html',
     controller: 'PicModalCtrl'
   })

   .state('contact', {
     url: '/contact',
     templateUrl: 'pages/contact.html',
     controller: 'PicModalCtrl'
   })

   .state('projects', {
     url: '/projects',
     templateUrl: 'pages/projects.html',
     controller: 'PicModalCtrl'
   })

   .state('modal', {
     url: '/projects{page:(?:/[^/]+)?}',

     // trigger the modal to open when this route is active
     onEnter: ['$stateParams', '$state', '$uibModal',
       function($stateParams, $state, $modal) {
         const projectName = $stateParams.page.slice(1);

         if (projectName) $modal
           .open({
             animation: true,
             templateUrl: 'angular/pic-modal.html',
             controller: ['$scope', 'projectsService',
               function($scope, projectsService) {
                 const projectIndex = getProjectIndex(projectName, projectsService);
                 $scope.positionInArray = projectIndex;
                 $scope.imagesObj = projectsService;
                 $scope.slides = $scope.imagesObj[projectIndex].src;
                 $scope.setDrawingsActive = function() {
                   $scope.slides.active = $scope.imagesObj[$scope.positionInArray].drawings;
                 };
                 $scope.setImagesActive = function() {
                    $scope.slides.active = 0;
                 };
                  $scope.setDescriptionActive = function() {
                    var index = $scope.imagesObj[$scope.positionInArray].src.length -1;
                    $scope.slides.active = index;
                  };
                  $scope.hasDescription = function() {
                    var index = $scope.imagesObj[$scope.positionInArray].src.length -1;
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
             $state.transitionTo('projects');
           }, function() {
             // change route after clicking Cancel button or clicking background
             $state.transitionTo('projects');
           });

       }
     ]

   });

   $urlRouterProvider.otherwise('/');

// use the HTML5 History API
    $locationProvider.html5Mode(true);
}]);
