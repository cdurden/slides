angular.module('slides')
.directive('snowQmTask', ['Sockets', function (Sockets) {
  return {
    restrict: 'A',
    require: ['snowQmTask'],
    replace: true,
    //transclude: true,
    //templateUrl: 'testing.html',
    templateUrl: './templates/html_task.html',
    /*templateUrl: function(element, attrs) {
        console.log(attrs);
        return(attrs.id);
    },*/
    scope: { collection: '=', task: '=' },
    bindToController: { collection: '@', task: '@' },
    controller: ["$scope","$sce", function ($scope, $sce) {
      Sockets.on('submission_confirmation', function (data) {
        console.log(data);
       // TaskData.confirmSubmission(data);
      })
      console.log("getting snow-qm task");
      var timer;
      function clearTimer() {
        clearTimeout(timer);
      }
      this.$onInit = function() {
        console.log(this.collection);
        console.log(this.task);
        function inject_questions() {
          clearTimer();
          Sockets.on('snow-qm-task', function (data) {
            console.log(data);
            if(data['collection']==this.collection && data['task']==this.task) {
              console.log("got task");
            }
            $scope.task = $sce.trustAsHtml(data.html);
          });
          Sockets.emit("get-snow-qm-task", {'collection': this.collection, 'task': this.task});
        }
        timer = setTimeout(function() { if(Reveal.isReady()) inject_questions()}, 1000); // call every 1000 milliseconds
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
