angular.module('helios.session', [])
  .factory('Session', ['$rootScope', '$window', '$http',
    function ($rootScope, $window, $http) {
      var session = {
        init: function () {
          this.resetSession();

        },
        resetSession: function() {
          this.currentUser = null;
          this.isLoggedIn = false;
          this.provider = null;

        },
        signin: function(provider) {
          this.provider = provider;
          var url = '/auth/'+provider,
            width = 1000,
            height = 650,
            top = (window.outerHeight - height) / 2,
            left = (window.outerWidth - width) / 2;
          $window.open(url, provider+'_login', 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left);

        },
        signout: function() {
          if (this.isLoggedIn === true &&
              this.provider !== undefined) {
            var scope = this;
            $http.delete('/auth/'+this.provider+'/logout').success(function() {
              scope.resetSession();
              $rootScope.$emit('session-changed');
            });
          }

        },
        authSuccess: function(userData) {
          this.currentUser = userData;
          this.isLoggedIn = true;
          $rootScope.$emit('session-changed');

        },
        authFailed: function() {
          this.resetSession();
          $rootScope.$emit('session-error', 'Authentication failed');
          //alert('Authentication failed');

        }
      };
      session.init();
      return session;
    }
  ]);
