var app = angular.module('md', [
    'btford.socket-io',
    'ng-showdown',
    'slides.services.sockets',
]);
app.controller("MyController", ["$scope", "$location", "$http", function($scope, $location, $http) {
    $scope.vm.mymarkdown = "# Heading";
}]);
