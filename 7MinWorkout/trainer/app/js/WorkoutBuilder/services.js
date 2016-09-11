'use strict'

angular.module('app')
  .value('appEvents', {
    workout: { exerciseStarted: 'event:workout:exerciseStarted' }
  })

angular.module('WorkoutBuilder').factory('WorkoutBuilderService', ['WorkoutService', 'WorkoutPlan', 'Exercise',
  function (WorkoutService, WorkoutPlan, Exercise) {
    var service = {}
    var buildingWorkout
    var newWorkout
    service.startBuilding = function (name) {
      // If name is defined, editing
      if (name) {
        buildingWorkout = WorkoutService.getWorkout(name)
        newWorkout = false
      } else {
        buildingWorkout = new WorkoutPlan({})
        newWorkout = true
      }
      return buildingWorkout
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

    service.deleteWorkout = function () {
      if (newWorkout) {
        return
      }
      WorkoutService.deleteWorkout(buildingWorkout.name)
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
      var workout = newWorkout ? WorkoutService.addWorkout(buildingWorkout) : WorkoutService.updateWorkout(buildingWorkout)
      newWorkout = false
      return workout
    }

    return service
  }])

angular.module('WorkoutBuilder').factory('ExerciseBuilderService', ['WorkoutService', 'Exercise',
  function (WorkoutService, Exercise) {
    var service = {}
    var buildingExercise
    var newExercise

    service.startBuilding = function (name) {
      if (name) {
        buildingExercise = WorkoutService.getExercise(name)
        newExercise = false
      } else {
        buildingExercise = new Exercise({})
        newExercise = true
      }
      return buildingExercise
    }

    service.save = function () {
      var exercise = newExercise ? WorkoutService.addExercise(buildingExercise) : WorkoutService.updateExercise(exercise)
      newExercise = false
      return exercise
    }

    service.delete = function () {
      WorkoutService.deleteExercise(buildingExercise.name)
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
