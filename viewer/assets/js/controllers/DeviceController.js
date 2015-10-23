'use strict';

var dependencies = ['$scope', '$http'];

function DeviceController($rootScope, $http, $window, Session) {

  $scope.view = {
    failureMessage = '';
  };

  $scope.register = function() {
    $http.get('/user/device/register')
    .success(function(data, status, headers, config) {
      console.log('Register successfully');
      $scope.device.credential.accessKey = data.message.accessKey;
      $scope.device.credential.accessSecretKey = data.message.accessSecretKey;
    })
    .error(function(data, status, headers, config) {
      console.log('Register failed');
      $scope.view.failureMessage = 'Unable to generate register credential, Error: '+data.error;
    });
  }
}

module.exports = dependencies.concat([DeviceController]);
