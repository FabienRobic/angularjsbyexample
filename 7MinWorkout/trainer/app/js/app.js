'use strict'

angular.module('app', ['ngRoute', 'ngSanitize', '7MinWorkout', 'WorkoutBuilder', 'mediaPlayer', 'ui.bootstrap', 'LocalStorageModule', 'ngAnimate', 'ngMessages'])
  .config(function ($routeProvider, $sceDelegateProvider) {
    $routeProvider.when('/start', {templateUrl: 'partials/start.html'})
    $routeProvider.when('/workout', {templateUrl: 'partials/workout.html', controller: 'WorkoutController'})
    $routeProvider.when('/finish', {templateUrl: 'partials/finish.html'})

    $routeProvider.when('/builder', {
      redirectTo: '/builder/workouts'
    })
    $routeProvider.when('/builder/workouts', {
      templateUrl: 'partials/workoutbuilder/workouts.html',
      leftNav: 'partials/workoutbuilder/left-nav-main.html',
      topNav: 'partials/workoutbuilder/top-nav.html',
      controller: 'WorkoutListController'
    })
    $routeProvider.when('/builder/exercises', {
      templateUrl: 'partials/workoutbuilder/exercises.html',
      leftNav: 'partials/workoutbuilder/left-nav-main.html',
      topNav: 'partials/workoutbuilder/top-nav.html',
      controller: 'ExerciseListController'
    })

    $routeProvider.when('/builder/workouts/new', {
      templateUrl: 'partials/workoutbuilder/workout.html',
      leftNav: 'partials/workoutbuilder/left-nav-exercises.html',
      topNav: 'partials/workoutbuilder/top-nav.html',
      controller: 'WorkoutDetailController',
      resolve: {
        selectedWorkout: ['WorkoutBuilderService', function (WorkoutBuilderService) {
          return WorkoutBuilderService.startBuilding()
        }]
      }
    })
    $routeProvider.when('/builder/workouts/:id', {
      templateUrl: 'partials/workoutbuilder/workout.html',
      leftNav: 'partials/workoutbuilder/left-nav-exercises.html',
      topNav: 'partials/workoutbuilder/top-nav.html',
      controller: 'WorkoutDetailController',
      resolve: {
        selectedWorkout: ['WorkoutBuilderService', '$route', '$location', function (WorkoutBuilderService, $route, $location) {
          var workout = WorkoutBuilderService.startBuilding($route.current.params.id)
          if (!workout) {
            $location.path('/builder/workouts')
          }
          return workout
        }]
      }
    })

    $routeProvider.when('/builder/exercises/new', {
      templateUrl: 'partials/workoutbuilder/exercise.html',
      controller: 'ExerciseDetailController',
      topNav: 'partials/workoutbuilder/top-nav.html'
    })
    $routeProvider.when('/builder/exercises/:id', {
      templateUrl: 'partials/workoutbuilder/exercise.html',
      controller: 'ExerciseDetailController',
      topNav: 'partials/workoutbuilder/top-nav.html'
    })

    // $routeProvider.when('/builder/exercises/new', {
    //   templateUrl: 'partials/workoutbuilder/exercise.html',
    //   topNav: 'partials/workoutbuilder/top-nav.html',
    //   controller: 'ExerciseDetailController',
    //   resolve: {
    //     selectedExercise: ['ExerciseBuilderService', function (ExerciseBuilderService) {
    //       var exercise = ExerciseBuilderService.startBuilding()
    //       if (!exercise) {
    //         $location.path('builder/exercises')
    //       }
    //       return exercise
    //     }]
    //   }
    // })
    // $routeProvider.when('/builder/exercises/:id', {
    //   templateUrl: 'partials/workoutbuilder/exercise.html',
    //   topNav: 'partials/workoutbuilder/top-nav.html',
    //   controller: 'ExerciseDetailController',
    //   resolve: {
    //     selectedExercise: ['ExerciseBuilderService', '$route', '$location', function (ExerciseBuilderService, $route, $location) {
    //       var exercise = ExerciseBuilderService.startBuilding($route.current.params.id)
    //       if (!exercise) {
    //         $location.path('builder/exercises')
    //       }
    //       return exercise
    //     }]
    //   }
    // })

    $routeProvider.otherwise({redirectTo: '/start'})

    $sceDelegateProvider.resourceUrlWhitelist([
      // Allow same origin resource loads.
      'self',
      // Allow loading from our assets domain.  Notice the difference between * and **.
      'http://*.youtube.com/**'])
  })
angular.module('7MinWorkout', [])
angular.module('WorkoutBuilder', [])
