angular.module( 'tribal', [] )
  .config( function($locationProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
  });
