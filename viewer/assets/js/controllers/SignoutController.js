'use strict';

var dependencies = ['$rootScope', '$http', '$window', 'Session'];

function SignoutController($rootScope, $http, $window, Session) {

  $rootScope.$on('session-changed', function() {
    console.log('[SignoutController] caught session change event');
    if (Session.isLoggedIn === false) {
      /**
       * We already signout'd
       */
      $window.location = '/';
    }
  });

  Session.signout();
}

module.exports = dependencies.concat([SignoutController]);
