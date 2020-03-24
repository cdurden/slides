var app = angular.module('md', [
    'btford.socket-io',
    'ng-showdown',
    'slides.services.sockets',
]);
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
