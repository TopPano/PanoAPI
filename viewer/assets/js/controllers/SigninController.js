'use strict';

var dependencies = ['$scope', '$rootScope', '$modalInstance', '$state', '$http', '$window', 'Session'];

function SigninController($scope, $rootScope, $modalInstance, $state, $http, $window, Session) {

  $scope.view = {
    failureMessage: 'hi'
  };

  $rootScope.$on('session-changed', function() {
    console.log('[SigninController] caught session change event');
    if ($state.current.name === 'signin') {
      if (Session.isLoggedIn === true) {
        $window.location = '/';
        $modalInstance.close();
      }
    } else if ($state.current.name === 'signout') {
      if (Session.isLoggedIn === false) {
        $window.location = '/';
      }
    }
  });

  $rootScope.$on('session-error', function(reason) {
    if ($state.current.name === 'signin') {
      $scope.view = {
        failureMessage: reason
      };
    }
  });

  $modalInstance.result.then(function() {
    // modal close successfully
    if ($state.current.name === 'signin') {
      $state.go('home');
    }
  }, function() {
    // modal been dismissed
    if ($state.current.name === 'signin') {
      $state.go('home');
    }
  });

  /**
   * When the user hits the signin link
   */
  $scope.signin = function(provider) {
    if (provider === 'local') {
      if ($scope.password !== $scope.passwordConfirm) {
        $scope.view.failureMessage = 'Password doesn\'t match';
      } else {
        $http.post('/auth/local/', {
          username: $scope.username,
          email: $scope.email,
          password: $scope.password
        })
        .success(function(data, status, headers, config) {
          console.log('data: %s, status: %s, headers: %s, config: %s', JSON.parse(data), status, headers, config);
          //$location.url('http://'+$location.host()+':'+$location.port());
          $window.location = '/';
        })
        .error(function(data, status, headers, config) {
          console.log('data: %s, status: %s, headers: %s, config: %s', JSON.parse(data), status, headers, config);
          $scope.view.failureMessage = 'Failed to register user, error: '+data;
        });
      }
    } else {
      Session.signin(provider);
    }
  };
}

module.exports = dependencies.concat([SigninController]);
