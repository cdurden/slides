var app = angular.module('md', [
    'btford.socket-io',
    'ng-showdown',
    'slides.services.sockets',
]);
app.config([ '$showdownProvider' , function ($showdownProvider) {
    $showdownProvider.setOption('tables', true);
}]);
app.config([ '$locationProvider' , function ($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);
app.controller("MyController", ["$scope", "$location", "$http", function($scope, $location, $http) {
  $scope.markdown = "";
  md = $location.search().md;
  $http({
    method: 'GET',
    url: "./markdown/"+md+".md"
  }).then(function success(response) {
      console.log(response);
      $scope.markdown = response.data;
  }, function error(response) {
  });


}]);
