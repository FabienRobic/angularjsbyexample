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
//       require: 'ngModel',
//       link: function (scope, elm, attr, ngModelCtrl) {
//         var expfn = $parse(attr['remoteValidatorFunction'])
//         var validatorName = attr['remoteValidator']
//         ngModelCtrl.$parsers.push(function (value) {
//           var result = expfn(scope, {'value': value})
//           if (result.then) {
//             result.then(function (data) {
//               ngModelCtrl.$setValidity(validatorName, true)
//             }, function (error) {
//               ngModelCtrl.$setValidity(validatorName, false) })
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
      require: 'ngModel',
      link: function (scope, elm, attr, ngModelCtrl) {
        var expfn = $parse(attr['remoteValidatorFunction'])
        var validatorName = attr['remoteValidator']
        ngModelCtrl.$asyncValidators[validatorName] = function (value) {
          return expfn(scope, {'value': value})
        }
      }
    }
  }])
