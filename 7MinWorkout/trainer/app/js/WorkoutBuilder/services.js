'use strict'

angular.module('app')
  .value('appEvents', {
    workout: { exerciseStarted: 'event:workout:exerciseStarted' }
  })

angular.module('WorkoutBuilder')
  .factory('WorkoutBuilderService', ['WorkoutService', 'WorkoutPlan', 'Exercise', '$q',
    function (WorkoutService, WorkoutPlan, Exercise, $q) {
      var service = {}
      var buildingWorkout
      var newWorkout
      service.startBuilding = function (name) {
        // If name is defined, editing
        if (name) {
          return WorkoutService.getWorkout(name).then(function (workout) {
            buildingWorkout = workout
            newWorkout = false
            return buildingWorkout
          })
        } else {
          buildingWorkout = new WorkoutPlan({})
          newWorkout = true
          return $q.when(buildingWorkout)
        }
      }

      service.addExercise = function (exercise) {
        buildingWorkout.exercises.push({
          details: exercise,
          duration: 30
        })
      }

      service.canDeleteWorkout = function () {
        return !newWorkout
      }

      service.delete = function () {
        if (newWorkout) {
          return
        }
        return WorkoutService.deleteWorkout(buildingWorkout.name)
      }

      service.removeExercise = function (exercise) {
        buildingWorkout.exercises.splice(buildingWorkout.exercises.indexOf(exercise), 1)
      }

      service.moveExercise = function (exercise, toIndex) {
        if (toIndex < 0 || toIndex >= buildingWorkout.exercises) {
          return
        } else {
          var currentIndex = buildingWorkout.exercises.indexOf(exercise)
          buildingWorkout.exercises.splice(toIndex, 0, buildingWorkout.exercises.splice(currentIndex, 1)[0])
        }
      }

      service.save = function () {
        var promise = newWorkout ?
          WorkoutService.addWorkout(buildingWorkout) :
          WorkoutService.updateWorkout(buildingWorkout)
        promise.then(function (workout) {
          newWorkout = false
        })
        return promise
      }

      return service
    }])

angular.module('WorkoutBuilder').factory('ExerciseBuilderService', ['WorkoutService', 'Exercise', '$q',
  function (WorkoutService, Exercise, $q) {
    var service = {}
    var buildingExercise
    var newExercise

    service.startBuilding = function (name) {
      if (name) {
        buildingExercise = WorkoutService.Exercises.get({ id: name}, function (data) {
          newExercise = false
        })
      } else {
        buildingExercise = new Exercise({})
        newExercise = true
      }
      return buildingExercise
    }

    service.save = function () {
      if (!buildingExercise._id) {
        buildingExercise._id = buildingExercise.name
      }
      var promise = newExercise ?
        Exercise.save({}, buildingExercise).$promise :
        buildingExercise.$update({ id: buildingExercise.name })
      return promise.then(function (data) {
        newExercise = false
        return buildingExercise
      })
    }

    service.delete = function () {
      buildingExercise.$delete({ id: buildingExercise.name })
    }

    service.canDeleteExercise = function () {
      return !newExercise
    }

    service.addVideo = function () {
      buildingExercise.related.videos.push('')
    }

    service.deleteVideo = function (index) {
      if (index >= 0) {
        buildingExercise.related.videos.splice(index, 1)
      }
    }

    return service
  }])
