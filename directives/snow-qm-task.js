angular.module('slides')
.directive('snowQmTask', ['Sockets', function (Sockets) {
  return {
    restrict: 'A',
    require: ['snowQmTask'],
    replace: true,
    templateUrl: './templates/html_task.html',
    scope: { collection: '=', task: '=' },
    bindToController: { collection: '@', task: '@' },
    controller: ["$scope","$sce", function ($scope, $sce) {
      Sockets.on('submission_confirmation', function (data) {
        console.log(data);
       // TaskData.confirmSubmission(data);
      })
      Sockets.on('task', function (data) {
        console.log(data);
        $scope.task = $sce.trustAsHtml(data.html);
      });
      console.log("getting snow-qm task");
      this.$onInit = function() {
        console.log(this.collection);
        console.log(this.task);
        Sockets.emit("get-snow-qm-task", {'collection': this.collection, 'task': this.task});
      }
      this.submit = function (ev) {
          ev.preventDefault(); // prevents page reloading
          Sockets.emit("submit");
          return false;
      }
    }],
    link: function (scope, element, attrs, ctrls) {
//      var taskCtrl = ctrls[0];
//      $(element).find("form").on("submit", taskCtrl.submit);
    }
  }
}]);
