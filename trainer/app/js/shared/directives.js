'use strict'

/* directives */
angular.module('app').directive('ngConfirm', [function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.bind('click', function () {
        var message = attrs.ngConfirmMessage || 'Are you sure?'
        if (message && confirm(message)) {
          scope.$apply(attrs.ngConfirm)
        }
      })
    }
  }
}])

// angular.module('app')
//   .directive('remoteValidator', ['$parse', function ($parse) {
//     return {
//       priority: 5,
//       require: ['ngModel', '?^busyIndicator'],
//       link: function (scope, elm, attr, ctrls) {
//         var expfn = $parse(attr['remoteValidatorFunction'])
//         var validatorName = attr['remoteValidator']
//         var ngModelCtrl = ctrls[0]
//         var busyIndicator = ctrls[1]
//         ngModelCtrl.$parsers.push(function (value) {
//           var result = expfn(scope, {'value': value})
//           if (result.then) {
//             if (busyIndicator) { busyIndicator.show() }
//             result.then(function (data) {
//               if (busyIndicator) { busyIndicator.hide() }
//               ngModelCtrl.$setValidity(validatorName, true)
//             }, function (error) {
//               if (busyIndicator) { busyIndicator.hide() }
//               ngModelCtrl.$setValidity(validatorName, false)
//             })
//           }
//           return value
//         })
//       }
//     }
//   }])

// angular.module('app').directive('updateOnBlur', function () {
//   return {
//     restrict: 'A',
//     require: 'ngModel',
//     link: function (scope, elm, attr, ngModelCtrl) {
//       if (attr.type === 'radio' || attr.type === 'checkbox') {
//         return
//       }
//       elm.unbind('input').unbind('keydown').unbind(
//         'change')
//       elm.bind('blur', function () {
//         scope.$apply(function () {
//           ngModelCtrl.$setViewValue(elm.val())
//         })
//       })
//     }
//   }
// })

angular.module('app')
  .directive('remoteValidator', ['$parse', function ($parse) {
    return {
      require: ['ngModel', '^?busyIndicator'],
      link: function (scope, elm, attr, ctrls) {
        var expfn = $parse(attr['remoteValidatorFunction'])
        var validatorName = attr['remoteValidator']
        var ngModelCtrl = ctrls[0]
        var busyIndicator = ctrls[1]
        ngModelCtrl.$asyncValidators[validatorName] = function (value) {
          return expfn(scope, {'value': value})
        }
        if (busyIndicator) {
          scope.$watch(function () { return ngModelCtrl.$pending},
            function (newValue) {
              if (newValue && newValue[validatorName]) {
                busyIndicator.show()
              } else {
                busyIndicator.hide()
              }
            })
        }
      }
    }
  }])

angular.module('app')
  .directive('busyIndicator', ['$compile', function () {
    return {
      scope: true,
      transclude: true,
      template: '<div><div ng-transclude=""></div><label ng-show="busy" class="text-info glyphicon glyphicon-refresh spin"></label></div>',
      controller: ['$scope', function ($scope) {
        this.show = function () { $scope.busy = true }
        this.hide = function () { $scope.busy = false }
      }]
    }
  }])

angular.module('app')
  .directive('ajaxButton', ['$compile', '$animate', function ($scope, $animate) {
    return {
      transclude: true,
      restrict: 'E',
      scope: {onClick: '&', submitting: '@'},
      replace: true,
      template: '<button ng-disabled="busy"><span class="glyphicon glyphicon-refresh spin" ng-show="busy"></span><span ng-transclude=""></span></button>',
      link: function (scope, element, attr) {
        if (attr.submitting !== undefined && attr.submitting !== null) {
          attr.$observe('submitting', function (value) {
            if (value) { scope.busy = JSON.parse(value) }
          })
        }
        if (attr.onClick) {
          element.on('click', function (event) {
            scope.$apply(function () {
              var result = scope.onClick()
              if (attr.submitting !== undefined && attr.submitting !== null) { return }
              if (result.finally) {
                scope.busy = true
                result.finally(function () {
                  scope.busy = false
                })
              }
            })
          })
        }
      }
    }
  }])
