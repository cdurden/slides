angular.module('slides')
.directive('snowQmTask', ['Sockets', function (Sockets) {
  return {
    restrict: 'A',
    require: ['snowQmTask'],
    replace: true,
    templateUrl: './templates/html_task.html',
    scope: { collection: "=collection", task: "=task" },
    controller: function ($scope) {
      Sockets.on('submission_confirmation', function (data) {
        console.log(data);
       // TaskData.confirmSubmission(data);
      })
      Sockets.on('task', function (data) {
        console.log(data);
        $scope.task = data;
      });
      console.log("getting snow-qm task");
      console.log($scope.collection);
      console.log($scope.task);
      Sockets.emit("get-snow-qm-task", {'collection': $scope.collection, 'task': $scope.task});
      this.submit = function (ev) {
          ev.preventDefault(); // prevents page reloading
          Sockets.emit("submit");
          return false;
      }
    },
    link: function (scope, element, attrs, ctrls) {
//      var taskCtrl = ctrls[0];
//      $(element).find("form").on("submit", taskCtrl.submit);
    }
  }
}]);
