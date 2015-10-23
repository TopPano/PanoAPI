'use strict';

angular.module('heliosModule.resources', [])
  .factory('Resources', ['$resource', '$location', function($resource, $location) {
    var apihost = $location.port() !== null ?
                    'http://'+$location.host()+':'+$location.port() :
                    'http://'+$location.host();
    return {
      userResource: $resource(
        apihost+'/',
        null,
        {
          create: { method: 'POST' }
        }
      )
    };
  }]);
